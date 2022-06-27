import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { UserDoc } from '~interfaces/user-doc.interface';
import { JobBoard } from '~models/job-board.model';

export class UserData {
  public currentJobBoard: JobBoard | null;
  public uid: string | null;

  constructor(doc: QueryDocumentSnapshot<DocumentData>) {
    const data = doc.data() as UserDoc;

    this.currentJobBoard = data?.currentJobBoard;
    this.uid = doc.id;
  }
}
