import { ChangeDetectorRef, Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { Observable } from 'rxjs';

import { PAY_PERIOD_OPTIONS } from '~constants/forms.constants';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ApplicationDoc } from '~interfaces/application-doc.interface';
import { NewApplicationDialogData } from '~interfaces/new-application-dialog-data.interface';
import { Column } from '~models/column.model';
import { ApplicationsService } from '~services/applications/applications.service';
import { ColumnsService } from '~services/columns/columns.service';
import { GlobalService } from '~services/global/global.service';
import { NotificationService } from '~services/notification/notification.service';
import { CustomValidators } from '~utils/custom-validators';
import { dateToTimestamp } from '~utils/date.util';
import { expandCollapse, ngIfAnimation } from '~utils/transitions.util';

@Component({
  selector: 'at-new-application-dialog',
  templateUrl: './new-application-dialog.component.html',
  styleUrls: ['./new-application-dialog.component.scss'],
  animations: [expandCollapse, ngIfAnimation]
})
export class NewApplicationDialogComponent implements OnInit {
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
  public viewMore = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: NewApplicationDialogData,
    private applicationsService: ApplicationsService,
    private changeDetectorRef: ChangeDetectorRef,
    private columnsService: ColumnsService,
    private globalService: GlobalService,
    private matDialogRef: MatDialogRef<NewApplicationDialogComponent>,
    private notificationService: NotificationService
  ) {
    this.columns$ = this.columnsService.columns$;
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

  public get currentDate(): Date {
    return new Date(Date.now());
  }

  public get date(): AbstractControl<Date | null> {
    return this.applicationForm.controls.date;
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

  public columnCompare = (a: Column, b: Column) => {
    return a.docId === b.docId;
  };

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
    this.applicationForm.patchValue({
      column: this.dialogData.column,
      date: new Date(),
      payPeriod: this.payPeriodOptions[3]
    });
  }

  public async primaryButtonClick(): Promise<void> {
    if (this.applicationForm.invalid) {
      return;
    }

    const application: ApplicationDoc = {
      columnDocId: this.column.value!.docId,
      company: this.company.value!,
      compensation: this.compensation.value,
      date: dateToTimestamp(this.date.value!),
      link: this.link.value,
      location: this.location.value,
      note: null,
      offer: null,
      payPeriod: this.payPeriod.value,
      position: this.position.value!
    };

    await this.createApplication(application);
  }

  public async secondaryButtonClick(): Promise<void> {
    if (this.applicationForm.pristine) {
      this.matDialogRef.close();

      return;
    }

    const dialogAction = await this.globalService.confirmationDialog({
      action: DialogActions.Discard,
      item: 'application'
    });

    if (dialogAction === DialogActions.Discard) {
      this.matDialogRef.close();
    }
  }

  public toggleViewMore(): void {
    this.viewMore = true;
    this.changeDetectorRef.detectChanges();
    this.matInputs?.get(2)?.focus();
  }

  private async createApplication(application: ApplicationDoc): Promise<void> {
    this.isLoading = true;

    await this.applicationsService
      .createApplication(application)
      .then(() => {
        this.notificationService.showSuccess('Application added!');
        this.matDialogRef.close();
      })
      .catch(() => {
        this.notificationService.showError('There was a problem adding the application. Please try again.');
      })
      .finally(() => (this.isLoading = false));
  }
}
