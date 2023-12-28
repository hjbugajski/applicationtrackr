import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

import { ApplicationsComponent } from './applications.component';
import { ColumnModule } from './components/column/column.module';
import { ColumnDialogModule } from './components/column-dialog/column-dialog.module';

@NgModule({
  declarations: [ApplicationsComponent],
  imports: [
    ColumnModule,
    ColumnDialogModule,
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule.forChild([{ path: '', component: ApplicationsComponent }]),
    ScrollingModule,
  ],
})
export class ApplicationsModule {}
