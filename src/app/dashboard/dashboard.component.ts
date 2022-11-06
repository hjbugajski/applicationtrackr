import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { map, Observable } from 'rxjs';

import { HelpComponent } from '~components/help/help.component';
import { Icons } from '~enums/icons.enum';
import { Paths } from '~enums/paths.enum';
import { AuthService } from '~services/auth/auth.service';
import { SidenavService } from '~services/sidenav/sidenav.service';
import { UserStore } from '~store/user.store';

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
export class DashboardComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) private _sidenav: MatSidenav | undefined;

  public isLoaded$: Observable<boolean>;
  public sidenavItems: SidenavItem[];

  constructor(
    private authService: AuthService,
    private matDialog: MatDialog,
    public sidenavService: SidenavService,
    private userStore: UserStore
  ) {
    this.sidenavItems = [
      {
        icon: Icons.CarbonApplication,
        viewValue: 'Applications',
        route: Paths.Applications
      },
      {
        icon: Icons.CarbonTemplate,
        viewValue: 'Job boards',
        route: Paths.JobBoards
      }
    ];
    this.isLoaded$ = this.userStore.currentJobBoard$.pipe(map((value) => !!value));
  }

  ngOnInit(): void {
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
    if (this.sidenavService.showMenuButton$.getValue()) {
      await this.sidenavService.sidenav?.toggle();
    }
  }
}
