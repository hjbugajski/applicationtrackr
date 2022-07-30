import { Component, Inject, OnDestroy } from '@angular/core';
import { onSnapshot } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Unsubscribe } from 'firebase/auth';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';

import { ConfirmationDialogComponent } from '~components/confirmation-dialog/confirmation-dialog.component';
import { OverlaySpinnerComponent } from '~components/overlay-spinner/overlay-spinner.component';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ApplicationDialogData } from '~interfaces/application-dialog-data.interface';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';
import { Application } from '~models/application.model';
import { Column } from '~models/column.model';
import { ApplicationService } from '~services/application/application.service';
import { NotificationService } from '~services/notification/notification.service';
import { applicationConverter } from '~utils/firestore-converters';

@Component({
  selector: 'at-application-dialog',
  templateUrl: './application-dialog.component.html',
  styleUrls: ['./application-dialog.component.scss']
})
export class ApplicationDialogComponent implements OnDestroy {
  public application: Application;
  public column: Column;
  public columns: BehaviorSubject<Column[]>;

  private unsubscribeApplication!: Unsubscribe;

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: ApplicationDialogData,
    private applicationService: ApplicationService,
    private matDialog: MatDialog,
    private matDialogRef: MatDialogRef<ApplicationDialogComponent>,
    private notificationService: NotificationService
  ) {
    this.application = this.dialogData.application;
    this.column = this.dialogData.column;
    this.columns = this.dialogData.columns;

    this.initApplicationDoc();
  }

  public close(): void {
    this.matDialogRef.close();
  }

  public async deleteApplication(): Promise<void> {
    const data: ConfirmationDialog = {
      action: DialogActions.Delete,
      message: `Application for ${this.application.company} will be deleted. This action cannot be undone.`,
      item: 'application'
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

      await this.applicationService
        .deleteApplication(this.column.docId, this.application.docId)
        .then(() => {
          this.notificationService.showSuccess('Application deleted.');
          overlayDialog.close();
          this.matDialogRef.close();
        })
        .catch((error) => {
          console.error(error);
          overlayDialog.close();
          this.notificationService.showError('There was an error deleting the application. Please try again.');
        });
    }
  }

  public async moveApplication(newColumn: Column): Promise<void> {
    const overlayDialog = this.matDialog.open(OverlaySpinnerComponent, {
      autoFocus: false,
      disableClose: true,
      panelClass: 'overlay-spinner-dialog'
    });

    await this.applicationService
      .moveApplication(this.column.docId, newColumn, this.application)
      .then(() => {
        this.notificationService.showSuccess('Application successfully moved!');
        overlayDialog.close();
      })
      .catch((error) => {
        console.error(error);
        overlayDialog.close();
        this.notificationService.showError('There was an error moving the application. Please try again.');
      });

    this.matDialogRef.close();
  }

  ngOnDestroy(): void {
    this.unsubscribeApplication();
  }

  public get dialogActions(): typeof DialogActions {
    return DialogActions;
  }

  private initApplicationDoc(): void {
    const docRef = this.applicationService.getDocRef(this.column.docId, this.application.docId);

    this.unsubscribeApplication = onSnapshot(docRef.withConverter(applicationConverter), (doc) => {
      if (doc.exists()) {
        this.application = doc.data();
      }
    });
  }
}
