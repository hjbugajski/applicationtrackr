import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
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
import { BehaviorSubject, Observable } from 'rxjs';

import { ApplicationDialogComponent } from '~components/application-dialog/application-dialog.component';
import { NewApplicationDialogComponent } from '~components/new-application-dialog/new-application-dialog.component';
import { Collections } from '~enums/collections.enum';
import { Application } from '~models/application.model';
import { Column } from '~models/column.model';
import { ApplicationService } from '~services/application/application.service';
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
  @Input() public column!: string;
  @Input() public columns!: Observable<Column[]>;
  @Input() public dragDropConnectedArray!: string[];
  @Input() public dragDropId!: string;
  @Input() public id!: string;

  public applications!: Observable<Application[]>;
  public columnDoc!: Column;
  public columnRef!: DocumentReference<Column>;
  public isLoaded: BehaviorSubject<boolean>;

  private unsubscribe!: Unsubscribe;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private applicationService: ApplicationService,
    private firestore: Firestore,
    private matDialog: MatDialog,
    private notificationService: NotificationService,
    private userStore: UserStore
  ) {
    this.isLoaded = new BehaviorSubject<boolean>(false);
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

  public keydown(event: KeyboardEvent, application: Application): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.openApplication(application);
    }
  }

  public newApplication(): void {
    this.matDialog.open(NewApplicationDialogComponent, {
      data: {
        column: this.columnDoc,
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
      this.userStore.currentJobBoard!.docId!,
      Collections.Columns,
      this.column
    ).withConverter(columnConverter);

    this.unsubscribe = onSnapshot(this.columnRef, (snapshot) => {
      this.columnDoc = snapshot.data()!;
      this.isLoaded.next(true);

      if (this.columnDoc.color) {
        this.document.getElementById(this.id)?.classList.add(this.columnDoc.color);
      }
    });
    this.applications = collectionData(query(this.applicationsCollection, orderBy('company', 'asc')));
  }

  public openApplication(application: Application): void {
    this.matDialog.open(ApplicationDialogComponent, {
      data: {
        application: application,
        columnDoc: this.columnDoc,
        columns: this.columns
      },
      disableClose: true,
      panelClass: ['at-dialog', 'mat-dialog-container-with-toolbar']
    });
  }

  private get applicationsCollection(): CollectionReference<Application> {
    return collection(
      this.firestore,
      Collections.Users,
      this.userStore.uid!,
      Collections.JobBoards,
      this.userStore.currentJobBoard!.docId!,
      Collections.Columns,
      this.column,
      Collections.Applications
    ).withConverter(applicationConverter);
  }
}
