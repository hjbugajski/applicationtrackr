import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { lastValueFrom, Observable } from 'rxjs';

import { ApplicationDialogComponent } from '~components/application-dialog/application-dialog.component';
import { ConfirmationDialogComponent } from '~components/confirmation-dialog/confirmation-dialog.component';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ApplicationDoc } from '~interfaces/application-doc.interface';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';
import { Application } from '~models/application.model';
import { Column } from '~models/column.model';
import { ApplicationService } from '~services/application/application.service';
import { NotificationService } from '~services/notification/notification.service';
import { CustomValidators } from '~utils/custom-validators';
import { dateToTimestamp, timestampToDate } from '~utils/date.util';
import { expandCollapse, ngIfAnimation } from '~utils/transitions.util';

enum States {
  Editing,
  Readonly
}

@Component({
  selector: 'at-application-info-form',
  templateUrl: './application-info-form.component.html',
  styleUrls: ['./application-info-form.component.scss'],
  animations: [expandCollapse, ngIfAnimation]
})
export class ApplicationInfoFormComponent implements OnInit {
  @Input() public action!: DialogActions;
  @Input() public application!: Application;
  @Input() public columns!: Observable<Column[]>;
  @Input() public currentColumn!: Column;
  @ViewChildren(MatInput) public matInputs: QueryList<MatInput> | undefined;

  public applicationForm!: FormGroup;
  public isLoading = false;
  public payPeriodOptions: string[];
  public state = States.Readonly;
  public viewMore = false;

  constructor(
    private applicationService: ApplicationService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private matDialogRef: MatDialogRef<ApplicationDialogComponent>,
    private notificationService: NotificationService
  ) {
    this.payPeriodOptions = ['hour', 'week', 'month', 'year', 'total'];
  }

  public close(): void {
    this.matDialogRef.close();
  }

  public columnCompare = (a: Column, b: Column) => {
    return a.docId === b.docId;
  };

  public getError(control: AbstractControl | null): string {
    if (control?.hasError('maxlength')) {
      return 'Length must be less than 128';
    } else {
      return 'Required';
    }
  }

  public getLinkError(control: AbstractControl | null): string {
    if (control?.hasError('maxlength')) {
      return 'Length must be less than 2000';
    } else if (control?.hasError('url')) {
      return 'Invalid URL';
    } else {
      return 'Required';
    }
  }

  ngOnInit(): void {
    if (this.action === DialogActions.New) {
      this.state = States.Editing;
      this.viewMore = false;
    } else {
      // DialogActions.Edit
      this.state = States.Readonly;
      this.viewMore = true;
    }

    this.initForm();
  }

  public async primaryButtonClick(): Promise<void> {
    if (this.action === DialogActions.Edit && !this.editing) {
      this.state = States.Editing;

      return;
    }

    if (this.applicationForm.valid) {
      this.isLoading = true;

      const newColumn = this.column?.value as Column;

      const application: ApplicationDoc = {
        columnDocId: newColumn.docId,
        company: this.company?.value as string,
        compensation: (this.compensation?.value as number) ?? null,
        date: dateToTimestamp(this.date?.value as Date),
        link: (this.link?.value as string) ?? null,
        location: (this.location?.value as string) ?? null,
        payPeriod: this.payPeriod?.value as string,
        position: this.position?.value as string
      };

      this.action === DialogActions.New
        ? await this.createApplication(application)
        : await this.editApplication(application);
    }
  }

  public async secondaryButtonClick(): Promise<void> {
    if (this.applicationForm.pristine) {
      if (this.action === DialogActions.New) {
        this.matDialogRef.close();
      } else {
        // DialogActions.Edit
        this.state = States.Readonly;
      }
    } else {
      const data: ConfirmationDialog = {
        action: DialogActions.Discard,
        item: this.action === DialogActions.New ? 'application' : 'edits'
      };
      const dialogAfterClosed = this.matDialog
        .open(ConfirmationDialogComponent, { autoFocus: false, data, disableClose: true, width: '315px' })
        .afterClosed() as Observable<DialogActions>;

      if ((await lastValueFrom(dialogAfterClosed)) === DialogActions.Discard) {
        if (this.action === DialogActions.New) {
          this.matDialogRef.close();
        } else {
          // DialogActions.Edit
          this.initEditForm();
          this.state = States.Readonly;
        }
      }
    }
  }

  public toggleViewMore(): void {
    this.viewMore = true;
    this.company?.markAsUntouched();
    this.matInputs!.first.focus();
  }

  private async createApplication(application: ApplicationDoc): Promise<void> {
    await this.applicationService
      .createApplication(application.columnDocId, application)
      .then(() => {
        this.isLoading = false;
        this.notificationService.showSuccess('Application added!');
        this.matDialogRef.close();
      })
      .catch((error) => {
        console.error(error);
        this.isLoading = false;
        this.notificationService.showError('There was a problem adding the application. Please try again.');
      });
  }

  private async editApplication(application: ApplicationDoc): Promise<void> {
    await this.applicationService
      .updateApplication(this.currentColumn.docId, this.application.docId, application)
      .then(() => {
        this.isLoading = false;
        this.state = States.Readonly;
        this.notificationService.showSuccess('Application updated!');
      })
      .catch((error) => {
        console.error(error);
        this.isLoading = false;
        this.notificationService.showError('There was a problem updating the application. Please try again.');
      });
  }

  private initEditForm(): void {
    this.column?.setValue(this.currentColumn);
    this.company?.setValue(this.application.company);
    this.compensation?.setValue(this.application.compensation);
    this.date?.setValue(timestampToDate(this.application.date));
    this.link?.setValue(this.application.link);
    this.location?.setValue(this.application.location);
    this.payPeriod?.setValue(this.application.payPeriod);
    this.position?.setValue(this.application.position);
  }

  private initForm(): void {
    this.applicationForm = this.formBuilder.group({
      column: [this.currentColumn, [Validators.required]],
      company: [null, [Validators.required, Validators.maxLength(128)]],
      compensation: [null, [Validators.maxLength(128)]],
      date: [new Date(), [Validators.required]],
      link: [null, [CustomValidators.url, Validators.maxLength(2000)]],
      location: [null, [Validators.maxLength(128)]],
      payPeriod: [this.payPeriodOptions[3]],
      position: [null, [Validators.required, Validators.maxLength(128)]]
    });

    if (this.action === DialogActions.Edit) {
      this.initEditForm();
    }
  }

  public get column(): AbstractControl | null {
    return this.applicationForm.get('column');
  }

  public get company(): AbstractControl | null {
    return this.applicationForm.get('company');
  }

  public get compensation(): AbstractControl | null {
    return this.applicationForm.get('compensation');
  }

  public get date(): AbstractControl | null {
    return this.applicationForm.get('date');
  }

  public get dialogActions(): typeof DialogActions {
    return DialogActions;
  }

  public get editing(): boolean {
    return this.state === States.Editing;
  }

  public get link(): AbstractControl | null {
    return this.applicationForm.get('link');
  }

  public get location(): AbstractControl | null {
    return this.applicationForm.get('location');
  }

  public get payPeriod(): AbstractControl | null {
    return this.applicationForm.get('payPeriod');
  }

  public get position(): AbstractControl | null {
    return this.applicationForm.get('position');
  }

  public get primaryButtonText(): string {
    if (this.action === DialogActions.New) {
      return 'Add';
    } else {
      // DialogActions.Edit
      return this.editing ? 'Save' : 'Edit';
    }
  }

  public get readonly(): boolean {
    return this.state === States.Readonly;
  }
}
