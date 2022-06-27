import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { MaterialModule } from '../modules/material.module';

import { SidenavComponent } from './sidenav/sidenav.component';
import { ThemePickerComponent } from './theme-picker/theme-picker.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  declarations: [ToolbarComponent, ThemePickerComponent, SidenavComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ToolbarComponent, ThemePickerComponent, SidenavComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule {}
