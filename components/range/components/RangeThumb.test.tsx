import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { RangeThumb } from '@/components/range/components/RangeThumb';

describe('RangeThumb', () => {
  it('renders slider accessibility attributes and position', () => {
    const onPointerDown = vi.fn();
    const onKeyDown = vi.fn();

    render(
      <RangeThumb
        label="minimum"
        value={25}
        percent={40}
        min={1}
        max={100}
        dragging={false}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      />,
    );

    const thumb = screen.getByTestId('minimum-thumb');

    expect(thumb.getAttribute('role')).toBe('slider');
    expect(thumb.getAttribute('aria-label')).toBe('minimum');
    expect(thumb.getAttribute('aria-valuemin')).toBe('1');
    expect(thumb.getAttribute('aria-valuemax')).toBe('100');
    expect(thumb.getAttribute('aria-valuenow')).toBe('25');
    expect(thumb.style.left).toBe('40%');
    expect(thumb.style.cursor).toBe('grab');
  });

  it('switches cursor style while dragging', () => {
    const onPointerDown = vi.fn();
    const onKeyDown = vi.fn();

    render(
      <RangeThumb
        label="maximum"
        value={75}
        percent={60}
        min={1}
        max={100}
        dragging
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      />,
    );

    expect(screen.getByTestId('maximum-thumb').style.cursor).toBe('grabbing');
  });

  it('forwards pointer and keyboard events', () => {
    const onPointerDown = vi.fn();
    const onKeyDown = vi.fn();

    render(
      <RangeThumb
        label="minimum"
        value={25}
        percent={40}
        min={1}
        max={100}
        dragging={false}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      />,
    );

    const thumb = screen.getByTestId('minimum-thumb');
    fireEvent.pointerDown(thumb, { pointerId: 1 });
    fireEvent.keyDown(thumb, { key: 'ArrowRight' });

    expect(onPointerDown).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });
});
