import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { JobBoard } from '~models/job-board.model';

export class UserData {
  public currentJobBoard: JobBoard | null;
  public uid: string | null;

  constructor(doc: QueryDocumentSnapshot<DocumentData>) {
    const data = doc.data() as UserData;

    this.currentJobBoard = data.currentJobBoard;
    this.uid = doc.id;
  }
}
