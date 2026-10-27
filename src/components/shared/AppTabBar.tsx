import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/theme';

const tabs = [
  { name: 'index', label: 'الأقسام', icon: 'grid-view' as const },
  { name: 'prayer-times', label: 'الصلوات', icon: 'schedule' as const },
  { name: 'main', label: 'الرئيسية', icon: 'star' as const, center: true },
  { name: 'qibla', label: 'القبلة', icon: 'explore' as const },
  { name: 'settings', label: 'الإعدادات', icon: 'settings' as const },
];

export function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.row}>
        {tabs.map((tab) => {
          const route = state.routes.find((item) => item.name === tab.name);
          if (!route) return null;
          const index = state.routes.indexOf(route);
          const focused = state.index === index;

          if (tab.center) {
            return (
              <Pressable
                key={tab.name}
                accessibilityLabel="الرئيسية"
                onPress={() => router.navigate(`/(tabs)/${route.name}`)}
                style={styles.centerWrap}>
                <View style={[styles.centerBtn, focused && styles.centerBtnActive]}>
                  <View style={styles.centerInner}>
                    <Image
                      source={require('@/assets/images/sunnah-icon.png')}
                      style={styles.centerImg}
                      resizeMode="contain"
                    />
                  </View>
                </View>
                <AppText
                  variant="labelSm"
                  color={focused ? colors.secondaryFixed : colors.gold}
                  align="center"
                  style={styles.centerLabel}>
                  {tab.label}
                </AppText>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={tab.name}
              accessibilityLabel={tab.label}
              onPress={() => router.navigate(`/(tabs)/${route.name}`)}
              style={styles.item}>
              <Icon
                name={tab.icon}
                size={24}
                color={focused ? colors.secondaryFixed : colors.navInactive}
              />
              <AppText
                variant="labelSm"
                color={focused ? colors.secondaryFixed : colors.navInactive}
                align="center">
                {tab.label}
              </AppText>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: focused ? colors.gold : 'transparent' },
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.primaryContainer,
    borderTopWidth: 1,
    borderTopColor: 'rgba(181,150,85,0.3)',
    shadowColor: '#024356',
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -4 },
    elevation: 16,
  },
  row: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  item: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 64,
  },
  centerBtn: {
    position: 'absolute',
    top: -22,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.gold,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00171f',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  centerBtnActive: {
    transform: [{ scale: 1.05 }],
  },
  centerInner: {
    width: '100%',
    height: '100%',
    borderRadius: 27,
    backgroundColor: colors.primaryContainer,
    borderWidth: 1.5,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  centerImg: {
    width: 48,
    height: 48,
  },
  centerLabel: {
    marginTop: 28,
  },
});
