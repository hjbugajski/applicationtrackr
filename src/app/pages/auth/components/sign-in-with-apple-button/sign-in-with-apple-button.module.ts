import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SignInWithAppleButtonComponent } from './sign-in-with-apple-button.component';

@NgModule({
  declarations: [SignInWithAppleButtonComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  exports: [SignInWithAppleButtonComponent]
})
export class SignInWithAppleButtonModule {}
