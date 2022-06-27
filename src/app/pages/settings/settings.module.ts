import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';

import { AlertModule } from '~components/alert/alert.module';
import { ForgotPasswordFormModule } from '~components/forgot-password-form/forgot-password-form.module';
import { ResetPasswordFormModule } from '~components/reset-password-form/reset-password-form.module';
import { SignInWithAppleButtonModule } from '~components/sign-in-with-apple-button/sign-in-with-apple-button.module';
import { SignInWithGoogleButtonModule } from '~components/sign-in-with-google-button/sign-in-with-google-button.module';
import { SignInWithPasswordFormModule } from '~components/sign-in-with-password-form/sign-in-with-password-form.module';
import { ThemePickerModule } from '~components/theme-picker/theme-picker.module';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    AlertModule,
    CommonModule,
    ForgotPasswordFormModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatStepperModule,
    MatToolbarModule,
    ReactiveFormsModule,
    ResetPasswordFormModule,
    RouterModule.forChild([{ path: '', component: SettingsComponent }]),
    SignInWithAppleButtonModule,
    SignInWithGoogleButtonModule,
    SignInWithPasswordFormModule,
    ThemePickerModule
  ]
})
export class SettingsModule {}
