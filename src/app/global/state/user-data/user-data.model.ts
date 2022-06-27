import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

export class UserData {
  public currentJobBoard: string | null;
  public uid: string | null;

  constructor(doc: QueryDocumentSnapshot<DocumentData>) {
    const data = doc.data() as UserData;

    this.currentJobBoard = data.currentJobBoard;
    this.uid = doc.id;
  }
}
