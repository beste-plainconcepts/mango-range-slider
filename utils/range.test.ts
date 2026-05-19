import {
  clamp,
  getClosestFixedValue,
  getNextFixedValue,
  percentToValue,
  sortedUniqueValues,
  valueToPercent,
} from '@/utils/range';

describe('range utilities', () => {
  it('clamps values in range boundaries', () => {
    expect(clamp(5, 1, 10)).toBe(5);
    expect(clamp(-10, 1, 10)).toBe(1);
    expect(clamp(100, 1, 10)).toBe(10);
  });

  it('converts value and percent consistently', () => {
    expect(valueToPercent(50, 0, 100)).toBe(50);
    expect(percentToValue(50, 0, 100)).toBe(50);
    expect(percentToValue(valueToPercent(30, 10, 50), 10, 50)).toBeCloseTo(30);
  });

  it('finds closest fixed value', () => {
    const values = [1.99, 5.99, 10.99, 30.99];
    expect(getClosestFixedValue(6.2, values)).toBe(5.99);
    expect(getClosestFixedValue(22, values)).toBe(30.99);
  });

  it('gets next fixed value by direction', () => {
    const values = [1.99, 5.99, 10.99, 30.99];
    expect(getNextFixedValue(5.99, values, 1)).toBe(10.99);
    expect(getNextFixedValue(5.99, values, -1)).toBe(1.99);
    expect(getNextFixedValue(1.99, values, -1)).toBe(1.99);
    expect(getNextFixedValue(30.99, values, 1)).toBe(30.99);
  });

  it('sorts and deduplicates fixed values', () => {
    expect(sortedUniqueValues([10.99, 1.99, 5.99, 10.99, 1.99])).toEqual([1.99, 5.99, 10.99]);
    expect(sortedUniqueValues([])).toEqual([]);
  });
});
