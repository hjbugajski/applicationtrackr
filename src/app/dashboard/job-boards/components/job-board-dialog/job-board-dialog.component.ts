import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { lastValueFrom, Observable } from 'rxjs';

import { ConfirmationDialogComponent } from '~components/confirmation-dialog/confirmation-dialog.component';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';
import { DocumentDialog } from '~interfaces/document-dialog.interface';
import { JobBoard } from '~models/job-board.model';
import { JobBoardsService } from '~services/job-boards/job-boards.service';
import { NotificationService } from '~services/notification/notification.service';
import { UserStore } from '~store/user.store';
import { dateToTimestamp, timestampToDate } from '~utils/date.util';

@Component({
  selector: 'at-new-job-board-dialog',
  templateUrl: './job-board-dialog.component.html'
})
export class JobBoardDialogComponent {
  public button: string;
  public header: string;
  public isLoading: boolean;
  public jobBoardForm = new FormGroup({
    date: new FormControl<Date | null>(null, [Validators.required]),
    title: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(128)])
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public providedData: DocumentDialog,
    private jobBoardsService: JobBoardsService,
    private matDialog: MatDialog,
    private matDialogRef: MatDialogRef<JobBoardDialogComponent>,
    private notificationService: NotificationService,
    private userStore: UserStore
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
      const data: ConfirmationDialog = {
        action: DialogActions.Discard,
        item: this.providedData.action === DialogActions.New ? 'job board' : 'edits'
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
    if (this.jobBoardForm.valid) {
      this.isLoading = true;

      const title = this.title.value!;
      const date = this.date.value!;

      if (this.providedData.action === DialogActions.New) {
        await this.jobBoardsService.createJobBoard(this.userStore.uid!, title, date).then(() => {
          this.isLoading = false;
          this.notificationService.showSuccess('Job board added!');
          this.matDialogRef.close();
        });
      } else {
        // DialogActions.Edit
        const data = this.providedData.data as JobBoard;
        const timestamp = dateToTimestamp(date);

        await this.jobBoardsService.updateJobBoard(data.docId, { date: timestamp, title }).then(() => {
          this.isLoading = false;
          this.matDialogRef.close();
        });
      }
    }
  }

  private initForm(): void {
    const data = this.providedData.data as JobBoard;

    if (this.providedData.action === DialogActions.Edit) {
      this.title.setValue(data.title);
      this.date.setValue(timestampToDate(data.date));
    }
  }
}
