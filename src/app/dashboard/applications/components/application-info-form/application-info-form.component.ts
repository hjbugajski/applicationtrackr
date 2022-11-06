import { ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { lastValueFrom, Observable } from 'rxjs';

import { ApplicationDialogComponent } from '~components/application-dialog/application-dialog.component';
import { ConfirmationDialogComponent } from '~components/confirmation-dialog/confirmation-dialog.component';
import { PAY_PERIOD_OPTIONS } from '~constants/forms.constants';
import { DialogActions } from '~enums/dialog-actions.enum';
import { FormStates } from '~enums/form-states.enum';
import { ApplicationDoc } from '~interfaces/application-doc.interface';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';
import { Application } from '~models/application.model';
import { Column } from '~models/column.model';
import { ApplicationsService } from '~services/applications/applications.service';
import { ColumnsService } from '~services/columns/columns.service';
import { NotificationService } from '~services/notification/notification.service';
import { CustomValidators } from '~utils/custom-validators';
import { dateToTimestamp, timestampToDate } from '~utils/date.util';
import { expandCollapse, ngIfAnimation } from '~utils/transitions.util';

@Component({
  selector: 'at-application-info-form',
  templateUrl: './application-info-form.component.html',
  styleUrls: ['./application-info-form.component.scss'],
  animations: [expandCollapse, ngIfAnimation]
})
export class ApplicationInfoFormComponent implements OnInit {
  @Input() public action!: DialogActions;
  @Input() public application!: Application;
  @Input() public currentColumn!: Column;
  @ViewChildren(MatInput) public matInputs: QueryList<MatInput> | undefined;

  public applicationForm = new FormGroup({
    column: new FormControl<Column | null>(null, [Validators.required]),
    company: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(128)]),
    compensation: new FormControl<number | null>(null, CustomValidators.numberValidators),
    date: new FormControl<Date | null>(null, [Validators.required]),
    link: new FormControl<string | null>(null, [CustomValidators.url, Validators.maxLength(2000)]),
    location: new FormControl<string | null>(null, [Validators.maxLength(128)]),
    payPeriod: new FormControl<string | null>(null),
    position: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(128)])
  });
  public columns$: Observable<Column[]>;
  public isLoading = false;
  public payPeriodOptions = PAY_PERIOD_OPTIONS;
  public state = FormStates.Readonly;
  public viewMore = false;

  constructor(
    private applicationsService: ApplicationsService,
    private changeDetectorRef: ChangeDetectorRef,
    private columnsService: ColumnsService,
    private matDialog: MatDialog,
    private matDialogRef: MatDialogRef<ApplicationDialogComponent>,
    private notificationService: NotificationService
  ) {
    this.columns$ = this.columnsService.columns$;
  }

  public columnCompare = (a: Column, b: Column) => {
    return a.docId === b.docId;
  };

  public get currentDate(): Date {
    return new Date(Date.now());
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

  public getLinkError(control: AbstractControl): string {
    if (control.hasError('maxlength')) {
      return 'Length must be less than 2000';
    } else if (control.hasError('url')) {
      return 'Invalid URL';
    } else {
      return 'Required';
    }
  }

  ngOnInit(): void {
    if (this.action === DialogActions.New) {
      this.state = FormStates.Editing;
      this.viewMore = false;
    } else {
      // DialogActions.Edit
      this.state = FormStates.Readonly;
      this.viewMore = true;
    }

    this.initForm();
  }

  public async primaryButtonClick(): Promise<void> {
    if (this.action === DialogActions.Edit && !this.editing) {
      this.state = FormStates.Editing;

      return;
    }

    if (this.applicationForm.valid) {
      this.isLoading = true;

      const newColumn = this.column.value;

      const application: ApplicationDoc = {
        columnDocId: newColumn!.docId,
        company: this.company.value!,
        compensation: this.compensation.value,
        date: dateToTimestamp(this.date.value!),
        link: this.link.value,
        location: this.location.value,
        offer: null,
        payPeriod: this.payPeriod.value,
        position: this.position.value!
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
        this.state = FormStates.Readonly;
      }

      return;
    }

    const data: ConfirmationDialog = {
      action: DialogActions.Discard,
      item: this.action === DialogActions.New ? 'application' : 'edits'
    };
    const dialogAction = await lastValueFrom(
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

    if (dialogAction === DialogActions.Discard) {
      if (this.action === DialogActions.New) {
        this.matDialogRef.close();
      } else {
        // DialogActions.Edit
        this.initEditForm();
        this.state = FormStates.Readonly;
      }
    }
  }

  public toggleViewMore(): void {
    this.viewMore = true;
    this.company.markAsUntouched();
    this.changeDetectorRef.detectChanges();
    this.matInputs?.get(2)?.focus();
  }

  private async createApplication(application: ApplicationDoc): Promise<void> {
    await this.applicationsService
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
    await this.applicationsService
      .updateApplication(this.application.docId, application)
      .then(() => {
        this.isLoading = false;
        this.state = FormStates.Readonly;
      })
      .catch((error) => {
        console.error(error);
        this.isLoading = false;
        this.notificationService.showError('There was a problem updating the application. Please try again.');
      });
  }

  private initEditForm(): void {
    this.applicationForm.setValue({
      column: this.currentColumn,
      company: this.application.company,
      compensation: this.application.compensation,
      date: timestampToDate(this.application.date),
      link: this.application.link,
      location: this.application.location,
      payPeriod: this.application.payPeriod,
      position: this.application.position
    });
  }

  private initForm(): void {
    this.applicationForm.patchValue({
      column: this.currentColumn,
      date: new Date(),
      payPeriod: this.payPeriodOptions[3]
    });

    if (this.action === DialogActions.Edit) {
      this.initEditForm();
    }
  }

  public get column(): AbstractControl<Column | null> {
    return this.applicationForm.controls.column;
  }

  public get company(): AbstractControl<string | null> {
    return this.applicationForm.controls.company;
  }

  public get compensation(): AbstractControl<number | null> {
    return this.applicationForm.controls.compensation;
  }

  public get date(): AbstractControl<Date | null> {
    return this.applicationForm.controls.date;
  }

  public get dialogActions(): typeof DialogActions {
    return DialogActions;
  }

  public get editing(): boolean {
    return this.state === FormStates.Editing;
  }

  public get link(): AbstractControl<string | null> {
    return this.applicationForm.controls.link;
  }

  public get location(): AbstractControl<string | null> {
    return this.applicationForm.controls.location;
  }

  public get payPeriod(): AbstractControl<string | null> {
    return this.applicationForm.controls.payPeriod;
  }

  public get position(): AbstractControl<string | null> {
    return this.applicationForm.controls.position;
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
    return this.state === FormStates.Readonly;
  }
}
