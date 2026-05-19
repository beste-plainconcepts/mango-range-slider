import type { ReactNode, RefObject } from 'react';

type RangeTrackProps = {
  minPercent: number;
  maxPercent: number;
  trackRef: RefObject<HTMLDivElement | null>;
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  children: ReactNode;
};

export function RangeTrack({ minPercent, maxPercent, trackRef, onPointerDown, children }: RangeTrackProps) {
  return (
    <div className="relative w-full py-5">
      <div
        ref={trackRef}
        data-testid="range-track"
        className="relative h-8 w-full touch-none cursor-pointer"
        onPointerDown={onPointerDown}
      >
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#e6e0d6]" />
        <div
          className="absolute top-1/2 h-px -translate-y-1/2 bg-[#111111]"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(maxPercent - minPercent, 0)}%`,
          }}
        />
        {children}
      </div>
    </div>
  );
}
