import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, Subscription } from 'rxjs';

import { JobBoardDialogComponent } from '~components/job-board-dialog/job-board-dialog.component';
import { DialogActions } from '~enums/dialog-actions.enum';
import { JobBoard } from '~models/job-board.model';
import { JobBoardsService } from '~services/job-boards/job-boards.service';
import { UserDataQuery } from '~state/user-data/user-data.query';
import { UserDataService } from '~state/user-data/user-data.service';

@Component({
  selector: 'at-board-selector',
  templateUrl: './board-selector.component.html',
  styleUrls: ['./board-selector.component.scss']
})
export class BoardSelectorComponent implements OnInit, OnDestroy {
  @Input() public mode = 'select';

  public currentJobBoard: JobBoard | undefined;
  public jobBoards: Observable<JobBoard[]>;

  private subscriptions: Subscription;

  constructor(
    private jobBoardsService: JobBoardsService,
    private matDialog: MatDialog,
    private userDataQuery: UserDataQuery,
    private userDataService: UserDataService
  ) {
    this.jobBoards = this.jobBoardsService.jobBoards.pipe(
      map((jobBoards) => jobBoards.sort((a, b) => 0 - (a.title! > b.title! ? -1 : 1)))
    );
    this.subscriptions = new Subscription();
  }

  public newBoard(): void {
    this.matDialog.open(JobBoardDialogComponent, {
      data: { action: DialogActions.New, data: null },
      panelClass: 'mat-dialog-container-with-toolbar'
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.userDataQuery.currentJobBoard$.subscribe((value) => {
        this.currentJobBoard = value;
      })
    );
  }

  public async onSelectionChange(board: JobBoard): Promise<void> {
    await this.userDataService.updateCurrentJobBoard(board);
  }
}
