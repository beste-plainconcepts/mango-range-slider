import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="space-y-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8c8579]">Component - Range</p>
        <h1 className="font-editorial-serif text-5xl font-normal leading-none tracking-tight text-[#111111]">
          Mango Range Slider
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-600">
          Explore both implementations of a custom dual-handle range component with the same editorial visual system.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/exercise1"
          className="rounded-xl border border-[#e6e0d6] bg-[#faf7f2] p-6 transition-colors hover:bg-[#f3eee6]"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8c8579]">Exercise 01</p>
          <h2 className="mt-3 font-editorial-serif text-4xl font-normal leading-none tracking-tight text-[#111111]">
            Normal range
          </h2>
          <p className="mt-4 text-sm text-zinc-600">Continuous range with editable min/max labels.</p>
        </Link>
        <Link
          href="/exercise2"
          className="rounded-xl border border-[#e6e0d6] bg-[#faf7f2] p-6 transition-colors hover:bg-[#f3eee6]"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8c8579]">Exercise 02</p>
          <h2 className="mt-3 font-editorial-serif text-4xl font-normal leading-none tracking-tight text-[#111111]">
            Fixed values
          </h2>
          <p className="mt-4 text-sm text-zinc-600">Fixed-value currency range with discrete steps.</p>
        </Link>
      </section>

      <p className="text-xs uppercase tracking-[0.2em] text-[#8c8579]">
        API mocks are available at <code>/api/range</code> and <code>/api/fixed-range</code>.
      </p>
    </main>
  );
}
