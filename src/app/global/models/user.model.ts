import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { UserDoc, UserSettings } from '~interfaces/user-doc.interface';

export class User {
  public currentJobBoard: string | null;
  public settings: UserSettings | null;
  public uid: string | null;

  constructor(doc: QueryDocumentSnapshot<DocumentData>) {
    const data = doc.data() as UserDoc;

    this.currentJobBoard = data?.currentJobBoard;
    this.settings = data?.settings;
    this.uid = doc.id;
  }
}
