import { Component, OnInit } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Params } from '~enums/params.enum';
import { Paths } from '~enums/paths.enum';
import { AuthParams } from '~interfaces/auth-params.interface';
import { LinkButton } from '~interfaces/link-button.interface';
import { AuthService } from '~services/auth/auth.service';

@Component({
  selector: 'at-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent implements OnInit {
  public authParams: AuthParams;
  public isLoading = false;
  public linkButton: LinkButton;

  constructor(
    private auth: Auth,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.authParams = this.activatedRoute.snapshot.queryParams as AuthParams;
    this.linkButton = { route: '/', text: 'Back to sign in' };
  }

  public get params(): typeof Params {
    return Params;
  }

  async ngOnInit(): Promise<void> {
    await this.setLinkButton();
  }

  public async recoverEmail(): Promise<void> {
    this.isLoading = true;
    await this.authService.recoverEmail(this.authParams.oobCode).finally(() => (this.isLoading = false));
  }

  public async verifyEmail(): Promise<void> {
    this.isLoading = true;
    await this.authService.verifyEmail(this.authParams.oobCode).finally(() => (this.isLoading = false));
  }

  private async setLinkButton(): Promise<void> {
    const isLoggedIn = await lastValueFrom(
      authState(this.auth).pipe(
        map((user) => !!user),
        take(1)
      )
    );

    this.linkButton = isLoggedIn
      ? { route: `/${Paths.Dashboard}`, text: 'Back to dashboard' }
      : { route: `/${Paths.Auth}/${Paths.SignIn}`, text: 'Back to sign in' };
  }
}
