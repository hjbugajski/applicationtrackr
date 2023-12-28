import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { JobBoardDialogComponent } from './job-board-dialog.component';

import { ConfirmationDialogModule } from '~components/confirmation-dialog/confirmation-dialog.module';

@NgModule({
  declarations: [JobBoardDialogComponent],
  imports: [
    CommonModule,
    ConfirmationDialogModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  exports: [JobBoardDialogComponent],
})
export class JobBoardDialogModule {}
