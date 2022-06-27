import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  CollectionReference,
  doc,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Collections } from '~enums/collections.enum';
import { Updates } from '~enums/updates.enum';
import { Column } from '~models/column.model';
import { UserDataQuery } from '~state/user-data/user-data.query';
import { columnConverter } from '~utils/firestore-converters';

@Injectable({
  providedIn: 'root'
})
export class ColumnsService {
  public columns: Observable<Column[]> | undefined;
  public columnsIds!: string[];

  constructor(private firestore: Firestore, private userDataQuery: UserDataQuery) {}

  public async initColumns(): Promise<void> {
    this.columns = collectionData(query(this.columnsCollection, orderBy('sortOrder', 'asc')));
    const snapshot = await getDocs(query(this.columnsCollection, orderBy('sortOrder', 'asc')));

    snapshot.forEach((doc) => {
      this.columnsIds.push(doc.id);
    });
  }

  public resetColumns(): void {
    this.columns = new Observable<Column[]>();
    this.columnsIds = [];
  }

  public async updateTotal(column: string, update: Updates): Promise<void> {
    const docRef = doc(
      this.firestore,
      Collections.Users,
      this.userDataQuery.uid!,
      Collections.JobBoards,
      this.userDataQuery.currentJobBoard!.docId!,
      Collections.Columns,
      column
    ).withConverter(columnConverter);
    const docSnap = await getDoc(docRef);
    const newTotal = update === Updates.Add ? docSnap.data()!.total + 1 : docSnap.data()!.total - 1;

    await updateDoc(docRef, { total: newTotal });
  }

  private get columnsCollection(): CollectionReference<Column> {
    return collection(
      this.firestore,
      Collections.Users,
      this.userDataQuery.uid!,
      Collections.JobBoards,
      this.userDataQuery.currentJobBoard!.docId!,
      Collections.Columns
    ).withConverter(columnConverter);
  }
}
