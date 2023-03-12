import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { filter, take } from 'rxjs';

import { UserService } from '~services/user/user.service';
import { UserStore } from '~store/user.store';

@Component({
  selector: 'at-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  public collapseColumnsFormControl = new FormControl(false);

  constructor(private userService: UserService, private userStore: UserStore) {
    this.userStore.collapseColumns$
      .pipe(
        filter((value) => !!value),
        take(1)
      )
      .subscribe((value) => this.collapseColumnsFormControl.setValue(value));
  }

  public async onCollapseColumnsChange(event: MatSlideToggleChange): Promise<void> {
    await this.userService.updateCollapseColumns(event.checked);
  }
}
