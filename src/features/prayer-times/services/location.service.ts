import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

import { STORAGE_KEYS } from "@/lib/constants";

export interface DeviceLocation {
  latitude: number;
  longitude: number;
  timezone: string;
  city?: string;
  country?: string;
}

/** Fallback used when location permission is denied (example coordinates). */
export const DEFAULT_LOCATION: DeviceLocation = {
  latitude: 30.0444,
  longitude: 31.2357,
  timezone: "Africa/Cairo",
};

const CACHE_TTL = 1000 * 60 * 60; // 1 hour

interface CachedLocation extends DeviceLocation {
  cachedAt: number;
}

export function getDeviceTimezone(): string {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone) return timeZone;
  } catch (error) {
    console.warn("[Location] Could not resolve device timezone:", error);
  }
  return DEFAULT_LOCATION.timezone;
}

let permissionRequest: Promise<boolean> | null = null;

async function doRequestLocationPermission(): Promise<boolean> {
  try {
    const current = await Location.getForegroundPermissionsAsync();
    if (current.status === "granted") return true;

    const requested = await Location.requestForegroundPermissionsAsync();
    console.log("[Location] Foreground permission status:", requested.status);
    return requested.status === "granted";
  } catch (error) {
    console.error("[Location] Permission request failed:", error);
    return false;
  }
}

/**
 * Ask the user for foreground location access. Safe to call on app open.
 * Concurrent callers share a single in-flight request so the OS prompt is
 * only shown once.
 */
export function requestLocationPermission(): Promise<boolean> {
  if (!permissionRequest) {
    permissionRequest = doRequestLocationPermission().finally(() => {
      permissionRequest = null;
    });
  }
  return permissionRequest;
}

async function readCache(): Promise<DeviceLocation | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.deviceLocation);
    if (!raw) return null;

    const cached = JSON.parse(raw) as CachedLocation;
    if (Date.now() - cached.cachedAt > CACHE_TTL) return null;

    const { cachedAt: _cachedAt, ...location } = cached;
    return location;
  } catch (error) {
    console.error("[Location] Failed to read cached location:", error);
    return null;
  }
}

/**
 * Resolve the device location (with a 1 hour AsyncStorage cache).
 * Returns `null` when permission is denied or the position cannot be read.
 */
export async function getDeviceLocation(options?: {
  force?: boolean;
}): Promise<DeviceLocation | null> {
  if (!options?.force) {
    const cached = await readCache();
    if (cached) {
      console.log("[Location] Using cached location:", cached);
      return cached;
    }
  }

  const granted = await requestLocationPermission();
  if (!granted) {
    console.warn("[Location] Permission not granted — location unavailable");
    return null;
  }

  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const { latitude, longitude } = position.coords;
    const timezone = getDeviceTimezone();

    let city: string | undefined;
    let country: string | undefined;
    try {
      const [place] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      city = place?.city ?? place?.subregion ?? place?.region ?? undefined;
      country = place?.country ?? undefined;
    } catch (geoError) {
      console.warn("[Location] Reverse geocoding failed:", geoError);
    }

    const location: DeviceLocation = {
      latitude,
      longitude,
      timezone,
      city,
      country,
    };
    await AsyncStorage.setItem(
      STORAGE_KEYS.deviceLocation,
      JSON.stringify({
        ...location,
        cachedAt: Date.now(),
      } satisfies CachedLocation),
    );

    console.log("[Location] Resolved location:", location);
    return location;
  } catch (error) {
    console.error("[Location] Failed to read current position:", error);
    return null;
  }
}
