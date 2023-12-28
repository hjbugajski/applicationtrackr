import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { JobBoard } from '~models/job-board.model';
import { JobBoardsService } from '~services/job-boards/job-boards.service';

@Component({
  selector: 'at-job-boards',
  templateUrl: './job-boards.component.html',
  styleUrls: ['./job-boards.component.scss'],
})
export class JobBoardsComponent {
  public jobBoards: Observable<JobBoard[]>;

  constructor(private jobBoardsService: JobBoardsService) {
    this.jobBoards = this.jobBoardsService.jobBoards$;
  }
}
