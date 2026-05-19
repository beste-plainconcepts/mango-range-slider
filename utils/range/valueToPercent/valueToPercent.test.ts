import { valueToPercent } from '.';

describe('valueToPercent', () => {
  it('converts values to percent', () => {
    expect(valueToPercent(50, 0, 100)).toBe(50);
    expect(valueToPercent(30, 10, 50)).toBe(50);
  });

  it('returns 0 when max is less than or equal to min', () => {
    expect(valueToPercent(10, 10, 10)).toBe(0);
  });
});
