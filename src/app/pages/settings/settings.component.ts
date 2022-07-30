import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '~services/auth/auth.service';

@Component({
  selector: 'at-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnDestroy {
  public opened = false;

  private subscription: Subscription;

  constructor(private authService: AuthService, private breakpointObserver: BreakpointObserver) {
    this.subscription = this.breakpointObserver.observe('(min-width: 768px)').subscribe((value) => {
      this.opened = value.matches;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public async signOut(): Promise<void> {
    await this.authService.signOut();
  }
}
