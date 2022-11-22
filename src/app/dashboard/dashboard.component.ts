import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject, Subscription } from 'rxjs';

import { HelpComponent } from '~components/help/help.component';
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
export class DashboardComponent implements OnDestroy, OnInit {
  @ViewChild('sidenav', { static: true }) private _sidenav: MatSidenav | undefined;

  public isLoaded$ = new BehaviorSubject<boolean>(false);
  public sidenavItems: SidenavItem[];

  private subscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private matDialog: MatDialog,
    public sidenavService: SidenavService,
    private userStore: UserStore
  ) {
    this.sidenavItems = [
      {
        icon: 'view_kanban',
        viewValue: 'Applications',
        route: Paths.Applications
      },
      {
        icon: 'folder',
        viewValue: 'Job boards',
        route: Paths.JobBoards
      }
    ];
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.sidenavService.sidenav = this._sidenav!;
    this.subscription = this.userStore.currentJobBoard$.subscribe((currentJobBoard) => {
      this.isLoaded$.next(false);
      this.changeDetectorRef.detectChanges();

      if (currentJobBoard) {
        this.isLoaded$.next(true);
      }
    });
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
