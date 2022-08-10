import { DialogActions } from '~enums/dialog-actions.enum';

export interface ConfirmationDialog {
  action: DialogActions;
  item: string;
  message?: string;
}
