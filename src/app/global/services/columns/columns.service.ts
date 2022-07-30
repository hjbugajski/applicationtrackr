import { EventEmitter, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionChanges,
  CollectionReference,
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
import { BehaviorSubject, Subscription } from 'rxjs';

import { Collections } from '~enums/collections.enum';
import { ReferenceTypes } from '~enums/reference-types.enum';
import { ColumnDoc } from '~interfaces/column-doc.interface';
import { Column } from '~models/column.model';
import { FirebaseFunctionsService } from '~services/firebase-functions/firebase-functions.service';
import { UserStore } from '~store/user.store';
import { columnConverter } from '~utils/firestore-converters';

@Injectable({
  providedIn: 'root'
})
export class ColumnsService {
  public columns$: BehaviorSubject<Column[]>;
  public reloadColumns$: EventEmitter<void>;

  private columnsSubscription: Subscription;

  constructor(
    private firebaseFunctionsService: FirebaseFunctionsService,
    private firestore: Firestore,
    private userStore: UserStore
  ) {
    this.columns$ = new BehaviorSubject<Column[]>([]);
    this.columnsSubscription = new Subscription();
    this.reloadColumns$ = new EventEmitter<void>();
  }

  public async createColumn(columnDoc: ColumnDoc, boardId = this.userStore.currentJobBoard!): Promise<void> {
    await addDoc(this.getCollectionRef(boardId), columnDoc).catch((error) => {
      throw error;
    });
  }

  public async deleteColumn(docId: string): Promise<void> {
    await this.firebaseFunctionsService
      .recursiveDelete(
        `${Collections.JobBoards}/${this.userStore.currentJobBoard!}/${Collections.Columns}/${docId}`,
        ReferenceTypes.Doc
      )
      .catch((error) => {
        throw error;
      });
  }

  public initColumns(): void {
    this.columnsSubscription = collectionChanges(this.columnQuery, {
      events: ['added', 'modified', 'removed']
    }).subscribe((changes) => {
      changes.forEach((change) => {
        const newColumn = change.doc.data();

        if (change.type === 'added') {
          const columns = this.columns$.getValue();

          columns.push(newColumn);
          this.columns$.next(columns);
        } else if (change.type === 'modified') {
          // const tempColumns = this.columns$.getValue();
          // if (tempColumns[change.oldIndex].sortOrder !== newColumn.sortOrder) {
          //   tempColumns[change.oldIndex] = newColumn;
          //   this.columns$.next(tempColumns.sort((a, b) => a.sortOrder - b.sortOrder));
          // }
        } else {
          // removed
          const tempColumns = this.columns$.getValue();
          const columns: Column[] = [];

          tempColumns.forEach((column) => {
            if (column.docId !== change.doc.id) {
              columns.push(column);
            }
          });

          this.columns$.next(columns);
        }
      });
    });
  }

  public resetColumns(): void {
    this.columns$ = new BehaviorSubject<Column[]>([]);
    this.columnsSubscription.unsubscribe();
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

  public async updateSortOrder(column: string, value: number): Promise<void> {
    await updateDoc(this.getDocRef(column), { sortOrder: value });
  }

  public async updateTotal(column: string, incrementValue: number): Promise<void> {
    await updateDoc(this.getDocRef(column), { total: increment(incrementValue) });
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
