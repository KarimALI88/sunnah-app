import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiRequest } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { GuestIdentity, GuestIdentityResponse } from '@/features/identity/types';
import { STORAGE_KEYS } from '@/lib/constants';

/** Read the stored guest identity, or `null` when either key is missing. */
export async function getStoredIdentity(): Promise<GuestIdentity | null> {
  try {
    const [identity_id, guest_token] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.identityId),
      AsyncStorage.getItem(STORAGE_KEYS.guestToken),
    ]);

    if (identity_id && guest_token) {
      return { identity_id, guest_token };
    }
    return null;
  } catch (error) {
    console.error('[Identity] Failed to read stored identity:', error);
    return null;
  }
}

/**
 * Ensure a guest identity exists on the device.
 * - If both keys are already in AsyncStorage, no request is made.
 * - Otherwise `POST /api/v1/guest/identities` is called and both keys are stored.
 */
export async function ensureGuestIdentity(): Promise<GuestIdentity> {
  const stored = await getStoredIdentity();
  if (stored) {
    return stored;
  }

  const response = await apiRequest<GuestIdentityResponse>(endpoints.guestIdentities, {
    method: 'POST',
    auth: false,
  });

  const identity = response?.data;
  if (!identity?.identity_id || !identity?.guest_token) {
    throw new Error('Guest identity response is missing identity_id or guest_token');
  }

  await AsyncStorage.multiSet([
    [STORAGE_KEYS.identityId, identity.identity_id],
    [STORAGE_KEYS.guestToken, identity.guest_token],
  ]);

  return identity;
}
