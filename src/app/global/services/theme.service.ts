import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LIGHT_THEME, THEME } from '../constants/themes.constants';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public appTheme: string;
  public appTheme$: BehaviorSubject<string>;

  constructor() {
    this.appTheme = LIGHT_THEME.CLASS;
    this.appTheme$ = new BehaviorSubject<string>(this.appTheme);
  }

  public initTheme(): void {
    this.setTheme(localStorage.getItem(THEME) ?? this.appTheme);
  }

  public setTheme(theme: string): void {
    localStorage.setItem(THEME, theme);
    document.body.classList.replace(this.appTheme, theme);
    this.appTheme = theme;
    this.appTheme$.next(theme);
  }
}
