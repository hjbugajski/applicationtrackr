import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from '~services/auth/auth.service';
import { MatIconService } from '~services/mat-icon/mat-icon.service';
import { ThemeService } from '~services/theme/theme.service';

@Component({
  selector: 'at-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private matIconService: MatIconService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.authService.initAuthState();
    this.matIconService.initializeMatIcons();
    this.themeService.initTheme();
  }

  ngOnDestroy(): void {
    this.authService.destroyAuthState();
  }
}
