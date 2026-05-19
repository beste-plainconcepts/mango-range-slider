type RangeHeaderProps = {
  subtitle: string;
  title: string;
  description: string;
};

export function RangeHeader({ subtitle, title, description }: RangeHeaderProps) {
  return (
    <header className="mb-6">
      <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-[#8c8579]">{subtitle}</p>
      <h2 className="font-editorial-serif text-5xl font-normal leading-none tracking-tight text-[#111111]">{title}</h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-600">{description}</p>
    </header>
  );
}
