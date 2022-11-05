import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Paths } from '~enums/paths.enum';
import { AuthService } from '~services/auth/auth.service';
import { ThemeService } from '~services/theme/theme.service';

@Component({
  selector: 'at-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnDestroy {
  public opened = false;

  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private themeService: ThemeService
  ) {
    this.subscription = this.breakpointObserver.observe('(min-width: 768px)').subscribe((value) => {
      this.opened = value.matches;
    });

    this.themeService.addBackgroundClass('at-background');
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.themeService.removeBackgroundClass('at-background');
  }

  public async signOut(): Promise<void> {
    await this.authService.signOut();
  }

  public get paths(): typeof Paths {
    return Paths;
  }
}
