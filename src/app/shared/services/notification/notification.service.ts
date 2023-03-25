import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NotificationComponent } from '~components/notification/notification.component';
import { Colors } from '~enums/colors.enum';
import { NotificationData } from '~interfaces/notification-data.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private matSnackBar: MatSnackBar) {}

  public show(type: Colors, title: string, message: string, duration = 3000): void {
    this.matSnackBar.openFromComponent<NotificationComponent, NotificationData>(NotificationComponent, {
      data: {
        message,
        title,
        type
      },
      duration,
      horizontalPosition: 'right',
      panelClass: 'mat-snackbar',
      verticalPosition: 'top'
    });
  }

  public showError(message: string, title = 'Error'): void {
    this.show(Colors.Danger, title, message, 0);
  }

  public showSuccess(message: string, title = 'Success'): void {
    this.show(Colors.Success, title, message);
  }
}
