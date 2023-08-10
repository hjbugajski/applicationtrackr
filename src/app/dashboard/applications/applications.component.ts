import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, Observable, Subscription } from 'rxjs';

import { ColumnDialogComponent } from '~components/column-dialog/column-dialog.component';
import { DialogActions } from '~enums/dialog-actions.enum';
import { Column } from '~models/column.model';
import { ColumnsService } from '~services/columns/columns.service';

@Component({
  selector: 'at-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnDestroy {
  public columnIds$: Observable<string[]>;
  public columns: Column[] = [];

  private subscription: Subscription;

  constructor(
    private columnsService: ColumnsService,
    private matDialog: MatDialog
  ) {
    this.columnIds$ = this.columnsService.columnIds$;
    this.subscription = this.columnsService.columns$
      .pipe(filter((columns) => !!columns))
      .subscribe((columns) => (this.columns = columns));
  }

  public addNewColumn(): void {
    this.matDialog.open(ColumnDialogComponent, {
      data: { action: DialogActions.New },
      disableClose: true,
      panelClass: 'at-dialog'
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
