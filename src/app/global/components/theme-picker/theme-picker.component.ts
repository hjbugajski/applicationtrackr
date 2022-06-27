import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { THEMES } from '../../constants/themes.constants';
import { ThemeService } from '../../services/theme.service';

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
    { class: THEMES.LIGHT, viewValue: 'Light theme' },
    { class: THEMES.DARK, viewValue: 'Dark theme' }
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
