import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { PrivacyPolicyModule } from './privacy-policy/privacy-policy.module';

@NgModule({
  imports: [CommonModule, AuthModule, DashboardModule, PrivacyPolicyModule]
})
export class PagesModule {}
