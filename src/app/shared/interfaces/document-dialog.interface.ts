import { DialogActions } from '~enums/dialog-actions.enum';

export interface DocumentDialog<T> {
  action: DialogActions;
  data: T;
}
