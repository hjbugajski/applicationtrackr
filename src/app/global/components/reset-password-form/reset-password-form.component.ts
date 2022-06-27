import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';

import { AuthModes } from '~enums/auth-modes.enum';
import { AuthParams } from '~interfaces/auth-params.interface';
import { AuthService } from '~services/auth/auth.service';
import { CustomValidators, getPasswordError } from '~utils/custom-validators/custom-validators';

@Component({
  selector: 'at-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss']
})
export class ResetPasswordFormComponent implements OnInit {
  @Input() public authMode: AuthModes = AuthModes.Reset;
  @Input() public buttonText = 'Reset';
  @Input() public email = '';
  @Input() public queryParams: AuthParams = { mode: '', oobCode: '' };

  public isLoading: boolean;
  public passwordForm!: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {
    this.isLoading = false;
  }

  public async confirmPasswordReset(formDirective: FormGroupDirective): Promise<void> {
    if (this.passwordForm.valid) {
      this.isLoading = true;

      const newPasswordValue = this.newPassword?.value as string;

      if (this.authMode === AuthModes.Reset) {
        await this.authService.confirmPasswordReset(this.queryParams.oobCode, newPasswordValue).then(() => {
          this.isLoading = false;
          this.resetForm(formDirective);
        });
      } else if (this.authMode === AuthModes.Update) {
        const currentPasswordValue = this.currentPassword?.value as string;

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
    this.passwordForm = this.formBuilder.group({
      newPassword: ['', CustomValidators.passwordValidators],
      confirmPassword: ['', CustomValidators.passwordValidators]
    });
    this.confirmPassword?.setValidators(CustomValidators.matchValue(this.newPassword));

    if (this.authMode === AuthModes.Update) {
      this.passwordForm.addControl('currentPassword', new FormControl('', CustomValidators.passwordValidators));
    }
  }

  private resetForm(formDirective: FormGroupDirective): void {
    this.passwordForm.reset();
    formDirective.resetForm();
  }

  public get authModes(): typeof AuthModes {
    return AuthModes;
  }

  public get confirmPassword(): AbstractControl | null {
    return this.passwordForm.get('confirmPassword');
  }

  public get currentPassword(): AbstractControl | null {
    return this.passwordForm.get('currentPassword');
  }

  public get newPassword(): AbstractControl | null {
    return this.passwordForm.get('newPassword');
  }
}
