import { Injectable } from '@angular/core';
import {
  ActionCodeInfo,
  applyActionCode,
  Auth,
  AuthProvider,
  authState,
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
  verifyPasswordResetCode
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

import { Paths } from '~enums/paths.enum';
import { Providers } from '~enums/providers.enum';
import { Error } from '~interfaces/error.interface';
import { NotificationService } from '~services/notification/notification.service';

interface AuthError extends Error {
  credential?: any;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public user$ = new BehaviorSubject<User | null>(null);

  private unsubscribeUser: Subscription | undefined;

  constructor(private auth: Auth, private notificationService: NotificationService, private router: Router) {}

  public async confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
    await verifyPasswordResetCode(this.auth, oobCode)
      .then(async () => {
        await confirmPasswordReset(this.auth, oobCode, newPassword)
          .then(async () => {
            await this.router.navigate([Paths.Auth, Paths.SignIn]).then(() => {
              this.notificationService.showSuccess('Password has been reset!');
            });
          })
          .catch((error: AuthError) => {
            console.error(error);
            this.notificationService.showError(error.message);
          });
      })
      .catch((error: AuthError) => {
        console.error(error);
        this.notificationService.showError(error.message);
      });
  }

  public async createUserWithEmail(email: string, password: string): Promise<void> {
    await createUserWithEmailAndPassword(this.auth, email, password)
      .then(async () => {
        await this.authSuccessNavigation();
      })
      .catch(async (error: AuthError) => {
        console.error(error);

        if (error.code === 'auth/email-already-in-use') {
          await fetchSignInMethodsForEmail(this.auth, email).then((methods) => {
            // TODO: implement account link options
            if (methods[0] === 'apple.com') {
              this.notificationService.showError(
                "This email address is already in use with an Apple account. Please sign in using the 'Sign in with Apple' button."
              );
            } else if (methods[0] === 'google.com') {
              this.notificationService.showError(
                "This email address is already in use with a Google account. Please sign in using the 'Sign in with Google' button."
              );
            } else {
              // (method) password
              this.notificationService.showError(
                'This email address is already in use. Please use another or sign in.'
              );
            }
          });
        } else if (error.code === 'auth/invalid-email') {
          this.notificationService.showError('Invalid email address');
        } else {
          this.notificationService.showError(error.message);
        }
      });
  }

  public async deleteUser(): Promise<void> {
    await deleteUser(this.auth.currentUser!)
      .then(async () => {
        await signOut(this.auth).then(async () => {
          await this.router.navigate([Paths.Auth, Paths.SignIn]).then(() => {
            this.notificationService.showSuccess('Account and data have been deleted.');
          });
        });
      })
      .catch((error) => {
        console.error(error);
        this.notificationService.showError('There was an error deleting account and data. Please try again.');
      });
  }

  public destroyAuthState(): void {
    this.unsubscribeUser?.unsubscribe();
  }

  public initAuthState(): void {
    this.unsubscribeUser = authState(this.auth).subscribe((user) => {
      this.isLoggedIn$.next(!!user);
      this.user$.next(user);
    });
  }

  public async reauthenticateCredential(email: string, password: string): Promise<void> {
    const credential = EmailAuthProvider.credential(email, password);

    await reauthenticateWithCredential(this.auth.currentUser!, credential).catch((error) => {
      console.error(error);
      this.notificationService.showError('There was an error with re-authentication. Please try again.');
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

    await reauthenticateWithPopup(this.auth.currentUser!, authProvider).catch((error) => {
      console.error(error);
      this.notificationService.showError('There was an error with re-authentication. Please try again.');
    });
  }

  public async recoverEmail(oobCode: string): Promise<void> {
    await checkActionCode(this.auth, oobCode)
      .then(async (info: ActionCodeInfo) => {
        const recoveredEmail = info.data.email;

        await applyActionCode(this.auth, oobCode)
          .then(async () => {
            this.notificationService.showSuccess('Email has been recovered!');

            if (recoveredEmail) {
              await this.sendPasswordResetEmail(recoveredEmail);
            }
          })
          .catch((error: AuthError) => {
            console.error(error);
            this.notificationService.showError(error.message);
          });
      })
      .catch((error: AuthError) => {
        console.error(error);
        this.notificationService.showError(error.message);
      });
  }

  public async sendPasswordResetEmail(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.notificationService.showSuccess('Password reset email has been sent');
      })
      .catch((error: AuthError) => {
        console.error(error);
        this.notificationService.showError(error.message);
      });
  }

  public async signInWithApple(): Promise<void> {
    const provider = new OAuthProvider('apple.com');

    provider.addScope('email');

    await signInWithPopup(this.auth, provider)
      .then(async () => {
        await this.authSuccessNavigation();
      })
      .catch((error: AuthError) => {
        this.handlePopupError(error);
      });
  }

  public async signInWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password)
      .then(async () => {
        await this.authSuccessNavigation();
      })
      .catch(async (error: AuthError) => {
        console.error(error);

        if (error.code === 'auth/user-not-found') {
          this.notificationService.showError('The provided email address is not connected to any account.');
        } else if (error.code === 'auth/wrong-password') {
          await fetchSignInMethodsForEmail(this.auth, email).then((methods) => {
            // TODO: implement account link options
            if (methods[0] === 'apple.com') {
              this.notificationService.showError(
                "This email address is already in use with an Apple account. Please sign in using the 'Sign in with Apple' button."
              );
            } else if (methods[0] === 'google.com') {
              this.notificationService.showError(
                "This email address is already in use with a Google account. Please sign in using the 'Sign in with Google' button."
              );
            } else {
              // (method) password
              this.notificationService.showError('The provided password is incorrect.');
            }
          });
        } else {
          this.notificationService.showError(error.message);
        }
      });
  }

  public async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({ prompt: 'select_account' });

    await signInWithPopup(this.auth, provider)
      .then(async () => {
        await this.authSuccessNavigation();
      })
      .catch((error: AuthError) => {
        this.handlePopupError(error);
      });
  }

  public async signOut(): Promise<void> {
    await signOut(this.auth)
      .then(async () => {
        await this.router.navigate([Paths.Auth, Paths.SignIn]).then(() => {
          this.notificationService.showSuccess('Sign out successful');
        });
      })
      .catch((error) => {
        console.error(error);
        this.notificationService.showError('There was an error while trying to sign out. Please try again.');
      });
  }

  public async updateUserEmail(currentEmail: string, newEmail: string, password: string): Promise<void> {
    await this.reauthenticateCredential(currentEmail, password).then(async () => {
      await updateEmail(this.auth.currentUser!, newEmail)
        .then(() => {
          this.notificationService.showSuccess('Email has been updated!');
        })
        .catch((error) => {
          console.error(error);
          this.notificationService.showError('There was an error updating your email. Please try again.');
        });
    });
  }

  public async updateUserPassword(email: string, currentPassword: string, newPassword: string): Promise<void> {
    await this.reauthenticateCredential(email, currentPassword).then(async () => {
      await updatePassword(this.auth.currentUser!, newPassword)
        .then(() => {
          this.notificationService.showSuccess('Password has been updated!');
        })
        .catch((error: AuthError) => {
          console.error(error);
          this.notificationService.showError(error.message);
        });
    });
  }

  public async verifyEmail(oobCode: string): Promise<void> {
    await applyActionCode(this.auth, oobCode)
      .then(async () => {
        await this.router.navigate([Paths.Dashboard]).then(() => {
          this.notificationService.showSuccess('Email verified');
        });
      })
      .catch((error: AuthError) => {
        console.error(error);
        this.notificationService.showError(error.message);
      });
  }

  private async authSuccessNavigation(): Promise<void> {
    await this.router.navigate([Paths.Dashboard]).then(() => {
      this.notificationService.showSuccess('Sign in successful');
    });
  }

  private handlePopupError(error: AuthError): void {
    console.error(error);

    if (error.code === 'auth/account-exists-with-different-credential') {
      this.notificationService.showError('This email is already in use with a different sign in method.');
    } else if (error.code === 'auth/popup-blocked') {
      this.notificationService.showError('The popup has been blocked.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      this.notificationService.showError('The popup window was closed without completing the sign in to the provider.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      this.notificationService.showError('The popup request to sign in to the provider was cancelled.');
    } else {
      this.notificationService.showError(error.message);
    }
  }
}