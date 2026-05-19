import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Range } from '@/components/range/Range';

const values = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

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

describe('FixedRange', () => {
  it('renders currency labels', () => {
    render(<Range variant="fixed" values={values} />);

    expect(screen.getByTestId('min-label')).toHaveTextContent('1,99');
    expect(screen.getByTestId('max-label')).toHaveTextContent('70,99');
  });

  it('does not allow editing fixed labels', () => {
    render(<Range variant="fixed" values={values} />);

    fireEvent.click(screen.getByTestId('min-label'));
    expect(screen.queryByTestId('min-input')).not.toBeInTheDocument();
  });

  it('steps through discrete values with keyboard', async () => {
    render(<Range variant="fixed" values={values} />);

    const minThumb = screen.getByTestId('minimum-thumb');
    minThumb.focus();
    fireEvent.keyDown(minThumb, { key: 'ArrowRight' });

    await waitFor(() => {
      expect(minThumb).toHaveAttribute('aria-valuenow', '5.99');
    });
  });

  it('snaps dragging to closest fixed value', async () => {
    render(<Range variant="fixed" values={values} />);
    mockTrackRect();

    const minThumb = screen.getByTestId('minimum-thumb');
    fireEvent.pointerDown(minThumb, { pointerId: 1, clientX: 42 });
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 42 });
    fireEvent.pointerUp(window, { pointerId: 1 });

    await waitFor(() => {
      expect(minThumb).toHaveAttribute('aria-valuenow', '30.99');
    });
  });

  it('sorts and deduplicates fixed values', async () => {
    render(<Range variant="fixed" values={[10.99, 1.99, 10.99, 5.99]} />);

    expect(screen.getByTestId('min-label')).toHaveTextContent('1,99');
    expect(screen.getByTestId('max-label')).toHaveTextContent('10,99');

    const minThumb = screen.getByTestId('minimum-thumb');
    minThumb.focus();
    fireEvent.keyDown(minThumb, { key: 'ArrowRight' });
    fireEvent.keyDown(minThumb, { key: 'ArrowRight' });

    await waitFor(() => {
      expect(minThumb).toHaveAttribute('aria-valuenow', '10.99');
    });
  });

  it('handles an empty values array safely', () => {
    render(<Range variant="fixed" values={[]} />);

    expect(screen.getByTestId('minimum-thumb')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByTestId('maximum-thumb')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByTestId('min-label')).toHaveTextContent('0,00');
    expect(screen.getByTestId('max-label')).toHaveTextContent('0,00');
  });

  it('handles a single-value array by keeping both thumbs fixed', async () => {
    render(<Range variant="fixed" values={[42.99]} />);
    mockTrackRect();

    const minThumb = screen.getByTestId('minimum-thumb');
    const maxThumb = screen.getByTestId('maximum-thumb');

    minThumb.focus();
    fireEvent.keyDown(minThumb, { key: 'ArrowRight' });

    fireEvent.pointerDown(maxThumb, { pointerId: 1, clientX: 0 });
    fireEvent.pointerMove(window, { pointerId: 1, clientX: 100 });
    fireEvent.pointerUp(window, { pointerId: 1 });

    await waitFor(() => {
      expect(minThumb).toHaveAttribute('aria-valuenow', '42.99');
      expect(maxThumb).toHaveAttribute('aria-valuenow', '42.99');
    });
  });

  it('normalizes invalid drag selections to the closest fixed value', async () => {
    render(<Range variant="fixed" values={values} />);
    mockTrackRect();

    const maxThumb = screen.getByTestId('maximum-thumb');
    fireEvent.pointerDown(maxThumb, { pointerId: 2, clientX: 13 });
    fireEvent.pointerMove(window, { pointerId: 2, clientX: 13 });
    fireEvent.pointerUp(window, { pointerId: 2 });

    await waitFor(() => {
      expect(maxThumb).toHaveAttribute('aria-valuenow', '10.99');
    });
  });
});
