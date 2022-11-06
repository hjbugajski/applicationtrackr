import { Component, OnDestroy } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Unsubscribe } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

import { Themes } from '~enums/themes.enum';
import { GlobalService } from '~services/global/global.service';
import { JobBoardsService } from '~services/job-boards/job-boards.service';
import { MatIconService } from '~services/mat-icon/mat-icon.service';
import { ThemeService } from '~services/theme/theme.service';
import { UserService } from '~services/user/user.service';
import { UserStore } from '~store/user.store';

@Component({
  selector: 'at-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  private subscriptions: Subscription;
  private unsubscribeUserDocData: Unsubscribe | undefined;

  constructor(
    private auth: Auth,
    private globalService: GlobalService,
    private jobBoardsService: JobBoardsService,
    private matIconService: MatIconService,
    private themeService: ThemeService,
    private userService: UserService,
    private userStore: UserStore
  ) {
    this.matIconService.initializeMatIcons();
    this.subscriptions = new Subscription();
    this.themeService.initTheme();

    this.subscriptions.add(
      authState(this.auth).subscribe((user) => {
        if (user) {
          this.userStore.update({
            uid: user.uid
          });
          this.unsubscribeUserDocData = this.userService.subscribeToUserDocData(user.uid);
          this.jobBoardsService.initJobBoards();
        } else {
          this.jobBoardsService.resetJobBoards();
          this.userService.resetUserData();

          if (this.unsubscribeUserDocData) {
            this.unsubscribeUserDocData();
          }
        }
      })
    );

    this.subscriptions.add(
      this.userStore.appearance$.subscribe((value) => {
        if (value) {
          this.themeService.setTheme(value);
        }
      })
    );

    this.themeService.prefersColorSchemeDark.addEventListener('change', (event) => {
      if (this.userStore.appearance === null || this.userStore.appearance === Themes.System) {
        this.themeService.setTheme(event.matches ? Themes.Dark : Themes.Light);
      }
    });
  }

  ngOnDestroy(): void {
    this.globalService.destroy$.next(true);
    this.globalService.destroy$.unsubscribe();
    this.subscriptions.unsubscribe();
    this.jobBoardsService.resetJobBoards();
    this.userService.resetUserData();
    this.removeListeners();

    if (this.unsubscribeUserDocData) {
      this.unsubscribeUserDocData();
    }
  }

  private removeListeners(): void {
    if (this.themeService.prefersColorSchemeDark.eventListeners) {
      this.themeService.prefersColorSchemeDark.removeAllListeners!('change');
    }
  }
}
