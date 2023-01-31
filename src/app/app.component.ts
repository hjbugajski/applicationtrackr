import { Component, OnDestroy } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { distinctUntilChanged, Subscription } from 'rxjs';

import { GlobalService } from '~services/global/global.service';
import { MatIconService } from '~services/mat-icon/mat-icon.service';
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
    private matIconService: MatIconService,
    private themeService: ThemeService,
    private userStore: UserStore
  ) {
    this.matIconService.initializeMatIcons();
    this.authSubscription = authState(this.auth)
      .pipe(distinctUntilChanged())
      .subscribe((user) => {
        if (user) {
          this.userStore.update({ uid: user.uid });
        } else {
          this.userStore.reset();
        }
      });
  }

  ngOnDestroy(): void {
    this.globalService.destroy$.next(true);
    this.globalService.destroy$.unsubscribe();
    this.authSubscription.unsubscribe();
    this.themeService.removeListeners();
    this.userStore.reset();
  }
}
