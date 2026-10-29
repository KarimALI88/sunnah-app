import * as Haptics from 'expo-haptics';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { useDhikrs, useSubcategories } from '@/features/azkar/hooks/useAzkar';
import { isComplete, nextCount, progressPercent } from '@/features/azkar/utils/counter';
import { useSettings } from '@/providers/SettingsProvider';
import { colors, radii, spacing } from '@/theme';
import { toEasternNumerals } from '@/utils/numerals';

const SIZE = 200;
const R = 88;
const C = 2 * Math.PI * R;

export function DhikrReadScreen({
  dhikrId,
  subcategoryId,
  categoryId,
  subcategoryTitle,
}: {
  dhikrId: string;
  subcategoryId?: string;
  categoryId?: string;
  subcategoryTitle?: string;
}) {
  const insets = useSafeAreaInsets();
  const { settings, update } = useSettings();
  const resolvedSubId = subcategoryId ?? dhikrId.split('-')[0];
  const { data: list, isLoading, isError, refetch } = useDhikrs(resolvedSubId);
  const { data: subcategories } = useSubcategories(categoryId ?? '');
  const subcategory = subcategories?.find((item) => item.id === resolvedSubId);
  const [activeDhikrId, setActiveDhikrId] = useState(dhikrId);
  const [count, setCount] = useState(0);
  const [exitOpen, setExitOpen] = useState(false);
  const [doneAll, setDoneAll] = useState(false);

  const requestedIndex = list?.findIndex((item) => item.id === activeDhikrId) ?? -1;
  const index = requestedIndex >= 0 ? requestedIndex : 0;
  const dhikr = list?.[index];
  const total = list?.length ?? 0;
  const audioPlayer = useAudioPlayer(dhikr?.audioUrl ?? null, { updateInterval: 500 });
  const audioStatus = useAudioPlayerStatus(audioPlayer);
  const complete = dhikr ? isComplete(count, dhikr.targetCount) : false;
  const progress = dhikr ? progressPercent(count, dhikr.targetCount) : 0;
  const offset = C - (progress / 100) * C;

  const headerLabel = useMemo(() => {
    const title = subcategory?.title ?? subcategoryTitle;
    if (!title) return '';
    return `${title} (${toEasternNumerals(index + 1)} من ${toEasternNumerals(total)})`;
  }, [subcategory, subcategoryTitle, index, total]);
  const safePageStyle = [styles.page, { paddingTop: insets.top + spacing.sm }];
  const navigateBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/categories');
  };

  if (isLoading) {
    return <View style={safePageStyle}><LoadingState label="جاري تجهيز الذكر..." /></View>;
  }
  if (isError) return <View style={safePageStyle}><ErrorState onRetry={() => { void refetch(); }} /></View>;
  if (!dhikr) return <View style={safePageStyle}><EmptyState title="لا توجد أذكار في هذا القسم" message="جرّب العودة واختيار قسم آخر." /></View>;

  const goNext = () => {
    if (!list) return;
    if (index >= list.length - 1) {
      setDoneAll(true);
      return;
    }
    setActiveDhikrId(list[index + 1].id);
    setCount(0);
  };

  const goPrev = () => {
    if (index === 0) return;
    setActiveDhikrId(list?.[index - 1]?.id ?? '');
    setCount(0);
  };

  const onTap = () => {
    if (!dhikr) return;
    if (count >= dhikr.targetCount) {
      goNext();
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const next = nextCount(count, dhikr.targetCount);
    setCount(next);
    if (next >= dhikr.targetCount) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const toggleAudio = () => {
    if (!dhikr.audioUrl) return;
    if (audioStatus.playing) {
      audioPlayer.pause();
      return;
    }
    if (audioStatus.didJustFinish) {
      void audioPlayer.seekTo(0).then(() => audioPlayer.play());
      return;
    }
    audioPlayer.play();
  };

  if (doneAll) {
    return (
      <View style={safePageStyle}>
        <View style={styles.completeCard}>
          <Icon name="check-circle" size={48} color={colors.secondary} />
          <AppText variant="headlineLg" color={colors.primary} align="center">
            أتممت الورد بحمد الله
          </AppText>
          <AppText variant="bodySm" color={colors.onSurfaceVariant} align="center">
            أكملت {toEasternNumerals(total)} أذكار في {subcategory?.title ?? subcategoryTitle}
          </AppText>
          <Pressable style={styles.primaryBtn} onPress={navigateBack}>
            <AppText variant="labelLg" color={colors.onPrimary} align="center">
              العودة للأقسام
            </AppText>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={safePageStyle}>
      <ScrollView
        style={styles.verticalScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
      <ScrollView
        horizontal
        style={styles.topBarScroll}
        contentContainerStyle={styles.topBarContent}
        showsHorizontalScrollIndicator={false}>
        <Pressable
          style={styles.iconBtn}
          accessibilityLabel="رجوع"
          onPress={() => setExitOpen(true)}
        >
          <Icon name="arrow-forward" size={20} color={colors.onSurfaceVariant} />
        </Pressable>
        <View style={styles.chip}>
          <Icon name="spa" size={16} color={colors.primary} />
          <AppText variant="labelMd" color={colors.onSurface}>
            {headerLabel}
          </AppText>
        </View>
        <Pressable
          style={[styles.audio, !dhikr.audioUrl && styles.audioDisabled]}
          onPress={toggleAudio}
          disabled={!dhikr.audioUrl}
          accessibilityLabel={audioStatus.playing ? 'إيقاف الاستماع' : 'تشغيل التلاوة الصوتية'}
          accessibilityState={{ disabled: !dhikr.audioUrl }}>
          <Icon name={audioStatus.playing ? 'pause' : 'volume-up'} size={18} color={colors.secondary} />
          <AppText variant="labelSm" color={colors.secondary}>
            {!dhikr.audioUrl
              ? 'الصوت غير متاح'
              : audioStatus.isBuffering
                ? 'جاري تحميل الصوت'
                : audioStatus.playing
                  ? 'إيقاف الاستماع'
                  : 'استماع صوتي'}
          </AppText>
          {dhikr.audioUrl && !audioStatus.playing ? <View style={styles.live} /> : null}
        </Pressable>
        <Pressable
          style={styles.iconBtn}
          accessibilityLabel="تغيير حجم الخط"
          onPress={() =>
            update({ dhikrFontSize: settings.dhikrFontSize >= 26 ? 20 : settings.dhikrFontSize + 4 })
          }>
          <Icon name="format-size" size={20} color={colors.onSurface} />
        </Pressable>
        <Pressable style={styles.iconBtn} accessibilityLabel="إنهاء الورد" onPress={() => setExitOpen(true)}>
          <Icon name="close" size={20} color={colors.onSurfaceVariant} />
        </Pressable>
      </ScrollView>

      <View style={styles.card}>
        <View style={styles.cardHead}>
          <View style={styles.badge}>
            <View style={styles.goldDot} />
            <AppText variant="labelMd" color={colors.primary}>
              {dhikr.badge}
            </AppText>
          </View>
          <View style={styles.toolbar}>
            <Icon name="verified" size={16} color={colors.outline} />
            <AppText variant="labelSm" color={colors.outline}>
              مأثور صحيح
            </AppText>
          </View>
        </View>
        <AppText
          variant="quranVerse"
          color={colors.primary}
          align="center"
          style={{ fontSize: Math.max(settings.dhikrFontSize, 24), lineHeight: Math.max(settings.dhikrFontSize + 22, 46) }}>
          {dhikr.arabicText}
        </AppText>
        {dhikr.virtue ? (
          <View style={styles.virtue}>
            <View style={styles.toolbar}>
              <Icon name="auto-awesome" size={16} color={colors.secondary} />
              <AppText variant="labelMd" color={colors.secondary}>
                الفضل والأثر
              </AppText>
            </View>
            <AppText variant="bodySm" color={colors.onSurfaceVariant}>
              {dhikr.virtue}
            </AppText>
          </View>
        ) : null}
      </View>

      <View style={styles.counterWrap}>
        <View style={styles.ringBox}>
          <Svg width={SIZE} height={SIZE} style={styles.svg}>
            <Circle
              cx={100}
              cy={100}
              r={R}
              stroke={colors.surfaceContainerHighest}
              strokeWidth={8}
              fill="transparent"
            />
            <Circle
              cx={100}
              cy={100}
              r={R}
              stroke={complete ? colors.secondaryFixedDim : colors.secondary}
              strokeWidth={8}
              fill="transparent"
              strokeDasharray={`${C} ${C}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </Svg>
          <Pressable style={styles.tap} onPress={onTap} accessibilityLabel="انقر لاحتساب الذكر">
            <AppText variant="displayLg" color={colors.primary} align="center">
              {toEasternNumerals(count)}
            </AppText>
            <AppText variant="labelSm" color={colors.outline} align="center">
              الهدف: {toEasternNumerals(dhikr.targetCount)}
            </AppText>
            <View style={styles.tapHint}>
              <Icon name="touch-app" size={14} color={colors.secondary} />
              <AppText variant="labelSm" color={colors.secondary}>
                اضغط للذكر
              </AppText>
            </View>
          </Pressable>
        </View>
        <View style={styles.toolbar}>
          <Icon name="vibration" size={14} color={colors.outline} />
          <AppText variant="labelSm" color={colors.outline}>
            الاهتزاز اللمسي مفعّل تلقائياً
          </AppText>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.prev} onPress={goPrev} disabled={index === 0}>
          <Icon name="arrow-forward" size={20} color={colors.onSurfaceVariant} />
          <AppText variant="labelLg" color={colors.onSurfaceVariant}>
            السابق
          </AppText>
        </Pressable>
        <Pressable style={styles.reset} onPress={() => setCount(0)}>
          <Icon name="replay" size={18} color={colors.secondary} />
          <AppText variant="labelLg" color={colors.onSurface}>
            إعادة
          </AppText>
        </Pressable>
        <Pressable style={styles.next} onPress={goNext}>
          <AppText variant="labelLg" color={colors.onPrimary}>
            التالي
          </AppText>
          <Icon name="arrow-back" size={20} color={colors.onPrimary} />
        </Pressable>
      </View>

      <ConfirmDialog
        visible={exitOpen}
        title="حفظ الورد ومغادرة؟"
        message={`سيتم حفظ مكان وصولك (${toEasternNumerals(index + 1)} من ${toEasternNumerals(total)}) بدقة لتواصل في أي وقت تشاء دون فقدان الأجر.`}
        confirmLabel="متابعة القراءة لاحقاً"
        cancelLabel="البقاء ومتابعة الذكر"
        onConfirm={() => {
          setExitOpen(false);
          navigateBack();
        }}
        onCancel={() => setExitOpen(false)}
      />
      </ScrollView>

      {audioStatus.playing || audioStatus.isBuffering ? (
        <View style={styles.toast}>
          <View style={styles.toolbar}>
            <Icon name="graphic-eq" size={20} color={colors.secondaryFixed} />
            <AppText variant="labelMd" color={colors.onPrimary} style={{ flex: 1 }}>
              {audioStatus.isBuffering ? 'جاري تحميل التلاوة...' : dhikr.audioLabel ?? 'التلاوة الصوتية'}
            </AppText>
          </View>
          <Pressable onPress={() => audioPlayer.pause()} accessibilityLabel="إيقاف الاستماع">
            <Icon name="pause" size={18} color={colors.onPrimary} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.xl,
  },
  verticalScroll: { flex: 1, width: '100%' },
  scrollContent: { gap: spacing.md, paddingBottom: spacing.xl },
  topBarScroll: { flexGrow: 0, width: '100%' },
  topBarContent: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 2 },
  toolbar: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
  },
  audio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
  },
  audioDisabled: { opacity: 0.55 },
  live: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.secondary },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  goldDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.secondary },
  virtue: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: 4,
  },
  counterWrap: { alignItems: 'center', gap: 8 },
  ringBox: { width: 224, height: 224, alignItems: 'center', justifyContent: 'center' },
  svg: { position: 'absolute', transform: [{ rotate: '-90deg' }] },
  tap: {
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    elevation: 3,
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
    marginTop: 8,
  },
  actions: { flexDirection: 'row', gap: spacing.sm },
  prev: {
    flex: 1,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceContainerLow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  reset: {
    flex: 1,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceContainerLowest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  next: {
    flex: 1,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  primaryBtn: {
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  completeCard: {
    marginTop: 80,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  toast: {
    position: 'absolute',
    left: spacing.margin,
    right: spacing.margin,
    bottom: 24,
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
});
