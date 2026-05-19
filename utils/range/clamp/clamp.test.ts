import { clamp } from '.';

describe('clamp', () => {
  it('clamps values in range boundaries', () => {
    expect(clamp(5, 1, 10)).toBe(5);
    expect(clamp(-10, 1, 10)).toBe(1);
    expect(clamp(100, 1, 10)).toBe(10);
  });
});