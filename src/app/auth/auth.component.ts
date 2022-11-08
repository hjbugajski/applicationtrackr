import { Component, OnDestroy } from '@angular/core';

import { ThemeService } from '~services/theme/theme.service';

@Component({
  selector: 'at-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnDestroy {
  constructor(private themeService: ThemeService) {
    this.themeService.addBackgroundClass('at-alt-background');
  }

  ngOnDestroy(): void {
    this.themeService.removeBackgroundClass('at-alt-background');
  }
}
