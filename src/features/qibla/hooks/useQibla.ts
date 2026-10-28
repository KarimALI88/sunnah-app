import { useCallback, useEffect, useRef, useState } from 'react';

import {
  buildFallbackReading,
  getCurrentCoordinates,
  requestQiblaPermissions,
  subscribeHeading,
} from '@/features/qibla/services/qibla.service';
import type { QiblaReading } from '@/features/qibla/types';
import { normalizeAngle, qiblaBearing } from '@/features/qibla/utils/bearing';
import { subscribeToLocationRefresh } from '@/lib/locationRefreshEvents';

const initial: QiblaReading = {
  status: 'idle',
  qiblaBearing: null,
  heading: null,
  relativeAngle: null,
  latitude: null,
  longitude: null,
  accuracyNote: '',
  usingFallback: false,
};

export function useQibla() {
  const [reading, setReading] = useState<QiblaReading>(initial);
  const headingSubscription = useRef<(() => void) | null>(null);

  const start = useCallback(async () => {
    headingSubscription.current?.();
    headingSubscription.current = null;
    const granted = await requestQiblaPermissions().catch(() => false);
    setReading((prev) => ({ ...prev, status: 'requesting-permission' }));
    if (!granted) {
      setReading({
        ...buildFallbackReading(),
        status: 'denied',
        accuracyNote: 'تم رفض إذن الموقع. يمكنك السماح به لاحقًا أو استخدام الوضع التجريبي.',
      });
      return;
    }

    const coords = await getCurrentCoordinates().catch(() => null);
    const fallback = buildFallbackReading();
    const latitude = coords?.latitude ?? fallback.latitude!;
    const longitude = coords?.longitude ?? fallback.longitude!;
    const bearing = qiblaBearing(latitude, longitude);
    const usingCoordsFallback = !coords;

    setReading({
      status: usingCoordsFallback ? 'fallback' : 'calibrating',
      qiblaBearing: bearing,
      heading: usingCoordsFallback ? fallback.heading : null,
      relativeAngle: usingCoordsFallback ? fallback.relativeAngle : null,
      latitude,
      longitude,
      accuracyNote: usingCoordsFallback
        ? fallback.accuracyNote
        : 'حرّك الجهاز على شكل رقم ٨ لمعايرة البوصلة.',
      usingFallback: usingCoordsFallback,
    });

    const unsubscribe = subscribeHeading((heading, sensorFallback) => {
      setReading((prev) => {
        const nextHeading = heading ?? prev.heading ?? fallback.heading;
        const nextBearing = prev.qiblaBearing ?? bearing;
        return {
          ...prev,
          status: sensorFallback || heading == null ? 'fallback' : 'ready',
          heading: nextHeading,
          relativeAngle:
            nextHeading != null && nextBearing != null ? normalizeAngle(nextBearing - nextHeading) : null,
          usingFallback: sensorFallback || heading == null,
          accuracyNote:
            sensorFallback || heading == null
              ? fallback.accuracyNote
              : 'الاتجاه محسوب من موقعك وإحداثيات الكعبة، مع بوصلة الجهاز.',
        };
      });
    });
    headingSubscription.current = unsubscribe;

    return unsubscribe;
  }, []);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      void start().then((unsubscribe) => {
        if (!active) unsubscribe?.();
      });
    };

    refresh();
    const unsubscribeLocationRefresh = subscribeToLocationRefresh(refresh);
    return () => {
      active = false;
      unsubscribeLocationRefresh();
      headingSubscription.current?.();
      headingSubscription.current = null;
    };
  }, [start]);

  return { reading, retry: start };
}
