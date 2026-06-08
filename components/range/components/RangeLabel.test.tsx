import { useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { RangeLabel } from '@/components/range/components/RangeLabel';
import { vi } from 'vitest';

type EditableLabelHarnessProps = {
  title: string;
  initialValue: number;
  min: number;
  max: number;
  onCommitAction?: (value: number) => void;
};

function EditableLabelHarness({ title, initialValue, min, max, onCommitAction }: EditableLabelHarnessProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <RangeLabel
      title={title}
      value={value}
      editable
      min={min}
      max={max}
      onCommitAction={(nextValue) => {
        setValue(nextValue);
        onCommitAction?.(nextValue);
      }}
    />
  );
}

describe('RangeLabel', () => {
  it('renders read-only labels with formatter output', () => {
    render(<RangeLabel title="Min" value={5.99} formatterAction={(value) => `EUR ${value.toFixed(2)}`} />);

    expect(screen.getByTestId('min-label')).toHaveTextContent('EUR 5.99');
    fireEvent.click(screen.getByTestId('min-label'));
    expect(screen.queryByTestId('min-input')).not.toBeInTheDocument();
  });

  it('commits rounded values on blur', () => {
    const onCommitAction = vi.fn();

    render(<EditableLabelHarness title="Min" initialValue={10} min={1} max={100} onCommitAction={onCommitAction} />);

    fireEvent.click(screen.getByTestId('min-label'));
    const input = screen.getByTestId('min-input');
    fireEvent.change(input, { target: { value: '12.6' } });
    fireEvent.blur(input);

    expect(onCommitAction).toHaveBeenCalledWith(13);
    expect(screen.getByTestId('min-label')).toHaveTextContent('13');
  });

  it('clamps out-of-range values before commit', () => {
    const onCommitAction = vi.fn();

    render(<EditableLabelHarness title="Max" initialValue={20} min={5} max={25} onCommitAction={onCommitAction} />);

    fireEvent.click(screen.getByTestId('max-label'));
    const input = screen.getByTestId('max-input');
    fireEvent.change(input, { target: { value: '99' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onCommitAction).toHaveBeenCalledWith(25);
    expect(screen.getByTestId('max-label')).toHaveTextContent('25');
  });

  it('restores the current value when the input is invalid', () => {
    const onCommitAction = vi.fn();

    render(<RangeLabel title="Min" value={8} editable min={1} max={10} onCommitAction={onCommitAction} />);

    fireEvent.click(screen.getByTestId('min-label'));
    const input = screen.getByTestId('min-input');
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.blur(input);

    expect(onCommitAction).not.toHaveBeenCalled();
    expect(screen.getByTestId('min-label')).toHaveTextContent('8');
  });

  it('cancels editing on Escape without committing', () => {
    const onCommitAction = vi.fn();

    render(<RangeLabel title="Max" value={30} editable min={1} max={100} onCommitAction={onCommitAction} />);

    fireEvent.click(screen.getByTestId('max-label'));
    const input = screen.getByTestId('max-input');
    fireEvent.change(input, { target: { value: '40' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(onCommitAction).not.toHaveBeenCalled();
    expect(screen.getByTestId('max-label')).toHaveTextContent('30');
  });
});
