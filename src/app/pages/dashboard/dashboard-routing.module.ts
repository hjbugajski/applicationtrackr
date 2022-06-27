import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

import { Paths } from '~enums/paths.enum';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', pathMatch: 'prefix', redirectTo: Paths.Applications },
      {
        path: Paths.Analytics,
        loadChildren: () => import('./analytics/analytics.module').then((m) => m.AnalyticsModule)
      },
      {
        path: Paths.Applications,
        loadChildren: () => import('./applications/applications.module').then((m) => m.ApplicationsModule)
      },
      {
        path: Paths.JobBoards,
        loadChildren: () => import('./job-boards/job-boards.module').then((m) => m.JobBoardsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
