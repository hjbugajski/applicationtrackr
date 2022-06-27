import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Paths } from '~enums/paths.enum';
import { Themes } from '~enums/themes.enum';
import { ThemeService } from '~services/theme/theme.service';

interface RouteData {
  title: string;
  path: string;
}

interface SignInUpButton {
  text: string;
  route: string;
}

@Component({
  selector: 'at-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  animations: [
    trigger('emailPasswordExpanded', [
      state('collapsed, void', style({ height: '0', minHeight: '0' })),
      state('expanded', style({ height: '*', marginBottom: '16px' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.5, 0, 0.5, 1)'))
    ])
  ]
})
export class SignInComponent implements OnInit, OnDestroy {
  public lightTheme: string = Themes.Light;
  public darkTheme: string = Themes.Dark;

  public title: string;
  public appTheme: string;
  public emailSignInButton: string | undefined;

  public showEmailPasswordForm: boolean;
  public showForgotPassword: boolean;

  public signInUpButton: SignInUpButton | undefined;

  private appThemeSubscription: Subscription | undefined;

  constructor(private activatedRoute: ActivatedRoute, public themeService: ThemeService) {
    this.title = 'Sign in';
    this.appTheme = this.themeService.appTheme;
    this.showEmailPasswordForm = false;
    this.showForgotPassword = false;
    this.initSignInOrSignUp();
  }

  ngOnInit(): void {
    this.appThemeSubscription = this.themeService.appTheme$.subscribe((theme: string) => (this.appTheme = theme));
  }

  ngOnDestroy(): void {
    this.appThemeSubscription?.unsubscribe();
  }

  private initSignInOrSignUp(): void {
    const data = this.activatedRoute.snapshot.data as RouteData;
    const path: string = data.path;

    this.title = data.title;
    this.emailSignInButton = this.title + ' with email';

    if (path === Paths.SignIn) {
      this.showForgotPassword = true;
      this.signInUpButton = {
        text: 'No account? Sign up',
        route: `/${Paths.Auth}/${Paths.SignUp}`
      };
    } else {
      // Sign up
      this.showForgotPassword = false;
      this.signInUpButton = {
        text: 'Have an account? Sign in',
        route: `/${Paths.Auth}/${Paths.SignIn}`
      };
    }
  }

  public emailSignInButtonClick(): void {
    this.showEmailPasswordForm = !this.showEmailPasswordForm;

    if (this.showEmailPasswordForm) {
      this.emailSignInButton = 'Hide ' + this.title.toLowerCase() + ' with email';
    } else {
      this.emailSignInButton = this.title + ' with email';
    }
  }
}
