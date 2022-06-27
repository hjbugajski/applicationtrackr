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
  @Input() public prefix = 'Sign in';
  @Output() public reauthenticated = new EventEmitter<void>();

  public appTheme = Themes.Light;
  public isLoading = false;

  private themeSubscription: Subscription;

  constructor(private authService: AuthService, private themeService: ThemeService) {
    this.appTheme = this.themeService.appTheme;
    this.themeSubscription = this.themeService.appTheme$.subscribe((theme) => {
      this.appTheme = theme;
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  public async signInWithApple(): Promise<void> {
    this.isLoading = true;

    if (this.authMode === AuthModes.SignIn) {
      await this.authService.signInWithApple().then(() => (this.isLoading = false));
    } else {
      await this.authService.reauthenticatePopup(Providers.Apple).then(() => {
        this.isLoading = false;
        this.reauthenticated.emit();
      });
    }
  }

  public get themes(): typeof Themes {
    return Themes;
  }
}
