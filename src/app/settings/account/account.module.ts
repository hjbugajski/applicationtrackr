import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';

import { AccountComponent } from './account.component';

import { AlertModule } from '~components/alert/alert.module';
import { ForgotPasswordFormModule } from '~components/forgot-password-form/forgot-password-form.module';
import { ResetPasswordFormModule } from '~components/reset-password-form/reset-password-form.module';
import { SignInWithAppleButtonModule } from '~components/sign-in-with-apple-button/sign-in-with-apple-button.module';
import { SignInWithGoogleButtonModule } from '~components/sign-in-with-google-button/sign-in-with-google-button.module';
import { SignInWithPasswordFormModule } from '~components/sign-in-with-password-form/sign-in-with-password-form.module';

@NgModule({
  declarations: [AccountComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatDividerModule,
    AlertModule,
    FormsModule,
    ReactiveFormsModule,
    ForgotPasswordFormModule,
    ResetPasswordFormModule,
    MatProgressSpinnerModule,
    SignInWithAppleButtonModule,
    SignInWithPasswordFormModule,
    SignInWithGoogleButtonModule,
    RouterModule.forChild([{ path: '', component: AccountComponent }])
  ]
})
export class AccountModule {}
