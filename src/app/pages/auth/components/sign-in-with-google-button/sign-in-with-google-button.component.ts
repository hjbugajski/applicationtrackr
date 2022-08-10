import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AuthModes } from '~enums/auth-modes.enum';
import { Providers } from '~enums/providers.enum';
import { AuthService } from '~services/auth/auth.service';

@Component({
  selector: 'at-sign-in-with-google-button',
  templateUrl: './sign-in-with-google-button.component.html',
  styleUrls: ['./sign-in-with-google-button.component.scss']
})
export class SignInWithGoogleButtonComponent {
  @Input() public authMode: AuthModes = AuthModes.SignIn;
  @Input() public fullWidth = true;
  @Input() public prefix = 'Sign in';
  @Output() public reauthenticated = new EventEmitter<void>();

  public isLoading = false;

  constructor(private authService: AuthService) {}

  public async signInWithGoogle(): Promise<void> {
    this.isLoading = true;

    if (this.authMode === AuthModes.SignIn) {
      await this.authService.signInWithGoogle().then(() => (this.isLoading = false));
    } else {
      await this.authService.reauthenticatePopup(Providers.Google).then(() => {
        this.isLoading = false;
        this.reauthenticated.emit();
      });
    }
  }
}
