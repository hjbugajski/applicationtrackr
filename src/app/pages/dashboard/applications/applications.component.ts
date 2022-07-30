import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';

import { ColumnDialogComponent } from '~components/column-dialog/column-dialog.component';
import { DialogActions } from '~enums/dialog-actions.enum';
import { Column } from '~models/column.model';
import { ColumnsService } from '~services/columns/columns.service';
import { UserStore } from '~store/user.store';

@Component({
  selector: 'at-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationsComponent implements OnDestroy, OnInit {
  public columns$: BehaviorSubject<Column[]>;
  public isLoaded: BehaviorSubject<boolean>;

  private subscriptions: Subscription;

  constructor(private columnsService: ColumnsService, private matDialog: MatDialog, private userStore: UserStore) {
    this.columns$ = new BehaviorSubject<Column[]>([]);
    this.isLoaded = new BehaviorSubject<boolean>(false);
    this.subscriptions = new Subscription();
  }

  public addNewColumn(): void {
    this.matDialog.open(ColumnDialogComponent, {
      data: { action: DialogActions.New },
      disableClose: true,
      panelClass: 'at-dialog'
    });
  }

  public getDragDropConnectedArray(columns: Column[], index: number): string[] {
    const array: string[] = [];

    columns?.forEach((column, i) => {
      if (i !== index) {
        array.push('column-' + i.toString());
      }
    });

    return array;
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.columnsService.reloadColumns$.subscribe(() => {
        this.reload(true);
      })
    );
    this.subscriptions.add(
      this.userStore.currentJobBoard$.subscribe((currentBoard) => {
        this.reload(!!currentBoard);
      })
    );
  }

  private reload(canBeReloaded: boolean): void {
    this.isLoaded.next(false);
    this.columnsService.resetColumns();

    if (canBeReloaded) {
      this.columnsService.initColumns();
      this.columns$ = this.columnsService.columns$;
      this.isLoaded.next(true);
    }
  }
}
