import { Pipe, PipeTransform } from '@angular/core';

const trimUrlRegex = /^http:\/\/www\.|^https:\/\/www\.|^http:\/\/|^https:\/\//;

@Pipe({
  name: 'trimUrl'
})
export class TrimUrlPipe implements PipeTransform {
  transform(value: string, end = 25): string {
    const trimmed = value.replace(trimUrlRegex, '');

    return trimmed.length > end ? trimmed.substring(0, end) + '...' : trimmed;
  }
}
