import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { AppHeader } from '@/components/shared/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { usePrayerTimes, useUpcomingPrayer } from '@/features/prayer-times/hooks/usePrayerTimes';
import type { PrayerTime } from '@/features/prayer-times/types';
import { useSettings } from '@/providers/SettingsProvider';
import { colors, radii, spacing } from '@/theme';
import { formatCountdown } from '@/utils/numerals';

export function PrayerTimesScreen() {
  const { data: day } = usePrayerTimes();
  const { upcoming } = useUpcomingPrayer();
  const { settings, setPrayerAlert, update } = useSettings();
  const [selectedCity, setSelectedCity] = useState('الرياض، السعودية');

  const prayers = day?.prayers ?? [];

  return (
    <View style={styles.container}>
      <AppHeader title="مواقيت الصلاة" subtitle={selectedCity} showBrand={true} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Top Location & Date Header */}
        <View style={styles.topSection}>
          <View style={styles.locationRow}>
            <AppText variant="headlineLg" color={colors.primary}>
              مواقيت الصلاة
            </AppText>
            <View style={styles.locationChip}>
              <Icon name="near-me" size={16} color={colors.gold} />
              <AppText variant="labelSm" color={colors.onSurface}>
                {selectedCity}
              </AppText>
              <Icon name="tune" size={14} color={colors.onSurfaceVariant} />
            </View>
          </View>
          <View style={styles.dateRow}>
            <Icon name="event" size={16} color={colors.gold} />
            <AppText variant="labelMd" color={colors.onSurfaceVariant}>
              {day?.hijriDate ?? 'الجمعة، ١٤ رمضان ١٤٤٦ هـ'} • {day?.gregorianDate ?? '٢١ مارس'}
            </AppText>
          </View>
        </View>

        {/* Upcoming Prayer Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroBadge}>
              <View style={styles.livePulse} />
              <AppText variant="labelMd" color={colors.secondaryFixed}>
                الصلاة القادمة
              </AppText>
            </View>
            <Pressable
              accessibilityLabel="تغيير تنبيه الأذان للصلاة القادمة"
              onPress={() => update({ adhanEnabled: !settings.adhanEnabled })}
              style={styles.heroSoundBtn}>
              <Icon
                name={settings.adhanEnabled ? 'notifications-active' : 'notifications-off'}
                size={20}
                color={colors.onPrimary}
              />
            </Pressable>
          </View>

          <View style={styles.heroMain}>
            <View>
              <AppText variant="displayLg" color={colors.onPrimary}>
                {upcoming?.prayer.name ?? 'العصر'}
              </AppText>
              <AppText variant="labelMd" color={colors.onPrimaryContainer} style={{ marginTop: 2 }}>
                الأذان القادم: {upcoming?.prayer.timeLabel ?? '٠٤:٣٠ م'}
              </AppText>
            </View>

            {/* Circular Progress Arc */}
            <View style={styles.arcContainer}>
              <Svg width={76} height={76} viewBox="0 0 76 76" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle
                  cx="38"
                  cy="38"
                  r="30"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="4"
                  fill="transparent"
                />
                <Circle
                  cx="38"
                  cy="38"
                  r="30"
                  stroke={colors.gold}
                  strokeWidth="4.5"
                  fill="transparent"
                  strokeDasharray="188.4"
                  strokeDashoffset={188.4 * (1 - (upcoming?.progress ?? 0.65))}
                  strokeLinecap="round"
                />
              </Svg>
              <View style={styles.arcCenterIcon}>
                <Icon name="wb-sunny" size={24} color={colors.secondaryFixed} />
              </View>
            </View>
          </View>

          {/* Countdown Display Box */}
          <View style={styles.countdownBox}>
            <View style={styles.countdownLabelRow}>
              <Icon name="hourglass-top" size={18} color={colors.secondaryFixed} />
              <AppText variant="labelSm" color={colors.onPrimaryContainer}>
                متبقي للأذان
              </AppText>
            </View>
            <AppText
              variant="headlineMd"
              color={colors.surfaceBright}
              align="left"
              style={styles.countdownNumbers}>
              {formatCountdown(upcoming?.remainingSeconds ?? 0)}
            </AppText>
          </View>
        </View>

        {/* Today's Prayers Section */}
        <View style={styles.sectionHeader}>
          <AppText variant="labelLg" color={colors.primary}>
            مواقيت صلاة اليوم
          </AppText>
          <AppText variant="labelSm" color={colors.onSurfaceVariant}>
            توقيت أم القرى
          </AppText>
        </View>

        <View style={styles.prayersList}>
          {prayers.map((prayer) => {
            const isUpcoming = upcoming?.prayer.id === prayer.id;
            const isAlertOn = settings.prayerAlerts[prayer.id] ?? false;

            return (
              <View
                key={prayer.id}
                style={[
                  styles.prayerRow,
                  isUpcoming && styles.prayerRowActive,
                ]}>
                <View style={styles.prayerRight}>
                  <View
                    style={[
                      styles.prayerIconWrap,
                      isUpcoming && styles.prayerIconWrapActive,
                    ]}>
                    <Icon
                      name={prayer.icon as any}
                      size={20}
                      color={isUpcoming ? colors.gold : colors.primary}
                    />
                  </View>
                  <View>
                    <View style={styles.nameRow}>
                      <AppText
                        variant="headlineMd"
                        color={isUpcoming ? colors.primaryContainer : colors.onSurface}>
                        {prayer.name}
                      </AppText>
                      {prayer.isSunrise ? (
                        <View style={styles.tagSunrise}>
                          <AppText variant="labelSm" color={colors.tertiary}>
                            شروق
                          </AppText>
                        </View>
                      ) : null}
                    </View>
                    <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                      {prayer.status ?? ''}
                    </AppText>
                  </View>
                </View>

                <View style={styles.prayerLeft}>
                  <AppText
                    variant="headlineMd"
                    color={isUpcoming ? colors.goldDark : colors.onSurface}
                    style={styles.prayerTime}>
                    {prayer.timeLabel}
                  </AppText>
                  {!prayer.isSunrise ? (
                    <Pressable
                      accessibilityLabel={`تنبيه ${prayer.name}`}
                      onPress={() => setPrayerAlert(prayer.id, !isAlertOn)}
                      style={[
                        styles.alertBtn,
                        isAlertOn && styles.alertBtnActive,
                      ]}>
                      <Icon
                        name={isAlertOn ? 'notifications-active' : 'notifications-none'}
                        size={18}
                        color={isAlertOn ? colors.gold : colors.outline}
                      />
                    </Pressable>
                  ) : (
                    <View style={{ width: 36 }} />
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Qibla Direction Shortcut Banner */}
        <Pressable
          style={styles.qiblaBanner}
          onPress={() => router.push('/(tabs)/qibla')}>
          <View style={styles.qiblaBannerRight}>
            <View style={styles.qiblaIconCircle}>
              <Icon name="explore" size={24} color={colors.gold} />
            </View>
            <View>
              <AppText variant="labelLg" color={colors.primary}>
                اتجاه القبلة
              </AppText>
              <AppText variant="bodySm" color={colors.onSurfaceVariant}>
                بوصلة تفاعلية دقيقة نحو مكة المكرمة
              </AppText>
            </View>
          </View>
          <View style={styles.arrowCircle}>
            <Icon name="arrow-back-ios" size={16} color={colors.primary} />
          </View>
        </Pressable>

        {/* Night Prayer and Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Icon name="nights-stay" size={18} color={colors.primary} />
            <AppText variant="labelMd" color={colors.primary}>
              أوقات قيام الليل والثلث الأخير
            </AppText>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                منتصف الليل
              </AppText>
              <AppText variant="headlineMd" color={colors.primary}>
                {day?.night?.midnightLabel ?? '١١:٣٠ م'}
              </AppText>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoCol}>
              <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                الثلث الأخير (وقت النزول)
              </AppText>
              <AppText variant="headlineMd" color={colors.goldDark}>
                {day?.night?.lastThirdLabel ?? '٠١:١٥ ص'}
              </AppText>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  topSection: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  heroCard: {
    backgroundColor: colors.primaryContainer,
    borderRadius: radii.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    shadowColor: colors.primaryContainer,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    gap: spacing.md,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  livePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondaryFixed,
  },
  heroSoundBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arcContainer: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  arcCenterIcon: {
    position: 'absolute',
  },
  countdownBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countdownLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countdownNumbers: {
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: spacing.xs,
  },
  prayersList: {
    gap: spacing.sm,
  },
  prayerRow: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#091F26',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  prayerRowActive: {
    borderColor: colors.gold,
    backgroundColor: '#FAF7F0',
    shadowColor: colors.gold,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  prayerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  prayerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerIconWrapActive: {
    backgroundColor: colors.secondaryContainer,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagSunrise: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  prayerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  prayerTime: {
    minWidth: 70,
  },
  alertBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
  },
  alertBtnActive: {
    backgroundColor: colors.secondaryContainer,
  },
  qiblaBanner: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    shadowColor: '#091F26',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  qiblaBannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  qiblaIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 4,
  },
  infoCol: {
    alignItems: 'center',
    gap: 2,
  },
  infoDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.outlineVariant,
  },
});
