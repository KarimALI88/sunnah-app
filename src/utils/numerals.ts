const easternDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toEasternNumerals(value: number | string): string {
  return String(value).replace(/[0-9]/g, (digit) => easternDigits[Number(digit)]);
}

export function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}
