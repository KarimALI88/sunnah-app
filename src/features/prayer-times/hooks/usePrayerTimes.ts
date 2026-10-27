import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import { prayerTimesRepository } from '@/features/prayer-times/services/prayerTimes.repository';
import { getUpcomingPrayer } from '@/features/prayer-times/utils/upcoming';

export const prayerKeys = {
  today: ['prayer-times', 'today'] as const,
};

export function usePrayerTimes() {
  return useQuery({
    queryKey: prayerKeys.today,
    queryFn: () => prayerTimesRepository.getToday(),
  });
}

export function useUpcomingPrayer() {
  const query = usePrayerTimes();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const upcoming = useMemo(() => {
    if (!query.data) return undefined;
    return getUpcomingPrayer(query.data, now);
  }, [query.data, now]);

  return { ...query, upcoming, now };
}
