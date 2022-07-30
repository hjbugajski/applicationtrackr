import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BoardColumnComponent } from './board-column.component';

import { ApplicationDialogModule } from '~components/application-dialog/application-dialog.module';
import { ColumnDialogModule } from '~components/column-dialog/column-dialog.module';
import { ConfirmationDialogModule } from '~components/confirmation-dialog/confirmation-dialog.module';
import { NewApplicationDialogModule } from '~components/new-application-dialog/new-application-dialog.module';
import { OverlaySpinnerModule } from '~components/overlay-spinner/overlay-spinner.module';

@NgModule({
  declarations: [BoardColumnComponent],
  imports: [
    ApplicationDialogModule,
    ColumnDialogModule,
    CommonModule,
    ConfirmationDialogModule,
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    NewApplicationDialogModule,
    OverlaySpinnerModule,
    ScrollingModule
  ],
  exports: [BoardColumnComponent]
})
export class BoardColumnModule {}
