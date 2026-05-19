import { sortedUniqueValues } from '.';

describe('sortedUniqueValues', () => {
  it('sorts and deduplicates fixed values', () => {
    expect(sortedUniqueValues([10.99, 1.99, 5.99, 10.99, 1.99])).toEqual([1.99, 5.99, 10.99]);
    expect(sortedUniqueValues([])).toEqual([]);
  });
});
