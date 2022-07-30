import { BehaviorSubject } from 'rxjs';

import { Column } from '~models/column.model';

export interface NewApplicationDialogData {
  column: Column;
  columns: BehaviorSubject<Column[]>;
}
