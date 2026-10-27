export type PrayerId = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTime {
  id: PrayerId;
  name: string;
  timeLabel: string;
  hour: number;
  minute: number;
  icon: string;
  status: string;
  isSunrise?: boolean;
}

export interface NightTimes {
  midnightLabel: string;
  lastThirdLabel: string;
}

export interface PrayerDay {
  hijriDate: string;
  gregorianDate: string;
  city: string;
  country: string;
  method: string;
  prayers: PrayerTime[];
  night: NightTimes;
}

export interface UpcomingPrayer {
  prayer: PrayerTime;
  remainingSeconds: number;
  progress: number;
}
