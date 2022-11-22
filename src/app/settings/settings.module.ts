import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

import { ToolbarModule } from '~components/toolbar/toolbar.module';

@NgModule({
  declarations: [SettingsComponent],
  imports: [CommonModule, MatButtonModule, MatDividerModule, MatIconModule, SettingsRoutingModule, ToolbarModule]
})
export class SettingsModule {}
