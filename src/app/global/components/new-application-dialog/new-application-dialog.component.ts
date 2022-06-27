import { Component, Inject, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { Timestamp } from '@firebase/firestore';
import { lastValueFrom, Observable } from 'rxjs';

import { ConfirmationDialogComponent } from '~components/confirmation-dialog/confirmation-dialog.component';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ApplicationDoc } from '~interfaces/application-doc.interface';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';
import { NewApplicationDialogData } from '~interfaces/new-application-dialog-data.interface';
import { ApplicationService } from '~services/application/application.service';
import { NotificationService } from '~services/notification/notification.service';
import { CustomValidators } from '~utils/custom-validators';
import { expandCollapse, ngIfAnimation } from '~utils/transitions.util';

@Component({
  selector: 'at-new-application-dialog',
  templateUrl: './new-application-dialog.component.html',
  styleUrls: ['./new-application-dialog.component.scss'],
  animations: [expandCollapse, ngIfAnimation]
})
export class NewApplicationDialogComponent {
  @ViewChildren(MatInput) public matInputs: QueryList<MatInput> | undefined;

  public applicationForm: FormGroup;
  public isLoading = false;
  public viewMore = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: NewApplicationDialogData,
    private applicationService: ApplicationService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private matDialogRef: MatDialogRef<NewApplicationDialogComponent>,
    private notificationService: NotificationService
  ) {
    this.applicationForm = this.formBuilder.group({
      column: [this.dialogData.column.docId, [Validators.required]],
      company: [null, [Validators.required, Validators.maxLength(128)]],
      date: [new Date(), [Validators.required]],
      link: [null, [CustomValidators.url, Validators.maxLength(2000)]],
      location: [null, [Validators.maxLength(128)]],
      position: [null, [Validators.required, Validators.maxLength(128)]]
    });
  }

  public async close(): Promise<void> {
    if (this.applicationForm.pristine) {
      this.matDialogRef.close();
    } else {
      const data: ConfirmationDialog = {
        action: DialogActions.Discard,
        item: 'application'
      };
      const dialogAfterClosed = this.matDialog
        .open(ConfirmationDialogComponent, { autoFocus: false, data, disableClose: true, width: '315px' })
        .afterClosed() as Observable<DialogActions>;

      if ((await lastValueFrom(dialogAfterClosed)) === DialogActions.Discard) {
        this.matDialogRef.close();
      }
    }
  }

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

  public async submit(): Promise<void> {
    if (this.applicationForm.valid) {
      this.isLoading = true;

      const application: ApplicationDoc = {
        company: this.company?.value as string,
        date: Timestamp.fromDate(this.date?.value as Date),
        link: (this.link?.value as string) ?? '',
        location: (this.location?.value as string) ?? '',
        position: this.position?.value as string
      };

      await this.applicationService
        .createApplication(this.dialogData.column.docId, application)
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
  }

  public toggleViewMore(): void {
    this.viewMore = true;
    this.company?.markAsUntouched();
    this.matInputs!.first.focus();
  }

  public get column(): AbstractControl | null {
    return this.applicationForm.get('column');
  }

  public get company(): AbstractControl | null {
    return this.applicationForm.get('company');
  }

  public get date(): AbstractControl | null {
    return this.applicationForm.get('date');
  }

  public get link(): AbstractControl | null {
    return this.applicationForm.get('link');
  }

  public get location(): AbstractControl | null {
    return this.applicationForm.get('location');
  }

  public get position(): AbstractControl | null {
    return this.applicationForm.get('position');
  }
}
