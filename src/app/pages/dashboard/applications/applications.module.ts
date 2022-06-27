import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ApplicationsComponent } from './applications.component';

import { BoardColumnModule } from '~components/board-column/board-column.module';

@NgModule({
  declarations: [ApplicationsComponent],
  imports: [
    BoardColumnModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: ApplicationsComponent }]),
    ScrollingModule
  ]
})
export class ApplicationsModule {}
