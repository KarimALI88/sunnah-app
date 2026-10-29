import { Amiri_400Regular, Amiri_700Bold } from "@expo-google-fonts/amiri";
import {
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSansArabic_700Bold,
} from "@expo-google-fonts/ibm-plex-sans-arabic";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { I18nManager, Platform } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { requestLocationPermission } from "@/features/prayer-times/services/location.service";
import { IdentityProvider } from "@/providers/IdentityProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { SettingsProvider } from "@/providers/SettingsProvider";
import { colors } from "@/theme";

// Keep Arabic layout consistent on every device, regardless of system locale.
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  anchor: "(tabs)",
};

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
    Amiri_400Regular,
    Amiri_700Bold,
    ...MaterialIcons.font,
  });

  useEffect(() => {
    if (error) {
      console.warn("Font loading error:", error);
    }
  }, [error]);

  useEffect(() => {
    // Ask for location access as the first thing when the app opens.
    void requestLocationPermission();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  if (Platform.OS !== "web" && !loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <IdentityProvider>
        <QueryProvider>
          <SettingsProvider>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.surface },
                animation: "slide_from_right",
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="azkar/[categoryId]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="azkar/read/[dhikrId]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="azkar/subcategory/[subcategoryId]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="allah-names"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="wird/create"
                options={{ presentation: "modal", headerShown: false }}
              />
            </Stack>
          </SettingsProvider>
        </QueryProvider>
      </IdentityProvider>
    </SafeAreaProvider>
  );
}
