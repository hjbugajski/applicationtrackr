import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { ColumnDialogComponent } from '~components/column-dialog/column-dialog.component';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ColumnsService } from '~services/columns/columns.service';
import { UserStore } from '~store/user.store';

@Component({
  selector: 'at-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationsComponent implements OnDestroy, OnInit {
  public columnIds$: Observable<string[]>;
  public isLoaded: BehaviorSubject<boolean>;

  private subscriptions: Subscription;

  constructor(private columnsService: ColumnsService, private matDialog: MatDialog, private userStore: UserStore) {
    this.columnIds$ = new Observable<string[]>();
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
      this.columnIds$ = this.columnsService.columnIds$;
      this.isLoaded.next(true);
    }
  }
}
