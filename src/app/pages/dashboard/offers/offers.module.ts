import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OffersComponent } from './offers.component';

@NgModule({
  declarations: [OffersComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: OffersComponent }])]
})
export class OffersModule {}
