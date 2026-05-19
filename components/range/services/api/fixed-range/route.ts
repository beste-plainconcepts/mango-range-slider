import { fetchFixedRange } from '@/components/range/services/range';

export async function GET() {
  const data = await fetchFixedRange();
  return Response.json(data);
}
