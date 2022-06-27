import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { ThemePickerComponent } from './theme-picker.component';

@NgModule({
  declarations: [ThemePickerComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  exports: [ThemePickerComponent]
})
export class ThemePickerModule {}
