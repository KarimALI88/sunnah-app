import { useCallback, useState } from 'react';
import { Linking } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { getDeviceLocation, requestLocationAccess } from '@/features/prayer-times/services/location.service';
import { prayerKeys } from '@/features/prayer-times/hooks/usePrayerTimes';
import { notifyLocationRefresh } from '@/lib/locationRefreshEvents';

export function useLocationRefresh() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [needsSettings, setNeedsSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestCurrentLocation = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setError(null);
    setNeedsSettings(false);

    try {
      const permission = await requestLocationAccess();
      if (!permission.granted) {
        setNeedsSettings(!permission.canAskAgain);
        setError(
          permission.canAskAgain
            ? 'اسمح للتطبيق باستخدام الموقع حتى نحسب مواقيت الصلاة والقبلة.'
            : 'إذن الموقع مغلق. فعّله من إعدادات التطبيق ثم أعد المحاولة.',
        );
        return;
      }

      const location = await getDeviceLocation({ force: true });
      if (!location) {
        setError('تعذر تحديد موقعك. تأكد من تشغيل خدمات الموقع ثم أعد المحاولة.');
        return;
      }

      notifyLocationRefresh();
      await queryClient.invalidateQueries({ queryKey: prayerKeys.today });
    } catch {
      setError('تعذر تحديد موقعك الآن. أعد المحاولة.');
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, queryClient]);

  const openSettings = useCallback(async () => {
    try {
      await Linking.openSettings();
    } catch {
      setError('تعذر فتح إعدادات التطبيق. افتح إعدادات الجهاز واسمح بالموقع.');
    }
  }, []);

  return { isRefreshing, needsSettings, error, requestCurrentLocation, openSettings };
}
