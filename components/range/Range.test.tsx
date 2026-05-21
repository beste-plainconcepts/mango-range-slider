import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Range } from '@/components/range/Range';

function mockTrackRect() {
  const track = screen.getByTestId('range-track');
  Object.defineProperty(track, 'getBoundingClientRect', {
    value: () => ({
      left: 0,
      width: 100,
      right: 100,
      top: 0,
      bottom: 10,
      height: 10,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }),
  });
}

describe('Range', () => {
  it('renders initial values', () => {
    render(<Range min={1} max={100} />);

    expect(screen.getByTestId('min-label')).toHaveTextContent('1');
    expect(screen.getByTestId('max-label')).toHaveTextContent('100');
  });

  it('shows euro formatting in continuous labels and tooltips', () => {
    render(<Range min={1} max={100} />);

    expect(screen.getByTestId('min-label')).toHaveTextContent('€');
    expect(screen.getByTestId('max-label')).toHaveTextContent('€');
    expect(screen.getByTestId('minimum-tooltip')).toHaveTextContent('€');
    expect(screen.getByTestId('maximum-tooltip')).toHaveTextContent('€');
  });

  it('exposes slider accessibility attributes', () => {
    render(<Range min={1} max={100} />);

    const minThumb = screen.getByTestId('minimum-thumb');
    const maxThumb = screen.getByTestId('maximum-thumb');

    expect(minThumb).toHaveAttribute('role', 'slider');
    expect(minThumb).toHaveAttribute('aria-valuemin', '1');
    expect(minThumb).toHaveAttribute('aria-valuemax', '100');
    expect(minThumb).toHaveAttribute('aria-valuenow', '1');

    expect(maxThumb).toHaveAttribute('role', 'slider');
    expect(maxThumb).toHaveAttribute('aria-valuemin', '1');
    expect(maxThumb).toHaveAttribute('aria-valuemax', '100');
    expect(maxThumb).toHaveAttribute('aria-valuenow', '100');
  });

  it('supports keyboard arrows on thumbs', async () => {
    render(<Range min={1} max={100} />);

    const minThumb = screen.getByTestId('minimum-thumb');
    minThumb.focus();

    fireEvent.keyDown(minThumb, { key: 'ArrowRight' });

    await waitFor(() => {
      expect(minThumb).toHaveAttribute('aria-valuenow', '2');
    });
  });

  it('prevents min from crossing max', async () => {
    render(<Range min={1} max={10} />);
    mockTrackRect();

    const maxThumb = screen.getByTestId('maximum-thumb');
    fireEvent.pointerDown(maxThumb, { pointerId: 1, clientX: 40 });
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 40 });
    fireEvent.pointerUp(window, { pointerId: 1 });

    const minThumb = screen.getByTestId('minimum-thumb');
    fireEvent.pointerDown(minThumb, { pointerId: 2, clientX: 90 });
    fireEvent.pointerMove(window, { pointerId: 2, clientX: 90 });
    fireEvent.pointerUp(window, { pointerId: 2 });

    await waitFor(() => {
      const minValue = Number(minThumb.getAttribute('aria-valuenow'));
      const maxValue = Number(maxThumb.getAttribute('aria-valuenow'));
      expect(minValue).toBeLessThanOrEqual(maxValue);
    });
  });

  it('prevents max from crossing min', async () => {
    render(<Range min={1} max={10} />);
    mockTrackRect();

    const minThumb = screen.getByTestId('minimum-thumb');
    fireEvent.pointerDown(minThumb, { pointerId: 1, clientX: 60 });
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 60 });
    fireEvent.pointerUp(window, { pointerId: 1 });

    const maxThumb = screen.getByTestId('maximum-thumb');
    fireEvent.pointerDown(maxThumb, { pointerId: 2, clientX: 10 });
    fireEvent.pointerMove(window, { pointerId: 2, clientX: 10 });
    fireEvent.pointerUp(window, { pointerId: 2 });

    await waitFor(() => {
      const minValue = Number(minThumb.getAttribute('aria-valuenow'));
      const maxValue = Number(maxThumb.getAttribute('aria-valuenow'));
      expect(maxValue).toBeGreaterThanOrEqual(minValue);
    });
  });

  it('updates values from pointer dragging in continuous mode', async () => {
    render(<Range min={1} max={100} />);
    mockTrackRect();

    const minThumb = screen.getByTestId('minimum-thumb');
    fireEvent.pointerDown(minThumb, { pointerId: 1, clientX: 70 });
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 70 });
    fireEvent.pointerUp(window, { pointerId: 1 });

    await waitFor(() => {
      expect(Number(minThumb.getAttribute('aria-valuenow'))).toBeGreaterThan(1);
    });
  });

  it('moves the nearest thumb when clicking the track', async () => {
    render(<Range min={1} max={100} />);
    mockTrackRect();

    const track = screen.getByTestId('range-track');
    const minThumb = screen.getByTestId('minimum-thumb');
    const maxThumb = screen.getByTestId('maximum-thumb');

    fireEvent.pointerDown(track, { pointerId: 3, clientX: 75 });
    fireEvent.pointerMove(window, { pointerId: 3, clientX: 75 });
    fireEvent.pointerUp(window, { pointerId: 3 });

    await waitFor(() => {
      expect(Number(maxThumb.getAttribute('aria-valuenow'))).toBeLessThan(100);
      expect(Number(minThumb.getAttribute('aria-valuenow'))).toBe(1);
    });
  });

  it('allows editing input values and clamps boundaries', async () => {
    render(<Range min={1} max={100} />);

    fireEvent.click(screen.getByTestId('min-label'));
    const input = screen.getByTestId('min-input');
    fireEvent.change(input, { target: { value: '-20' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByTestId('min-label')).toHaveTextContent('1');
    });
  });

  it('normalizes when max is set below current min', async () => {
    render(<Range min={1} max={100} />);

    fireEvent.click(screen.getByTestId('min-label'));
    const minInput = screen.getByTestId('min-input');
    fireEvent.change(minInput, { target: { value: '50' } });
    fireEvent.blur(minInput);

    await waitFor(() => {
      expect(screen.getByTestId('min-label')).toHaveTextContent('50');
    });

    fireEvent.click(screen.getByTestId('max-label'));
    const maxInput = screen.getByTestId('max-input');
    fireEvent.change(maxInput, { target: { value: '25' } });
    fireEvent.blur(maxInput);

    await waitFor(() => {
      expect(screen.getByTestId('max-label')).toHaveTextContent('25');
      expect(screen.getByTestId('min-label')).toHaveTextContent('25');
    });
  });

  it('rounds floating point input to the nearest integer', async () => {
    render(<Range min={1} max={100} />);

    fireEvent.click(screen.getByTestId('min-label'));
    const input = screen.getByTestId('min-input');
    fireEvent.change(input, { target: { value: '33.7' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByTestId('min-label')).toHaveTextContent('34');
    });
  });

  it('restores the previous value when non-numeric input is entered', async () => {
    render(<Range min={1} max={100} />);

    fireEvent.click(screen.getByTestId('min-label'));
    const input = screen.getByTestId('min-input');
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByTestId('min-label')).toHaveTextContent('1');
    });
  });
});
