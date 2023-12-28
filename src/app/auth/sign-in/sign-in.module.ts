import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { SignInComponent } from './sign-in.component';

import { SignInWithAppleButtonModule } from '~components/sign-in-with-apple-button/sign-in-with-apple-button.module';
import { SignInWithGoogleButtonModule } from '~components/sign-in-with-google-button/sign-in-with-google-button.module';
import { SignInWithPasswordFormModule } from '~components/sign-in-with-password-form/sign-in-with-password-form.module';

@NgModule({
  declarations: [SignInComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild([{ path: '', component: SignInComponent }]),
    SignInWithAppleButtonModule,
    SignInWithGoogleButtonModule,
    SignInWithPasswordFormModule,
  ],
  exports: [SignInComponent],
})
export class SignInModule {}
