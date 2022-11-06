import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { filter, Subscription, take } from 'rxjs';

import { UserService } from '~services/user/user.service';
import { UserStore } from '~store/user.store';

@Component({
  selector: 'at-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnDestroy {
  public collapseColumnsFormControl = new FormControl(false);

  private subscription: Subscription;

  constructor(private userService: UserService, private userStore: UserStore) {
    this.subscription = new Subscription();

    this.subscription.add(
      this.userStore.collapseColumns$
        .pipe(
          filter((value) => value !== null),
          take(1)
        )
        .subscribe((value) => {
          this.collapseColumnsFormControl.setValue(value);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public async onCollapseColumnsChange(event: MatSlideToggleChange): Promise<void> {
    await this.userService.updateCollapseColumns(event.checked);
  }
}
