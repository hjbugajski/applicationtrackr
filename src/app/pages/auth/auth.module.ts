import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/global/modules/material.module';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { SignInComponent } from './sign-in/sign-in.component';

import { ComponentsModule } from '~components/components.module';

@NgModule({
  declarations: [AuthComponent, ManageAccountComponent, PasswordResetComponent, SignInComponent],
  imports: [CommonModule, AuthRoutingModule, ComponentsModule, MaterialModule],
  exports: [AuthComponent]
})
export class AuthModule {}
