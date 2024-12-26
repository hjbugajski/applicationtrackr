import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  ToolbarComponent,
  ToolbarSpacerDirective,
  ToolbarTitleDirective,
} from './toolbar.component';

@NgModule({
  declarations: [ToolbarComponent, ToolbarSpacerDirective, ToolbarTitleDirective],
  imports: [CommonModule],
  exports: [ToolbarComponent, ToolbarSpacerDirective, ToolbarTitleDirective],
})
export class ToolbarModule {}
