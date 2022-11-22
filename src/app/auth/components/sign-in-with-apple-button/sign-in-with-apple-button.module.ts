import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

import { SignInWithAppleButtonComponent } from './sign-in-with-apple-button.component';

@NgModule({
  declarations: [SignInWithAppleButtonComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  exports: [SignInWithAppleButtonComponent]
})
export class SignInWithAppleButtonModule {}
