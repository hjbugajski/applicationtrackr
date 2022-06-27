import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Themes } from '~enums/themes.enum';
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
  public themes: Theme[];

  private appThemeSubscription: Subscription | undefined;

  constructor(private themeService: ThemeService) {
    this.appTheme = this.themeService.appTheme;
    this.themes = [
      { class: Themes.Light, viewValue: 'Light theme' },
      { class: Themes.Dark, viewValue: 'Dark theme' }
    ];
  }

  ngOnInit(): void {
    this.appThemeSubscription = this.themeService.appTheme$.subscribe((theme: string) => (this.appTheme = theme));
  }

  ngOnDestroy(): void {
    this.appThemeSubscription?.unsubscribe();
  }

  public setTheme(theme: string): void {
    this.themeService.setTheme(theme);
  }
}
