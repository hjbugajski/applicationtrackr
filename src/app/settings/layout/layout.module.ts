import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: LayoutComponent }]),
  ],
})
export class LayoutModule {}
