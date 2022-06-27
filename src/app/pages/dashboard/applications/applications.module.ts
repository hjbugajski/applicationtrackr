import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { ApplicationsComponent } from './applications.component';

@NgModule({
  declarations: [ApplicationsComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    RouterModule.forChild([{ path: '', component: ApplicationsComponent }]),
    ScrollingModule
  ]
})
export class ApplicationsModule {}
