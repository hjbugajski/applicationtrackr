import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { SidenavModule } from '~components/sidenav/sidenav.module';
import { ToolbarModule } from '~components/toolbar/toolbar.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, DashboardRoutingModule, MatSidenavModule, SidenavModule, ToolbarModule]
})
export class DashboardModule {}
