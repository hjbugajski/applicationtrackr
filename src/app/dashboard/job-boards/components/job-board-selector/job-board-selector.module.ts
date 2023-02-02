import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { JobBoardSelectorComponent } from './job-board-selector.component';

import { JobBoardDialogModule } from '~components/job-board-dialog/job-board-dialog.module';

@NgModule({
  declarations: [JobBoardSelectorComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    JobBoardDialogModule
  ],
  exports: [JobBoardSelectorComponent]
})
export class JobBoardSelectorModule {}
