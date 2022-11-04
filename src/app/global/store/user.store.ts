import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Themes } from '~enums/themes.enum';

@Injectable({ providedIn: 'root' })
export class UserStore {
  public appearance$ = new BehaviorSubject<string | null>(null);
  public collapseColumns$ = new BehaviorSubject<boolean | null>(null);
  public currentJobBoard$ = new BehaviorSubject<string | null>(null);
  public uid$ = new BehaviorSubject<string | null>(null);

  public get appearance(): Themes | string | null {
    return this.appearance$.getValue();
  }

  public set appearance(value: Themes | string | null) {
    this.appearance$.next(value);
  }

  public get collapseColumns(): boolean | null {
    return this.collapseColumns$.getValue();
  }

  public set collapseColumns(value: boolean | null) {
    this.collapseColumns$.next(value);
  }

  public get currentJobBoard(): string | null {
    return this.currentJobBoard$.getValue();
  }

  public set currentJobBoard(value: string | null) {
    this.currentJobBoard$.next(value);
  }

  public get uid(): string | null {
    return this.uid$.getValue();
  }

  public set uid(value: string | null) {
    this.uid$.next(value);
  }
}
