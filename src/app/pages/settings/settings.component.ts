import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  AbstractControl,
  FormGroupDirective,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { User } from '@firebase/auth';
import { Subscription } from 'rxjs';

import { AuthModes } from '~enums/auth-modes.enum';
import { Colors } from '~enums/colors.enum';
import { Providers } from '~enums/providers.enum';
import { AuthService } from '~services/auth/auth.service';
import { CustomValidators, getEmailError, getPasswordError } from '~utils/custom-validators';

@Component({
  selector: 'at-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnDestroy {
  public confirmDeleteControl: UntypedFormControl;
  public isLoading = false;
  public isUpdateEmailLoading = false;
  public provider: Providers | undefined;
  public reauthenticated = false;
  public stepOneCompleted = false;
  public updateEmailForm: UntypedFormGroup;
  public user: User | null = null;

  private subscriptions = new Subscription();

  constructor(
    private auth: Auth,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private location: Location
  ) {
    this.subscriptions.add(
      authState(this.auth).subscribe((user) => {
        this.user = user;
        this.provider = user?.providerData[0].providerId as Providers;
      })
    );

    this.updateEmailForm = this.formBuilder.group({
      newEmail: ['', CustomValidators.emailValidators],
      password: ['', CustomValidators.passwordValidators]
    });
    this.confirmDeleteControl = new UntypedFormControl('', [
      Validators.required,
      Validators.pattern('delete account and data')
    ]);
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

  public getEmailError(control: AbstractControl | null): string {
    return getEmailError(control);
  }

  public getPasswordError(control: AbstractControl | null): string {
    return getPasswordError(control);
  }

  public goBack(): void {
    this.location.back();
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

  public async signOut(): Promise<void> {
    await this.authService.signOut();
  }

  public async updateUserEmail(formDirective: FormGroupDirective): Promise<void> {
    if (this.updateEmailForm.valid) {
      const currentEmailValue = this.user!.email as string;
      const newEmailValue = this.newEmail?.value as string;
      const passwordValue = this.password?.value as string;

      this.isUpdateEmailLoading = true;

      await this.authService.updateUserEmail(currentEmailValue, newEmailValue, passwordValue).then(() => {
        this.isUpdateEmailLoading = false;
        this.updateEmailForm.reset();
        formDirective.resetForm();
      });
    }
  }

  public get authModes(): typeof AuthModes {
    return AuthModes;
  }

  public get colors(): typeof Colors {
    return Colors;
  }

  public get newEmail(): AbstractControl | null {
    return this.updateEmailForm.get('newEmail');
  }

  public get password(): AbstractControl | null {
    return this.updateEmailForm.get('password');
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
}
