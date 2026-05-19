import { Range } from '@/components/range/Range';
import { RangeHeader } from '@/components/range/components/RangeHeader';
import { fetchFixedRange } from '@/components/range/services/range';
import { RANGE_VARIANTS } from '@/types/range';

export default async function Exercise2Page() {
  const { rangeValues } = await fetchFixedRange();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <section className="w-full max-w-3xl rounded-2xl border border-[#e6e0d6] bg-[#faf7f2] p-12 shadow-sm">
        <RangeHeader
          subtitle="Exercise 02 - Range"
          title="Fixed values"
          description="Values snap to predefined currency points."
        />
        <Range variant={RANGE_VARIANTS.FIXED} values={rangeValues} />
      </section>
    </main>
  );
}
