import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Themes } from '~enums/themes.enum';

const THEME = 'theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public appTheme: Themes;
  public appTheme$: BehaviorSubject<Themes>;

  constructor() {
    this.appTheme = Themes.Light;
    this.appTheme$ = new BehaviorSubject<Themes>(this.appTheme);
  }

  public initTheme(): void {
    this.setTheme((localStorage.getItem(THEME) as Themes) ?? this.appTheme);
  }

  public setTheme(theme: Themes): void {
    localStorage.setItem(THEME, theme);
    document.body.classList.replace(this.appTheme, theme);
    this.appTheme = theme;
    this.appTheme$.next(theme);
  }
}
