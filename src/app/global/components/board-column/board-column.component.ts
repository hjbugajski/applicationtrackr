import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  doc,
  DocumentReference,
  Firestore,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe
} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';

import { ApplicationDialogComponent } from '~components/application-dialog/application-dialog.component';
import { ColumnDialogComponent } from '~components/column-dialog/column-dialog.component';
import { ConfirmationDialogComponent } from '~components/confirmation-dialog/confirmation-dialog.component';
import { NewApplicationDialogComponent } from '~components/new-application-dialog/new-application-dialog.component';
import { OverlaySpinnerComponent } from '~components/overlay-spinner/overlay-spinner.component';
import { Collections } from '~enums/collections.enum';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';
import { Application } from '~models/application.model';
import { Column } from '~models/column.model';
import { ApplicationService } from '~services/application/application.service';
import { ColumnsService } from '~services/columns/columns.service';
import { NotificationService } from '~services/notification/notification.service';
import { UserStore } from '~store/user.store';
import { applicationConverter, columnConverter } from '~utils/firestore-converters';

/* eslint @angular-eslint/no-host-metadata-property: "off" */
@Component({
  selector: 'at-board-column',
  templateUrl: './board-column.component.html',
  styleUrls: ['./board-column.component.scss'],
  host: {
    class: 'board-column at-alpha-background'
  }
})
export class BoardColumnComponent implements OnInit, OnDestroy {
  @HostBinding('class') colorClass = '';
  @Input() public columnId!: string;
  @Input() public columns!: BehaviorSubject<Column[]>;
  @Input() public dragDropConnectedArray!: string[];
  @Input() public dragDropId!: string;
  @Input() public id!: string;

  public applications!: Observable<Application[]>;
  public column!: Column;
  public columnRef!: DocumentReference<Column>;
  public isLoaded: BehaviorSubject<boolean>;

  private unsubscribe!: Unsubscribe;

  constructor(
    private applicationService: ApplicationService,
    private columnsService: ColumnsService,
    private firestore: Firestore,
    private matDialog: MatDialog,
    private notificationService: NotificationService,
    private userStore: UserStore
  ) {
    this.isLoaded = new BehaviorSubject<boolean>(false);
  }

  public async deleteColumn(): Promise<void> {
    const data: ConfirmationDialog = {
      action: DialogActions.Delete,
      message: `Column ${this.column.title} will be deleted. This action cannot be undone.`,
      item: 'column'
    };

    const dialogAfterClosed = this.matDialog
      .open(ConfirmationDialogComponent, {
        data,
        disableClose: true,
        width: '350px',
        panelClass: 'at-dialog-with-padding'
      })
      .afterClosed() as Observable<DialogActions>;

    if ((await lastValueFrom<DialogActions>(dialogAfterClosed)) === DialogActions.Delete) {
      const overlayDialog = this.matDialog.open(OverlaySpinnerComponent, {
        autoFocus: false,
        disableClose: true,
        panelClass: 'overlay-spinner-dialog'
      });

      await this.columnsService
        .deleteColumn(this.column.docId)
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
      await this.applicationService.moveApplication(prevColumn.docId, nextColumn, application).catch((error) => {
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

  public keydown(event: KeyboardEvent, application: Application): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.openApplication(application);
    }
  }

  public newApplication(): void {
    this.matDialog.open(NewApplicationDialogComponent, {
      data: {
        column: this.column,
        columns: this.columns
      },
      disableClose: true,
      panelClass: 'at-dialog'
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  ngOnInit(): void {
    this.columnRef = doc(
      this.firestore,
      Collections.Users,
      this.userStore.uid!,
      Collections.JobBoards,
      this.userStore.currentJobBoard!,
      Collections.Columns,
      this.columnId
    ).withConverter(columnConverter);

    this.unsubscribe = onSnapshot(this.columnRef, (snapshot) => {
      const data = snapshot.data();

      if (data) {
        this.column = data;
        this.colorClass = this.column.color ?? '';
        this.isLoaded.next(true);
      }
    });
    this.applications = collectionData(query(this.applicationsCollection, orderBy('company', 'asc')));
  }

  public openApplication(application: Application): void {
    this.matDialog.open(ApplicationDialogComponent, {
      data: {
        application: application,
        column: this.column,
        columns: this.columns
      },
      disableClose: true,
      panelClass: ['at-dialog', 'mat-dialog-container-with-toolbar']
    });
  }

  public reorderColumn(): void {
    this.matDialog.open(ColumnDialogComponent, {
      data: { action: DialogActions.Reorder, data: this.column },
      disableClose: true,
      panelClass: 'at-dialog'
    });
  }

  private get applicationsCollection(): CollectionReference<Application> {
    return collection(
      this.firestore,
      Collections.Users,
      this.userStore.uid!,
      Collections.JobBoards,
      this.userStore.currentJobBoard!,
      Collections.Columns,
      this.columnId,
      Collections.Applications
    ).withConverter(applicationConverter);
  }
}
