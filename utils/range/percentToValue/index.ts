export function percentToValue(percent: number, min: number, max: number): number {
  if (max <= min) {
    return min;
  }

  return min + ((max - min) * percent) / 100;
}
