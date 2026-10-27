import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { colors, radii, spacing } from '@/theme';

interface Props {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <Icon name="search" size={32} color={colors.outline} />
      </View>
      <AppText variant="headlineMd" color={colors.primary} align="center">
        {title}
      </AppText>
      <AppText variant="bodySm" color={colors.onSurfaceVariant} align="center">
        {message}
      </AppText>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} style={styles.actionBtn}>
          <Icon name="add" size={18} color={colors.onPrimary} />
          <AppText variant="labelMd" color={colors.onPrimary}>
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.full,
    marginTop: 8,
  },
});
