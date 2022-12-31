import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'timestampDate'
})
export class TimestampDatePipe implements PipeTransform {
  transform(timestamp: Timestamp): string {
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  }
}
