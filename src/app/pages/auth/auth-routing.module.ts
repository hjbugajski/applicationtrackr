import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { SignInComponent } from './sign-in/sign-in.component';

import { Paths } from '~enums/paths.enum';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', pathMatch: 'prefix', redirectTo: Paths.SignIn },
      {
        path: Paths.SignIn,
        component: SignInComponent,
        data: { title: 'Sign in' }
      },
      {
        path: Paths.SignUp,
        component: SignInComponent,
        data: { title: 'Sign up' }
      },
      { path: Paths.PasswordReset, component: PasswordResetComponent },
      { path: Paths.ManageAccount, component: ManageAccountComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
