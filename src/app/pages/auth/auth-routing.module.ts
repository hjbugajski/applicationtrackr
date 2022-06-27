import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SIGN_IN, SIGN_UP } from 'src/app/global/constants/pages.constants';
import { AuthComponent } from './auth.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { SignInComponent } from './sign-in/sign-in.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', pathMatch: 'prefix', redirectTo: 'sign-in' },
      {
        path: 'sign-in',
        component: SignInComponent,
        data: { title: { value: SIGN_IN.VALUE, viewValue: SIGN_IN.VIEW_VALUE } }
      },
      {
        path: 'sign-up',
        component: SignInComponent,
        data: { title: { value: SIGN_UP.VALUE, viewValue: SIGN_UP.VIEW_VALUE } }
      },
      { path: 'password-reset', component: PasswordResetComponent },
      { path: 'manage-account', component: ManageAccountComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
