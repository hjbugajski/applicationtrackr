import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  doc,
  Firestore,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Collections } from '~enums/collections.enum';
import { Column } from '~models/column.model';
import { UserStore } from '~store/user.store';
import { columnConverter } from '~utils/firestore-converters';

@Injectable({
  providedIn: 'root'
})
export class ColumnsService {
  public columns: Column[];
  public columns$: Observable<Column[]>;
  public columnsIds: string[];

  constructor(private firestore: Firestore, private userStore: UserStore) {
    this.columns = [];
    this.columns$ = new Observable<Column[]>();
    this.columnsIds = [];
  }

  public async initColumns(): Promise<void> {
    this.columns$ = collectionData(query(this.columnsCollection, orderBy('sortOrder', 'asc')));
    const snapshot = await getDocs(query(this.columnsCollection, orderBy('sortOrder', 'asc')));

    snapshot.forEach((doc) => {
      this.columns.push(doc.data());
      this.columnsIds.push(doc.id);
    });
  }

  public resetColumns(): void {
    this.columns = [];
    this.columns$ = new Observable<Column[]>();
    this.columnsIds = [];
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
