import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { lastValueFrom, Observable, Subscription, switchMap } from 'rxjs';

import { ConfirmationDialogComponent } from '~components/confirmation-dialog/confirmation-dialog.component';
import { OverlaySpinnerComponent } from '~components/overlay-spinner/overlay-spinner.component';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ApplicationDialogData } from '~interfaces/application-dialog-data.interface';
import { ApplicationDoc } from '~interfaces/application-doc.interface';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';
import { Application } from '~models/application.model';
import { Column } from '~models/column.model';
import { ApplicationsService } from '~services/applications/applications.service';
import { ColumnsService } from '~services/columns/columns.service';
import { NotificationService } from '~services/notification/notification.service';
import { applicationConverter, columnConverter } from '~utils/firestore-converters';

@Component({
  selector: 'at-application-panel',
  templateUrl: './application-panel.component.html',
  styleUrls: ['./application-panel.component.scss']
})
export class ApplicationPanelComponent implements OnDestroy, OnInit {
  @ViewChildren(MatInput) public matInputs: QueryList<MatInput> | undefined;

  public application: Application;
  public column: Column;
  public columns$: Observable<Column[]>;
  public companyPositionForm = new FormGroup({
    company: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(128)]),
    position: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(128)])
  });
  public isEditing = false;
  public isLoading = false;

  private subscription: Subscription;

  constructor(
    @Inject(DIALOG_DATA) private dialogData: ApplicationDialogData,
    private applicationsService: ApplicationsService,
    private changeDetectorRef: ChangeDetectorRef,
    private columnsService: ColumnsService,
    private dialogRef: DialogRef,
    private matDialog: MatDialog,
    private notificationService: NotificationService
  ) {
    this.application = this.dialogData.application;
    this.column = this.dialogData.column;
    this.columns$ = this.columnsService.columns$;
    this.subscription = this.applicationColumnSubscription;
  }

  public async cancel(): Promise<void> {
    if (this.companyPositionForm.pristine) {
      this.isEditing = false;

      return;
    }

    const data: ConfirmationDialog = {
      action: DialogActions.Discard,
      item: 'edits'
    };
    const dialogActions = await lastValueFrom(
      this.matDialog
        .open(ConfirmationDialogComponent, {
          autoFocus: false,
          data,
          disableClose: true,
          width: '315px',
          panelClass: 'at-dialog-with-padding'
        })
        .afterClosed() as Observable<DialogActions>
    );

    if (dialogActions === DialogActions.Discard) {
      this.isEditing = false;
      this.companyPositionForm.reset();
      this.initForm();
    }
  }

  public close(): void {
    this.dialogRef.close();
  }

  public async deleteApplication(): Promise<void> {
    const data: ConfirmationDialog = {
      action: DialogActions.Delete,
      message: `Application for <strong class="at-text danger">${this.application.company}</strong> will be deleted. This action cannot be undone.`,
      item: 'application'
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

      await this.applicationsService
        .deleteApplication(this.column.docId, this.application.docId)
        .then(() => {
          this.notificationService.showSuccess('Application deleted.');
          overlayDialog.close();
          this.close();
        })
        .catch((error) => {
          console.error(error);
          overlayDialog.close();
          this.notificationService.showError('There was an error deleting the application. Please try again.');
        });
    }
  }

  public edit(): void {
    this.isEditing = true;
    this.changeDetectorRef.detectChanges();
    this.matInputs?.get(0)?.focus();
  }

  public getError(control: AbstractControl): string {
    if (control.hasError('maxlength')) {
      return 'Length must be less than 128';
    } else if (control.hasError('max')) {
      return 'Number is too big';
    } else {
      return 'Required';
    }
  }

  public async moveApplication(newColumn: Column): Promise<void> {
    const overlayDialog = this.matDialog.open(OverlaySpinnerComponent, {
      autoFocus: false,
      disableClose: true,
      panelClass: 'overlay-spinner-dialog'
    });

    await this.applicationsService
      .moveApplication(this.column.docId, newColumn.docId, this.application.docId)
      .then(() => {
        this.notificationService.showSuccess('Application successfully moved!');
        overlayDialog.close();
      })
      .catch((error) => {
        console.error(error);
        overlayDialog.close();
        this.notificationService.showError('There was an error moving the application. Please try again.');
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.initForm();
  }

  public async save(): Promise<void> {
    if (this.companyPositionForm.valid) {
      this.isLoading = true;

      const application: Partial<ApplicationDoc> = {
        company: this.company.value!,
        position: this.position.value!
      };

      await this.applicationsService
        .updateApplication(this.application.docId, application)
        .then(() => {
          this.isLoading = false;
          this.isEditing = false;
          this.companyPositionForm.reset();
          this.initForm();
        })
        .catch((error) => {
          console.error(error);
          this.isLoading = false;
          this.notificationService.showError('There was a problem updating the application. Please try again.');
        });
    }
  }

  private get applicationColumnSubscription(): Subscription {
    return this.applicationsService
      .doc$(this.application.docId, applicationConverter)
      .pipe(
        switchMap(async (doc) => {
          if (this.application.columnDocId !== doc.columnDocId) {
            const newColumn = (await this.columnsService.docSnap(doc.columnDocId, columnConverter)).data();

            if (newColumn) {
              this.column = newColumn;
            }
          }

          return doc;
        })
      )
      .subscribe((doc) => {
        this.application = doc;
      });
  }

  private initForm(): void {
    this.companyPositionForm.setValue({
      company: this.application.company,
      position: this.application.position
    });
  }

  public get company(): AbstractControl<string | null> {
    return this.companyPositionForm.controls.company;
  }

  public get position(): AbstractControl<string | null> {
    return this.companyPositionForm.controls.position;
  }
}
