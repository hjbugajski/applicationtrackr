import { EventEmitter, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionChanges,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  increment,
  orderBy,
  Query,
  query,
  updateDoc
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { Collections } from '~enums/collections.enum';
import { ColumnDoc } from '~interfaces/column-doc.interface';
import { Sort } from '~interfaces/sort.interface';
import { Column } from '~models/column.model';
import { UserStore } from '~store/user.store';
import { columnConverter } from '~utils/firestore-converters';

@Injectable({
  providedIn: 'root'
})
export class ColumnsService {
  public columnIds$: BehaviorSubject<string[]>;
  public columns$: Observable<Column[]>;
  public reloadColumns$: EventEmitter<void>;

  private subscription: Subscription;

  constructor(private firestore: Firestore, private userStore: UserStore) {
    this.columnIds$ = new BehaviorSubject<string[]>([]);
    this.columns$ = new Observable<Column[]>();
    this.reloadColumns$ = new EventEmitter<void>();
    this.subscription = new Subscription();
  }

  public async createColumn(columnDoc: ColumnDoc, boardId = this.userStore.currentJobBoard!): Promise<void> {
    await addDoc(this.getCollectionRef(boardId), columnDoc).catch((error) => {
      throw error;
    });
  }

  public async deleteColumn(docId: string): Promise<void> {
    await deleteDoc(this.getDocRef(docId)).catch((error) => {
      throw error;
    });
  }

  public initColumns(): void {
    this.columns$ = collectionData(this.columnQuery);
    this.subscription = collectionChanges(this.columnQuery, {
      events: ['added', 'removed']
    }).subscribe((changes) => {
      changes.forEach((change) => {
        const newColumn = change.doc.id;

        if (change.type === 'added') {
          const columns = this.columnIds$.getValue();

          columns.push(newColumn);
          this.columnIds$.next(columns);
        } else {
          // removed
          const tempColumns = this.columnIds$.getValue();
          const columns: string[] = [];

          tempColumns.forEach((column) => {
            if (column !== change.doc.id) {
              columns.push(column);
            }
          });

          this.columnIds$.next(columns);
        }
      });
    });
  }

  public resetColumns(): void {
    this.columnIds$ = new BehaviorSubject<string[]>([]);
    this.columns$ = new Observable<Column[]>();
    this.subscription.unsubscribe();
  }

  public async updateApplicationSort(columnId: string, value: Sort): Promise<void> {
    await updateDoc(this.getDocRef(columnId), { applicationSort: value }).catch((error) => {
      throw error;
    });
  }

  public async updateColumn(columnId: string, columnDoc: ColumnDoc): Promise<void> {
    await updateDoc(this.getDocRef(columnId), {
      color: columnDoc.color,
      sortOrder: columnDoc.sortOrder,
      title: columnDoc.title
    }).catch((error) => {
      throw error;
    });
  }

  public async updateSortOrder(columnId: string, value: number): Promise<void> {
    await updateDoc(this.getDocRef(columnId), { sortOrder: value }).catch((error) => {
      throw error;
    });
  }

  public async updateTotal(columnId: string, incrementValue: number): Promise<void> {
    await updateDoc(this.getDocRef(columnId), { total: increment(incrementValue) }).catch((error) => {
      throw error;
    });
  }

  public get columnQuery(): Query<Column> {
    return query(this.getCollectionRef().withConverter(columnConverter), orderBy('sortOrder', 'asc'));
  }

  private getCollectionRef(boardId = this.userStore.currentJobBoard!): CollectionReference<DocumentData> {
    return collection(
      this.firestore,
      Collections.Users,
      this.userStore.uid!,
      Collections.JobBoards,
      boardId,
      Collections.Columns
    );
  }

  private getDocRef(column: string): DocumentReference<DocumentData> {
    return doc(
      this.firestore,
      Collections.Users,
      this.userStore.uid!,
      Collections.JobBoards,
      this.userStore.currentJobBoard!,
      Collections.Columns,
      column
    );
  }
}
