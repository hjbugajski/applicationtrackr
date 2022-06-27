import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BoardColumnComponent } from './board-column.component';

@NgModule({
  declarations: [BoardColumnComponent],
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatTooltipModule, ScrollingModule],
  exports: [BoardColumnComponent]
})
export class BoardColumnModule {}
