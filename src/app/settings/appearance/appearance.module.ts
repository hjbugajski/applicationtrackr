import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { RouterModule } from '@angular/router';

import { AppearanceComponent } from './appearance.component';

@NgModule({
  declarations: [AppearanceComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatRadioModule,
    RouterModule.forChild([{ path: '', component: AppearanceComponent }])
  ]
})
export class AppearanceModule {}
