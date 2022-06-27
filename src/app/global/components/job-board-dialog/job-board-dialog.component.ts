import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Timestamp } from '@firebase/firestore';
import { lastValueFrom, Observable } from 'rxjs';

import { ConfirmationDialogComponent } from '~components/confirmation-dialog/confirmation-dialog.component';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';
import { DocumentDialog } from '~interfaces/document-dialog.interface';
import { JobBoard } from '~models/job-board.model';
import { JobBoardsService } from '~services/job-boards/job-boards.service';
import { NotificationService } from '~services/notification/notification.service';
import { UserDataQuery } from '~state/user-data/user-data.query';

@Component({
  selector: 'at-new-job-board-dialog',
  templateUrl: './job-board-dialog.component.html',
  styleUrls: ['./job-board-dialog.component.scss']
})
export class JobBoardDialogComponent {
  public button: string;
  public header: string;
  public isLoading: boolean;
  public jobBoardForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public providedData: DocumentDialog,
    private formBuilder: FormBuilder,
    private jobBoardsService: JobBoardsService,
    private matDialog: MatDialog,
    private matDialogRef: MatDialogRef<JobBoardDialogComponent>,
    private notificationService: NotificationService,
    private userDataQuery: UserDataQuery
  ) {
    this.button = this.providedData.action === DialogActions.New ? 'Add' : 'Save';
    this.header = this.providedData.action === DialogActions.New ? 'New' : 'Edit';
    this.isLoading = false;
    this.jobBoardForm = this.formBuilder.group({
      date: [null, [Validators.required]],
      title: [null, [Validators.required, Validators.maxLength(128)]]
    });

    this.initForm();
  }

  public async close(): Promise<void> {
    if (this.jobBoardForm.pristine) {
      this.matDialogRef.close();
    } else {
      const data: ConfirmationDialog = {
        action: DialogActions.Discard,
        item: this.providedData.action === DialogActions.New ? 'job board' : 'edits'
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

  public async submit(): Promise<void> {
    if (this.jobBoardForm.valid) {
      this.isLoading = true;

      const title = this.title?.value as string;
      const date = this.date?.value as Date;

      if (this.providedData.action === DialogActions.New) {
        await this.jobBoardsService.createJobBoard(this.userDataQuery.uid!, title, date).then(() => {
          this.isLoading = false;
          this.notificationService.showSuccess('Job board added!');
          this.matDialogRef.close();
        });
      } else {
        // DialogActions.Edit
        const data = this.providedData.data as JobBoard;
        const timestamp = Timestamp.fromDate(date);

        await this.jobBoardsService.updateJobBoard({ date: timestamp, docId: data.docId, title }).then(() => {
          this.isLoading = false;
          this.notificationService.showSuccess('Job board updated!');
          this.matDialogRef.close();
        });
      }
    }
  }

  public get date(): AbstractControl | null {
    return this.jobBoardForm.get('date');
  }

  public get title(): AbstractControl | null {
    return this.jobBoardForm.get('title');
  }

  private initForm(): void {
    const data = this.providedData.data as JobBoard;

    if (this.providedData.action === DialogActions.Edit) {
      this.title?.setValue(data.title);
      this.date?.setValue(data.date?.toDate());
    }
  }
}
