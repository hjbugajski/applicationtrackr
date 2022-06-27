import { Timestamp } from '@firebase/firestore';

export interface JobBoardDoc {
  date: Timestamp | null;
  title: string | null;
}
