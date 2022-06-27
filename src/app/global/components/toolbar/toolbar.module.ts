import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { ToolbarComponent } from './toolbar.component';

import { BoardSelectorModule } from '~components/board-selector/board-selector.module';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [BoardSelectorModule, CommonModule, MatButtonModule, MatIconModule, MatToolbarModule, RouterModule],
  exports: [ToolbarComponent]
})
export class ToolbarModule {}
