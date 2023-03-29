import { Component, OnDestroy } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { distinctUntilChanged, Subscription } from 'rxjs';

import { GlobalService } from '~services/global/global.service';
import { ThemeService } from '~services/theme/theme.service';
import { UserStore } from '~store/user.store';

@Component({
  selector: 'at-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnDestroy {
  private authSubscription: Subscription;

  constructor(
    private auth: Auth,
    private globalService: GlobalService,
    private themeService: ThemeService,
    private userStore: UserStore
  ) {
    this.authSubscription = authState(this.auth)
      .pipe(distinctUntilChanged((prev, curr) => prev?.uid === curr?.uid))
      .subscribe((user) => {
        if (user) {
          this.userStore.update({ uid: user.uid });
        } else {
          this.userStore.reset();
        }
      });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.themeService.removeListeners();
    this.userStore.reset();
  }
}
