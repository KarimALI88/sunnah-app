import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';

import type { QiblaReading } from '@/features/qibla/types';
import { headingFromMagnetometer, normalizeAngle, qiblaBearing } from '@/features/qibla/utils/bearing';

const FALLBACK_RIYADH = { latitude: 24.7136, longitude: 46.6753 };

export async function requestQiblaPermissions(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentCoordinates() {
  const enabled = await Location.hasServicesEnabledAsync();
  if (!enabled) return null;
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

export function subscribeHeading(onHeading: (heading: number | null, fallback: boolean) => void) {
  let usingFallback = true;
  let headingSub: { remove: () => void } | undefined;
  let magSub: { remove: () => void } | undefined;

  Location.watchHeadingAsync((data) => {
    usingFallback = false;
    onHeading(normalizeAngle(data.trueHeading || data.magHeading), false);
  })
    .then((sub) => {
      headingSub = sub;
    })
    .catch(() => {
      Magnetometer.isAvailableAsync()
        .then((available) => {
          if (!available) {
            onHeading(null, true);
            return;
          }
          Magnetometer.setUpdateInterval(200);
          magSub = Magnetometer.addListener((reading) => {
            usingFallback = false;
            onHeading(headingFromMagnetometer(reading.x, reading.y), false);
          });
        })
        .catch(() => onHeading(null, true));
    });

  const fallbackTimer = setTimeout(() => {
    if (usingFallback) onHeading(null, true);
  }, 1800);

  return () => {
    clearTimeout(fallbackTimer);
    headingSub?.remove();
    magSub?.remove();
  };
}

export function buildFallbackReading(): QiblaReading {
  const bearing = qiblaBearing(FALLBACK_RIYADH.latitude, FALLBACK_RIYADH.longitude);
  return {
    status: 'fallback',
    qiblaBearing: bearing,
    heading: 42,
    relativeAngle: normalizeAngle(bearing - 42),
    latitude: FALLBACK_RIYADH.latitude,
    longitude: FALLBACK_RIYADH.longitude,
    accuracyNote: 'وضع تجريبي: لا تتوفر مستشعرات الجهاز. الاتجاه تقريبي لمدينة الرياض وليس بوصلة حية.',
    usingFallback: true,
  };
}
