import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { LocationAccessPrompt } from '@/components/shared/LocationAccessPrompt';
import { useCategories } from '@/features/azkar/hooks/useAzkar';
import { dailyReflection } from '@/features/home/data/home.mock';
import { useUpcomingPrayer } from '@/features/prayer-times/hooks/usePrayerTimes';
import { useLocationRefresh } from '@/features/prayer-times/hooks/useLocationRefresh';
import { useWirdMutations, useWirds } from '@/features/wird/hooks/useWirds';
import { formatCountdown, toEasternNumerals } from '@/utils/numerals';
import { colors, radii, spacing } from '@/theme';

const compactIcons = {
  fajr: 'brightness-3',
  sunrise: 'wb-sunny',
  dhuhr: 'wb-sunny',
  asr: 'wb-sunny',
  maghrib: 'brightness-4',
  isha: 'nights-stay',
} as const;

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { data: categories } = useCategories();
  const { data: day, upcoming, isLoading: prayerTimesLoading } = useUpcomingPrayer();
  const locationRefresh = useLocationRefresh();
  const { data: wirds } = useWirds();
  const { increment } = useWirdMutations();

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.greeting}>
        <View>
          <AppText variant="headlineMd" color={colors.primary}>
            السلام عليكم ورحمة الله
          </AppText>
          <View style={styles.metaRow}>
            <Icon name="event" size={16} color={colors.secondary} />
            <AppText variant="labelMd" color={colors.onSurfaceVariant}>
              {day?.hijriDate ?? '—'}
            </AppText>
            <View style={styles.dot} />
            <Icon name="place" size={16} color={colors.secondary} />
            <AppText variant="labelMd" color={colors.onSurfaceVariant}>
              {day?.city ?? '—'}
            </AppText>
          </View>
        </View>
        <View style={styles.roundIcon}>
          <Image
            source={require('../../../../assets/images/sunnah-transparent.png')}
            style={styles.homeLogo}
            resizeMode="contain"
            accessibilityLabel="شعار سنة"
          />
        </View>
      </View>

      {!day && !prayerTimesLoading ? (
        <LocationAccessPrompt
          isRefreshing={locationRefresh.isRefreshing}
          needsSettings={locationRefresh.needsSettings}
          error={locationRefresh.error}
          onRequestLocation={locationRefresh.requestCurrentLocation}
          onOpenSettings={locationRefresh.openSettings}
        />
      ) : null}

      <Pressable style={styles.hero} onPress={() => router.push('/(tabs)/prayer-times')}>
        <View style={styles.heroTop}>
          <View style={styles.pill}>
            <View style={styles.liveDot} />
            <AppText variant="labelSm" color={colors.secondaryFixed}>
              الصلاة القادمة
            </AppText>
          </View>
          <View style={styles.heroTop}>
            <Icon name="volume-up" size={18} color={colors.onPrimaryContainer} />
            <AppText variant="labelSm" color={colors.onPrimaryContainer}>
              الأذان مفعل
            </AppText>
          </View>
        </View>
        <View style={styles.heroBody}>
          <View>
            <AppText variant="displayLg" color={colors.onPrimary}>
              صلاة {upcoming?.prayer.name ?? '—'}
            </AppText>
            <AppText variant="bodySm" color={colors.onPrimaryContainer}>
              موعد الأذان: {upcoming?.prayer.timeLabel ?? '—'}
            </AppText>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <AppText variant="labelSm" color={colors.onPrimaryContainer}>
              الوقت المتبقي
            </AppText>
            <AppText variant="headlineLg" color={colors.secondaryFixed} align="left">
              {formatCountdown(upcoming?.remainingSeconds ?? 0)}
            </AppText>
          </View>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.round((upcoming?.progress ?? 0.65) * 100)}%` }]} />
        </View>
      </Pressable>

      <View style={styles.sectionHead}>
        <AppText variant="labelLg" color={colors.primary}>
          مواقيت صلاة اليوم
        </AppText>
        <Pressable onPress={() => router.push('/(tabs)/prayer-times')} style={styles.link}>
          <AppText variant="labelSm" color={colors.secondary}>
            عرض الشهر
          </AppText>
          <Icon name="chevron-left" size={14} color={colors.secondary} />
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.prayerRow}>
        {day?.prayers.map((prayer) => {
          const active = upcoming?.prayer.id === prayer.id;
          return (
            <View key={prayer.id} style={[styles.prayerChip, active && styles.prayerChipActive]}>
              <AppText
                variant="labelSm"
                color={active ? colors.onSecondaryContainer : colors.onSurfaceVariant}
                align="center">
                {prayer.name}
              </AppText>
              <Icon
                name={compactIcons[prayer.id]}
                size={20}
                color={active ? colors.onSecondaryContainer : colors.onSurfaceVariant}
              />
              <AppText
                variant="labelMd"
                color={active ? colors.onSecondaryContainer : colors.onSurface}
                align="center">
                {prayer.timeLabel}
              </AppText>
              {active ? <View style={styles.activeDot} /> : null}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.sectionHead}>
        <AppText variant="labelLg" color={colors.primary}>
          الخدمات
        </AppText>
        <AppText variant="labelSm" color={colors.onSurfaceVariant}>
          ٤ أبواب رئيسية
        </AppText>
      </View>
      <View style={styles.grid}>
        {(categories ?? []).filter((category) => category.id !== 'allah-names').map((category) => (
          <Pressable
            key={category.id}
            style={styles.service}
            onPress={() => {
              if (category.id === 'allah-names') {
                router.push('/allah-names');
              } else {
                router.push(`/azkar/${category.id}`);
              }
            }}>
            <View
              style={[
                styles.serviceIcon,
                { backgroundColor: colors.surfaceContainer },
              ]}>
              <Icon
                name={
                  category.id === 'allah-names'
                    ? 'auto-awesome'
                    : category.id === 'ruqyah'
                    ? 'shield'
                    : category.id === 'duas'
                    ? 'front-hand'
                    : 'wb-sunny'
                }
                size={24}
                color={category.accent === 'gold' ? colors.secondary : colors.primaryContainer}
              />
            </View>
            <AppText variant="labelLg" color={colors.primary}>
              {category.title}
            </AppText>
            <AppText variant="labelSm" color={colors.onSurfaceVariant}>
              {category.subtitle}
            </AppText>
          </Pressable>
        ))}
        <Pressable
          style={styles.service}
          accessibilityRole="button"
          onPress={() => router.push('/allah-names')}>
          <View style={[styles.serviceIcon, { backgroundColor: colors.surfaceContainer }]}>
            <Icon name="auto-awesome" size={24} color={colors.secondary} />
          </View>
          <AppText variant="labelLg" color={colors.primary}>
            أسماء الله الحسنى
          </AppText>
          <AppText variant="labelSm" color={colors.onSurfaceVariant}>
            ٩٩ اسماً مباركاً
          </AppText>
        </Pressable>
      </View>

      <View style={styles.sectionHead}>
        <View style={styles.metaRow}>
          <AppText variant="labelLg" color={colors.primary}>
            الأوراد الشخصية
          </AppText>
          <View style={styles.countBadge}>
            <AppText variant="labelSm" color={colors.primary} align="center">
              {toEasternNumerals(wirds?.length ?? 0)}
            </AppText>
          </View>
        </View>
        <Pressable style={styles.addChip} onPress={() => router.push('/wird/create')}>
          <Icon name="add" size={16} color={colors.primary} />
          <AppText variant="labelMd" color={colors.primary}>
            ورد جديد
          </AppText>
        </Pressable>
      </View>

      {(wirds ?? []).map((wird) => {
        const done = wird.currentCount >= wird.targetCount;
        const percent = Math.min(100, (wird.currentCount / wird.targetCount) * 100);
        const remaining = Math.max(0, wird.targetCount - wird.currentCount);
        return (
          <Pressable
            key={wird.id}
            style={styles.wirdCard}
            onPress={() => increment.mutate(wird)}
            onLongPress={() => router.push('/(tabs)/wird')}>
            <View style={styles.wirdTop}>
              <View style={styles.metaRow}>
                <View style={[styles.wirdIcon, done && { backgroundColor: colors.tertiaryFixed }]}>
                  <Icon
                    name={done ? 'check' : 'repeat'}
                    size={20}
                    color={done ? colors.onTertiaryFixed : colors.onSecondaryContainer}
                  />
                </View>
                <View>
                  <AppText variant="labelLg" color={colors.onSurface}>
                    {wird.title}
                  </AppText>
                  <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                    الهدف اليومي: {toEasternNumerals(wird.targetCount)} مرة
                  </AppText>
                </View>
              </View>
              {done ? (
                <View style={styles.donePill}>
                  <Icon name="done-all" size={14} color={colors.onTertiaryFixed} />
                  <AppText variant="labelSm" color={colors.onTertiaryFixed}>
                    مكتمل
                  </AppText>
                </View>
              ) : (
                <AppText variant="labelLg" color={colors.secondary}>
                  {toEasternNumerals(wird.currentCount)} / {toEasternNumerals(wird.targetCount)}
                </AppText>
              )}
            </View>
            <View style={styles.wirdTrack}>
              <View
                style={[
                  styles.wirdFill,
                  {
                    width: `${percent}%`,
                    backgroundColor: done ? colors.tertiary : colors.secondary,
                  },
                ]}
              />
            </View>
            <View style={styles.wirdTop}>
              <AppText variant="labelSm" color={done ? colors.tertiary : colors.onSurfaceVariant}>
                {done ? 'أُتم بحمد الله' : `متبقي ${toEasternNumerals(remaining)}`}
              </AppText>
              <AppText variant="labelSm" color={done ? colors.onSurfaceVariant : colors.secondary}>
                {done
                  ? `${toEasternNumerals(wird.currentCount)} / ${toEasternNumerals(wird.targetCount)}`
                  : 'المس للتسبيح +١'}
              </AppText>
            </View>
          </Pressable>
        );
      })}

      <View style={styles.quote}>
        <View style={styles.metaRow}>
          <Icon name="format-quote" size={18} color={colors.primary} />
          <AppText variant="labelSm" color={colors.primary}>
            فائدة اليوم
          </AppText>
        </View>
        <AppText variant="bodySm" color={colors.onSurface}>
          {dailyReflection}
        </AppText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.surface },
  content: { paddingHorizontal: spacing.margin, paddingBottom: 120, gap: spacing.lg },
  greeting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.outlineVariant },
  roundIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeLogo: {
    width: 40,
    height: 40,
  },
  hero: {
    backgroundColor: colors.primaryContainer,
    borderRadius: radii.lg,
    padding: spacing.lg,
    overflow: 'hidden',
    gap: spacing.md,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.secondaryFixed },
  heroBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  track: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.15)', overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.secondaryFixed, borderRadius: 3 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  prayerRow: { gap: 6, paddingVertical: 4 },
  prayerChip: {
    minWidth: 72,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    gap: 4,
  },
  prayerChipActive: { backgroundColor: colors.secondaryContainer, minWidth: 76 },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
    position: 'absolute',
    bottom: -2,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  service: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: 4,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  countBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  wirdCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: 8,
  },
  wirdTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wirdIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,219,148,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wirdTrack: { height: 8, borderRadius: 4, backgroundColor: colors.surfaceContainer, overflow: 'hidden' },
  wirdFill: { height: '100%', borderRadius: 4 },
  donePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(211,231,224,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  quote: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: 4,
  },
});
