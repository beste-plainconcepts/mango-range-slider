import { getNextFixedValue } from '.';

describe('getNextFixedValue', () => {
  it('gets next fixed value by direction', () => {
    const values = [1.99, 5.99, 10.99, 30.99];
    expect(getNextFixedValue(5.99, values, 1)).toBe(10.99);
    expect(getNextFixedValue(5.99, values, -1)).toBe(1.99);
    expect(getNextFixedValue(1.99, values, -1)).toBe(1.99);
    expect(getNextFixedValue(30.99, values, 1)).toBe(30.99);
  });

  it('returns closest value when current value is not present', () => {
    const values = [1.99, 5.99, 10.99, 30.99];
    expect(getNextFixedValue(7, values, 1)).toBe(5.99);
  });

  it('returns current value for an empty fixed values list', () => {
    expect(getNextFixedValue(7, [], 1)).toBe(7);
  });
});