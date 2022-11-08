import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { ColumnDialogComponent } from '~components/column-dialog/column-dialog.component';
import { DialogActions } from '~enums/dialog-actions.enum';
import { Column } from '~models/column.model';
import { ColumnsService } from '~services/columns/columns.service';
import { GlobalService } from '~services/global/global.service';

@Component({
  selector: 'at-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnDestroy {
  public columnIds$!: Observable<string[]>;
  public columns!: Column[];
  public isLoaded$ = new BehaviorSubject<boolean>(false);

  private columnsSubscription: Subscription | undefined;
  private reloadSubscription: Subscription;

  constructor(
    private columnsService: ColumnsService,
    private globalService: GlobalService,
    private matDialog: MatDialog
  ) {
    this.initColumns();
    this.reloadSubscription = this.globalService.reloadColumns$.subscribe(() => {
      this.reset();
      this.initColumns();
    });
  }

  public addNewColumn(): void {
    this.matDialog.open(ColumnDialogComponent, {
      data: { action: DialogActions.New },
      disableClose: true,
      panelClass: 'at-dialog'
    });
  }

  ngOnDestroy(): void {
    this.columnsSubscription?.unsubscribe();
    this.reloadSubscription.unsubscribe();
  }

  private initColumns(): void {
    this.columnIds$ = this.columnsService.columnIds$;
    this.columnsSubscription = this.columnsService.columns$.subscribe((columns) => {
      if (columns) {
        this.columns = columns;
        this.isLoaded$.next(true);
      }
    });
  }

  private reset(): void {
    this.isLoaded$.next(false);
    this.columns = [];
    this.columnIds$ = new Observable<string[]>();
    this.columnsSubscription?.unsubscribe();
  }
}
