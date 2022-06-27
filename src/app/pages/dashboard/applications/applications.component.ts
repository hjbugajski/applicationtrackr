import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { TITLE_SUFFIX } from '~constants/title.constant';
import { Column } from '~models/column.model';
import { ColumnsService } from '~services/columns/columns.service';
import { UserDataQuery } from '~state/user-data/user-data.query';

@Component({
  selector: 'at-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationsComponent implements OnDestroy, OnInit {
  public columns: Observable<Column[]>;
  public columnsIds: string[];
  public isLoaded: BehaviorSubject<boolean>;

  private subscriptions: Subscription;

  constructor(
    private columnsService: ColumnsService,
    private titleService: Title,
    private userDataQuery: UserDataQuery
  ) {
    this.columns = new Observable<Column[]>();
    this.columnsIds = [];
    this.isLoaded = new BehaviorSubject<boolean>(false);
    this.subscriptions = new Subscription();
    this.titleService.setTitle('Applications' + TITLE_SUFFIX);
  }

  public getDragDropConnectedArray(index: number): string[] {
    const array: string[] = [];

    this.columnsIds.forEach((column, i) => {
      if (i !== index) {
        array.push('column-' + i.toString());
      }
    });

    return array;
  }

  ngOnDestroy(): void {
    this.columnsService.resetColumns();
    this.subscriptions?.unsubscribe();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      /* eslint-disable */
      this.userDataQuery.currentJobBoard$.subscribe(async (currentBoard) => {
        /* eslint-enable */
        this.isLoaded.next(false);
        this.columnsService.resetColumns();

        if (currentBoard) {
          await this.columnsService.initColumns().then(() => {
            this.columns = this.columnsService.columns!;
            this.columnsIds = this.columnsService.columnsIds!;
            this.isLoaded.next(true);
          });
        }
      })
    );
  }
}
