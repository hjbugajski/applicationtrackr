import { Component, Inject } from '@angular/core';
import {
  MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA,
  MatLegacySnackBarRef as MatSnackBarRef
} from '@angular/material/legacy-snack-bar';

import { NotificationData } from '~interfaces/notification-data.interface';

@Component({
  selector: 'at-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: NotificationData,
    private matSnackBarRef: MatSnackBarRef<NotificationComponent>
  ) {}

  public dismiss(): void {
    this.matSnackBarRef.dismiss();
  }
}
