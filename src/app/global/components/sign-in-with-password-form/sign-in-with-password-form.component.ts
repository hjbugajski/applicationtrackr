import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';

import { AuthModes } from '~enums/auth-modes.enum';
import { AuthService } from '~services/auth/auth.service';
import { CustomValidators, getEmailError, getPasswordError } from '~utils/custom-validators/custom-validators';

@Component({
  selector: 'at-sign-in-with-password-form',
  templateUrl: './sign-in-with-password-form.component.html',
  styleUrls: ['./sign-in-with-password-form.component.scss']
})
export class SignInWithPasswordFormComponent implements OnChanges {
  @Input() public authMode: AuthModes = AuthModes.SignIn;
  @Input() public buttonColor = 'primary';
  @Input() public buttonText = 'Sign in';
  @Output() public reauthenticated = new EventEmitter<void>();
  @Input() public showForm = false;

  public emailForm: FormGroup;
  public isLoading = false;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {
    this.emailForm = this.formBuilder.group({
      email: ['', CustomValidators.emailValidators, null, { disabled: true }],
      password: ['', CustomValidators.passwordValidators, null, { disabled: true }]
    });

    this.emailForm.disable();
  }

  public getEmailError(control: AbstractControl | null): string {
    return getEmailError(control);
  }

  public getPasswordError(control: AbstractControl | null): string {
    return getPasswordError(control);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.showForm) {
      if (changes.showForm.currentValue) {
        this.emailForm.enable();
      } else {
        this.emailForm.disable();
      }
    }
  }

  public async signInWithEmail(formDirective: FormGroupDirective): Promise<void> {
    if (this.emailForm.valid) {
      const email = this.email?.value as string;
      const password = this.password?.value as string;

      this.isLoading = true;

      if (this.authMode === AuthModes.SignIn) {
        await this.authService.signInWithEmail(email, password).then(() => {
          this.isLoading = false;
          this.resetForm(formDirective);
        });
      } else if (this.authMode === AuthModes.Create) {
        await this.authService.createUserWithEmail(email, password).then(() => {
          this.isLoading = false;
          this.resetForm(formDirective);
        });
      } else {
        await this.authService.reauthenticateCredential(email, password).then(() => {
          this.isLoading = false;
          this.resetForm(formDirective);
          this.reauthenticated.emit();
        });
      }
    }
  }

  private resetForm(formDirective: FormGroupDirective): void {
    this.emailForm.reset();
    formDirective.resetForm();
  }

  public get email(): AbstractControl | null {
    return this.emailForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.emailForm.get('password');
  }
}