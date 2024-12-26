import { Injectable } from '@angular/core';
import {
  collection,
  CollectionReference,
  DocumentData,
  Firestore,
  orderBy,
  Query,
  query,
} from '@angular/fire/firestore';
import { distinctUntilChanged, map, Observable, takeUntil } from 'rxjs';

import { Collections } from '~enums/collections.enum';
import { Column } from '~models/column.model';
import { FirebaseFunctionsService } from '~services/firebase-functions/firebase-functions.service';
import { FirestoreService } from '~services/firestore/firestore.service';
import { GlobalService } from '~services/global/global.service';
import { UserStore } from '~store/user.store';
import { columnConverter } from '~utils/firestore-converters';

@Injectable({
  providedIn: 'root',
})
export class ColumnsService extends FirestoreService<Column> {
  public columnIds$!: Observable<string[]>;
  public columns$!: Observable<Column[]>;

  protected _basePath!: string;
  protected _collectionRef!: CollectionReference<DocumentData>;
  protected _collectionRefWithConverter!: CollectionReference<Column>;

  constructor(
    private firebaseFunctionsService: FirebaseFunctionsService,
    protected firestore: Firestore,
    private globalService: GlobalService,
    private userStore: UserStore,
  ) {
    super(firestore);

    this.columnIds$ = new Observable<string[]>();
    this.columns$ = new Observable<Column[]>();

    this.userStore.state$.pipe(takeUntil(this.globalService.destroy$)).subscribe((state) => {
      if (state.uid && state.currentJobBoard) {
        this._basePath = [
          Collections.Users,
          state.uid,
          Collections.JobBoards,
          state.currentJobBoard,
          Collections.Columns,
        ].join('/');
        this._collectionRef = collection(this.firestore, this._basePath);
        this._collectionRefWithConverter = collection(this.firestore, this._basePath).withConverter(
          columnConverter,
        );

        this.reset();
        this.columnIds$ = this.collection$(this.query).pipe(
          map((columns) => columns.map((column) => column.docId)),
          distinctUntilChanged(),
        );
        this.columns$ = this.collection$(this.query);
      } else {
        this.reset();
      }
    });
  }

  public get query(): Query<Column> {
    return query(this.collectionRefWithConverter, orderBy('sortOrder', 'asc'));
  }

  public async deleteColumn(column: Column): Promise<void> {
    await this.delete(column.docId).then(async () => {
      await this.firebaseFunctionsService.batchDeleteApplications(column.docId);
    });
  }

  private reset(): void {
    this.columnIds$ = new Observable<string[]>();
    this.columns$ = new Observable<Column[]>();
  }
}
