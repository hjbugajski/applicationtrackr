import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';

import { AuthService } from '~services/auth/auth.service';
import { CustomValidators, getEmailError } from '~utils/custom-validators';

@Component({
  selector: 'at-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss']
})
export class ForgotPasswordFormComponent implements OnInit {
  @Input() public emailValue: string | undefined;
  @Input() public hint: string | undefined;
  @Input() public readonly: boolean | undefined;

  public email: UntypedFormControl;
  public isLoading: boolean;

  constructor(private authService: AuthService) {
    this.email = new UntypedFormControl('', CustomValidators.emailValidators);
    this.isLoading = false;
  }

  public getEmailError(control: AbstractControl | null): string {
    return getEmailError(control);
  }

  ngOnInit(): void {
    this.email.setValue(this.emailValue ?? '');
  }

  public async sendPasswordResetEmail(): Promise<void> {
    if (this.email.valid) {
      this.isLoading = true;

      const email = this.email.value as string;

      await this.authService.sendPasswordResetEmail(email).then(() => (this.isLoading = false));
    }
  }
}
