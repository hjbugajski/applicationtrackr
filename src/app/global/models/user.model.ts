import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { UserDoc } from '~interfaces/user-doc.interface';

export class User {
  public currentJobBoard: string | null;
  public uid: string | null;

  constructor(doc: QueryDocumentSnapshot<DocumentData>) {
    const data = doc.data() as UserDoc;

    this.currentJobBoard = data?.currentJobBoard;
    this.uid = doc.id;
  }
}