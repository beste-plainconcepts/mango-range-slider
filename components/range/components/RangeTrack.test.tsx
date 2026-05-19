import { createRef } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { RangeTrack } from '@/components/range/components/RangeTrack';

describe('RangeTrack', () => {
  it('renders track, selected segment and children', () => {
    const onPointerDown = vi.fn();
    const trackRef = createRef<HTMLDivElement>();

    render(
      <RangeTrack minPercent={20} maxPercent={60} trackRef={trackRef} onPointerDown={onPointerDown}>
        <span data-testid="track-child">Thumbs</span>
      </RangeTrack>,
    );

    const track = screen.getByTestId('range-track');
    const selectedRange = Array.from(track.children).find(
      (child) =>
        child.getAttribute('style')?.includes('left: 20%') && child.getAttribute('style')?.includes('width: 40%'),
    );

    expect(track).toBeTruthy();
    expect(screen.queryByTestId('track-child')).toBeTruthy();
    expect(selectedRange).toBeTruthy();
    expect(trackRef.current).toBe(track);
  });

  it('forwards pointer down events from track', () => {
    const onPointerDown = vi.fn();
    const trackRef = createRef<HTMLDivElement>();

    render(
      <RangeTrack minPercent={10} maxPercent={30} trackRef={trackRef} onPointerDown={onPointerDown}>
        <span />
      </RangeTrack>,
    );

    fireEvent.pointerDown(screen.getByTestId('range-track'), { pointerId: 1, clientX: 40 });
    expect(onPointerDown).toHaveBeenCalledTimes(1);
  });
});
