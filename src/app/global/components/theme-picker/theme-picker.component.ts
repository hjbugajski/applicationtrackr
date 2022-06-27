import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Themes } from '~enums/themes.enum';
import { ThemeService } from '~services/theme/theme.service';

interface Theme {
  class: Themes;
  viewValue: string;
}

@Component({
  selector: 'at-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss']
})
export class ThemePickerComponent implements OnInit, OnDestroy {
  @Input() public layout: string;

  public appTheme: Themes;
  public themesArray: Theme[];

  private appThemeSubscription: Subscription | undefined;

  constructor(private themeService: ThemeService) {
    this.layout = 'icon';
    this.appTheme = this.themeService.appTheme;
    this.themesArray = [
      { class: Themes.Light, viewValue: 'Light theme' },
      { class: Themes.Dark, viewValue: 'Dark theme' }
    ];
  }

  ngOnDestroy(): void {
    this.appThemeSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.appThemeSubscription = this.themeService.appTheme$.subscribe((theme: Themes) => (this.appTheme = theme));
  }

  public setTheme(theme: Themes): void {
    this.themeService.setTheme(theme);
  }

  public get themes(): typeof Themes {
    return Themes;
  }
}
