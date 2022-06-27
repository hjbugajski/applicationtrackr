import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';

import { SidenavService } from '~services/sidenav/sidenav.service';

@Component({
  selector: 'at-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) private _sidenav: MatSidenav | undefined;

  public mode: MatDrawerMode;
  public opened: boolean;

  private subscriptions: Subscription;

  constructor(public sidenavService: SidenavService) {
    this.mode = 'side';
    this.opened = true;
    this.subscriptions = new Subscription();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.sidenavService.mode.subscribe((value) => {
        this.mode = value;
      })
    );
    this.subscriptions.add(
      this.sidenavService.opened.subscribe((value) => {
        this.opened = value;
      })
    );
    this.sidenavService.sidenav = this._sidenav!;
  }
}
