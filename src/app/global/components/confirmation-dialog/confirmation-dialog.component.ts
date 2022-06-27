import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DialogActions } from '~enums/dialog-actions.enum';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';

@Component({
  selector: 'at-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialog,
    private matDialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) {}

  public close(action: DialogActions): void {
    this.matDialogRef.close(action);
  }

  public get dialogActions(): typeof DialogActions {
    return DialogActions;
  }
}
