import { Tabs } from 'expo-router';

import { AppTabBar } from '@/components/shared/AppTabBar';

export const unstable_settings = {
  anchor: 'main',
};

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="main"
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'الأقسام',
        }}
      />
      <Tabs.Screen
        name="prayer-times"
        options={{
          title: 'الصلوات',
        }}
      />
      <Tabs.Screen
        name="main"
        options={{
          title: 'الرئيسية',
        }}
      />
      <Tabs.Screen
        name="qibla"
        options={{
          title: 'القبلة',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'الإعدادات',
        }}
      />
      <Tabs.Screen
        name="wird"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
