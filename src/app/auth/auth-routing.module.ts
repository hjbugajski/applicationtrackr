import { NgModule } from '@angular/core';
import { RouterModule, Routes, TitleStrategy } from '@angular/router';

import { AuthComponent } from './auth.component';

import { Paths } from '~enums/paths.enum';
import { AuthGuard } from '~guards/auth/auth.guard';
import { PageTitleStrategy } from '~utils/title-strategy.util';

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
        title: 'Sign In',
        data: { path: Paths.SignIn, title: 'Sign in' },
        loadChildren: () => import('./sign-in/sign-in.module').then((m) => m.SignInModule)
      },
      {
        path: Paths.SignUp,
        title: 'Sign Up',
        data: { path: Paths.SignUp, title: 'Sign up' },
        loadChildren: () => import('./sign-in/sign-in.module').then((m) => m.SignInModule)
      },
      {
        path: Paths.ForgotPassword,
        title: 'Forgot Password',
        data: { path: Paths.ForgotPassword, title: 'Forgot password' },
        loadChildren: () => import('./forgot-password/forgot-password.module').then((m) => m.ForgotPasswordModule)
      },
      {
        path: Paths.ManageAccount,
        title: 'Manage Account',
        data: { path: Paths.ManageAccount, title: 'Manage account' },
        loadChildren: () => import('./manage-account/manage-account.module').then((m) => m.ManageAccountModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [{ provide: TitleStrategy, useClass: PageTitleStrategy }],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
