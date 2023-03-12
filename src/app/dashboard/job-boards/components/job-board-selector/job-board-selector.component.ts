import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { JobBoardDialogComponent } from '~components/job-board-dialog/job-board-dialog.component';
import { DialogActions } from '~enums/dialog-actions.enum';
import { JobBoard } from '~models/job-board.model';
import { JobBoardsService } from '~services/job-boards/job-boards.service';
import { UserService } from '~services/user/user.service';
import { UserStore } from '~store/user.store';

@Component({
  selector: 'at-job-board-selector',
  templateUrl: './job-board-selector.component.html',
  styleUrls: ['./job-board-selector.component.scss']
})
export class JobBoardSelectorComponent {
  public currentJobBoard$: Observable<string | null>;
  public jobBoards$: Observable<JobBoard[]>;

  constructor(
    private jobBoardsService: JobBoardsService,
    private matDialog: MatDialog,
    private userStore: UserStore,
    private userService: UserService
  ) {
    this.currentJobBoard$ = this.userStore.currentJobBoard$;
    this.jobBoards$ = this.jobBoardsService.jobBoards$;
  }

  public newBoard(): void {
    this.matDialog.open(JobBoardDialogComponent, {
      data: { action: DialogActions.New, data: null },
      disableClose: true,
      panelClass: 'at-dialog'
    });
  }

  public async onSelectionChange(board: JobBoard): Promise<void> {
    await this.userService.update(this.userStore.uid!, { currentJobBoard: board.docId });
  }
}
