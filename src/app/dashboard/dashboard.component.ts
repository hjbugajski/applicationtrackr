import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { Paths } from '~enums/paths.enum';
import { AuthService } from '~services/auth/auth.service';
import { UserStore } from '~store/user.store';

interface SidenavItem {
  icon: string;
  relativeRoute: boolean;
  route: string;
  viewValue: string;
}

@Component({
  selector: 'at-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy, OnInit {
  public isLoaded$ = new BehaviorSubject<boolean>(false);
  public sidenavItems: SidenavItem[];

  private subscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private userStore: UserStore
  ) {
    this.sidenavItems = [
      {
        icon: 'view_kanban',
        relativeRoute: true,
        route: Paths.Applications,
        viewValue: 'Applications'
      },
      {
        icon: 'folder',
        relativeRoute: true,
        route: Paths.JobBoards,
        viewValue: 'Job boards'
      }
    ];
  }

  public get paths(): typeof Paths {
    return Paths;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.userStore.currentJobBoard$.subscribe((currentJobBoard) => {
      this.isLoaded$.next(false);
      this.changeDetectorRef.detectChanges();

      if (currentJobBoard) {
        this.isLoaded$.next(true);
      }
    });
  }

  public async signOut(): Promise<void> {
    await this.authService.signOut();
  }
}
