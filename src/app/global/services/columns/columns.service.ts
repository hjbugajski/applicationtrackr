import { Injectable } from '@angular/core';
import {
  collection,
  collectionChanges,
  CollectionReference,
  doc,
  Firestore,
  increment,
  orderBy,
  Query,
  query,
  updateDoc
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

import { Collections } from '~enums/collections.enum';
import { Column } from '~models/column.model';
import { UserStore } from '~store/user.store';
import { columnConverter } from '~utils/firestore-converters';

@Injectable({
  providedIn: 'root'
})
export class ColumnsService {
  public columns$: Observable<Column[]>;

  constructor(private firestore: Firestore, private userStore: UserStore) {
    this.columns$ = new Observable<Column[]>();
  }

  public initColumns(): void {
    this.columns$ = collectionChanges(this.columnQuery, { events: ['added', 'removed'] }).pipe(
      map((value) => value.map((item) => item.doc.data()))
    );
  }

  public resetColumns(): void {
    this.columns$ = new Observable<Column[]>();
  }

  public async updateTotal(column: string, incrementValue: number): Promise<void> {
    const docRef = doc(
      this.firestore,
      Collections.Users,
      this.userStore.uid!,
      Collections.JobBoards,
      this.userStore.currentJobBoard!,
      Collections.Columns,
      column
    ).withConverter(columnConverter);

    await updateDoc(docRef, { total: increment(incrementValue) });
  }

  public get columnQuery(): Query<Column> {
    return query(this.columnsCollection, orderBy('sortOrder', 'asc'));
  }

  private get columnsCollection(): CollectionReference<Column> {
    return collection(
      this.firestore,
      Collections.Users,
      this.userStore.uid!,
      Collections.JobBoards,
      this.userStore.currentJobBoard!,
      Collections.Columns
    ).withConverter(columnConverter);
  }
}
