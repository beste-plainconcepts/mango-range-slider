export function valueToPercent(value: number, min: number, max: number): number {
  if (max <= min) {
    return 0;
  }

  return ((value - min) / (max - min)) * 100;
}
