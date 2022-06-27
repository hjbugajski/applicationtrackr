import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Timestamp } from '@firebase/firestore';

export class JobBoard {
  public date: Timestamp | null;
  public docId: string | null;
  public title: string | null;

  constructor(doc: QueryDocumentSnapshot<DocumentData>) {
    const data = doc.data() as JobBoard;

    this.date = data.date;
    this.docId = doc.id;
    this.title = data.title;
  }
}
