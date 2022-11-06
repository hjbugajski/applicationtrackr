import { DialogActions } from '~enums/dialog-actions.enum';
import { Column } from '~models/column.model';
import { JobBoard } from '~models/job-board.model';

export interface DocumentDialog {
  action: DialogActions;
  data: Column | JobBoard | any;
}
