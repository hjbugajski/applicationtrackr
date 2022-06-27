import { Observable } from 'rxjs';

import { Application } from '~models/application.model';
import { Column } from '~models/column.model';

export interface ApplicationDialogData {
  application: Application;
  columnDoc: Column;
  columns: Observable<Column[]>;
}
