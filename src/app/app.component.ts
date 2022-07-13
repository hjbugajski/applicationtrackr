import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription;
  private unsubscribeUserDocData!: Unsubscribe;

  constructor(
    private auth: Auth,
    private jobBoardsService: JobBoardsService,
    private matIconService: MatIconService,
    private themeService: ThemeService,
    private userService: UserService,
    private userStore: UserStore
  ) {
    this.subscriptions = new Subscription();
    this.matIconService.initializeMatIcons();
    this.themeService.initTheme();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.unsubscribeUserDocData();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      authState(this.auth).subscribe((user) => {
        if (user) {
          this.userStore.uid = user.uid;
          this.unsubscribeUserDocData = this.userService.subscribeToUserDocData(user.uid);
          this.jobBoardsService.initJobBoards();
        } else {
          this.unsubscribeUserDocData();
          this.userService.resetUserData();
          this.jobBoardsService.resetJobBoards();
        }
      })
    );
  }
}
