import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { Sort } from '~interfaces/sort.interface';

export class Column {
  public applicationSort: Sort;
  public color: string;
  public docId: string;
  public sortOrder: number;
  public title: string;

  constructor(doc: QueryDocumentSnapshot<DocumentData>) {
    const data = doc.data() as Column;

    this.applicationSort = data.applicationSort;
    this.color = data.color;
    this.docId = doc.id;
    this.sortOrder = data.sortOrder;
    this.title = data.title;
  }
}
