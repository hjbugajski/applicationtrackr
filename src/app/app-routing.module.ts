import { NgModule } from '@angular/core';
import { RouterModule, Routes, TitleStrategy } from '@angular/router';

import { Paths } from '~enums/paths.enum';
import { AuthGuard } from '~guards/auth/auth.guard';
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
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: Paths.Dashboard,
    title: 'Dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule)
  },
  {
    path: Paths.PrivacyPolicy,
    title: 'Privacy Policy',
    loadChildren: () => import('./pages/privacy-policy/privacy-policy.module').then((m) => m.PrivacyPolicyModule)
  },
  {
    path: Paths.Settings,
    title: 'Settings',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/settings/settings.module').then((m) => m.SettingsModule)
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
