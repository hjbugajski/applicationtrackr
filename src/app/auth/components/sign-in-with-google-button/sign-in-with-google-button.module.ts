import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SignInWithGoogleButtonComponent } from './sign-in-with-google-button.component';

@NgModule({
  declarations: [SignInWithGoogleButtonComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  exports: [SignInWithGoogleButtonComponent],
})
export class SignInWithGoogleButtonModule {}
