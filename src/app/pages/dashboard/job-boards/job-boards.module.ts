import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

import { JobBoardsComponent } from './job-boards.component';

@NgModule({
  declarations: [JobBoardsComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    RouterModule.forChild([{ path: '', component: JobBoardsComponent }])
  ]
})
export class JobBoardsModule {}
