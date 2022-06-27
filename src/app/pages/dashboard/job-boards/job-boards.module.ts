import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { JobBoardsComponent } from './job-boards.component';

@NgModule({
  declarations: [JobBoardsComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    RouterModule.forChild([{ path: '', component: JobBoardsComponent }])
  ]
})
export class JobBoardsModule {}
