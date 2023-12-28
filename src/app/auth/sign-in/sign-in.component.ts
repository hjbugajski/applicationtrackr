import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

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
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.5, 0, 0.5, 1)')),
    ]),
  ],
})
export class SignInComponent implements OnDestroy {
  public appTheme: string;
  public currentPath = Paths.SignIn;
  public emailPasswordAuthMode = AuthModes.SignIn;
  public emailSignInButton: string | undefined;
  public showEmailPasswordForm = false;
  public showForgotPassword = false;
  public signInUpButton: LinkButton | undefined;
  public title = 'Sign in';

  private subscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private themeService: ThemeService,
  ) {
    this.appTheme = this.themeService.appTheme;
    this.subscription = this.themeService.appTheme$.subscribe((theme: string) => (this.appTheme = theme));

    this.initSignInOrSignUp();
  }

  public get paths(): typeof Paths {
    return Paths;
  }

  public get themes(): typeof Themes {
    return Themes;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
}
