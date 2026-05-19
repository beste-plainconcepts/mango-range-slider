import type { FixedRangeValues, RangeValues } from '@/types/range';

export async function fetchRange(): Promise<RangeValues> {
  return {
    min: 1,
    max: 100,
  };
}

export async function fetchFixedRange(): Promise<FixedRangeValues> {
  return {
    rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
  };
}
