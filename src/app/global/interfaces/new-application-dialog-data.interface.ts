import { Observable } from 'rxjs';

import { Column } from '~models/column.model';

export interface NewApplicationDialogData {
  column: Column;
  columns: Observable<Column[]>;
}
