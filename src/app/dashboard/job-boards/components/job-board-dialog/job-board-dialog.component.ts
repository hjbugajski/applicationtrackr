import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DialogActions } from '~enums/dialog-actions.enum';
import { DocumentDialog } from '~interfaces/document-dialog.interface';
import { JobBoard } from '~models/job-board.model';
import { GlobalService } from '~services/global/global.service';
import { JobBoardsService } from '~services/job-boards/job-boards.service';
import { NotificationService } from '~services/notification/notification.service';
import { UserStore } from '~store/user.store';
import { dateToTimestamp, timestampToDate } from '~utils/date.util';

@Component({
  selector: 'at-new-job-board-dialog',
  templateUrl: './job-board-dialog.component.html',
})
export class JobBoardDialogComponent {
  public button: string;
  public header: string;
  public isLoading: boolean;
  public jobBoardForm = new FormGroup({
    date: new FormControl<Date | null>(null, [Validators.required]),
    title: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(128)]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public providedData: DocumentDialog<JobBoard>,
    private globalService: GlobalService,
    private jobBoardsService: JobBoardsService,
    private matDialogRef: MatDialogRef<JobBoardDialogComponent>,
    private notificationService: NotificationService,
    private userStore: UserStore,
  ) {
    this.button = this.providedData.action === DialogActions.New ? 'Add' : 'Save';
    this.header = this.providedData.action === DialogActions.New ? 'New' : 'Edit';
    this.isLoading = false;
    this.jobBoardForm.controls.date.setValue(new Date());

    this.initForm();
  }

  public get currentDate(): Date {
    return new Date(Date.now());
  }

  public get date(): AbstractControl<Date | null> {
    return this.jobBoardForm.controls.date;
  }

  public get title(): AbstractControl<string | null> {
    return this.jobBoardForm.controls.title;
  }

  public async close(): Promise<void> {
    if (this.jobBoardForm.pristine) {
      this.matDialogRef.close();
    } else {
      const dialogAction = await this.globalService.confirmationDialog({
        action: DialogActions.Discard,
        item: this.providedData.action === DialogActions.New ? 'job board' : 'edits',
      });

      if (dialogAction === DialogActions.Discard) {
        this.matDialogRef.close();
      }
    }
  }

  public getError(control: AbstractControl): string {
    if (control.hasError('maxlength')) {
      return 'Length must be less than 128';
    } else {
      return 'Required';
    }
  }

  public async submit(): Promise<void> {
    if (this.jobBoardForm.invalid) {
      return;
    }

    this.isLoading = true;

    const title = this.title.value!;
    const date = dateToTimestamp(this.date.value!);

    if (this.providedData.action === DialogActions.New) {
      await this.jobBoardsService
        .createJobBoard(this.userStore.uid!, { date, title })
        .then(() => {
          this.notificationService.showSuccess('Job board added!');
          this.matDialogRef.close();
        })
        .catch(() => {
          this.notificationService.showError(
            'There was a problem creating the job board. Please try again.',
          );
        })
        .finally(() => (this.isLoading = false));
    } else {
      // DialogActions.Edit
      const data = this.providedData.data;

      await this.jobBoardsService
        .update(data.docId, { date, title })
        .then(() => this.matDialogRef.close())
        .catch(() => {
          this.notificationService.showError(
            'There was a problem updating the job board. Please try again.',
          );
        })
        .finally(() => (this.isLoading = false));
    }
  }

  private initForm(): void {
    const data = this.providedData.data;

    if (this.providedData.action === DialogActions.Edit) {
      this.title.setValue(data.title);
      this.date.setValue(timestampToDate(data.date));
    }
  }
}
