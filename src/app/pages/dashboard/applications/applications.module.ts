import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ApplicationsComponent } from './applications.component';

@NgModule({
  declarations: [ApplicationsComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: ApplicationsComponent }])]
})
export class ApplicationsModule {}
