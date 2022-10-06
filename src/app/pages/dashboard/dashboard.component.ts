import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';

import { HelpComponent } from '~components/help/help.component';
import { Icons } from '~enums/icons.enum';
import { Paths } from '~enums/paths.enum';
import { AuthService } from '~services/auth/auth.service';
import { SidenavService } from '~services/sidenav/sidenav.service';

interface SidenavItem {
  icon: string;
  viewValue: string;
  route: string;
}

@Component({
  selector: 'at-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) private _sidenav: MatSidenav | undefined;

  public mode: MatDrawerMode;
  public opened: boolean;
  public sidenavItems: SidenavItem[];

  private subscriptions: Subscription;

  constructor(private authService: AuthService, private matDialog: MatDialog, public sidenavService: SidenavService) {
    this.mode = 'side';
    this.opened = true;
    this.subscriptions = new Subscription();
    this.sidenavItems = [
      {
        icon: Icons.CarbonApplication,
        viewValue: 'Applications',
        route: Paths.Applications
      },
      // {
      //   icon: Icons.CarbonChartMultitype,
      //   viewValue: 'Analytics',
      //   route: Paths.Analytics
      // },
      {
        icon: Icons.CarbonTemplate,
        viewValue: 'Job boards',
        route: Paths.JobBoards
      }
    ];
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

  public openHelpDialog(): void {
    this.matDialog.open(HelpComponent, { maxWidth: '600px', panelClass: 'at-dialog-with-padding' });
  }

  public async signOut(): Promise<void> {
    await this.authService.signOut();
  }

  public get paths(): typeof Paths {
    return Paths;
  }

  public async toggleSidenav(): Promise<void> {
    if (this.sidenavService.showMenuButton.getValue()) {
      await this.sidenavService.sidenav.toggle();
    }
  }
}
