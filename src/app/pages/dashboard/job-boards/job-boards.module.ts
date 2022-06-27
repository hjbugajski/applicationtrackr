import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JobBoardsComponent } from './job-boards.component';

@NgModule({
  declarations: [JobBoardsComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: JobBoardsComponent }])]
})
export class JobBoardsModule {}
