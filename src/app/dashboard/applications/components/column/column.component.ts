import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, HostBinding, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { doc, docSnapshots, Firestore, orderBy, query, where } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { deepEqual } from '@firebase/util';
import { BehaviorSubject, filter, lastValueFrom, map, Observable, Subscription } from 'rxjs';

import { ColumnDialogComponent } from '~components/column-dialog/column-dialog.component';
import { ConfirmationDialogComponent } from '~components/confirmation-dialog/confirmation-dialog.component';
import { NewApplicationDialogComponent } from '~components/new-application-dialog/new-application-dialog.component';
import { OverlaySpinnerComponent } from '~components/overlay-spinner/overlay-spinner.component';
import { COLUMN_SORT_OPTIONS } from '~constants/forms.constants';
import { Collections } from '~enums/collections.enum';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';
import { SortOption } from '~interfaces/sort-option.interface';
import { Application } from '~models/application.model';
import { Column } from '~models/column.model';
import { ApplicationsService } from '~services/applications/applications.service';
import { ColumnsService } from '~services/columns/columns.service';
import { NotificationService } from '~services/notification/notification.service';
import { UserStore } from '~store/user.store';
import { columnConverter } from '~utils/firestore-converters';

/* eslint @angular-eslint/no-host-metadata-property: "off" */
@Component({
  selector: 'at-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
  host: {
    class: 'column at-alpha-background',
    '[class.column-empty]': 'column?.total === 0 && userStore.collapseColumns'
  },
  encapsulation: ViewEncapsulation.None
})
export class ColumnComponent implements OnInit, OnDestroy {
  @HostBinding('class') colorClass = '';
  @Input() public columnId!: string;

  public applications$: BehaviorSubject<Application[]>;
  public column: Column | undefined;
  public isTouch = true;
  public selectedSortOption: SortOption | undefined;
  public sortOptions = COLUMN_SORT_OPTIONS;

  private applicationsSubscription: Subscription;
  private subscriptions: Subscription;

  constructor(
    private applicationsService: ApplicationsService,
    private columnsService: ColumnsService,
    private firestore: Firestore,
    private matDialog: MatDialog,
    private notificationService: NotificationService,
    private userStore: UserStore
  ) {
    this.subscriptions = new Subscription();
    this.applicationsSubscription = new Subscription();
    this.isTouch = matchMedia('(hover: none)').matches;
    this.applications$ = new BehaviorSubject<Application[]>([]);
  }

  public async deleteColumn(): Promise<void> {
    const data: ConfirmationDialog = {
      action: DialogActions.Delete,
      message: `Column <strong class="at-text danger">${
        this.column!.title
      }</strong> and all associated applications will be deleted. This action cannot be undone.`,
      item: 'column'
    };

    const dialogAction = await lastValueFrom(
      this.matDialog
        .open(ConfirmationDialogComponent, {
          data,
          disableClose: true,
          width: '350px',
          panelClass: 'at-dialog-with-padding'
        })
        .afterClosed() as Observable<DialogActions>
    );

    if (dialogAction === DialogActions.Delete) {
      const overlayDialog = this.matDialog.open(OverlaySpinnerComponent, {
        autoFocus: false,
        disableClose: true,
        panelClass: 'overlay-spinner-dialog'
      });

      await this.columnsService
        .deleteColumn(this.column!)
        .then(() => {
          this.notificationService.showSuccess('Column deleted.');
          overlayDialog.close();
        })
        .catch((error) => {
          console.error(error);
          overlayDialog.close();
          this.notificationService.showError('There was an error deleting the column. Please try again.');
        });
    }
  }

  public async drop(event: CdkDragDrop<any, any>): Promise<void> {
    const application = event.item.data as Application;
    const nextColumn = event.container.data as Column;
    const prevColumn = event.previousContainer.data as Column;

    if (prevColumn !== nextColumn) {
      await this.applicationsService
        .moveApplication(prevColumn.docId, nextColumn.docId, application.docId)
        .catch((error) => {
          console.error(error);
          this.notificationService.showError('There was an error moving the application. Please try again.');
        });
    }
  }

  public editColumn(): void {
    this.matDialog.open(ColumnDialogComponent, {
      data: { action: DialogActions.Edit, data: this.column },
      disableClose: true,
      panelClass: 'at-dialog'
    });
  }

  public newApplication(): void {
    this.matDialog.open(NewApplicationDialogComponent, {
      data: { column: this.column },
      disableClose: true,
      panelClass: 'at-dialog'
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.applicationsSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    const columnRef = doc(
      this.firestore,
      Collections.Users,
      this.userStore.uid!,
      Collections.JobBoards,
      this.userStore.currentJobBoard!,
      Collections.Columns,
      this.columnId
    ).withConverter(columnConverter);

    this.subscriptions.add(
      docSnapshots(columnRef)
        .pipe(
          map((snapshots) => snapshots.data()),
          filter((data) => data !== undefined)
        )
        .subscribe((data) => {
          const prev = this.column;
          this.column = data!;

          if (deepEqual(data!, prev ?? {})) {
            return;
          }

          if (!prev || !deepEqual(data!.applicationSort, prev.applicationSort)) {
            this.initApplications();
          }

          this.colorClass = this.column.color;
          this.selectedSortOption = this.sortOptions.find(
            (sortOption) =>
              sortOption.value.field === this.column!.applicationSort.field &&
              sortOption.value.direction === this.column!.applicationSort.direction
          );
        })
    );
  }

  public reorderColumn(): void {
    this.matDialog.open(ColumnDialogComponent, {
      data: { action: DialogActions.Reorder, data: this.column },
      disableClose: true,
      panelClass: 'at-dialog'
    });
  }

  public async sort(sortOption: SortOption): Promise<void> {
    if (this.selectedSortOption === sortOption) {
      return;
    }

    this.selectedSortOption = sortOption;
    await this.updateApplicationSort();
  }

  public async updateApplicationSort(): Promise<void> {
    await this.columnsService
      .updateApplicationSort(this.columnId, this.selectedSortOption?.value ?? this.sortOptions[0].value)
      .catch((error) => {
        console.log(error);
        this.notificationService.showError('There was an error updating the default sort. Please try again.');
      });
  }

  private initApplications(): void {
    this.applicationsSubscription?.unsubscribe();

    this.applicationsSubscription = this.applicationsService
      .collection$(
        query(
          this.applicationsService.collectionRefWithConverter,
          where('columnDocId', '==', this.columnId),
          orderBy(this.column!.applicationSort.field, this.column!.applicationSort.direction)
        )
      )
      .subscribe((applications) => {
        this.applications$.next(applications);
      });
  }
}
