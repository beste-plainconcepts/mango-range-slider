import { render, screen } from '@testing-library/react';

import { RangeHeader } from '@/components/range/components/RangeHeader';

describe('RangeHeader', () => {
  it('renders subtitle, title and description', () => {
    render(
      <RangeHeader
        subtitle="Exercise 01 - Range"
        title="Normal range"
        description="Drag the handles or click the values below to define the interval."
      />,
    );

    expect(screen.getByText('Exercise 01 - Range')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Normal range' })).toBeInTheDocument();
    expect(screen.getByText('Drag the handles or click the values below to define the interval.')).toBeInTheDocument();
  });
});
