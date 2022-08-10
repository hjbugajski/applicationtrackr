import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Themes } from '~enums/themes.enum';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public appTheme: Themes | string;
  public appTheme$: BehaviorSubject<Themes | string>;
  public prefersColorSchemeDark: MediaQueryList;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.prefersColorSchemeDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.appTheme = this.colorSchemeTheme;
    this.appTheme$ = new BehaviorSubject<Themes | string>(this.appTheme);
  }

  public initTheme(): void {
    this.setTheme(this.colorSchemeTheme);
  }

  public setTheme(value: Themes | string): void {
    const theme = value === Themes.System ? this.colorSchemeTheme : value;

    this.document.body.classList.replace(Themes.Light, theme);
    this.document.body.classList.replace(Themes.Dark, theme);
    this.appTheme = theme;
    this.appTheme$.next(theme);
  }

  private get colorSchemeTheme(): Themes {
    return this.prefersColorSchemeDark.matches ? Themes.Dark : Themes.Light;
  }
}
