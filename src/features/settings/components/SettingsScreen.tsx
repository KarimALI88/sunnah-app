import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/shared/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { useSettings } from '@/providers/SettingsProvider';
import { colors, radii, spacing } from '@/theme';
import { toEasternNumerals } from '@/utils/numerals';

const FONT_SIZES = [
  { label: 'صغير', size: 16 },
  { label: 'متوسط', size: 20 },
  { label: 'كبير', size: 24 },
  { label: 'كبير جداً', size: 28 },
];

export function SettingsScreen() {
  const { settings, update } = useSettings();
  const currentFontSize = settings.dhikrFontSize ?? 20;

  return (
    <View style={styles.container}>
      <AppHeader title="الإعدادات" subtitle="تخصيص تجربتك" showBrand={true} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Title & Subtitle */}
        <View style={styles.topSection}>
          <View style={styles.titleRow}>
            <View style={styles.titleWithIcon}>
              <Icon name="tune" size={24} color={colors.primary} />
              <AppText variant="headlineLg" color={colors.primary}>
                الإعدادات
              </AppText>
            </View>
            <View style={styles.circleIcon}>
              <Icon name="settings-suggest" size={20} color={colors.primaryContainer} />
            </View>
          </View>
          <AppText variant="bodySm" color={colors.onSurfaceVariant}>
            تخصيص تجربة الاستخدام والقراءة
          </AppText>
        </View>

        {/* Account & Profile Card (Guest Mode) */}
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.profileInfo}>
              <View style={styles.avatarWrap}>
                <Icon name="person-outline" size={24} color={colors.onPrimary} />
                <View style={styles.avatarBadge} />
              </View>
              <View>
                <View style={styles.nameRow}>
                  <AppText variant="labelLg" color={colors.primary}>
                    ضيف
                  </AppText>
                  <View style={styles.localBadge}>
                    <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                      محلي
                    </AppText>
                  </View>
                </View>
                <AppText variant="bodySm" color={colors.onSurfaceVariant}>
                  حساب محلي • حفظ البيانات على جهازك
                </AppText>
              </View>
            </View>
          </View>
          <View style={styles.cloudCard}>
            <View style={styles.cloudLeft}>
              <Icon name="verified-user" size={18} color={colors.gold} />
              <AppText variant="labelSm" color={colors.onSurface}>
                احفظ أورادك وإنجازاتك عبر السحابة
              </AppText>
            </View>
            <AppText variant="labelSm" color={colors.secondary} style={{ fontWeight: '600' }}>
              مجانًا
            </AppText>
          </View>
        </View>

        {/* Font Size & Dynamic Preview Section */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View style={styles.titleWithIcon}>
              <Icon name="format-size" size={20} color={colors.gold} />
              <AppText variant="labelLg" color={colors.primary}>
                حجم خط الأذكار والنصوص
              </AppText>
            </View>
            <View style={styles.badgeGold}>
              <AppText variant="labelMd" color={colors.secondary}>
                {FONT_SIZES.find((f) => f.size === currentFontSize)?.label ?? 'متوسط'} ({toEasternNumerals(currentFontSize)})
              </AppText>
            </View>
          </View>

          {/* Live Verse Preview */}
          <View style={styles.previewBox}>
            <AppText
              variant="quranVerse"
              color={colors.primary}
              align="center"
              style={{ fontSize: currentFontSize, lineHeight: currentFontSize * 1.8 }}>
              بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ
            </AppText>
            <AppText variant="labelSm" color={colors.onSurfaceVariant} align="center" style={{ marginTop: 4 }}>
              معاينة حية لحجم الخط أثناء القراءة
            </AppText>
          </View>

          {/* Font Size Options */}
          <View style={styles.fontSizeRow}>
            {FONT_SIZES.map((item) => (
              <Pressable
                key={item.size}
                onPress={() => update({ dhikrFontSize: item.size })}
                style={[
                  styles.fontSizeBtn,
                  currentFontSize === item.size && styles.fontSizeBtnActive,
                ]}>
                <AppText
                  variant="labelMd"
                  color={currentFontSize === item.size ? colors.primaryContainer : colors.onSurfaceVariant}>
                  {item.label}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* App Info & About */}
        <View style={styles.card}>
          <View style={styles.appInfoWrap}>
            <View style={styles.appLogoCircle}>
              <Image source={require('../../../../assets/images/sunnah-transparent.png')} style={styles.appLogo} resizeMode="contain" />
            </View>
            <AppText variant="headlineMd" color={colors.primary}>
              تطبيق سُنَّةُ (Sunnah)
            </AppText>
            <AppText variant="labelSm" color={colors.onSurfaceVariant}>
              الإصدار ١.٠.٠ • سُنَّةُ
            </AppText>
            <AppText variant="bodySm" color={colors.onSurfaceVariant} align="center" style={{ marginTop: 6 }}>
              ملاذك الرقمي الهادئ للأذكار والمأثورات النبوية ومواقيت الصلاة، صُمم بعناية وتأمل ليعينك على دوام ذكر الله وطمأنينة القلب.
            </AppText>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  circleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: '#091F26',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeGold: {
    backgroundColor: 'rgba(255, 219, 148, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.secondaryFixedDim,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  localBadge: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  cloudCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainer,
    borderRadius: radii.lg,
    padding: 10,
  },
  cloudLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: 6,
  },
  fontSizeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  fontSizeBtn: {
    flex: 1,
    height: 38,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  fontSizeBtnActive: {
    backgroundColor: colors.secondaryContainer,
    borderColor: colors.gold,
  },
  appInfoWrap: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: 4,
  },
  appLogoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.gold,
    marginBottom: spacing.xs,
  },
  appLogo: {
    width: 48,
    height: 48,
  },
});
