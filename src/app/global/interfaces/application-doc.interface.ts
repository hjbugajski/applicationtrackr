import { Timestamp } from '@angular/fire/firestore';

export interface ApplicationDoc {
  columnDocId: string;
  company: string;
  compensation: number | null;
  date: Timestamp;
  link: string | null;
  location: string | null;
  payPeriod: string | null;
  position: string;
}
