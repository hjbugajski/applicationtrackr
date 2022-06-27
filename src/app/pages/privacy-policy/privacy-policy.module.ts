import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';
import { MaterialModule } from 'src/app/global/modules/material.module';

@NgModule({
  declarations: [PrivacyPolicyComponent],
  imports: [CommonModule, MaterialModule, PrivacyPolicyRoutingModule],
  exports: [PrivacyPolicyComponent]
})
export class PrivacyPolicyModule {}
