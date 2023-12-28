import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Paths } from '~enums/paths.enum';
import { AuthService } from '~services/auth/auth.service';

@Component({
  selector: 'at-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnDestroy {
  public opened = false;

  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.subscription = this.breakpointObserver
      .observe('(min-width: 768px)')
      .subscribe((v) => (this.opened = v.matches));
  }

  public get paths(): typeof Paths {
    return Paths;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public async signOut(): Promise<void> {
    await this.authService.signOut();
  }
}
