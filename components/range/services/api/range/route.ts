import { fetchRange } from '@/components/range/services/range';

export async function GET() {
  const data = await fetchRange();
  return Response.json(data);
}
