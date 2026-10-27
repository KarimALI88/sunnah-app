import { useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import type { WirdDraft, WirdItem } from '@/features/wird/types';
import { colors, radii, spacing } from '@/theme';
import { toEasternNumerals } from '@/utils/numerals';

const PRESETS = [
  { title: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', target: 100 },
  { title: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', target: 100 },
  { title: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', target: 100 },
  { title: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', target: 100 },
  { title: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', target: 100 },
  { title: 'سُبْحَانَ اللَّهِ الْعَظِيمِ وَبِحَمْدِهِ', target: 33 },
];

const TARGET_PRESETS = [33, 100, 300, 1000];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (draft: WirdDraft) => void;
  initialItem?: WirdItem | null;
}

export function CreateWirdModal({ visible, onClose, onSubmit, initialItem }: Props) {
  const [title, setTitle] = useState(initialItem?.title ?? '');
  const [target, setTarget] = useState(initialItem?.targetCount ?? 100);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      setError('يرجى كتابة نص الذكر أو اختيار ذكر مأثور');
      return;
    }
    onSubmit({
      title: title.trim(),
      targetCount: target > 0 ? target : 100,
    });
    setTitle('');
    setError('');
    onClose();
  };

  const handleSelectPreset = (p: { title: string; target: number }) => {
    setTitle(p.title);
    setTarget(p.target);
    setError('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          {/* Handle indicator */}
          <View style={styles.handle} />

          <View style={styles.header}>
            <AppText variant="headlineMd" color={colors.primary}>
              {initialItem ? 'تعديل الورد الشخصي' : 'إضافة ورد جديد'}
            </AppText>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Icon name="close" size={20} color={colors.onSurfaceVariant} />
            </Pressable>
          </View>

          {/* Quick presets */}
          <View style={styles.section}>
            <AppText variant="labelSm" color={colors.onSurfaceVariant}>
              اختر من الأذكار المأثورة المقترحة:
            </AppText>
            <View style={styles.presetChips}>
              {PRESETS.map((p, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleSelectPreset(p)}
                  style={[
                    styles.chip,
                    title === p.title && styles.chipActive,
                  ]}>
                  <AppText
                    variant="labelSm"
                    color={title === p.title ? colors.primary : colors.onSurfaceVariant}>
                    {p.title}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <AppText variant="labelSm" color={colors.primary}>
              نص الورد أو الذكر *
            </AppText>
            <TextInput
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setError('');
              }}
              placeholder="اكتب ذكرك أو دعاءك الخاص..."
              placeholderTextColor={colors.outlineVariant}
              style={[styles.input, Boolean(error) && styles.inputError]}
              textAlign="right"
              multiline
            />
            {error ? (
              <AppText variant="labelSm" color={colors.error}>
                {error}
              </AppText>
            ) : null}
          </View>

          {/* Target Count Selection */}
          <View style={styles.inputGroup}>
            <AppText variant="labelSm" color={colors.primary}>
              الهدف اليومي (عدد التكرار)
            </AppText>
            <View style={styles.targetRow}>
              {TARGET_PRESETS.map((val) => (
                <Pressable
                  key={val}
                  onPress={() => setTarget(val)}
                  style={[
                    styles.targetBtn,
                    target === val && styles.targetBtnActive,
                  ]}>
                  <AppText
                    variant="labelMd"
                    color={target === val ? colors.primaryContainer : colors.onSurfaceVariant}>
                    {toEasternNumerals(val)}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <Pressable onPress={handleSave} style={styles.submitBtn}>
            <Icon name="check" size={20} color={colors.onPrimary} />
            <AppText variant="labelLg" color={colors.onPrimary}>
              {initialItem ? 'حفظ التعديل' : 'إضافة إلى أورادي'}
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
    backgroundColor: 'rgba(9, 31, 38, 0.45)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: colors.surfaceContainerLowest,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
    maxHeight: '85%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.outlineVariant,
    alignSelf: 'center',
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: 6,
  },
  presetChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: colors.secondaryContainer,
    borderColor: colors.gold,
  },
  inputGroup: {
    gap: 6,
  },
  input: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.lg,
    padding: 12,
    minHeight: 64,
    color: colors.onSurface,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  inputError: {
    borderColor: colors.error,
  },
  targetRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  targetBtn: {
    flex: 1,
    height: 42,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  targetBtnActive: {
    backgroundColor: colors.secondaryContainer,
    borderColor: colors.gold,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
});
