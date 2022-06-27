import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PrivacyPolicyModule } from './privacy-policy/privacy-policy.module';

@NgModule({
  imports: [CommonModule, AuthModule, DashboardModule, PrivacyPolicyModule]
})
export class PagesModule {}
