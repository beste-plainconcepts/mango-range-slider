export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function sortedUniqueValues(values: number[]): number[] {
  return [...new Set(values)].sort((a, b) => a - b);
}

export function valueToPercent(value: number, min: number, max: number): number {
  if (max <= min) {
    return 0;
  }

  return ((value - min) / (max - min)) * 100;
}

export function percentToValue(percent: number, min: number, max: number): number {
  if (max <= min) {
    return min;
  }

  return min + ((max - min) * percent) / 100;
}

export function getClosestFixedValue(value: number, fixedValues: number[]): number {
  if (!fixedValues.length) {
    return value;
  }

  return fixedValues.reduce((closest, current) => {
    const closestDistance = Math.abs(closest - value);
    const currentDistance = Math.abs(current - value);
    return currentDistance < closestDistance ? current : closest;
  }, fixedValues[0]);
}

export function getNextFixedValue(currentValue: number, fixedValues: number[], direction: -1 | 1): number {
  if (!fixedValues.length) {
    return currentValue;
  }

  const currentIndex = fixedValues.indexOf(currentValue);
  if (currentIndex === -1) {
    return getClosestFixedValue(currentValue, fixedValues);
  }

  const nextIndex = clamp(currentIndex + direction, 0, fixedValues.length - 1);

  return fixedValues[nextIndex];
}
