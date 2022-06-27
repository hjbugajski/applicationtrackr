import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth.component';

import { Paths } from '~enums/paths.enum';
import { AuthGuard } from '~guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        redirectTo: Paths.SignIn
      },
      {
        path: Paths.SignIn,
        data: { path: Paths.SignIn, title: 'Sign in' },
        loadChildren: () => import('./sign-in/sign-in.module').then((m) => m.SignInModule)
      },
      {
        path: Paths.SignUp,
        data: { path: Paths.SignUp, title: 'Sign up' },
        loadChildren: () => import('./sign-in/sign-in.module').then((m) => m.SignInModule)
      },
      {
        path: Paths.ForgotPassword,
        data: { path: Paths.ForgotPassword, title: 'Forgot password' },
        loadChildren: () => import('./forgot-password/forgot-password.module').then((m) => m.ForgotPasswordModule)
      },
      {
        path: Paths.ManageAccount,
        data: { path: Paths.ManageAccount, title: 'Manage account' },
        loadChildren: () => import('./manage-account/manage-account.module').then((m) => m.ManageAccountModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
