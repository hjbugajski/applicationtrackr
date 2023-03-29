import { Injectable } from '@angular/core';
import {
  applyActionCode,
  Auth,
  AuthProvider,
  checkActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  OAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
  updatePassword,
  User,
  UserCredential,
  verifyPasswordResetCode
} from '@angular/fire/auth';
import { getDocs, query } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { Paths } from '~enums/paths.enum';
import { Providers } from '~enums/providers.enum';
import { Error } from '~interfaces/error.interface';
import { JobBoardsService } from '~services/job-boards/job-boards.service';
import { NotificationService } from '~services/notification/notification.service';
import { UserService } from '~services/user/user.service';
import { userConverter } from '~utils/firestore-converters';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth,
    private jobBoardsService: JobBoardsService,
    private notificationService: NotificationService,
    private router: Router,
    private userService: UserService
  ) {}

  public async confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
    try {
      await verifyPasswordResetCode(this.auth, oobCode);
      await confirmPasswordReset(this.auth, oobCode, newPassword);
      await this.router.navigate([Paths.Auth, Paths.SignIn]);
      this.notificationService.showSuccess('Password has been reset!');
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      this.notificationService.showError(error?.message ?? 'An error occurred. Please try again.');
    }
  }

  public async createUserWithEmail(email: string, password: string): Promise<void> {
    await createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (result: UserCredential) => await this.userService.createUserDoc(result.user))
      .then(async () => await this.authSuccessNavigation())
      .catch(async (error: Error) => {
        let message = 'An error occurred. Please try again.';

        if (error.code === 'auth/email-already-in-use') {
          const defaultMessage = 'This email address is already in use. Please use another or sign in.';

          message = await this.signInMethods(email, defaultMessage);
        } else if (error.code === 'auth/invalid-email') {
          message = 'Invalid email address';
        } else {
          message = error.message;
        }

        this.notificationService.showError(message);
      });
  }

  public async deleteUser(): Promise<void> {
    try {
      await deleteUser(this.auth.currentUser!);
      await signOut(this.auth);
      await this.router.navigate([Paths.Auth, Paths.SignIn]);
      this.notificationService.showSuccess('Account and data have been deleted.');
    } catch {
      this.notificationService.showError('There was an error deleting account and data. Please try again.');
    }
  }

  public async reauthenticateCredential(email: string, password: string): Promise<void> {
    const credential = EmailAuthProvider.credential(email, password);

    await reauthenticateWithCredential(this.auth.currentUser!, credential).catch((error) => {
      throw error;
    });
  }

  public async reauthenticatePopup(provider: Providers): Promise<void> {
    let authProvider: AuthProvider;

    if (provider === Providers.Apple) {
      authProvider = new OAuthProvider('apple.com').addScope('email');
    } else {
      // Google
      authProvider = new GoogleAuthProvider().setCustomParameters({ prompt: 'select_account' });
    }

    await reauthenticateWithPopup(this.auth.currentUser!, authProvider).catch(() => {
      this.notificationService.showError('There was an error with re-authentication. Please try again.');
    });
  }

  public async recoverEmail(oobCode: string): Promise<void> {
    try {
      const info = await checkActionCode(this.auth, oobCode);
      await applyActionCode(this.auth, oobCode);

      if (info.data.email) {
        await this.sendPasswordResetEmail(info.data.email);
      }

      this.notificationService.showSuccess('Email has been recovered!');
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      this.notificationService.showError(error?.message ?? 'An error occurred. Please try again.');
    }
  }

  public async sendPasswordResetEmail(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.notificationService.showSuccess('Password reset email has been sent');
      })
      .catch((error: Error) => {
        this.notificationService.showError(error.message);
      });
  }

  public async signInWithApple(): Promise<void> {
    const provider = new OAuthProvider('apple.com');

    provider.addScope('email');

    await signInWithPopup(this.auth, provider)
      .then(async (result: UserCredential) => await this.handleCreateUserDoc(result.user))
      .then(async () => await this.authSuccessNavigation())
      .catch((error: Error) => {
        this.handlePopupError(error);
      });
  }

  public async signInWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password)
      .then(async (result) => await this.handleCreateUserDoc(result.user))
      .then(async () => await this.authSuccessNavigation())
      .catch(async (error: Error) => {
        let message = 'An error occurred. Please try again.';

        if (error.code === 'auth/user-not-found') {
          message = 'The provided email address is not connected to any account.';
        } else if (error.code === 'auth/wrong-password') {
          const defaultMessage = 'The provided password is incorrect.';

          message = await this.signInMethods(email, defaultMessage);
        } else {
          message = error.message;
        }

        this.notificationService.showError(message);
      });
  }

  public async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({ prompt: 'select_account' });

    await signInWithPopup(this.auth, provider)
      .then(async (result: UserCredential) => await this.handleCreateUserDoc(result.user))
      .then(async () => await this.authSuccessNavigation())
      .catch((error: Error) => {
        this.handlePopupError(error);
      });
  }

  public async signOut(): Promise<void> {
    await signOut(this.auth)
      .then(async () => await this.router.navigate([Paths.Auth, Paths.SignIn]))
      .then(() => this.notificationService.showSuccess('You have been signed out.'))
      .catch(() => {
        this.notificationService.showError('There was an error while trying to sign out. Please try again.');
      });
  }

  public async updateUserEmail(currentEmail: string, newEmail: string, password: string): Promise<void> {
    try {
      await this.reauthenticateCredential(currentEmail, password);
      await updateEmail(this.auth.currentUser!, newEmail);
      this.notificationService.showSuccess('Email has been updated!');
    } catch {
      this.notificationService.showError('There was an error updating your email. Please try again.');
    }
  }

  public async updateUserPassword(email: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      await this.reauthenticateCredential(email, currentPassword);
      await updatePassword(this.auth.currentUser!, newPassword);
      this.notificationService.showSuccess('Password has been updated!');
    } catch {
      this.notificationService.showError('There was an error updating your password. Please try again.');
    }
  }

  public async verifyEmail(oobCode: string): Promise<void> {
    try {
      await applyActionCode(this.auth, oobCode);
      await this.router.navigate([Paths.Auth, Paths.SignIn]);
      this.notificationService.showSuccess('Email verified');
    } catch {
      this.notificationService.showError('There was an error verifying your email. Please try again.');
    }
  }

  private async authSuccessNavigation(): Promise<void> {
    await this.router.navigate([Paths.Dashboard]).then(() => {
      this.notificationService.showSuccess('Sign in successful');
    });
  }

  private async handleCreateUserDoc(user: User): Promise<void> {
    const userDoc = await this.userService.docSnap(user.uid, userConverter);
    const jobBoardsCollection = await getDocs(query(this.jobBoardsService.collectionRefWithConverter));

    if (!userDoc.exists()) {
      await this.userService.createUserDoc(user);
    } else if (jobBoardsCollection.docs.length === 0) {
      await this.userService.createExistingUserDoc(user);
    }
  }

  private handlePopupError(error: Error): void {
    let message;

    if (error.code === 'auth/account-exists-with-different-credential') {
      message = 'This email is already in use with a different sign in method.';
    } else if (error.code === 'auth/popup-blocked') {
      message = 'The popup has been blocked.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      message = 'The popup window was closed without completing the sign in to the provider.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      message = 'The popup request to sign in to the provider was cancelled.';
    } else {
      message = error?.message ?? 'An error occurred. Please try again.';
    }

    this.notificationService.showError(message);
  }

  private async signInMethods(email: string, defaultErrorMessage: string): Promise<string> {
    try {
      const methods = await fetchSignInMethodsForEmail(this.auth, email);

      // TODO: implement account link options
      if (methods[0] === 'apple.com') {
        return "This email address is already in use with an Apple account. Please sign in using the 'Sign in with Apple' button.";
      } else if (methods[0] === 'google.com') {
        return "This email address is already in use with a Google account. Please sign in using the 'Sign in with Google' button.";
      }

      return defaultErrorMessage;
    } catch {
      return 'An error occurred. Please try again.';
    }
  }
}
