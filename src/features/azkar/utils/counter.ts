export function nextCount(current: number, target: number, canExceed = false): number {
  if (canExceed) return current + 1;
  if (current >= target) return current;
  return current + 1;
}

export function isComplete(current: number, target: number) {
  return current >= target;
}

export function progressPercent(current: number, target: number) {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}
