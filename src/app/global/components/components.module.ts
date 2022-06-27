import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ThemePickerComponent } from './theme-picker/theme-picker.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MaterialModule } from '../modules/material.module';

@NgModule({
  declarations: [ToolbarComponent, ThemePickerComponent, SidenavComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ToolbarComponent, ThemePickerComponent, SidenavComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule {}
