import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

import { AuthService } from '~services/auth/auth.service';
import { CustomValidators, getEmailError } from '~utils/custom-validators';

@Component({
  selector: 'at-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
})
export class ForgotPasswordFormComponent implements OnInit {
  @Input() public emailValue: string | undefined;
  @Input() public hint: string | undefined;
  @Input() public maxWidth = false;
  @Input() public readonly: boolean | undefined;

  public email = new FormControl('', {
    nonNullable: true,
    validators: CustomValidators.emailValidators,
  });
  public isLoading = false;

  constructor(private authService: AuthService) {}

  public getEmailError(control: AbstractControl | null): string {
    return getEmailError(control);
  }

  ngOnInit(): void {
    this.email.setValue(this.emailValue ?? '');
  }

  public async sendPasswordResetEmail(): Promise<void> {
    if (this.email.valid) {
      this.isLoading = true;

      await this.authService
        .sendPasswordResetEmail(this.email.value)
        .finally(() => (this.isLoading = false));
    }
  }
}
