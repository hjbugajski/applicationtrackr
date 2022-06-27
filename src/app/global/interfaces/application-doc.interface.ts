import { Timestamp } from '@firebase/firestore';

export interface ApplicationDoc {
  columnDocId: string;
  company: string;
  date: Timestamp;
  link: string | null;
  location: string | null;
  position: string;
  salary: number | null;
}
