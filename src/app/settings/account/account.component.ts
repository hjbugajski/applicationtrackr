import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';

import { AuthModes } from '~enums/auth-modes.enum';
import { Colors } from '~enums/colors.enum';
import { Providers } from '~enums/providers.enum';
import { AuthService } from '~services/auth/auth.service';
import { FirebaseFunctionsService } from '~services/firebase-functions/firebase-functions.service';
import { NotificationService } from '~services/notification/notification.service';
import { CustomValidators, getEmailError, getPasswordError } from '~utils/custom-validators';

@Component({
  selector: 'at-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnDestroy {
  public confirmDeleteControl = new FormControl('', [
    Validators.required,
    Validators.pattern('delete account and data'),
  ]);
  public isLoading = false;
  public isBulkExportLoading = false;
  public isUpdateEmailLoading = false;
  public provider: Providers | undefined;
  public reauthenticated = false;
  public stepOneCompleted = false;
  public updateEmailForm = new FormGroup({
    newEmail: new FormControl('', CustomValidators.emailValidators),
    password: new FormControl('', CustomValidators.passwordValidators),
  });
  public user: User | null = null;

  private subscriptions: Subscription;

  constructor(
    private auth: Auth,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private firebaseFunctionsService: FirebaseFunctionsService,
    private notificationsService: NotificationService,
  ) {
    this.subscriptions = authState(this.auth).subscribe((user) => {
      this.user = user;

      if (user) {
        this.provider = user.providerData[0].providerId as Providers;
      }
    });
  }

  public get authModes(): typeof AuthModes {
    return AuthModes;
  }

  public get colors(): typeof Colors {
    return Colors;
  }

  public get newEmail(): AbstractControl<string | null> {
    return this.updateEmailForm.controls.newEmail;
  }

  public get password(): AbstractControl<string | null> {
    return this.updateEmailForm.controls.password;
  }

  public get providerDisplay(): string {
    switch (this.provider) {
      case Providers.Apple:
        return 'Apple';
      case Providers.Google:
        return 'Google';
      default:
        return 'email and password';
    }
  }

  public get providers(): typeof Providers {
    return Providers;
  }

  public async bulkExport(): Promise<void> {
    this.isBulkExportLoading = true;
    this.notificationsService.show(Colors.Neutral, 'Exporting data...');

    try {
      const exportData = await this.firebaseFunctionsService.bulkExport();

      this.downloadJsonFile(exportData, 'job-board-export.json');
      this.notificationsService.showSuccess('Data exported successfully!');
    } catch (error) {
      console.error('Error during bulk export:', error);
      this.notificationsService.showError('Failed to export data. Please try again.');
    } finally {
      this.isBulkExportLoading = false;
    }
  }

  private downloadJsonFile(data: any, filename: string): void {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  public async deleteUser(): Promise<void> {
    if (this.confirmDeleteControl.valid) {
      this.isLoading = true;

      await this.authService.deleteUser().then(() => {
        this.isLoading = false;
        this.confirmDeleteControl.reset();
      });
    }
  }

  public getConfirmDeleteError(): string {
    if (this.confirmDeleteControl.hasError('pattern')) {
      return "Must match 'delete account and data'";
    } else {
      return 'Required';
    }
  }

  public getEmailError(control: AbstractControl): string {
    return getEmailError(control);
  }

  public getPasswordError(control: AbstractControl): string {
    return getPasswordError(control);
  }

  public goToNextStep(stepper: MatStepper): void {
    this.stepOneCompleted = true;
    this.changeDetectorRef.detectChanges();
    stepper.next();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public async sendPasswordResetEmail(): Promise<void> {
    await this.authService.sendPasswordResetEmail(this.user!.email as string);
  }

  public async updateUserEmail(formDirective: FormGroupDirective): Promise<void> {
    if (this.updateEmailForm.valid) {
      this.isUpdateEmailLoading = true;

      await this.authService
        .updateUserEmail(this.user!.email!, this.newEmail.value!, this.password.value!)
        .then(() => {
          this.isUpdateEmailLoading = false;
          this.updateEmailForm.reset();
          formDirective.resetForm();
        });
    }
  }
}
