import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ApplicationDialogComponent } from './application-dialog.component';

import { ApplicationInfoFormModule } from '~components/application-info-form/application-info-form.module';
import { ConfirmationDialogModule } from '~components/confirmation-dialog/confirmation-dialog.module';
import { OverlaySpinnerModule } from '~components/overlay-spinner/overlay-spinner.module';

@NgModule({
  declarations: [ApplicationDialogComponent],
  imports: [
    ApplicationInfoFormModule,
    CommonModule,
    ConfirmationDialogModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    OverlaySpinnerModule,
    ReactiveFormsModule
  ],
  exports: [ApplicationDialogComponent]
})
export class ApplicationDialogModule {}
