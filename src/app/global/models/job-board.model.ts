import { DocumentData, QueryDocumentSnapshot, Timestamp } from '@angular/fire/firestore';

import { JobBoardDoc } from '~interfaces/job-board-doc.interface';

export class JobBoard {
  public date: Timestamp;
  public docId: string;
  public title: string;
  public total: number;

  constructor(doc: QueryDocumentSnapshot<DocumentData>) {
    const data = doc.data() as JobBoardDoc;

    this.date = data.date;
    this.docId = doc.id;
    this.title = data.title;
    this.total = data.total;
  }
}
