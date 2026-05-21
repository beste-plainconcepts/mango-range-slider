import type { FixedRangeValues, RangeValues } from '@/types/range';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export async function fetchRange(): Promise<RangeValues> {
  const response = await fetch(`${BASE_URL}/api/range`);
  return response.json();
}

export async function fetchFixedRange(): Promise<FixedRangeValues> {
  const response = await fetch(`${BASE_URL}/api/fixed-range`);
  return response.json();
}
