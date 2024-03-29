import { Timestamp } from '@angular/fire/firestore';

export function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

export function timestampToDate(timestamp: Timestamp): Date {
  return new Date(timestamp.seconds * 1000);
}
