import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  exports: [ConfirmationDialogComponent]
})
export class ConfirmationDialogModule {}
