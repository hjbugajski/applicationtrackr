import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { Column } from '~models/column.model';
import { ColumnsService } from '~services/columns/columns.service';
import { UserStore } from '~store/user.store';

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

  constructor(private columnsService: ColumnsService, private userStore: UserStore) {
    this.columns = new Observable<Column[]>();
    this.columnsIds = [];
    this.isLoaded = new BehaviorSubject<boolean>(false);
    this.subscriptions = new Subscription();
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
      this.userStore.currentJobBoard$.subscribe(async (currentBoard) => {
        /* eslint-enable */
        this.isLoaded.next(false);
        this.columnsService.resetColumns();

        if (currentBoard) {
          await this.columnsService.initColumns().then(() => {
            this.columns = this.columnsService.columns$!;
            this.columnsIds = this.columnsService.columnsIds!;
            this.isLoaded.next(true);
          });
        }
      })
    );
  }
}
