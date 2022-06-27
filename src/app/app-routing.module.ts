import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Paths } from '~enums/paths.enum';
import { AuthGuard } from '~guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: Paths.Dashboard
  },
  {
    path: Paths.Auth,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: Paths.Dashboard,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule)
  },
  {
    path: Paths.PrivacyPolicy,
    loadChildren: () => import('./pages/privacy-policy/privacy-policy.module').then((m) => m.PrivacyPolicyModule)
  },
  {
    path: Paths.Settings,
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
  exports: [RouterModule]
})
export class AppRoutingModule {}
