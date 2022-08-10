import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { ApplicationsComponent } from './applications.component';
import { ColumnDialogModule } from './components/column-dialog/column-dialog.module';
import { ColumnModule } from './components/column/column.module';

@NgModule({
  declarations: [ApplicationsComponent],
  imports: [
    ColumnModule,
    ColumnDialogModule,
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild([{ path: '', component: ApplicationsComponent }]),
    ScrollingModule
  ]
})
export class ApplicationsModule {}
