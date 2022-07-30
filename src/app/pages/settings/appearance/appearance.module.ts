import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppearanceComponent } from './appearance.component';

import { ThemePickerModule } from '~components/theme-picker/theme-picker.module';

@NgModule({
  declarations: [AppearanceComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: AppearanceComponent }]), ThemePickerModule]
})
export class AppearanceModule {}
