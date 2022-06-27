import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';

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
  public isLoading = true;

  private subscriptions: Subscription;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private columnsService: ColumnsService,
    private titleService: Title,
    private userDataQuery: UserDataQuery
  ) {
    this.columns = new Observable<Column[]>();
    this.subscriptions = new Subscription();
    this.titleService.setTitle('Applications' + TITLE_SUFFIX);
  }

  ngOnDestroy(): void {
    this.columnsService.resetColumns();
    this.subscriptions?.unsubscribe();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.userDataQuery.currentJobBoard$.subscribe((currentBoard) => {
        this.columnsService.resetColumns();

        if (currentBoard) {
          this.columnsService.initColumns();
          this.columns = this.columnsService.columns!;
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        }
      })
    );
  }
}
