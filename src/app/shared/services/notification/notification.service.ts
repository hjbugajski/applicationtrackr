import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NotificationComponent } from '~components/notification/notification.component';
import { Colors } from '~enums/colors.enum';
import { NotificationData } from '~interfaces/notification-data.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private matSnackBar: MatSnackBar) {}

  public show(type: Colors, message: string, duration = 3000): void {
    this.matSnackBar.openFromComponent<NotificationComponent, NotificationData>(NotificationComponent, {
      data: {
        message,
        type,
      },
      duration,
      horizontalPosition: 'right',
      panelClass: 'mat-snackbar',
      verticalPosition: 'top',
    });
  }

  public showError(message: string): void {
    this.show(Colors.Danger, message, 0);
  }

  public showSuccess(message: string): void {
    this.show(Colors.Success, message);
  }
}
