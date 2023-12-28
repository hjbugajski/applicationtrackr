import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { OverlaySpinnerComponent } from './overlay-spinner.component';

@NgModule({
  declarations: [OverlaySpinnerComponent],
  imports: [CommonModule, MatProgressSpinnerModule],
  exports: [OverlaySpinnerComponent],
})
export class OverlaySpinnerModule {}
