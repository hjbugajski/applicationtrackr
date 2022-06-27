import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/global/modules/material.module';

import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';
import { PrivacyPolicyComponent } from './privacy-policy.component';

@NgModule({
  declarations: [PrivacyPolicyComponent],
  imports: [CommonModule, MaterialModule, PrivacyPolicyRoutingModule],
  exports: [PrivacyPolicyComponent]
})
export class PrivacyPolicyModule {}
