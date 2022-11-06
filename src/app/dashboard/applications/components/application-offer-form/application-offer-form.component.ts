import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, Observable } from 'rxjs';

import { ConfirmationDialogComponent } from '~components/confirmation-dialog/confirmation-dialog.component';
import { PAY_PERIOD_OPTIONS } from '~constants/forms.constants';
import { Colors } from '~enums/colors.enum';
import { DialogActions } from '~enums/dialog-actions.enum';
import { FormStates } from '~enums/form-states.enum';
import { ApplicationOffer } from '~interfaces/application-doc.interface';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';
import { Application } from '~models/application.model';
import { Column } from '~models/column.model';
import { ApplicationsService } from '~services/applications/applications.service';
import { NotificationService } from '~services/notification/notification.service';
import { CustomValidators } from '~utils/custom-validators';
import { dateToTimestamp, timestampToDate } from '~utils/date.util';

@Component({
  selector: 'at-application-offer-form',
  templateUrl: './application-offer-form.component.html',
  styleUrls: ['./application-offer-form.component.scss']
})
export class ApplicationOfferFormComponent implements OnInit {
  @Input() public application!: Application;
  @Input() public currentColumn!: Column;

  public isLoading = false;
  public offerForm = new FormGroup({
    benefits: new FormControl<string | null>(null, [Validators.maxLength(128)]),
    bonus: new FormControl<number | null>(null, CustomValidators.numberValidators),
    compensation: new FormControl<number | null>(null, CustomValidators.numberValidators),
    deadline: new FormControl<Date | null>(null),
    notes: new FormControl<string | null>(null, [Validators.maxLength(2000)]),
    payPeriod: new FormControl<string | null>(null),
    pto: new FormControl<string | null>(null, [Validators.maxLength(128)]),
    startDate: new FormControl<Date | null>(null)
  });
  public payPeriodOptions = PAY_PERIOD_OPTIONS;
  public state = FormStates.Readonly;

  constructor(
    private applicationsService: ApplicationsService,
    private matDialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  public getError(control: AbstractControl): string {
    if (control.hasError('maxlength')) {
      return 'Length must be less than 128';
    } else if (control.hasError('max')) {
      return 'Number is too big';
    } else {
      return 'Required';
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  public async primaryButtonClick(): Promise<void> {
    if (!this.editing) {
      this.state = FormStates.Editing;

      return;
    }

    if (this.offerForm.valid) {
      this.isLoading = true;

      const offer: ApplicationOffer = {
        benefits: this.benefits.value,
        bonus: this.bonus.value,
        compensation: this.compensation.value,
        deadline: this.deadline.value ? dateToTimestamp(this.deadline.value) : null,
        notes: this.notes.value,
        payPeriod: this.payPeriod.value,
        pto: this.pto.value,
        startDate: this.startDate.value ? dateToTimestamp(this.startDate.value) : null
      };

      await this.applicationsService
        .updateApplicationOffer(this.application.docId, offer)
        .then(() => {
          this.isLoading = false;
          this.state = FormStates.Readonly;
        })
        .catch((error) => {
          console.error(error);
          this.isLoading = false;
          this.notificationService.showError('There was a problem updating the offer. Please try again.');
        });
    }
  }

  public async secondaryButtonClick(): Promise<void> {
    if (this.offerForm.pristine) {
      this.state = FormStates.Readonly;

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
      this.initForm();
      this.state = FormStates.Readonly;
    }
  }

  private initForm(): void {
    this.offerForm.patchValue({
      benefits: this.application.offer?.benefits ?? null,
      bonus: this.application.offer?.bonus ?? null,
      compensation: this.application.offer?.compensation ?? null,
      deadline: this.application.offer?.deadline ? timestampToDate(this.application.offer.deadline) : null,
      notes: this.application.offer?.notes ?? null,
      payPeriod: this.application.offer?.payPeriod ?? this.payPeriodOptions[3],
      pto: this.application.offer?.pto ?? null,
      startDate: this.application.offer?.startDate ? timestampToDate(this.application.offer.startDate) : null
    });
  }

  public get benefits(): AbstractControl<string | null> {
    return this.offerForm.controls.benefits;
  }

  public get bonus(): AbstractControl<number | null> {
    return this.offerForm.controls.bonus;
  }

  public get colors(): typeof Colors {
    return Colors;
  }

  public get compensation(): AbstractControl<number | null> {
    return this.offerForm.controls.compensation;
  }

  public get deadline(): AbstractControl<Date | null> {
    return this.offerForm.controls.deadline;
  }

  public get editing(): boolean {
    return this.state === FormStates.Editing;
  }

  public get notes(): AbstractControl<string | null> {
    return this.offerForm.controls.notes;
  }

  public get payPeriod(): AbstractControl<string | null> {
    return this.offerForm.controls.payPeriod;
  }

  public get pto(): AbstractControl<string | null> {
    return this.offerForm.controls.pto;
  }

  public get startDate(): AbstractControl<Date | null> {
    return this.offerForm.controls.startDate;
  }

  public get readonly(): boolean {
    return this.state === FormStates.Readonly;
  }
}
