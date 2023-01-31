import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';

import { AuthModes } from '~enums/auth-modes.enum';
import { AuthParams } from '~interfaces/auth-params.interface';
import { AuthService } from '~services/auth/auth.service';
import { CustomValidators, getPasswordError } from '~utils/custom-validators';

interface PasswordForm {
  confirmPassword: FormControl<string | null>;
  currentPassword?: FormControl<string | null>;
  newPassword: FormControl<string | null>;
}

@Component({
  selector: 'at-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss']
})
export class ResetPasswordFormComponent implements OnInit {
  @Input() public authMode: AuthModes = AuthModes.Reset;
  @Input() public buttonText = 'Reset';
  @Input() public email = '';
  @Input() public maxWidth = false;
  @Input() public queryParams: AuthParams = { mode: '', oobCode: '' };

  public isLoading: boolean;
  public passwordForm = new FormGroup<PasswordForm>({
    newPassword: new FormControl('', CustomValidators.passwordValidators),
    confirmPassword: new FormControl('', CustomValidators.passwordValidators)
  });

  constructor(private authService: AuthService) {
    this.isLoading = false;
  }

  public get authModes(): typeof AuthModes {
    return AuthModes;
  }

  public get confirmPassword(): AbstractControl<string | null> {
    return this.passwordForm.controls.confirmPassword;
  }

  public get currentPassword(): AbstractControl<string | null> | undefined {
    return this.passwordForm.controls.currentPassword;
  }

  public get newPassword(): AbstractControl<string | null> {
    return this.passwordForm.controls.newPassword;
  }

  public async confirmPasswordReset(formDirective: FormGroupDirective): Promise<void> {
    if (this.passwordForm.valid) {
      this.isLoading = true;

      const newPasswordValue = this.newPassword.value!;

      if (this.authMode === AuthModes.Reset) {
        await this.authService.confirmPasswordReset(this.queryParams.oobCode, newPasswordValue).then(() => {
          this.isLoading = false;
          this.resetForm(formDirective);
        });
      } else if (this.authMode === AuthModes.Update) {
        const currentPasswordValue = this.currentPassword!.value!;

        await this.authService.updateUserPassword(this.email, currentPasswordValue, newPasswordValue).then(() => {
          this.isLoading = false;
          this.resetForm(formDirective);
        });
      }
    }
  }

  public getFormControlError(control: AbstractControl | null): string {
    return getPasswordError(control);
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.confirmPassword.addValidators(CustomValidators.matchValue(this.newPassword));

    if (this.authMode === AuthModes.Update) {
      this.passwordForm.addControl('currentPassword', new FormControl('', CustomValidators.passwordValidators));
    }
  }

  private resetForm(formDirective: FormGroupDirective): void {
    this.passwordForm.reset();
    formDirective.resetForm();
  }
}
