import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { TagComponent } from './tag.component';

@NgModule({
  declarations: [TagComponent],
  imports: [CommonModule, MatIconModule],
  exports: [TagComponent]
})
export class TagModule {}
