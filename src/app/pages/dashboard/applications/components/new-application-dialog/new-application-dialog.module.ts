import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import { NewApplicationDialogComponent } from './new-application-dialog.component';

import { ApplicationInfoFormModule } from '~components/application-info-form/application-info-form.module';

@NgModule({
  declarations: [NewApplicationDialogComponent],
  imports: [ApplicationInfoFormModule, CommonModule, MatDialogModule],
  exports: [NewApplicationDialogComponent]
})
export class NewApplicationDialogModule {}
