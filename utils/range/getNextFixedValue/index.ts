import { clamp } from '../clamp';
import { getClosestFixedValue } from '../getClosestFixedValue';

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