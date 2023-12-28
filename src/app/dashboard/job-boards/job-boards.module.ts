import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JobBoardsComponent } from './job-boards.component';

import { JobBoardModule } from '~components/job-board/job-board.module';

@NgModule({
  declarations: [JobBoardsComponent],
  imports: [CommonModule, JobBoardModule, RouterModule.forChild([{ path: '', component: JobBoardsComponent }])],
})
export class JobBoardsModule {}
