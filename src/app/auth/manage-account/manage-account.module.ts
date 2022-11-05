import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

import { ManageAccountComponent } from './manage-account.component';

import { ResetPasswordFormModule } from '~components/reset-password-form/reset-password-form.module';

@NgModule({
  declarations: [ManageAccountComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ResetPasswordFormModule,
    RouterModule.forChild([{ path: '', component: ManageAccountComponent }])
  ],
  exports: [ManageAccountComponent]
})
export class ManageAccountModule {}
