import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'dayDifference'
})
export class DayDifferencePipe implements PipeTransform {
  public transform(value: Timestamp): string {
    const diff = Math.floor((Date.now() - value.toMillis()) / (1000 * 3600 * 24));

    if (diff < 1) {
      return 'Less than a day ago';
    } else if (diff >= 1 && diff < 365) {
      return `${diff} day${diff === 1 ? '' : 's'} ago`;
    } else {
      return 'More than a year ago';
    }
  }
}
