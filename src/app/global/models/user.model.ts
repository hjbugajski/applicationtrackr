import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { Themes } from '~enums/themes.enum';
import { UserDoc } from '~interfaces/user-doc.interface';

export class User {
  public appearance: Themes | string | null;
  public currentJobBoard: string | null;
  public uid: string | null;

  constructor(doc: QueryDocumentSnapshot<DocumentData>) {
    const data = doc.data() as UserDoc;

    this.appearance = data?.appearance;
    this.currentJobBoard = data?.currentJobBoard;
    this.uid = doc.id;
  }
}
