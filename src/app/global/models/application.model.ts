import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Timestamp } from '@firebase/firestore';

import { ApplicationDoc } from '~interfaces/application-doc.interface';

export class Application {
  public columnDocId: string;
  public company: string;
  public date: Timestamp;
  public docId: string;
  public link: string | null;
  public location: string | null;
  public position: string;
  public salary: number | null;

  constructor(doc: QueryDocumentSnapshot<DocumentData>) {
    const data = doc.data() as ApplicationDoc;

    this.columnDocId = data.columnDocId;
    this.company = data.company;
    this.date = data.date;
    this.docId = doc.id;
    this.link = data.link;
    this.location = data.location;
    this.position = data.position;
    this.salary = data.salary;
  }
}
