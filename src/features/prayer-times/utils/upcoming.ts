import type { PrayerDay, PrayerTime, UpcomingPrayer } from '@/features/prayer-times/types';

function minutesOfDay(hour: number, minute: number) {
  return hour * 60 + minute;
}

export function getUpcomingPrayer(day: PrayerDay, now = new Date()): UpcomingPrayer {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowSeconds = nowMinutes * 60 + now.getSeconds();
  const prayers = day.prayers.filter((item) => !item.isSunrise);

  for (let index = 0; index < prayers.length; index += 1) {
    const prayer = prayers[index];
    const start = minutesOfDay(prayer.hour, prayer.minute) * 60;
    const next = prayers[index + 1];
    const end = next
      ? minutesOfDay(next.hour, next.minute) * 60
      : 24 * 60 * 60 + minutesOfDay(prayers[0].hour, prayers[0].minute) * 60;

    if (nowSeconds < start) {
      const previousEnd = index === 0 ? 0 : minutesOfDay(prayers[index - 1].hour, prayers[index - 1].minute) * 60;
      const window = start - previousEnd;
      const elapsed = nowSeconds - previousEnd;
      return {
        prayer,
        remainingSeconds: start - nowSeconds,
        progress: window <= 0 ? 0 : Math.min(1, Math.max(0, elapsed / window)),
      };
    }
  }

  const fajr = prayers[0];
  const fajrStart = minutesOfDay(fajr.hour, fajr.minute) * 60;
  const remaining = 24 * 60 * 60 - nowSeconds + fajrStart;
  return {
    prayer: fajr,
    remainingSeconds: remaining,
    progress: 0.85,
  };
}

export function withDynamicStatus(prayer: PrayerTime, upcomingId: string, now = new Date()): string {
  if (prayer.id === upcomingId) return prayer.status;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const prayerMinutes = prayer.hour * 60 + prayer.minute;
  if (nowMinutes >= prayerMinutes) return prayer.isSunrise ? prayer.status : 'مضى';
  return prayer.status;
}
