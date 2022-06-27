import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TITLE_SUFFIX } from '~constants/title.constant';
import { AuthModes } from '~enums/auth-modes.enum';
import { Paths } from '~enums/paths.enum';
import { Themes } from '~enums/themes.enum';
import { LinkButton } from '~interfaces/link-button.interface';
import { RouteData } from '~interfaces/route-data.interface';
import { ThemeService } from '~services/theme/theme.service';

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
  public appTheme: string;
  public currentPath: Paths;
  public emailPasswordAuthMode: AuthModes;
  public emailSignInButton: string | undefined;
  public showEmailPasswordForm: boolean;
  public showForgotPassword: boolean;
  public signInUpButton: LinkButton | undefined;
  public title: string;

  private appThemeSubscription: Subscription | undefined;

  constructor(private activatedRoute: ActivatedRoute, private themeService: ThemeService, private titleService: Title) {
    this.appTheme = this.themeService.appTheme;
    this.currentPath = Paths.SignIn;
    this.emailPasswordAuthMode = AuthModes.SignIn;
    this.showEmailPasswordForm = false;
    this.showForgotPassword = false;
    this.title = 'Sign in';

    this.initSignInOrSignUp();
    this.titleService.setTitle(this.title + TITLE_SUFFIX);
  }

  ngOnDestroy(): void {
    this.appThemeSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.appThemeSubscription = this.themeService.appTheme$.subscribe((theme: string) => (this.appTheme = theme));
  }

  public toggleEmailForm(): void {
    this.showEmailPasswordForm = !this.showEmailPasswordForm;

    if (this.showEmailPasswordForm) {
      this.emailSignInButton = 'Hide ' + this.title.toLowerCase() + ' with email';
    } else {
      this.emailSignInButton = this.title + ' with email';
    }
  }

  private initSignInOrSignUp(): void {
    const data = this.activatedRoute.snapshot.data as RouteData;
    this.currentPath = data.path;

    this.title = data.title;
    this.emailSignInButton = this.title + ' with email';

    if (this.currentPath === Paths.SignIn) {
      this.emailPasswordAuthMode = AuthModes.SignIn;
      this.showForgotPassword = true;
      this.signInUpButton = { text: 'No account? Sign up', route: `/${Paths.Auth}/${Paths.SignUp}` };
    } else {
      // Sign up
      this.emailPasswordAuthMode = AuthModes.Create;
      this.showForgotPassword = false;
      this.signInUpButton = { text: 'Have an account? Sign in', route: `/${Paths.Auth}/${Paths.SignIn}` };
    }
  }

  public get paths(): typeof Paths {
    return Paths;
  }

  public get themes(): typeof Themes {
    return Themes;
  }
}
