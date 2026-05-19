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