import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { SidenavComponent } from './sidenav.component';

import { BoardSelectorModule } from '~components/board-selector/board-selector.module';
import { ThemePickerModule } from '~components/theme-picker/theme-picker.module';

@NgModule({
  declarations: [SidenavComponent],
  imports: [
    BoardSelectorModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatToolbarModule,
    MatTooltipModule,
    ThemePickerModule,
    RouterModule
  ],
  exports: [SidenavComponent]
})
export class SidenavModule {}
