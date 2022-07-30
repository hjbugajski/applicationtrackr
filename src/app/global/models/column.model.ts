import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

export class Column {
  public color: string;
  public docId: string;
  public sortOrder: number;
  public title: string;
  public total: number;

  constructor(doc: QueryDocumentSnapshot<DocumentData>) {
    const data = doc.data() as Column;

    this.color = data.color;
    this.docId = doc.id;
    this.sortOrder = data.sortOrder;
    this.title = data.title;
    this.total = data.total;
  }
}
