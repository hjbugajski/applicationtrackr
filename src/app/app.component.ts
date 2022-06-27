import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

import { JobBoardsService } from '~services/job-boards/job-boards.service';
import { MatIconService } from '~services/mat-icon/mat-icon.service';
import { ThemeService } from '~services/theme/theme.service';
import { UserDataService } from '~state/user-data/user-data.service';

@Component({
  selector: 'at-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription;
  private unsubscribeUserDocData: Subscription;

  constructor(
    private auth: Auth,
    private jobBoardsService: JobBoardsService,
    private matIconService: MatIconService,
    private themeService: ThemeService,
    private userDataService: UserDataService
  ) {
    this.subscriptions = new Subscription();
    this.unsubscribeUserDocData = new Subscription();
    this.matIconService.initializeMatIcons();
    this.themeService.initTheme();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.unsubscribeUserDocData?.unsubscribe();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      authState(this.auth).subscribe((user) => {
        if (user) {
          this.userDataService.uid = user.uid;
          this.unsubscribeUserDocData = this.userDataService.subscribeToUserDocData(user.uid);
          this.jobBoardsService.initJobBoards();
        } else {
          this.unsubscribeUserDocData.unsubscribe();
          this.userDataService.resetUserData();
          this.jobBoardsService.resetJobBoards();
        }
      })
    );
  }
}
