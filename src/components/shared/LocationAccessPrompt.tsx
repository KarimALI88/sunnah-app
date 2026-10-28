import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { colors, radii, spacing } from '@/theme';

interface Props {
  isRefreshing: boolean;
  needsSettings: boolean;
  error: string | null;
  onRequestLocation: () => void;
  onOpenSettings: () => void;
}

export function LocationAccessPrompt({
  isRefreshing,
  needsSettings,
  error,
  onRequestLocation,
  onOpenSettings,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <Icon name="near-me" size={20} color={colors.secondary} />
        <AppText variant="labelLg" color={colors.primary}>
          فعّل موقعك لمواقيت الصلاة والقبلة
        </AppText>
      </View>
      <AppText variant="bodySm" color={colors.onSurfaceVariant}>
        نستخدم موقعك الحالي لحساب مواقيت الصلاة وتحديد اتجاه القبلة بدقة.
      </AppText>
      {error ? <AppText variant="bodySm" color={colors.error}>{error}</AppText> : null}
      <Pressable
        accessibilityRole="button"
        onPress={onRequestLocation}
        disabled={isRefreshing}
        style={styles.primaryButton}
      >
        {isRefreshing ? <ActivityIndicator color={colors.onPrimary} /> : <Icon name="my-location" size={18} color={colors.onPrimary} />}
        <AppText variant="labelMd" color={colors.onPrimary}>
          {isRefreshing ? 'جارٍ تحديد الموقع...' : 'تحديد موقعي وإعادة المحاولة'}
        </AppText>
      </Pressable>
      {needsSettings ? (
        <Pressable accessibilityRole="button" onPress={onOpenSettings} style={styles.settingsButton}>
          <AppText variant="labelSm" color={colors.primary}>فتح إعدادات التطبيق</AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  heading: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  primaryButton: {
    minHeight: 44,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  settingsButton: { alignSelf: 'center', padding: spacing.sm },
});
