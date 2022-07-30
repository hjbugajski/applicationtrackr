import { BehaviorSubject } from 'rxjs';

import { Application } from '~models/application.model';
import { Column } from '~models/column.model';

export interface ApplicationDialogData {
  application: Application;
  column: Column;
  columns: BehaviorSubject<Column[]>;
}
