import { apiRequest } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { DEFAULT_LOCATION, getDeviceLocation } from '@/features/prayer-times/services/location.service';
import type { PrayerDay, PrayerId, PrayerTime } from '@/features/prayer-times/types';
import { pad2, toEasternNumerals } from '@/utils/numerals';

const CALCULATION_METHOD = 5;
const SCHOOL = 0;

interface PrayerTimesApiResponse {
  data: {
    date: string;
    timezone: string;
    calculation_method: number;
    school: number;
    high_latitude_method?: number;
    timings: Record<string, string>;
  };
}

const PRAYERS: Array<{
  key: string;
  id: PrayerId;
  name: string;
  icon: string;
  isSunrise?: boolean;
}> = [
  { key: 'fajr', id: 'fajr', name: 'الفجر', icon: 'wb-twilight' },
  { key: 'sunrise', id: 'sunrise', name: 'الشروق', icon: 'wb-sunny', isSunrise: true },
  { key: 'dhuhr', id: 'dhuhr', name: 'الظهر', icon: 'wb-sunny' },
  { key: 'asr', id: 'asr', name: 'العصر', icon: 'wb-sunny' },
  { key: 'maghrib', id: 'maghrib', name: 'المغرب', icon: 'wb-twilight' },
  { key: 'isha', id: 'isha', name: 'العشاء', icon: 'nights-stay' },
];

function toDateParam(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseTime(value: string): { hour: number; minute: number } {
  const [hours = '0', minutes = '0'] = (value ?? '').split(':');
  return { hour: Number(hours) || 0, minute: Number(minutes) || 0 };
}

function formatTimeLabel(hour: number, minute: number): string {
  const period = hour < 12 ? 'ص' : 'م';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${toEasternNumerals(pad2(hour12))}:${toEasternNumerals(pad2(minute))} ${period}`;
}

function minutesToLabel(totalMinutes: number): string {
  const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  return formatTimeLabel(Math.floor(normalized / 60), normalized % 60);
}

function formatGregorian(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  try {
    return new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'long' }).format(date);
  } catch {
    return dateStr;
  }
}

function formatHijri(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '';
  try {
    const formatted = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
    return `${formatted} هـ`;
  } catch {
    return '';
  }
}

function mapPrayerDay(response: PrayerTimesApiResponse): PrayerDay {
  const { timings, date, calculation_method } = response.data;

  const prayers: PrayerTime[] = PRAYERS.map((meta) => {
    const { hour, minute } = parseTime(timings[meta.key] ?? '00:00');
    return {
      id: meta.id,
      name: meta.name,
      timeLabel: formatTimeLabel(hour, minute),
      hour,
      minute,
      icon: meta.icon,
      status: '',
      isSunrise: meta.isSunrise,
    };
  });

  const maghrib = prayers.find((item) => item.id === 'maghrib');
  const fajr = prayers.find((item) => item.id === 'fajr');
  const maghribMinutes = maghrib ? maghrib.hour * 60 + maghrib.minute : 18 * 60;
  const fajrMinutes = fajr ? fajr.hour * 60 + fajr.minute : 5 * 60;
  const nightLength = 1440 - maghribMinutes + fajrMinutes;

  return {
    hijriDate: formatHijri(date) || formatGregorian(date),
    gregorianDate: formatGregorian(date),
    city: '',
    country: '',
    method: `طريقة الحساب: ${toEasternNumerals(calculation_method)}`,
    prayers,
    night: {
      midnightLabel: minutesToLabel(maghribMinutes + nightLength / 2),
      lastThirdLabel: minutesToLabel(maghribMinutes + (nightLength * 2) / 3),
    },
  };
}

export interface PrayerTimesRepository {
  getToday(): Promise<PrayerDay>;
}

export const prayerTimesRepository: PrayerTimesRepository = {
  async getToday() {
    const location = (await getDeviceLocation()) ?? DEFAULT_LOCATION;
    const timezone = location.timezone || DEFAULT_LOCATION.timezone;

    const response = await apiRequest<PrayerTimesApiResponse>(endpoints.prayerTimes, {
      query: {
        latitude: location.latitude,
        longitude: location.longitude,
        date: toDateParam(new Date()),
        timezone,
        calculation_method: CALCULATION_METHOD,
        school: SCHOOL,
      },
    });

    const day = mapPrayerDay(response);
    return {
      ...day,
      city: location.city ?? day.city,
      country: location.country ?? day.country,
    };
  },
};
