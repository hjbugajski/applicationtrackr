import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AnalyticsComponent } from './analytics.component';

@NgModule({
  declarations: [AnalyticsComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: AnalyticsComponent }])]
})
export class AnalyticsModule {}
