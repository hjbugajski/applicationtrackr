import { TimestampDatePipe } from './timestamp-date.pipe';

describe('DatePipe', () => {
  it('create an instance', () => {
    const pipe = new TimestampDatePipe();
    expect(pipe).toBeTruthy();
  });
});
