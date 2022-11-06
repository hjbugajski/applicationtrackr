import { Component, OnDestroy } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Unsubscribe } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

import { GlobalService } from '~services/global/global.service';
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
    private matIconService: MatIconService,
    private themeService: ThemeService,
    private userService: UserService,
    private userStore: UserStore
  ) {
    this.matIconService.initializeMatIcons();
    this.subscriptions = new Subscription();

    this.subscriptions.add(
      authState(this.auth).subscribe((user) => {
        if (user) {
          this.userStore.update({
            uid: user.uid
          });
          this.unsubscribeUserDocData = this.userService.subscribeToUserDocData(user.uid);
        } else {
          this.userStore.reset();
          this.userService.resetUserData();

          if (this.unsubscribeUserDocData) {
            this.unsubscribeUserDocData();
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.globalService.destroy$.next(true);
    this.globalService.destroy$.unsubscribe();
    this.subscriptions.unsubscribe();
    this.userService.resetUserData();
    this.themeService.removeListeners();

    if (this.unsubscribeUserDocData) {
      this.unsubscribeUserDocData();
    }
  }
}
