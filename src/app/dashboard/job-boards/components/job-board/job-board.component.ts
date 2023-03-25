/* eslint-disable @angular-eslint/no-host-metadata-property */
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { JobBoardDialogComponent } from '~components/job-board-dialog/job-board-dialog.component';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';
import { JobBoard } from '~models/job-board.model';
import { GlobalService } from '~services/global/global.service';
import { JobBoardsService } from '~services/job-boards/job-boards.service';
import { UserStore } from '~store/user.store';

@Component({
  selector: 'at-job-board',
  templateUrl: './job-board.component.html',
  styleUrls: ['./job-board.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'job-boards-list-item'
  }
})
export class JobBoardComponent implements OnInit {
  @Input() public jobBoard!: JobBoard;

  public total = -1;

  constructor(
    private globalService: GlobalService,
    private jobBoardsService: JobBoardsService,
    private matDialog: MatDialog,
    private userStore: UserStore
  ) {}

  public async deleteJobBoard(jobBoard: JobBoard): Promise<void> {
    const data: ConfirmationDialog = {
      action: DialogActions.Delete,
      message: `Job board <strong class="at-text danger">${jobBoard.title}</strong>, all associated columns, and all associated applications will be deleted. This action cannot be undone.`,
      item: 'job board'
    };
    const dialogAction = await this.globalService.confirmationDialog(data, { width: '375px' });

    if (dialogAction === DialogActions.Delete) {
      const overlayDialog = this.globalService.overlayDialog();

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

  async ngOnInit(): Promise<void> {
    this.total = await this.jobBoardsService.getApplicationsTotal(this.jobBoard.docId);
  }
}
