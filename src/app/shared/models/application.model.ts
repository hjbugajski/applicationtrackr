import { DocumentData, QueryDocumentSnapshot, Timestamp } from '@angular/fire/firestore';

import { ApplicationDoc, ApplicationOffer } from '~interfaces/application-doc.interface';

export class Application {
  public columnDocId: string;
  public company: string;
  public compensation: number | null;
  public date: Timestamp;
  public docId: string;
  public link: string | null;
  public location: string | null;
  public offer: ApplicationOffer | null;
  public payPeriod: string | null;
  public position: string;

  constructor(doc: QueryDocumentSnapshot<DocumentData>) {
    const data = doc.data() as ApplicationDoc;

    this.columnDocId = data.columnDocId;
    this.company = data.company;
    this.compensation = data.compensation;
    this.date = data.date;
    this.docId = doc.id;
    this.link = data.link;
    this.location = data.location;
    this.offer = data.offer;
    this.payPeriod = data.payPeriod;
    this.position = data.position;
  }
}
