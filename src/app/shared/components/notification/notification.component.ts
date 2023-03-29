import { Component, HostBinding, HostListener, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

import { NotificationData } from '~interfaces/notification-data.interface';

@Component({
  selector: 'at-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  host: {
    class: 'at-color-background'
  }
})
export class NotificationComponent {
  @HostBinding('class') colorClass = '';

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: NotificationData,
    private matSnackBarRef: MatSnackBarRef<NotificationComponent>
  ) {
    this.colorClass = this.data.type;
  }

  @HostListener('click')
  public dismiss(): void {
    this.matSnackBarRef.dismiss();
  }
}
