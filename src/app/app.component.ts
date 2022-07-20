import { Component, OnDestroy } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Unsubscribe } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

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
          this.userStore.uid = user.uid;
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
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.jobBoardsService.resetJobBoards();
    this.userService.resetUserData();

    if (this.unsubscribeUserDocData) {
      this.unsubscribeUserDocData();
    }
  }
}
