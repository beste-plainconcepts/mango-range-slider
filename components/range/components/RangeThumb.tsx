type RangeThumbProps = {
  value: number;
  percent: number;
  dragging: boolean;
  label: string;
  min: number;
  max: number;
  tooltip: string;
  onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
};

export function RangeThumb({
  value,
  percent,
  dragging,
  label,
  min,
  max,
  tooltip,
  onPointerDown,
  onKeyDown,
}: RangeThumbProps) {
  return (
    <>
      <span
        data-testid={`${label}-tooltip`}
        className="pointer-events-none absolute top-[calc(50%-16px)] -translate-y-full whitespace-nowrap rounded-full border border-[#bfd1ef] bg-white px-2.5 py-0.5 text-sm font-semibold leading-5 text-[#2a67d1] shadow-[0_6px_14px_rgba(42,103,209,0.14)]"
        style={{
          left: `${percent}%`,
          transform: 'translate(-50%, -50%)',
        }}
        aria-hidden="true"
      >
        {tooltip}
      </span>
      <span
        className="pointer-events-none absolute top-[calc(50%-3px)] h-2 w-2 rotate-45 border-b border-r border-[#bfd1ef] bg-white"
        style={{
          left: `${percent}%`,
          transform: 'translate(-50%, -50%)',
        }}
        aria-hidden="true"
      />
      <button
        type="button"
        data-testid={`${label}-thumb`}
        role="slider"
        aria-label={label}
        aria-orientation="horizontal"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={tooltip}
        className="absolute top-[calc(50%+0.5px)] h-5.5 w-5.5 rounded-full border border-[#111111] bg-[#faf7f2] shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition duration-150 ease-out hover:scale-110 hover:shadow-[0_0_0_6px_rgba(17,17,17,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2"
        style={{
          left: `${percent}%`,
          transform: 'translate(-50%, -50%)',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      />
    </>
  );
}
