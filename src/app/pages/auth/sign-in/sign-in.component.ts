import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TITLE_SUFFIX } from '~constants/title.constant';
import { Paths } from '~enums/paths.enum';
import { Themes } from '~enums/themes.enum';
import { LinkButton } from '~interfaces/link-button.interface';
import { RouteData } from '~interfaces/route-data.interface';
import { AuthService } from '~services/auth/auth.service';
import { ThemeService } from '~services/theme/theme.service';
import { CustomValidators } from '~utils/custom-validators/custom-validators';

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
  public emailForm: FormGroup;
  public emailSignInButton: string | undefined;
  public isAppleLoading: boolean;
  public isEmailLoading: boolean;
  public isGoogleLoading: boolean;
  public showEmailPasswordForm: boolean;
  public showForgotPassword: boolean;
  public signInUpButton: LinkButton | undefined;
  public title: string;

  private appThemeSubscription: Subscription | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    private titleService: Title
  ) {
    this.appTheme = this.themeService.appTheme;
    this.currentPath = Paths.SignIn;
    this.isAppleLoading = false;
    this.isEmailLoading = false;
    this.isGoogleLoading = false;
    this.showEmailPasswordForm = false;
    this.showForgotPassword = false;
    this.title = 'Sign in';

    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email], null, { disabled: true }],
      password: ['', CustomValidators.passwordValidators, null, { disabled: true }]
    });

    this.emailForm.disable();
    this.initSignInOrSignUp();
    this.titleService.setTitle(this.title + TITLE_SUFFIX);
  }

  public getFormControlError(control: AbstractControl | null): string {
    if (control?.hasError('email')) {
      return 'Invalid email';
    } else if (control?.hasError('minlength')) {
      return 'Password length must be at least 8 characters';
    } else if (control?.hasError('letter')) {
      return 'Must contain at least one letter';
    } else if (control?.hasError('number')) {
      return 'Must contain at least one number';
    } else if (control?.hasError('symbol')) {
      return 'Must contain at least one symbol';
    } else {
      return 'Required';
    }
  }

  ngOnDestroy(): void {
    this.appThemeSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.appThemeSubscription = this.themeService.appTheme$.subscribe((theme: string) => (this.appTheme = theme));
  }

  public async signInWithApple(): Promise<void> {
    this.isAppleLoading = true;
    await this.authService.signInWithApple().then(() => (this.isAppleLoading = false));
  }

  public async signInWithEmail(): Promise<void> {
    if (this.emailForm.valid) {
      const email = this.email?.value as string;
      const password = this.password?.value as string;

      this.isEmailLoading = true;

      if (this.currentPath === Paths.SignIn) {
        await this.authService.signInWithEmail(email, password).then(() => (this.isEmailLoading = false));
      } else {
        // Sign up
        await this.authService.createUserWithEmail(email, password).then(() => (this.isEmailLoading = false));
      }
    }
  }

  public async signInWithGoogle(): Promise<void> {
    this.isGoogleLoading = true;
    await this.authService.signInWithGoogle().then(() => (this.isGoogleLoading = false));
  }

  public toggleEmailForm(): void {
    this.showEmailPasswordForm = !this.showEmailPasswordForm;

    if (this.showEmailPasswordForm) {
      this.emailForm.enable();
      this.emailSignInButton = 'Hide ' + this.title.toLowerCase() + ' with email';
    } else {
      this.emailForm.disable();
      this.emailSignInButton = this.title + ' with email';
    }
  }

  private initSignInOrSignUp(): void {
    const data = this.activatedRoute.snapshot.data as RouteData;
    this.currentPath = data.path;

    this.title = data.title;
    this.emailSignInButton = this.title + ' with email';

    if (this.currentPath === Paths.SignIn) {
      this.showForgotPassword = true;
      this.signInUpButton = { text: 'No account? Sign up', route: `/${Paths.Auth}/${Paths.SignUp}` };
    } else {
      // Sign up
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

  public get email(): AbstractControl | null {
    return this.emailForm.get('email');
  }

  public get password(): AbstractControl | null {
    return this.emailForm.get('password');
  }
}
