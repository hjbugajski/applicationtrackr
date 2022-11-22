import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

import { SignInWithGoogleButtonComponent } from './sign-in-with-google-button.component';

@NgModule({
  declarations: [SignInWithGoogleButtonComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  exports: [SignInWithGoogleButtonComponent]
})
export class SignInWithGoogleButtonModule {}
