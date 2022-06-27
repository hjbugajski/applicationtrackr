import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { DiscardDialogComponent } from './discard-dialog.component';

@NgModule({
  declarations: [DiscardDialogComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  exports: [DiscardDialogComponent]
})
export class DiscardDialogModule {}
