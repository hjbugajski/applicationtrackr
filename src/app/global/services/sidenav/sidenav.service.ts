import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private _mode: BehaviorSubject<MatDrawerMode>;
  private _opened: BehaviorSubject<boolean>;
  private _showMenuButton: BehaviorSubject<boolean>;
  private _sidenav: MatSidenav | undefined;
  private subscription: Subscription;

  constructor(private breakpointObserver: BreakpointObserver) {
    this._mode = new BehaviorSubject<MatDrawerMode>('side');
    this._opened = new BehaviorSubject<boolean>(true);
    this._showMenuButton = new BehaviorSubject<boolean>(false);
    this.subscription = new Subscription();
  }

  public destroy(): void {
    this.subscription.unsubscribe();
  }

  public init(): void {
    this.subscription.add(
      this.breakpointObserver.observe(Breakpoints.XSmall).subscribe((result: BreakpointState) => {
        if (result.matches) {
          this._opened.next(false);
          this._mode.next('push');
          this._showMenuButton.next(true);
        } else {
          this._opened.next(true);
          this._mode.next('side');
          this._showMenuButton.next(false);
        }
      })
    );
  }

  public get mode(): BehaviorSubject<MatDrawerMode> {
    return this._mode;
  }

  public setMode(value: MatDrawerMode): void {
    this._mode.next(value);
  }

  public get opened(): BehaviorSubject<boolean> {
    return this._opened;
  }

  public setOpened(value: boolean): void {
    this._opened.next(value);
  }

  public get showMenuButton(): BehaviorSubject<boolean> {
    return this._showMenuButton;
  }

  public get sidenav(): MatSidenav {
    return this._sidenav!;
  }

  public set sidenav(value: MatSidenav) {
    this._sidenav = value;
  }
}
