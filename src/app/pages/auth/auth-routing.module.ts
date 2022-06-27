import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth.component';

import { Paths } from '~enums/paths.enum';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        redirectTo: Paths.SignIn
      },
      {
        path: Paths.SignIn,
        data: { title: 'Sign in', path: Paths.SignIn },
        loadChildren: () => import('./sign-in/sign-in.module').then((m) => m.SignInModule)
      },
      {
        path: Paths.SignUp,
        data: { title: 'Sign up', path: Paths.SignUp },
        loadChildren: () => import('./sign-in/sign-in.module').then((m) => m.SignInModule)
      },
      {
        path: Paths.PasswordReset,
        loadChildren: () => import('./password-reset/password-reset.module').then((m) => m.PasswordResetModule)
      },
      {
        path: Paths.ManageAccount,
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
