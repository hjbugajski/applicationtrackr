import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';

import { ThemePickerModule } from '~components/theme-picker/theme-picker.module';

@NgModule({
  declarations: [AuthComponent],
  imports: [AuthRoutingModule, CommonModule, MatCardModule, MatIconModule, MatSidenavModule, ThemePickerModule],
  exports: [AuthComponent]
})
export class AuthModule {}
