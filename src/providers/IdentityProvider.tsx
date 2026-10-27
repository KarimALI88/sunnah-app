import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ensureGuestIdentity } from "@/features/identity/services/identity.service";
import type { GuestIdentity } from "@/features/identity/types";
import { colors } from "@/theme";

interface IdentityContextValue {
  identity: GuestIdentity | null;
  ready: boolean;
  error: string | null;
}

const IdentityContext = createContext<IdentityContextValue | undefined>(
  undefined,
);

/**
 * Ensures the device has a guest identity on app open.
 *
 * The guest-identity request must run before any other API call so the token
 * is available, so children are held back until it settles. On failure the app
 * still proceeds (the error is exposed to callers) instead of blocking.
 */
export function IdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<GuestIdentity | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    ensureGuestIdentity()
      .then((value) => {
        if (active) setIdentity(value);
      })
      .catch((err) => {
        console.error("[Identity] ensureGuestIdentity failed:", err);
        if (active) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({ identity, ready, error }),
    [identity, ready, error],
  );

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <IdentityContext.Provider value={value}>
      {children}
    </IdentityContext.Provider>
  );
}

export function useIdentity() {
  const ctx = useContext(IdentityContext);
  if (!ctx) throw new Error("useIdentity must be used within IdentityProvider");
  return ctx;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
});
