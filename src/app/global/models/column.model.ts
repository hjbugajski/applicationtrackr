import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

export class Column {
  public color?: string | null;
  public docId: string;
  public sortOrder: number;
  public title: string;

  constructor(doc: QueryDocumentSnapshot<DocumentData>) {
    const data = doc.data() as Column;

    this.color = data.color ?? null;
    this.docId = doc.id;
    this.sortOrder = data.sortOrder;
    this.title = data.title;
  }
}
