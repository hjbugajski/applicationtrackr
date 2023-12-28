import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { ColumnDialogComponent } from './column-dialog.component';

import { ConfirmationDialogModule } from '~components/confirmation-dialog/confirmation-dialog.module';
import { OverlaySpinnerModule } from '~components/overlay-spinner/overlay-spinner.module';

@NgModule({
  declarations: [ColumnDialogComponent],
  imports: [
    CommonModule,
    ConfirmationDialogModule,
    DragDropModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    OverlaySpinnerModule,
    ReactiveFormsModule,
  ],
  exports: [ColumnDialogComponent],
})
export class ColumnDialogModule {}
