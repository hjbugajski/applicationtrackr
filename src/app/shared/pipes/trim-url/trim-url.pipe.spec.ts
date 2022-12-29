import { TrimUrlPipe } from './trim-url.pipe';

describe('TrimPipe', () => {
  it('create an instance', () => {
    const pipe = new TrimUrlPipe();
    expect(pipe).toBeTruthy();
  });
});
