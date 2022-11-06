import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable, takeUntil } from 'rxjs';

import { Themes } from '~enums/themes.enum';
import { GlobalService } from '~services/global/global.service';

interface UserState {
  appearance: Themes | string | null;
  collapseColumns: boolean | null;
  currentJobBoard: string | null;
  uid: string | null;
}

@Injectable({ providedIn: 'root' })
export class UserStore {
  public state!: UserState;
  public state$: Observable<UserState>;

  protected _state$: BehaviorSubject<UserState>;

  constructor(private globalService: GlobalService) {
    this._state$ = new BehaviorSubject<UserState>({
      appearance: null,
      collapseColumns: null,
      currentJobBoard: null,
      uid: null
    });
    this.state$ = this._state$.asObservable().pipe(distinctUntilChanged());
    this.state$.pipe(takeUntil(this.globalService.destroy$)).subscribe((state) => {
      this.state = state;
    });
  }

  public reset(): void {
    this._state$.next({
      appearance: null,
      collapseColumns: null,
      currentJobBoard: null,
      uid: null
    });
  }

  public set(newValue: Partial<UserState>): void {
    this._state$.next(Object.assign({}, newValue) as UserState);
  }

  public update(value: Partial<UserState>): void {
    this._state$.next(Object.assign({}, this.state, value));
  }

  public get appearance(): Themes | string | null {
    return this.state.appearance;
  }

  public get appearance$(): Observable<Themes | string | null> {
    return this.state$.pipe(map((state) => state.appearance));
  }

  public get collapseColumns(): boolean | null {
    return this.state.collapseColumns;
  }

  public get collapseColumns$(): Observable<boolean | null> {
    return this.state$.pipe(map((state) => state.collapseColumns));
  }

  public get currentJobBoard(): string | null {
    return this.state.currentJobBoard;
  }

  public get currentJobBoard$(): Observable<string | null> {
    return this.state$.pipe(map((state) => state.currentJobBoard));
  }

  public get uid(): string | null {
    return this.state.uid;
  }

  public get uid$(): Observable<string | null> {
    return this.state$.pipe(map((state) => state.uid));
  }
}
