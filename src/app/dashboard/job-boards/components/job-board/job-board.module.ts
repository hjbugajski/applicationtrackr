import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { JobBoardComponent } from './job-board.component';

import { OverlaySpinnerModule } from '~components/overlay-spinner/overlay-spinner.module';
import { TagModule } from '~components/tag/tag.module';
import { TimestampDatePipeModule } from '~pipes/timestamp-date/timestamp-date.pipe.module';

@NgModule({
  declarations: [JobBoardComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    OverlaySpinnerModule,
    TagModule,
    TimestampDatePipeModule,
  ],
  exports: [JobBoardComponent],
})
export class JobBoardModule {}
