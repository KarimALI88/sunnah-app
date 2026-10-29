import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { colors, spacing } from '@/theme';

interface Props {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showBrand?: boolean;
}

export function AppHeader({
  title = 'سُنَّةُ',
  subtitle,
  showBack = false,
  showBrand = true,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <View style={styles.left}>
          {showBack ? (
            <Pressable
              accessibilityLabel="رجوع"
              onPress={() => {
                if (router.canGoBack()) router.back();
                else router.replace('/(tabs)');
              }}
              style={styles.iconBtn}>
              <Icon name="arrow-forward" size={24} color={colors.onSurface} />
            </Pressable>
          ) : null}
          {showBrand ? (
            <View style={styles.logo}>
              <Image
                source={require('../../../assets/images/sunnah-transparent.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          ) : null}
          <View>
            <AppText variant="labelLg" color={colors.primary}>
              {title}
            </AppText>
            {subtitle ? (
              <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                {subtitle}
              </AppText>
            ) : null}
          </View>
        </View>
        <View style={styles.right}>
          <Pressable accessibilityLabel="التنبيهات" style={styles.iconBtn}>
            <Icon name="notifications-none" size={22} color={colors.onSurfaceVariant} />
          </Pressable>
          <View style={styles.avatar}>
            <Icon name="person" size={18} color={colors.onPrimary} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'rgba(242,251,255,0.92)',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  row: {
    height: 64,
    paddingHorizontal: spacing.margin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.gold,
    overflow: 'hidden',
  },
  logoImage: {
    width: 28,
    height: 28,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
