import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TrimUrlPipe } from './trim-url.pipe';

@NgModule({
  declarations: [TrimUrlPipe],
  imports: [CommonModule],
  exports: [TrimUrlPipe],
})
export class TrimUrlPipeModule {}
