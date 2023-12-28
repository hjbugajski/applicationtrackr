import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DayDifferencePipe } from './day-difference.pipe';

@NgModule({
  declarations: [DayDifferencePipe],
  imports: [CommonModule],
  exports: [DayDifferencePipe],
})
export class DayDifferencePipeModule {}
