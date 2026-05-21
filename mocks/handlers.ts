import { http, HttpResponse } from 'msw';

import type { FixedRangeValues, RangeValues } from '@/types/range';

const rangeData: RangeValues = {
  min: 1,
  max: 100,
};

const fixedRangeData: FixedRangeValues = {
  rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
};

export const handlers = [
  http.get('http://localhost:8080/api/range', () => {
    return HttpResponse.json(rangeData);
  }),

  http.get('http://localhost:8080/api/fixed-range', () => {
    return HttpResponse.json(fixedRangeData);
  }),
];
