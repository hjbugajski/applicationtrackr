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

  constructor(private sidenavService: SidenavService) {
    this.mode = 'side';
    this.opened = true;
    this.subscriptions = new Subscription();

    this.sidenavService.init();

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
  }

  ngOnDestroy(): void {
    this.sidenavService.destroy();
  }

  ngOnInit(): void {
    this.sidenavService.sidenav = this._sidenav!;
  }
}
