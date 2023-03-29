import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthModes } from '~enums/auth-modes.enum';
import { Providers } from '~enums/providers.enum';
import { Themes } from '~enums/themes.enum';
import { AuthService } from '~services/auth/auth.service';
import { ThemeService } from '~services/theme/theme.service';

@Component({
  selector: 'at-sign-in-with-apple-button',
  templateUrl: './sign-in-with-apple-button.component.html',
  styleUrls: ['./sign-in-with-apple-button.component.scss']
})
export class SignInWithAppleButtonComponent implements OnDestroy {
  @Input() public authMode: AuthModes = AuthModes.SignIn;
  @Input() public fullWidth = true;
  @Input() public prefix = 'Sign in';
  @Output() public reauthenticated = new EventEmitter<void>();

  public appTheme: Themes | string = Themes.Light;
  public isLoading = false;

  private subscription: Subscription;

  constructor(private authService: AuthService, private themeService: ThemeService) {
    this.appTheme = this.themeService.appTheme;
    this.subscription = this.themeService.appTheme$.subscribe((theme) => (this.appTheme = theme));
  }

  public get themes(): typeof Themes {
    return Themes;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public async signInWithApple(): Promise<void> {
    this.isLoading = true;

    if (this.authMode === AuthModes.SignIn) {
      await this.authService.signInWithApple().finally(() => (this.isLoading = false));
    } else {
      await this.authService
        .reauthenticatePopup(Providers.Apple)
        .then(() => this.reauthenticated.emit())
        .finally(() => (this.isLoading = false));
    }
  }
}
