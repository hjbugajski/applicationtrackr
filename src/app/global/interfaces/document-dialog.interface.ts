import { DialogActions } from '~enums/dialog-actions.enum';
import { JobBoard } from '~models/job-board.model';

export interface DocumentDialog {
  action: DialogActions;
  data: JobBoard | any;
}
