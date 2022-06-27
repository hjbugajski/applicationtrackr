import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Timestamp } from '@firebase/firestore';
import { BehaviorSubject, lastValueFrom, map, Observable } from 'rxjs';

import { ConfirmationDialogComponent } from '~components/confirmation-dialog/confirmation-dialog.component';
import { JobBoardDialogComponent } from '~components/job-board-dialog/job-board-dialog.component';
import { TITLE_SUFFIX } from '~constants/title.constant';
import { DialogActions } from '~enums/dialog-actions.enum';
import { ConfirmationDialog } from '~interfaces/confirmation-dialog.interface';
import { JobBoard } from '~models/job-board.model';
import { JobBoardsService } from '~services/job-boards/job-boards.service';
import { SidenavService } from '~services/sidenav/sidenav.service';
import { UserDataQuery } from '~state/user-data/user-data.query';

@Component({
  selector: 'at-job-boards',
  templateUrl: './job-boards.component.html',
  styleUrls: ['./job-boards.component.scss']
})
export class JobBoardsComponent {
  @ViewChild(MatSort) public sort: MatSort;

  public displayedColumns: string[] = ['title', 'date', 'actions'];
  public displayedColumnsMobile: string[] = ['title', 'actions'];
  public isMobile: BehaviorSubject<boolean>;
  public jobBoards: Observable<JobBoard[]>;

  constructor(
    private jobBoardsService: JobBoardsService,
    private matDialog: MatDialog,
    private sidenavService: SidenavService,
    private title: Title,
    private userDataQuery: UserDataQuery
  ) {
    this.isMobile = this.sidenavService.isMobile;
    this.title.setTitle('Job Boards' + TITLE_SUFFIX);
    this.sort = new MatSort();
    this.jobBoards = this.jobBoardsService.jobBoards.pipe(
      map((jobBoards) => jobBoards.sort((a, b) => 0 - (a.title! > b.title! ? -1 : 1)))
    );
  }

  public convertToDate(timestamp: Timestamp): string {
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  }

  public async deleteJobBoard(docId: string): Promise<void> {
    const data: ConfirmationDialog = {
      action: DialogActions.Delete,
      message: 'This job board and all respective applications will be deleted. This action cannot be undone.',
      item: 'job board'
    };

    const dialogAfterClosed = this.matDialog
      .open(ConfirmationDialogComponent, { autoFocus: false, data, width: '350px' })
      .afterClosed() as Observable<DialogActions>;

    if ((await lastValueFrom<DialogActions>(dialogAfterClosed)) === DialogActions.Delete) {
      await this.jobBoardsService.deleteJobBoard(docId);
    }
  }

  public editJobBoard(jobBoard: JobBoard): void {
    this.matDialog.open(JobBoardDialogComponent, {
      data: { action: DialogActions.Edit, data: jobBoard },
      panelClass: 'mat-dialog-container-with-toolbar'
    });
  }

  public isCurrentBoard(board: JobBoard): boolean {
    return board.docId === this.userDataQuery.currentJobBoard?.docId;
  }

  public sortData(data: MatTableDataSource<JobBoard>): void {
    data.sort = this.sort;
  }
}
