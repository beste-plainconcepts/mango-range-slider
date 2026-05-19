export type RangeValues = {
  min: number;
  max: number;
};

export const RANGE_VARIANTS = {
  CONTINUOUS: 'continuous',
  FIXED: 'fixed',
} as const;

export type RangeVariant = (typeof RANGE_VARIANTS)[keyof typeof RANGE_VARIANTS];

export type FixedRangeValues = {
  rangeValues: number[];
};

export type RangeSelection = {
  min: number;
  max: number;
};
