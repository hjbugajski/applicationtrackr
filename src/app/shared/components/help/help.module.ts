import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { HelpComponent } from './help.component';

@NgModule({
  declarations: [HelpComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  exports: [HelpComponent]
})
export class HelpModule {}
