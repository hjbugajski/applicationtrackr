import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { MaterialModule } from 'src/app/global/modules/material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { ComponentsModule } from 'src/app/global/components/components.module';
import { SignInComponent } from './sign-in/sign-in.component';

@NgModule({
  declarations: [AuthComponent, ManageAccountComponent, PasswordResetComponent, SignInComponent],
  imports: [CommonModule, AuthRoutingModule, ComponentsModule, MaterialModule],
  exports: [AuthComponent]
})
export class AuthModule {}
