import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, Firestore, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Collections } from '~enums/collections.enum';
import { Column } from '~models/column.model';
import { UserDataQuery } from '~state/user-data/user-data.query';
import { columnConverter } from '~utils/firestore-converters';

@Injectable({
  providedIn: 'root'
})
export class ColumnsService {
  public columns: Observable<Column[]> | undefined;

  constructor(private firestore: Firestore, private userDataQuery: UserDataQuery) {}

  public initColumns(): void {
    this.columns = collectionData(query(this.columnsCollection, orderBy('sortOrder', 'asc')));
  }

  public resetColumns(): void {
    this.columns = new Observable<Column[]>();
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
