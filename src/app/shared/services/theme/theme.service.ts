import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, takeUntil } from 'rxjs';

import { Themes } from '~enums/themes.enum';
import { GlobalService } from '~services/global/global.service';
import { UserStore } from '~store/user.store';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public appTheme: Themes | string;
  public appTheme$: BehaviorSubject<Themes | string>;
  public prefersColorSchemeDark: MediaQueryList;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private globalService: GlobalService,
    private userStore: UserStore,
  ) {
    this.prefersColorSchemeDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.appTheme = this.colorSchemeTheme;
    this.appTheme$ = new BehaviorSubject<Themes | string>(this.appTheme);
    this.userStore.appearance$
      .pipe(
        takeUntil(this.globalService.destroy$),
        filter((appearance) => appearance !== null),
      )
      .subscribe((appearance) => {
        this.setTheme(appearance!);
      });
    this.prefersColorSchemeDark.addEventListener('change', (event) => {
      if (this.userStore.appearance === null || this.userStore.appearance === Themes.System.toString()) {
        this.setTheme(event.matches ? Themes.Dark : Themes.Light);
      }
    });
    this.setTheme(this.colorSchemeTheme);
  }

  private get colorSchemeTheme(): Themes {
    return this.prefersColorSchemeDark.matches ? Themes.Dark : Themes.Light;
  }

  public addBackgroundClass(value: string): void {
    this.document.body.classList.add(value);
  }

  public removeBackgroundClass(value: string): void {
    this.document.body.classList.remove(value);
  }

  public removeListeners(): void {
    this.prefersColorSchemeDark.removeAllListeners!('change');
  }

  public setTheme(value: Themes | string): void {
    const theme = value === Themes.System.toString() ? this.colorSchemeTheme : value;

    this.document.body.classList.replace(Themes.Light, theme);
    this.document.body.classList.replace(Themes.Dark, theme);
    this.appTheme = theme;
    this.appTheme$.next(theme);
  }
}
