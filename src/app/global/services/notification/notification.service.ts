import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NotificationComponent } from '~components/notification/notification.component';
import { Notifications } from '~enums/notifications.enum';
import { NotificationData } from '~interfaces/notification-data.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private matSnackBar: MatSnackBar) {}

  public show(type: Notifications, title: string, message: string, duration = 3000): void {
    const data: NotificationData = {
      message,
      title,
      type
    };

    this.matSnackBar.openFromComponent(NotificationComponent, {
      data,
      duration,
      horizontalPosition: 'right',
      panelClass: 'mat-snackbar',
      verticalPosition: 'top'
    });
  }

  public showError(message: string, title = 'Error'): void {
    this.show(Notifications.Error, title, message, 0);
  }

  public showSuccess(message: string, title = 'Success'): void {
    this.show(Notifications.Success, title, message);
  }
}
