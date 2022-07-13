import { Timestamp } from '@angular/fire/firestore';

export interface JobBoardDoc {
  date: Timestamp | null;
  title: string | null;
}
