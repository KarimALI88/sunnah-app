import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Polygon, Text as SvgText } from 'react-native-svg';

import { AppHeader } from '@/components/shared/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { useQibla } from '@/features/qibla/hooks/useQibla';
import { colors, radii, spacing } from '@/theme';
import { toEasternNumerals } from '@/utils/numerals';

export function QiblaScreen() {
  const { reading, retry } = useQibla();
  const lastVibratedRef = useRef(false);

  const heading = reading.heading ?? 0;
  const qiblaBearing = reading.qiblaBearing ?? 248;
  const relativeAngle = reading.relativeAngle ?? (qiblaBearing - heading);

  // Check if aligned towards Qibla (within 6 degrees)
  const isAligned = Math.abs(relativeAngle) <= 6;

  useEffect(() => {
    if (isAligned && !lastVibratedRef.current) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      lastVibratedRef.current = true;
    } else if (!isAligned) {
      lastVibratedRef.current = false;
    }
  }, [isAligned]);

  return (
    <View style={[styles.container, isAligned && styles.containerAligned]}>
      <AppHeader title="اتجاه القبلة" subtitle="البوصلة الدقيقة" showBrand={true} />

      <View style={styles.content}>
        {/* Status Chip */}
        <View style={styles.statusChipWrap}>
          <View
            style={[
              styles.statusChip,
              isAligned && styles.statusChipAligned,
              reading.usingFallback && styles.statusChipFallback,
            ]}>
            <View
              style={[
                styles.statusDot,
                isAligned && styles.statusDotAligned,
                reading.usingFallback && styles.statusDotFallback,
              ]}
            />
            <AppText
              variant="labelMd"
              color={
                isAligned
                  ? colors.tertiary
                  : reading.usingFallback
                  ? colors.secondary
                  : colors.primary
              }>
              {isAligned
                ? 'أنت باتجاه القبلة المشرفة مباشرة!'
                : reading.usingFallback
                ? 'وضع المحاكاة (موقع الرياض)'
                : 'أدر الهاتف حتى يتطابق السهم مع الكعبة'}
            </AppText>
          </View>
        </View>

        {/* Degrees and Reading Info */}
        <View style={styles.degreeWrap}>
          <View style={styles.degreeRow}>
            <AppText variant="displayLg" color={isAligned ? colors.onPrimary : colors.primary}>
              {toEasternNumerals(Math.round(qiblaBearing))}°
            </AppText>
            <AppText
              variant="bodyMd"
              color={isAligned ? colors.onPrimaryContainer : colors.onSurfaceVariant}
              style={{ marginTop: 8 }}>
              نحو الكعبة المشرفة
            </AppText>
          </View>
          <AppText variant="labelSm" color={isAligned ? colors.onPrimaryContainer : colors.outline}>
            زاوية البوصلة الحالية: {toEasternNumerals(Math.round(heading))}°
          </AppText>
        </View>

        {/* Big Interactive Compass Dial */}
        <View style={styles.compassWrapper}>
          {/* Ambient Gold Glow when aligned */}
          {isAligned ? <View style={styles.glowAligned} /> : null}

          <View style={[styles.dialCircle, isAligned && styles.dialCircleAligned]}>
            {/* Rotating dial based on heading */}
            <View
              style={[
                styles.dialRotate,
                { transform: [{ rotate: `${-heading}deg` }] },
              ]}>
              <Svg width={260} height={260} viewBox="0 0 260 260">
                {/* Outer Ring */}
                <Circle
                  cx="130"
                  cy="130"
                  r="120"
                  stroke={colors.surfaceContainerHighest}
                  strokeWidth="2"
                  fill="transparent"
                />
                <Circle
                  cx="130"
                  cy="130"
                  r="105"
                  stroke={colors.outlineVariant}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  fill="transparent"
                />

                {/* Cardinal Points */}
                <SvgText
                  x="130"
                  y="26"
                  fill={colors.error}
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle">
                  N (ش)
                </SvgText>
                <SvgText
                  x="238"
                  y="135"
                  fill={colors.onSurfaceVariant}
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="middle">
                  E (ق)
                </SvgText>
                <SvgText
                  x="130"
                  y="246"
                  fill={colors.onSurfaceVariant}
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="middle">
                  S (ج)
                </SvgText>
                <SvgText
                  x="22"
                  y="135"
                  fill={colors.onSurfaceVariant}
                  fontSize="12"
                  fontWeight="600"
                  textAnchor="middle">
                  W (غ)
                </SvgText>

                {/* Degree tick marks every 30 deg */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
                  const rad = ((deg - 90) * Math.PI) / 180;
                  const x1 = 130 + 112 * Math.cos(rad);
                  const y1 = 130 + 112 * Math.sin(rad);
                  const x2 = 130 + 120 * Math.cos(rad);
                  const y2 = 130 + 120 * Math.sin(rad);
                  return (
                    <Line
                      key={deg}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={deg % 90 === 0 ? colors.primary : colors.outlineVariant}
                      strokeWidth={deg % 90 === 0 ? '2' : '1'}
                    />
                  );
                })}

                {/* Kaaba Direction Marker on the dial */}
                <G transform={`rotate(${qiblaBearing}, 130, 130)`}>
                  <Line
                    x1="130"
                    y1="130"
                    x2="130"
                    y2="34"
                    stroke={colors.gold}
                    strokeWidth="3"
                    strokeDasharray="4 2"
                  />
                  {/* Kaaba Golden Icon */}
                  <Circle cx="130" cy="30" r="14" fill={colors.gold} />
                  <Circle cx="130" cy="30" r="10" fill={colors.primary} />
                </G>
              </Svg>
            </View>

            {/* Static Center Pivot & Needle */}
            <View style={styles.centerPivot}>
              <View
                style={[
                  styles.needleWrap,
                  { transform: [{ rotate: `${relativeAngle}deg` }] },
                ]}>
                <View style={styles.needlePointer}>
                  <Icon name="navigation" size={36} color={isAligned ? colors.gold : colors.primary} />
                </View>
              </View>
              <View style={styles.pivotDot} />
            </View>
          </View>
        </View>

        {/* Accuracy and Sensor Guidance Card */}
        <View style={styles.guidanceCard}>
          <View style={styles.guidanceHeader}>
            <Icon
              name={reading.usingFallback ? 'info-outline' : 'explore'}
              size={18}
              color={colors.secondary}
            />
            <AppText variant="labelMd" color={colors.primary}>
              {reading.usingFallback ? 'تنبيه الوضع التجريبي' : 'دقة البوصلة والمستشعر'}
            </AppText>
          </View>
          <AppText variant="bodySm" color={colors.onSurfaceVariant} leading="relaxed">
            {reading.accuracyNote ||
              'الاتجاه محسوب من موقعك الجغرافي الحالي ومحاذاة خط الطول والعرض مع مكة المكرمة.'}
          </AppText>

          {reading.usingFallback ? (
            <Pressable onPress={() => retry()} style={styles.retryBtn}>
              <Icon name="refresh" size={16} color={colors.primary} />
              <AppText variant="labelSm" color={colors.primary}>
                إعادة فحص مستشعرات الجهاز والموقع
              </AppText>
            </Pressable>
          ) : null}
        </View>

        {/* Coordinates Footer */}
        <View style={styles.coordsFooter}>
          <AppText variant="labelSm" color={isAligned ? colors.onPrimaryContainer : colors.outline}>
            إحداثيات الكعبة المشرفة: ٢١.٤٢٢٥° N ، ٣٩.٨٢٦٢° E
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  containerAligned: {
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.margin,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  statusChipWrap: {
    width: '100%',
    alignItems: 'center',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statusChipAligned: {
    backgroundColor: colors.tertiaryFixed,
    borderColor: colors.tertiary,
  },
  statusChipFallback: {
    backgroundColor: colors.secondaryContainer,
    borderColor: colors.gold,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  statusDotAligned: {
    backgroundColor: colors.tertiary,
  },
  statusDotFallback: {
    backgroundColor: colors.secondary,
  },
  degreeWrap: {
    alignItems: 'center',
    gap: 2,
  },
  degreeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  compassWrapper: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowAligned: {
    position: 'absolute',
    width: 290,
    height: 290,
    borderRadius: 145,
    backgroundColor: 'rgba(181, 150, 85, 0.25)',
    transform: [{ scale: 1.05 }],
  },
  dialCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#091F26',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.surfaceContainerHigh,
    position: 'relative',
  },
  dialCircleAligned: {
    borderColor: colors.gold,
    borderWidth: 3,
  },
  dialRotate: {
    width: 260,
    height: 260,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPivot: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  needleWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  needlePointer: {
    transform: [{ translateY: -20 }],
  },
  pivotDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
    position: 'absolute',
  },
  guidanceCard: {
    width: '100%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: spacing.md,
    gap: 6,
    shadowColor: '#091F26',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  guidanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceContainerLow,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    marginTop: 4,
  },
  coordsFooter: {
    alignItems: 'center',
  },
});
