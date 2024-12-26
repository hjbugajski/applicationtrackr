import { NgModule } from '@angular/core';
import { RouterModule, Routes, TitleStrategy } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

import { Paths } from '~enums/paths.enum';
import { PageTitleStrategy } from '~utils/title-strategy.util';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', pathMatch: 'prefix', redirectTo: Paths.Applications },
      {
        path: Paths.Applications,
        title: 'Applications',
        loadChildren: () =>
          import('./applications/applications.module').then((m) => m.ApplicationsModule),
      },
      {
        path: Paths.JobBoards,
        title: 'Job Boards',
        loadChildren: () => import('./job-boards/job-boards.module').then((m) => m.JobBoardsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [{ provide: TitleStrategy, useClass: PageTitleStrategy }],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
