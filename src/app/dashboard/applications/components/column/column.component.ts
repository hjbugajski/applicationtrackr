import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { orderBy, query, where } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';

import { ColumnDialogComponent } from '~components/column-dialog/column-dialog.component';
import { NewApplicationDialogComponent } from '~components/new-application-dialog/new-application-dialog.component';
import { COLUMN_SORT_OPTIONS } from '~constants/forms.constants';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';
import { SortOption } from '~interfaces/sort-option.interface';
import { Sort } from '~interfaces/sort.interface';
import { Application } from '~models/application.model';
import { Column } from '~models/column.model';
import { ApplicationsService } from '~services/applications/applications.service';
import { ColumnsService } from '~services/columns/columns.service';
import { GlobalService } from '~services/global/global.service';
import { NotificationService } from '~services/notification/notification.service';
import { UserStore } from '~store/user.store';
import { objectDeepEquals } from '~utils/compare.util';

@Component({
  selector: 'at-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  host: {
    class: 'column at-alpha-background',
    '[class.column-empty]': 'total === 0 && userStore.collapseColumns',
  },
  encapsulation: ViewEncapsulation.None,
})
export class ColumnComponent implements OnChanges, OnDestroy {
  @Input() public column: Column | undefined;

  public applications$ = new Observable<Application[]>();
  public collapseColumns$: Observable<boolean | null>;
  public isTouch = true;
  public selectedSortOption: SortOption | undefined;
  public sortOptions = COLUMN_SORT_OPTIONS;
  public total = -1;

  private subscription: Subscription | undefined;

  constructor(
    private applicationsService: ApplicationsService,
    private columnsService: ColumnsService,
    private globalService: GlobalService,
    private matDialog: MatDialog,
    private notificationService: NotificationService,
    private userStore: UserStore,
  ) {
    this.collapseColumns$ = this.userStore.collapseColumns$;
    this.isTouch = matchMedia('(hover: none)').matches;
  }

  public async deleteColumn(): Promise<void> {
    const data: ConfirmationDialog = {
      action: DialogActions.Delete,
      message: `Column <strong class="at-text danger">${
        this.column!.title
      }</strong> and all associated applications will be deleted. This action cannot be undone.`,
      item: 'column',
    };
    const dialogAction = await this.globalService.confirmationDialog(data, { width: '375px' });

    if (dialogAction === DialogActions.Delete) {
      const overlayDialog = this.globalService.overlayDialog();

      await this.columnsService
        .deleteColumn(this.column!)
        .then(() => this.notificationService.showSuccess('Column deleted.'))
        .catch(() =>
          this.notificationService.showError(
            'There was an error deleting the column. Please try again.',
          ),
        )
        .finally(() => overlayDialog.close());
    }
  }

  public async drop(event: CdkDragDrop<any, any>): Promise<void> {
    const application = event.item.data as Application;
    const nextColumn = event.container.data as Column;
    const prevColumn = event.previousContainer.data as Column;

    if (prevColumn !== nextColumn) {
      await this.applicationsService
        .moveApplication(nextColumn.docId, application.docId)
        .catch(() => {
          this.notificationService.showError(
            'There was an error moving the application. Please try again.',
          );
        });
    }
  }

  public editColumn(): void {
    this.matDialog.open(ColumnDialogComponent, {
      data: { action: DialogActions.Edit, data: this.column },
      disableClose: true,
      panelClass: 'at-dialog',
    });
  }

  public newApplication(): void {
    this.matDialog.open(NewApplicationDialogComponent, {
      data: { column: this.column },
      disableClose: true,
      panelClass: 'at-dialog',
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currColumn = changes.column.currentValue as Column | undefined;
    const prevColumn = changes.column.previousValue as Column | undefined;
    const isColumnChange = currColumn?.docId !== prevColumn?.docId;
    const isSortChange =
      currColumn &&
      prevColumn &&
      !this.deepEqualSort(currColumn.applicationSort, prevColumn.applicationSort);

    if (currColumn && (changes.column.isFirstChange() || isColumnChange || isSortChange)) {
      this.selectedSortOption = this.sortOptions.find((v) =>
        objectDeepEquals(v.value, currColumn.applicationSort),
      );
      this.initApplications();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  public reorderColumn(): void {
    this.matDialog.open(ColumnDialogComponent, {
      data: { action: DialogActions.Reorder, data: this.column },
      disableClose: true,
      panelClass: 'at-dialog',
    });
  }

  public async sort(sortOption: SortOption): Promise<void> {
    if (this.selectedSortOption === sortOption) {
      return;
    }

    this.selectedSortOption = sortOption;

    const value = this.selectedSortOption?.value ?? this.sortOptions[0].value;
    await this.columnsService.update(this.column!.docId, { applicationSort: value }).catch(() => {
      this.notificationService.showError(
        'There was an error updating the default sort. Please try again.',
      );
    });
  }

  private deepEqualSort(a: Sort, b: Sort): boolean {
    if (a === b) {
      return true;
    }

    if (!a || !b) {
      return false;
    }

    if (typeof a !== 'object' || typeof b !== 'object') {
      return false;
    }

    return a.direction === b.direction && a.field === b.field;
  }

  private initApplications(): void {
    this.subscription?.unsubscribe();
    this.applications$ = this.applicationsService.collection$(
      query(
        this.applicationsService.collectionRefWithConverter,
        where('columnDocId', '==', this.column!.docId),
        orderBy(this.column!.applicationSort.field, this.column!.applicationSort.direction),
      ),
    );
    this.subscription = this.applications$.subscribe(
      (applications) => (this.total = applications.length),
    );
  }
}
