import { NextResponse } from 'next/server';

import type { FixedRangeValues } from '@/types/range';

const fixedRangeData: FixedRangeValues = {
  rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
};

export async function GET() {
  return NextResponse.json(fixedRangeData);
}
