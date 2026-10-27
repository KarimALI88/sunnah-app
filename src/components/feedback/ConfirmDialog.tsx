import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { colors, radii, spacing } from '@/theme';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={[styles.icon, destructive && styles.iconDestructive]}>
            <Icon
              name={destructive ? 'delete-outline' : 'bookmark'}
              size={28}
              color={destructive ? colors.error : colors.primary}
            />
          </View>
          <AppText variant="headlineMd" color={colors.primary} align="center">
            {title}
          </AppText>
          <AppText variant="bodySm" color={colors.onSurfaceVariant} align="center">
            {message}
          </AppText>
          <Pressable
            style={[styles.primary, destructive && styles.primaryDestructive]}
            onPress={onConfirm}>
            <AppText variant="labelLg" color={colors.onPrimary} align="center">
              {confirmLabel}
            </AppText>
          </Pressable>
          <Pressable style={styles.secondary} onPress={onCancel}>
            <AppText variant="labelLg" color={colors.onSurface} align="center">
              {cancelLabel}
            </AppText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(31,51,59,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.margin,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainerHigh,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDestructive: {
    backgroundColor: colors.errorContainer,
  },
  primary: {
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryDestructive: {
    backgroundColor: colors.error,
  },
  secondary: {
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
