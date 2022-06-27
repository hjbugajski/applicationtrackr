import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

import { ForgotPasswordComponent } from './forgot-password.component';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: ForgotPasswordComponent }])
  ],
  exports: [ForgotPasswordComponent]
})
export class ForgotPasswordModule {}
