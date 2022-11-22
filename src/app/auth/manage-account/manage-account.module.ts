import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { RouterModule } from '@angular/router';

import { ManageAccountComponent } from './manage-account.component';

import { ResetPasswordFormModule } from '~components/reset-password-form/reset-password-form.module';

@NgModule({
  declarations: [ManageAccountComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ResetPasswordFormModule,
    RouterModule.forChild([{ path: '', component: ManageAccountComponent }])
  ],
  exports: [ManageAccountComponent]
})
export class ManageAccountModule {}
