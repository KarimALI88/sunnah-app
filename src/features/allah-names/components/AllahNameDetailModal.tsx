import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import type { AllahName } from '@/features/allah-names/types';
import { colors, radii, spacing } from '@/theme';
import { toEasternNumerals } from '@/utils/numerals';

interface Props {
  name: AllahName | null;
  visible: boolean;
  onClose: () => void;
}

export function AllahNameDetailModal({ name, visible, onClose }: Props) {
  if (!name) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.card}>
          {/* Close button */}
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Icon name="close" size={20} color={colors.onSurfaceVariant} />
          </Pressable>

          {/* Golden Medallion Number */}
          <View style={styles.numberPill}>
            <AppText variant="labelMd" color={colors.goldDark}>
              الاسم رقم {toEasternNumerals(name.number)} من ٩٩
            </AppText>
          </View>

          {/* Divine Name in large calligraphy style */}
          <View style={styles.nameWrap}>
            <AppText
              variant="quranVerse"
              color={colors.primary}
              align="center"
              style={styles.nameText}>
              {name.arabic}
            </AppText>
          </View>

          {/* Short Meaning */}
          <View style={styles.meaningTag}>
            <AppText variant="labelLg" color={colors.secondary}>
              {name.meaning}
            </AppText>
          </View>

          {/* Detailed Explanation */}
          <View style={styles.explanationBox}>
            <View style={styles.boxHeader}>
              <Icon name="auto-awesome" size={18} color={colors.gold} />
              <AppText variant="labelMd" color={colors.primary}>
                المعنى والأثر الإيماني
              </AppText>
            </View>
            <AppText variant="bodyMd" color={colors.onSurface} leading="relaxed">
              {name.explanation}
            </AppText>
          </View>

          {/* Spiritual Reflection */}
          <View style={styles.verseQuote}>
            <AppText variant="labelSm" color={colors.primary} style={{ fontStyle: 'italic' }}>
              &ldquo;وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا&rdquo;
            </AppText>
          </View>

          {/* Dismiss Button */}
          <Pressable onPress={onClose} style={styles.okBtn}>
            <AppText variant="labelMd" color={colors.onPrimary}>
              إغلاق
            </AppText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 31, 38, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.margin,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: '#002C39',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberPill: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
    marginTop: 4,
  },
  nameWrap: {
    paddingVertical: spacing.xs,
  },
  nameText: {
    fontSize: 40,
    lineHeight: 64,
  },
  meaningTag: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: radii.full,
  },
  explanationBox: {
    width: '100%',
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: 6,
  },
  boxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verseQuote: {
    paddingHorizontal: spacing.sm,
  },
  okBtn: {
    width: '100%',
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
