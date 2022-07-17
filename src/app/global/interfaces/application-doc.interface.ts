import { Timestamp } from '@angular/fire/firestore';

export interface ApplicationOffer {
  benefits: string | null;
  bonus: number | null;
  compensation: number | null;
  deadline: Timestamp | null;
  notes: string | null;
  payPeriod: string | null;
  pto: string | null;
  startDate: Timestamp | null;
}

export interface ApplicationDoc {
  columnDocId: string;
  company: string;
  compensation: number | null;
  date: Timestamp;
  link: string | null;
  location: string | null;
  offer: ApplicationOffer | null;
  payPeriod: string | null;
  position: string;
}
