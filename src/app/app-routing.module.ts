import { NgModule } from '@angular/core';
import { RouterModule, Routes, TitleStrategy } from '@angular/router';

import { Paths } from '~enums/paths.enum';
import { authGuard } from '~guards/auth/auth.guard';
import { PageTitleStrategy } from '~utils/title-strategy.util';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: Paths.Dashboard
  },
  {
    path: Paths.Auth,
    title: 'Auth',
    canActivate: [authGuard],
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: Paths.Dashboard,
    title: 'Dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
  },
  {
    path: Paths.Settings,
    title: 'Settings',
    canActivate: [authGuard],
    loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsModule)
  },
  {
    path: '**',
    redirectTo: Paths.Dashboard
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [{ provide: TitleStrategy, useClass: PageTitleStrategy }],
  exports: [RouterModule]
})
export class AppRoutingModule {}
