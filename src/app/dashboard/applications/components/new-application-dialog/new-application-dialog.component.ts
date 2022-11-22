import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

import { DialogActions } from '~enums/dialog-actions.enum';
import { NewApplicationDialogData } from '~interfaces/new-application-dialog-data.interface';
import { expandCollapse, ngIfAnimation } from '~utils/transitions.util';

@Component({
  selector: 'at-new-application-dialog',
  templateUrl: './new-application-dialog.component.html',
  styleUrls: ['./new-application-dialog.component.scss'],
  animations: [expandCollapse, ngIfAnimation]
})
export class NewApplicationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: NewApplicationDialogData) {}

  public get dialogActions(): typeof DialogActions {
    return DialogActions;
  }
}
