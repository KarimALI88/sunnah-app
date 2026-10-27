import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { STORAGE_KEYS } from '@/lib/constants';
import { storage } from '@/lib/storage';

export interface AppSettings {
  dhikrFontSize: number;
  notificationsEnabled: boolean;
  adhanEnabled: boolean;
  language: 'ar' | 'en';
  prayerAlerts: Record<string, boolean>;
}

const defaults: AppSettings = {
  dhikrFontSize: 20,
  notificationsEnabled: true,
  adhanEnabled: true,
  language: 'ar',
  prayerAlerts: {
    fajr: false,
    dhuhr: false,
    asr: true,
    maghrib: true,
    isha: true,
  },
};

interface SettingsContextValue {
  settings: AppSettings;
  loaded: boolean;
  update: (patch: Partial<AppSettings>) => void;
  setPrayerAlert: (id: string, value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaults);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    storage.getItem<AppSettings>(STORAGE_KEYS.settings).then((saved) => {
      if (saved) setSettings({ ...defaults, ...saved });
      setLoaded(true);
    });
  }, []);

  const update = (patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      void storage.setItem(STORAGE_KEYS.settings, next);
      return next;
    });
  };

  const setPrayerAlert = (id: string, value: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, prayerAlerts: { ...prev.prayerAlerts, [id]: value } };
      void storage.setItem(STORAGE_KEYS.settings, next);
      return next;
    });
  };

  const value = useMemo(
    () => ({ settings, loaded, update, setPrayerAlert }),
    [settings, loaded],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
