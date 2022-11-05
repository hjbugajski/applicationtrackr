import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DayDifferencePipeModule } from 'src/app/global/pipes/day-difference/day-difference.pipe.module';

import { ApplicationCardComponent } from './application-card.component';

@NgModule({
  declarations: [ApplicationCardComponent],
  imports: [CommonModule, DayDifferencePipeModule, DragDropModule, MatIconModule],
  exports: [ApplicationCardComponent]
})
export class ApplicationCardModule {}
