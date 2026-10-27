import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radii, spacing } from '@/theme';

export function ErrorState({
  message = 'تعذر تحميل البيانات',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <AppText variant="bodyMd" color={colors.error} align="center">
        {message}
      </AppText>
      {onRetry ? (
        <Pressable onPress={onRetry} style={styles.btn}>
          <AppText variant="labelLg" color={colors.onPrimary} align="center">
            إعادة المحاولة
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
