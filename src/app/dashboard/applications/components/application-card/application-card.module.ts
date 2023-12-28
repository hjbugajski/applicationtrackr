import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ApplicationCardComponent } from './application-card.component';

import { ApplicationPanelModule } from '~components/application-panel/application-panel.module';
import { DayDifferencePipeModule } from '~pipes/day-difference/day-difference.pipe.module';

@NgModule({
  declarations: [ApplicationCardComponent],
  imports: [
    ApplicationPanelModule,
    CommonModule,
    DayDifferencePipeModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [ApplicationCardComponent],
})
export class ApplicationCardModule {}
