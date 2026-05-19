import { Range } from '@/components/range/Range';
import { RangeHeader } from '@/components/range/components/RangeHeader';
import { fetchRange } from '@/components/range/services/range';

export default async function Exercise1Page() {
  const { min, max } = await fetchRange();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <section className="w-full max-w-3xl rounded-2xl border border-[#e6e0d6] bg-[#faf7f2] p-12 shadow-sm">
        <RangeHeader
          subtitle="Exercise 01 - Range"
          title="Normal range"
          description="Drag the handles or click the values below to define the interval."
        />
        <Range min={min} max={max} />
      </section>
    </main>
  );
}
