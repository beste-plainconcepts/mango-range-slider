import { percentToValue } from '.';
import { valueToPercent } from '../valueToPercent';

describe('percentToValue', () => {
  it('converts percent to value', () => {
    expect(percentToValue(50, 0, 100)).toBe(50);
    expect(percentToValue(50, 10, 50)).toBe(30);
    expect(percentToValue(valueToPercent(30, 10, 50), 10, 50)).toBeCloseTo(30);
  });

  it('returns min when max is less than or equal to min', () => {
    expect(percentToValue(50, 10, 10)).toBe(10);
  });
});
