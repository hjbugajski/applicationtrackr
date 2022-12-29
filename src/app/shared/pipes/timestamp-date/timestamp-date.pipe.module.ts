import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TimestampDatePipe } from './timestamp-date.pipe';

@NgModule({
  declarations: [TimestampDatePipe],
  imports: [CommonModule],
  exports: [TimestampDatePipe]
})
export class TimestampDatePipeModule {}
