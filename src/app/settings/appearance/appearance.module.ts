import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
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
