import { getClosestFixedValue } from '.';

describe('getClosestFixedValue', () => {
  it('finds the closest fixed value', () => {
    const values = [1.99, 5.99, 10.99, 30.99];
    expect(getClosestFixedValue(6.2, values)).toBe(5.99);
    expect(getClosestFixedValue(22, values)).toBe(30.99);
  });

  it('returns the input value for an empty fixed values list', () => {
    expect(getClosestFixedValue(7, [])).toBe(7);
  });
});