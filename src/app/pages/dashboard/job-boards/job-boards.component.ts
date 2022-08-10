import { Component } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, map, Observable } from 'rxjs';

import { ConfirmationDialogComponent } from '~components/confirmation-dialog/confirmation-dialog.component';
import { JobBoardDialogComponent } from '~components/job-board-dialog/job-board-dialog.component';
import { OverlaySpinnerComponent } from '~components/overlay-spinner/overlay-spinner.component';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';
import { JobBoard } from '~models/job-board.model';
import { JobBoardsService } from '~services/job-boards/job-boards.service';
import { UserStore } from '~store/user.store';

@Component({
  selector: 'at-job-boards',
  templateUrl: './job-boards.component.html',
  styleUrls: ['./job-boards.component.scss']
})
export class JobBoardsComponent {
  public jobBoards: Observable<JobBoard[]>;

  constructor(private jobBoardsService: JobBoardsService, private matDialog: MatDialog, private userStore: UserStore) {
    this.jobBoards = this.jobBoardsService.jobBoards$.pipe(
      map((jobBoards) => jobBoards.sort((a, b) => 0 - (a.title > b.title ? -1 : 1)))
    );
  }

  public convertToDate(timestamp: Timestamp): string {
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  }

  public async deleteJobBoard(jobBoard: JobBoard): Promise<void> {
    const data: ConfirmationDialog = {
      action: DialogActions.Delete,
      message: `Job board <strong class="at-text danger">${jobBoard.title}</strong>, all associated columns, and all associated applications will be deleted. This action cannot be undone.`,
      item: 'job board'
    };

    const dialogAfterClosed = this.matDialog
      .open(ConfirmationDialogComponent, {
        autoFocus: false,
        data,
        disableClose: true,
        width: '350px',
        panelClass: 'at-dialog-with-padding'
      })
      .afterClosed() as Observable<DialogActions>;

    if ((await lastValueFrom<DialogActions>(dialogAfterClosed)) === DialogActions.Delete) {
      const overlayDialog = this.matDialog.open(OverlaySpinnerComponent, {
        autoFocus: false,
        disableClose: true,
        panelClass: 'overlay-spinner-dialog'
      });

      await this.jobBoardsService.deleteJobBoard(jobBoard.docId).then(() => {
        overlayDialog.close();
      });
    }
  }

  public editJobBoard(jobBoard: JobBoard): void {
    this.matDialog.open(JobBoardDialogComponent, {
      data: { action: DialogActions.Edit, data: jobBoard },
      disableClose: true,
      panelClass: 'at-dialog'
    });
  }

  public isCurrentBoard(board: JobBoard): boolean {
    return board.docId === this.userStore.currentJobBoard;
  }
}
