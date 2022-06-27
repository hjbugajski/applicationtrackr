import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DARK_THEME, LIGHT_THEME } from '~constants/themes.constants';
import { ThemeService } from '~services/theme/theme.service';

interface Theme {
  class: string;
  viewValue: string;
}

@Component({
  selector: 'at-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss']
})
export class ThemePickerComponent implements OnInit, OnDestroy {
  public appTheme: string;
  public themes: Theme[] = [
    { class: LIGHT_THEME.CLASS, viewValue: LIGHT_THEME.VIEW_VALUE },
    { class: DARK_THEME.CLASS, viewValue: DARK_THEME.VIEW_VALUE }
  ];

  private appThemeSubscription: Subscription | undefined;

  constructor(private themeService: ThemeService) {
    this.appTheme = this.themeService.appTheme;
  }

  ngOnInit(): void {
    this.appThemeSubscription = this.themeService.appTheme$.subscribe((theme: string) => {
      this.appTheme = theme;
    });
  }

  ngOnDestroy(): void {
    if (this.appThemeSubscription) {
      this.appThemeSubscription.unsubscribe();
    }
  }

  public setTheme(theme: string): void {
    this.themeService.setTheme(theme);
  }
}
