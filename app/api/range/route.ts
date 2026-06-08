import { NextResponse } from 'next/server';

import type { RangeValues } from '@/types/range';

const rangeData: RangeValues = {
  min: 1,
  max: 100,
};

export async function GET() {
  return NextResponse.json(rangeData);
}
