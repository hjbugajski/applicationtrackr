import { ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { Observable } from 'rxjs';

import { PAY_PERIOD_OPTIONS } from '~constants/forms.constants';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ApplicationDoc } from '~interfaces/application-doc.interface';
import { Application } from '~models/application.model';
import { Column } from '~models/column.model';
import { ApplicationsService } from '~services/applications/applications.service';
import { ColumnsService } from '~services/columns/columns.service';
import { GlobalService } from '~services/global/global.service';
import { NotificationService } from '~services/notification/notification.service';
import { CustomValidators } from '~utils/custom-validators';
import { dateToTimestamp, timestampToDate } from '~utils/date.util';

@Component({
  selector: 'at-application-panel-info',
  templateUrl: './application-panel-info.component.html'
})
export class ApplicationPanelInfoComponent implements OnInit {
  @Input() public application!: Application;
  @Input() public column!: Column;
  @ViewChildren(MatInput) public matInputs: QueryList<MatInput> | undefined;

  public columns$: Observable<Column[]>;
  public infoForm = new FormGroup({
    compensation: new FormControl<number | null>(null, CustomValidators.numberValidators),
    date: new FormControl<Date | null>(null, [Validators.required]),
    link: new FormControl<string | null>(null, [CustomValidators.url, Validators.maxLength(2000)]),
    location: new FormControl<string | null>(null, [Validators.maxLength(128)]),
    payPeriod: new FormControl<string | null>(null)
  });
  public isEditing = false;
  public isLoading = false;
  public payPeriodOptions = PAY_PERIOD_OPTIONS;

  constructor(
    private applicationsService: ApplicationsService,
    private changeDetectorRef: ChangeDetectorRef,
    private columnsService: ColumnsService,
    private globalService: GlobalService,
    private notificationService: NotificationService
  ) {
    this.columns$ = this.columnsService.columns$;
  }

  public get compensation(): AbstractControl<number | null> {
    return this.infoForm.controls.compensation;
  }

  public get currentDate(): Date {
    return new Date(Date.now());
  }

  public get date(): AbstractControl<Date | null> {
    return this.infoForm.controls.date;
  }

  public get dialogActions(): typeof DialogActions {
    return DialogActions;
  }

  public get link(): AbstractControl<string | null> {
    return this.infoForm.controls.link;
  }

  public get location(): AbstractControl<string | null> {
    return this.infoForm.controls.location;
  }

  public get payPeriod(): AbstractControl<string | null> {
    return this.infoForm.controls.payPeriod;
  }

  public async cancel(): Promise<void> {
    if (this.infoForm.pristine) {
      this.isEditing = false;

      return;
    }

    const dialogAction = await this.globalService.confirmationDialog({
      action: DialogActions.Discard,
      item: 'edits'
    });

    if (dialogAction === DialogActions.Discard) {
      this.isEditing = false;
      this.infoForm.reset();
      this.initInfoForm();
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
    this.initInfoForm();
  }

  public async save(): Promise<void> {
    if (!this.infoForm.valid) {
      return;
    }

    this.isLoading = true;

    const application: Partial<ApplicationDoc> = {
      compensation: this.compensation.value,
      date: dateToTimestamp(this.date.value!),
      link: this.link.value,
      location: this.location.value,
      payPeriod: this.payPeriod.value
    };

    await this.applicationsService
      .update(this.application.docId, application)
      .then(() => {
        this.isEditing = false;
        this.infoForm.reset();
        this.initInfoForm();
      })
      .catch((error) => {
        console.error(error);
        this.notificationService.showError('There was a problem updating the application. Please try again.');
      })
      .finally(() => (this.isLoading = false));
  }

  private initInfoForm(): void {
    this.infoForm.setValue({
      compensation: this.application.compensation,
      date: timestampToDate(this.application.date),
      link: this.application.link,
      location: this.application.location,
      payPeriod: this.application.payPeriod
    });
  }
}
