import { Timestamp } from '@firebase/firestore';

export interface ApplicationDoc {
  company: string;
  date: Timestamp;
  link: string;
  location: string;
  position: string;
}
