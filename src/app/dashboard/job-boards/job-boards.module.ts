import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { RouterModule } from '@angular/router';

import { JobBoardsComponent } from './job-boards.component';

import { OverlaySpinnerModule } from '~components/overlay-spinner/overlay-spinner.module';

@NgModule({
  declarations: [JobBoardsComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    OverlaySpinnerModule,
    RouterModule.forChild([{ path: '', component: JobBoardsComponent }])
  ]
})
export class JobBoardsModule {}
