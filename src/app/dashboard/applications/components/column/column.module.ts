import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { ColumnComponent } from './column.component';

import { ApplicationCardModule } from '~components/application-card/application-card.module';
import { ColumnDialogModule } from '~components/column-dialog/column-dialog.module';
import { ConfirmationDialogModule } from '~components/confirmation-dialog/confirmation-dialog.module';
import { NewApplicationDialogModule } from '~components/new-application-dialog/new-application-dialog.module';
import { OverlaySpinnerModule } from '~components/overlay-spinner/overlay-spinner.module';
import { TagModule } from '~components/tag/tag.module';
import { DayDifferencePipeModule } from '~pipes/day-difference/day-difference.pipe.module';

@NgModule({
  declarations: [ColumnComponent],
  imports: [
    ApplicationCardModule,
    ColumnDialogModule,
    CommonModule,
    ConfirmationDialogModule,
    DayDifferencePipeModule,
    DragDropModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    NewApplicationDialogModule,
    OverlaySpinnerModule,
    ScrollingModule,
    TagModule
  ],
  exports: [ColumnComponent]
})
export class ColumnModule {}
