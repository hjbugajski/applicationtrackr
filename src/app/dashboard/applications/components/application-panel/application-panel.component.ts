import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { filter, Observable, Subscription, switchMap } from 'rxjs';

import { DialogActions } from '~enums/dialog-actions.enum';
import { ApplicationDialogData } from '~interfaces/application-dialog-data.interface';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';
import { Application } from '~models/application.model';
import { Column } from '~models/column.model';
import { ApplicationsService } from '~services/applications/applications.service';
import { ColumnsService } from '~services/columns/columns.service';
import { GlobalService } from '~services/global/global.service';
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
    private globalService: GlobalService,
    private notificationService: NotificationService
  ) {
    this.application = this.dialogData.application;
    this.column = this.dialogData.column;
    this.columns$ = this.columnsService.columns$;
    this.subscription = this.applicationsService
      .doc$(this.application.docId, applicationConverter)
      .pipe(
        filter((doc) => !!doc),
        switchMap(async (doc) => await this.setColumn(doc))
      )
      .subscribe((doc) => (this.application = doc));
  }

  public get company(): AbstractControl<string | null> {
    return this.companyPositionForm.controls.company;
  }

  public get position(): AbstractControl<string | null> {
    return this.companyPositionForm.controls.position;
  }

  public async cancel(): Promise<void> {
    if (this.companyPositionForm.pristine) {
      this.isEditing = false;

      return;
    }

    const dialogAction = await this.globalService.confirmationDialog({
      action: DialogActions.Discard,
      item: 'edits'
    });

    if (dialogAction === DialogActions.Discard) {
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
    const dialogAction = await this.globalService.confirmationDialog(data, { width: '375px' });

    if (dialogAction === DialogActions.Delete) {
      const overlayDialog = this.globalService.overlayDialog();

      await this.applicationsService
        .deleteApplication(this.application.docId)
        .then(() => {
          this.notificationService.showSuccess('Application deleted.');
          this.close();
        })
        .catch(() => {
          this.notificationService.showError('There was an error deleting the application. Please try again.');
        })
        .finally(() => overlayDialog.close());
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
    const overlayDialog = this.globalService.overlayDialog();

    await this.applicationsService
      .moveApplication(newColumn.docId, this.application.docId)
      .then(() => this.notificationService.showSuccess('Application successfully moved!'))
      .catch(() => this.notificationService.showError('There was an error moving the application. Please try again.'))
      .finally(() => overlayDialog.close());
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.initForm();
  }

  public async save(): Promise<void> {
    if (this.companyPositionForm.invalid) {
      return;
    }

    this.isLoading = true;

    await this.applicationsService
      .update(this.application.docId, { company: this.company.value!, position: this.position.value! })
      .then(() => {
        this.isEditing = false;
        this.companyPositionForm.reset();
        this.initForm();
      })
      .catch(() => {
        this.notificationService.showError('There was a problem updating the application. Please try again.');
      })
      .finally(() => (this.isLoading = false));
  }

  private initForm(): void {
    this.companyPositionForm.setValue({
      company: this.application.company,
      position: this.application.position
    });
  }

  private async setColumn(doc: Application): Promise<Application> {
    if (this.application.columnDocId !== doc.columnDocId) {
      const snapshot = await this.columnsService.docSnap(doc.columnDocId, columnConverter);
      const column = snapshot.data();

      if (column) {
        this.column = column;
      }
    }

    return doc;
  }
}
