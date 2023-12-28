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
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ApplicationPanelInfoComponent } from './application-panel-info.component';

import { DayDifferencePipeModule } from '~pipes/day-difference/day-difference.pipe.module';
import { TimestampDatePipeModule } from '~pipes/timestamp-date/timestamp-date.pipe.module';
import { TrimUrlPipeModule } from '~pipes/trim-url/trim-url.pipe.module';

@NgModule({
  declarations: [ApplicationPanelInfoComponent],
  imports: [
    CommonModule,
    DayDifferencePipeModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule,
    TimestampDatePipeModule,
    TrimUrlPipeModule,
  ],
  exports: [ApplicationPanelInfoComponent],
})
export class ApplicationPanelInfoModule {}
