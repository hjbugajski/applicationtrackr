import { Component } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs/operators';

import { TITLE_SUFFIX } from '~constants/title.constant';
import { Params } from '~enums/params.enum';
import { Paths } from '~enums/paths.enum';
import { AuthParams } from '~interfaces/auth-params.interface';
import { LinkButton } from '~interfaces/link-button.interface';
import { RouteData } from '~interfaces/route-data.interface';
import { AuthService } from '~services/auth/auth.service';

@Component({
  selector: 'at-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent {
  public isLoading: boolean;
  public linkButton: LinkButton;
  public queryParams: AuthParams;

  constructor(
    private auth: Auth,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private titleService: Title
  ) {
    const routeSnapshot = this.activatedRoute.snapshot;
    const data = routeSnapshot.data as RouteData;

    this.isLoading = false;
    this.queryParams = routeSnapshot.queryParams as AuthParams;
    this.linkButton = { route: '/', text: 'Back to sign in' };

    this.titleService.setTitle(data.title + TITLE_SUFFIX);
    this.setLinkButton();
  }

  public async recoverEmail(): Promise<void> {
    this.isLoading = true;
    await this.authService.recoverEmail(this.queryParams.oobCode).then(() => (this.isLoading = false));
  }

  public async verifyEmail(): Promise<void> {
    this.isLoading = true;
    await this.authService.verifyEmail(this.queryParams.oobCode).then(() => (this.isLoading = false));
  }

  private setLinkButton(): void {
    authState(this.auth)
      .pipe(
        map((user) => !!user),
        take(1)
      )
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
}
