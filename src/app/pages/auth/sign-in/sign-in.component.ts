import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { SIGN_IN, SIGN_UP } from 'src/app/global/constants/pages.constants';
import { LIGHT_THEME, DARK_THEME } from 'src/app/global/constants/themes.constants';
import { IPage } from 'src/app/global/interfaces/page.interface';
import { ThemeService } from 'src/app/global/services/theme.service';

interface ISignInUpButton {
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
  public LIGHT_THEME: string = LIGHT_THEME.CLASS;
  public DARK_THEME: string = DARK_THEME.CLASS;

  public title: string;
  public appTheme: string;
  public emailSignInButton: string | undefined;

  public showEmailPasswordForm: boolean;
  public showForgotPassword: boolean;

  public signInUpButton: ISignInUpButton | undefined;

  private activatedRouteSubscription: Subscription | undefined;
  private appThemeSubscription: Subscription | undefined;

  constructor(private activatedRoute: ActivatedRoute, public themeService: ThemeService) {
    this.title = SIGN_IN.VIEW_VALUE;
    this.appTheme = this.themeService.appTheme;
    this.showEmailPasswordForm = false;
    this.showForgotPassword = false;
  }

  ngOnInit(): void {
    this.activatedRouteSubscription = this.subscribeToActivatedRoute();
    this.appThemeSubscription = this.subscribeToAppTheme();
  }

  ngOnDestroy(): void {
    if (this.activatedRouteSubscription) {
      this.activatedRouteSubscription.unsubscribe();
    }

    if (this.appThemeSubscription) {
      this.appThemeSubscription.unsubscribe();
    }
  }

  private subscribeToActivatedRoute(): Subscription {
    return this.activatedRoute.data.subscribe((data: Data) => {
      this.onActivatedRouteDataChange(data.title);
    });
  }

  private subscribeToAppTheme(): Subscription {
    return this.themeService.appTheme$.subscribe((theme: string) => {
      this.appTheme = theme;
    });
  }

  private onActivatedRouteDataChange(title: IPage): void {
    this.title = title.viewValue;
    this.emailSignInButton = title.viewValue + ' with email';

    if (title.value === SIGN_IN.VALUE) {
      this.showForgotPassword = true;
      this.signInUpButton = {
        text: 'No account? Sign up',
        route: SIGN_UP.ROUTE
      };
    } else {
      // Sign up
      this.showForgotPassword = false;
      this.signInUpButton = {
        text: 'Have an account? Sign in',
        route: SIGN_IN.ROUTE
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
