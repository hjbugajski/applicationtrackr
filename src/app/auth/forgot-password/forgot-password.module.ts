import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { ForgotPasswordComponent } from './forgot-password.component';

import { ForgotPasswordFormModule } from '~components/forgot-password-form/forgot-password-form.module';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    ForgotPasswordFormModule,
    MatButtonModule,
    RouterModule.forChild([{ path: '', component: ForgotPasswordComponent }])
  ],
  exports: [ForgotPasswordComponent]
})
export class ForgotPasswordModule {}
