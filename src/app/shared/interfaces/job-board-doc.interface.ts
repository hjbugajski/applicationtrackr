import { Timestamp } from '@angular/fire/firestore';

export interface JobBoardDoc {
  date: Timestamp;
  title: string;
}
