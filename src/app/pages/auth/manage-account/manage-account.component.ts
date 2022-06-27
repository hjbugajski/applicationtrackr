import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

import { TITLE_SUFFIX } from '~constants/title.constant';
import { Params } from '~enums/params.enum';
import { Paths } from '~enums/paths.enum';
import { LinkButton } from '~interfaces/link-button.interface';
import { RouteData } from '~interfaces/route-data.interface';
import { AuthService } from '~services/auth/auth.service';
import { CustomValidators } from '~utils/custom-validators/custom-validators';

interface AuthParams {
  mode: string;
  oobCode: string;
}

@Component({
  selector: 'at-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent {
  public queryParams: AuthParams;
  public passwordForm: FormGroup;
  public isLoading: boolean;
  public linkButton: LinkButton;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private titleService: Title
  ) {
    const routeSnapshot = this.activatedRoute.snapshot;
    const data = routeSnapshot.data as RouteData;

    this.isLoading = false;
    this.queryParams = routeSnapshot.queryParams as AuthParams;
    this.linkButton = { route: '/', text: 'Back to sign in' };

    this.passwordForm = this.formBuilder.group({
      password: ['', CustomValidators.passwordValidators],
      confirmPassword: ['', CustomValidators.passwordValidators]
    });
    this.confirmPassword?.setValidators(CustomValidators.matchValue(this.password));

    this.titleService.setTitle(data.title + TITLE_SUFFIX);
    this.setLinkButton();
  }

  public async confirmPasswordReset(): Promise<void> {
    if (this.passwordForm.valid) {
      this.isLoading = true;

      const passwordValue = this.password?.value as string;

      await this.authService
        .confirmPasswordReset(this.queryParams.oobCode, passwordValue)
        .then(() => (this.isLoading = false));
    }
  }

  public async verifyEmail(): Promise<void> {
    this.isLoading = true;
    await this.authService.verifyEmail(this.queryParams.oobCode).then(() => (this.isLoading = false));
  }

  public async recoverEmail(): Promise<void> {
    this.isLoading = true;
    await this.authService.recoverEmail(this.queryParams.oobCode).then(() => (this.isLoading = false));
  }

  public getFormControlError(control: AbstractControl | null): string {
    if (control?.hasError('minlength')) {
      return 'Length must be at least 8 characters';
    } else if (control?.hasError('letter')) {
      return 'Must contain at least one letter';
    } else if (control?.hasError('number')) {
      return 'Must contain at least one number';
    } else if (control?.hasError('symbol')) {
      return 'Must contain at least one symbol';
    } else if (control?.hasError('matchValue')) {
      return 'Passwords must match';
    } else {
      return 'Required';
    }
  }

  private setLinkButton(): void {
    this.authService.isLoggedIn$
      .pipe(take(1))
      .toPromise()
      .then((isLoggedIn) => {
        this.linkButton = isLoggedIn
          ? { route: `/${Paths.Dashboard}`, text: 'Back to dashboard' }
          : { route: `/${Paths.Auth}/${Paths.SignIn}`, text: 'Back to sign in' };
      })
      .catch((error) => {
        console.error(error);
      });
  }

  public get params(): typeof Params {
    return Params;
  }

  public get password(): AbstractControl | null {
    return this.passwordForm.get('password');
  }

  public get confirmPassword(): AbstractControl | null {
    return this.passwordForm.get('confirmPassword');
  }
}
