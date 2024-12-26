import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom, Subject } from 'rxjs';

import { ConfirmationDialogComponent } from '~components/confirmation-dialog/confirmation-dialog.component';
import { OverlaySpinnerComponent } from '~components/overlay-spinner/overlay-spinner.component';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';

@Injectable({
  providedIn: 'root',
})
export class GlobalService implements OnDestroy {
  public destroy$ = new Subject<boolean>();

  constructor(private matDialog: MatDialog) {}

  public async confirmationDialog(
    data: ConfirmationDialog,
    {
      autoFocus = false,
      disableClose = true,
      width = '315px',
      panelClass = 'at-dialog-with-padding',
    } = {},
  ): Promise<DialogActions | undefined> {
    return await lastValueFrom(
      this.matDialog
        .open<ConfirmationDialogComponent, ConfirmationDialog, DialogActions>(
          ConfirmationDialogComponent,
          {
            autoFocus,
            data,
            disableClose,
            width,
            panelClass,
          },
        )
        .afterClosed(),
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public overlayDialog(): MatDialogRef<OverlaySpinnerComponent> {
    return this.matDialog.open(OverlaySpinnerComponent, {
      autoFocus: false,
      disableClose: true,
      panelClass: 'overlay-spinner-dialog',
    });
  }
}
