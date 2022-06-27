import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DialogActions } from '~enums/dialog-actions.enum';

@Component({
  selector: 'at-discard-dialog',
  templateUrl: './discard-dialog.component.html',
  styleUrls: ['./discard-dialog.component.scss']
})
export class DiscardDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public item: string,
    private matDialogRef: MatDialogRef<DiscardDialogComponent>
  ) {}

  public close(action: DialogActions): void {
    this.matDialogRef.close(action);
  }

  public get dialogActions(): typeof DialogActions {
    return DialogActions;
  }
}
