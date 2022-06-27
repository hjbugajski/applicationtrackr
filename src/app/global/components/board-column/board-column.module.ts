import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BoardColumnComponent } from './board-column.component';

import { ApplicationDialogModule } from '~components/application-dialog/application-dialog.module';
import { NewApplicationDialogModule } from '~components/new-application-dialog/new-application-dialog.module';

@NgModule({
  declarations: [BoardColumnComponent],
  imports: [
    ApplicationDialogModule,
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    NewApplicationDialogModule,
    ScrollingModule
  ],
  exports: [BoardColumnComponent]
})
export class BoardColumnModule {}
