import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';

import { AuthModes } from '~enums/auth-modes.enum';
import { AuthService } from '~services/auth/auth.service';
import { NotificationService } from '~services/notification/notification.service';
import { CustomValidators, getEmailError, getPasswordError } from '~utils/custom-validators';

@Component({
  selector: 'at-sign-in-with-password-form',
  templateUrl: './sign-in-with-password-form.component.html'
})
export class SignInWithPasswordFormComponent implements OnChanges {
  @Input() public authMode: AuthModes = AuthModes.SignIn;
  @Input() public buttonColor = 'primary';
  @Input() public buttonText = 'Sign in';
  @Input() public maxWidth = false;
  @Output() public reauthenticated = new EventEmitter<void>();
  @Input() public showForm = false;

  public emailForm = new FormGroup({
    email: new FormControl('', CustomValidators.emailValidators),
    password: new FormControl('', CustomValidators.passwordValidators)
  });
  public isLoading = false;

  constructor(private authService: AuthService, private notificationService: NotificationService) {
    this.emailForm.disable();
  }

  public get email(): AbstractControl<string | null> {
    return this.emailForm.controls.email;
  }

  public get password(): AbstractControl<string | null> {
    return this.emailForm.controls.password;
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
    if (this.emailForm.invalid) {
      return;
    }

    const email = this.email.value!;
    const password = this.password.value!;

    this.isLoading = true;

    if (this.authMode === AuthModes.SignIn) {
      await this.authService
        .signInWithEmail(email, password)
        .then(() => this.resetForm(formDirective))
        .finally(() => (this.isLoading = false));
    } else if (this.authMode === AuthModes.Create) {
      await this.authService
        .createUserWithEmail(email, password)
        .then(() => this.resetForm(formDirective))
        .finally(() => (this.isLoading = false));
    } else {
      await this.authService
        .reauthenticateCredential(email, password)
        .then(() => {
          this.resetForm(formDirective);
          this.reauthenticated.emit();
        })
        .catch(() => {
          this.notificationService.showError('There was an error with re-authentication. Please try again.');
        })
        .finally(() => (this.isLoading = false));
    }
  }

  private resetForm(formDirective: FormGroupDirective): void {
    this.emailForm.reset();
    formDirective.resetForm();
  }
}
