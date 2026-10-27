import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';

import { AppHeader } from '@/components/shared/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { useSettings } from '@/providers/SettingsProvider';
import { colors, radii, spacing } from '@/theme';
import { toEasternNumerals } from '@/utils/numerals';

const RECITERS = [
  { id: 'afasy', name: 'الشيخ مشاري راشد العفاسي', desc: 'تلاوة مريحة بالأحكام والسكينة' },
  { id: 'ghamdi', name: 'الشيخ سعد بن سعيد الغامدي', desc: 'صوت شجي وترتيل خاشع' },
  { id: 'ajmy', name: 'الشيخ أحمد بن علي العجمي', desc: 'قراءة مؤثرة بنبرة واضحة' },
];

const FONT_SIZES = [
  { label: 'صغير', size: 16 },
  { label: 'متوسط', size: 20 },
  { label: 'كبير', size: 24 },
  { label: 'كبير جداً', size: 28 },
];

export function SettingsScreen() {
  const { settings, update } = useSettings();
  const [selectedReciter, setSelectedReciter] = useState('afasy');
  const [morningReminder, setMorningReminder] = useState(true);
  const [eveningReminder, setEveningReminder] = useState(true);
  const [nightReminder, setNightReminder] = useState(true);

  const currentFontSize = settings.dhikrFontSize ?? 20;

  return (
    <View style={styles.container}>
      <AppHeader title="الإعدادات" subtitle="تخصيص التجربة والتنبيهات" showBrand={true} />

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
            تخصيص تجربة الاستخدام، القراءة، والتنبيهات
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
                    ضيف كريم
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
            <Pressable
              onPress={() => Alert.alert('حساب المستخدم', 'ميزة تسجيل الدخول ستكون متاحة قريباً مع المزامنة السحابية.')}
              style={styles.loginBtn}>
              <AppText variant="labelMd" color={colors.primaryContainer}>
                دخول
              </AppText>
              <Icon name="arrow-back-ios" size={14} color={colors.primaryContainer} />
            </Pressable>
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

        {/* Audio Reciter Selection */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View style={styles.titleWithIcon}>
              <Icon name="volume-up" size={20} color={colors.gold} />
              <AppText variant="labelLg" color={colors.primary}>
                القارئ المفضل للتلاوة الصوتية
              </AppText>
            </View>
          </View>

          <View style={styles.recitersList}>
            {RECITERS.map((r) => {
              const isSelected = selectedReciter === r.id;
              return (
                <Pressable
                  key={r.id}
                  onPress={() => setSelectedReciter(r.id)}
                  style={[
                    styles.reciterItem,
                    isSelected && styles.reciterItemActive,
                  ]}>
                  <View style={styles.reciterRadio}>
                    {isSelected ? <View style={styles.radioInner} /> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText
                      variant="labelMd"
                      color={isSelected ? colors.primary : colors.onSurface}>
                      {r.name}
                    </AppText>
                    <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                      {r.desc}
                    </AppText>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Notifications & Adhan */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View style={styles.titleWithIcon}>
              <Icon name="notifications" size={20} color={colors.gold} />
              <AppText variant="labelLg" color={colors.primary}>
                التنبيهات والأذان
              </AppText>
            </View>
          </View>

          <View style={styles.toggleRow}>
            <View>
              <AppText variant="bodyMd" color={colors.primary}>
                تنبيهات مواقيت الصلاة (الأذان)
              </AppText>
              <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                إشعار صوتي عند دخول وقت الصلاة
              </AppText>
            </View>
            <Switch
              value={settings.adhanEnabled}
              onValueChange={(val) => update({ adhanEnabled: val })}
              trackColor={{ false: colors.surfaceContainer, true: colors.primaryContainer }}
              thumbColor={settings.adhanEnabled ? colors.gold : colors.outlineVariant}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View>
              <AppText variant="bodyMd" color={colors.primary}>
                تذكير أذكار الصباح والمساء
              </AppText>
              <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                تنبيه يومي في أوقات الاستحباب
              </AppText>
            </View>
            <Switch
              value={morningReminder}
              onValueChange={setMorningReminder}
              trackColor={{ false: colors.surfaceContainer, true: colors.primaryContainer }}
              thumbColor={morningReminder ? colors.gold : colors.outlineVariant}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View>
              <AppText variant="bodyMd" color={colors.primary}>
                تذكير ورد الليل والاستغفار بالأسحار
              </AppText>
              <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                تنبيه قبل الفجر بساعة لقيام الليل
              </AppText>
            </View>
            <Switch
              value={nightReminder}
              onValueChange={setNightReminder}
              trackColor={{ false: colors.surfaceContainer, true: colors.primaryContainer }}
              thumbColor={nightReminder ? colors.gold : colors.outlineVariant}
            />
          </View>
        </View>

        {/* App Info & About */}
        <View style={styles.card}>
          <View style={styles.appInfoWrap}>
            <View style={styles.appLogoCircle}>
              <AppText variant="headlineLg" color={colors.gold}>
                س
              </AppText>
            </View>
            <AppText variant="headlineMd" color={colors.primary}>
              تطبيق سكينة (Sakinah)
            </AppText>
            <AppText variant="labelSm" color={colors.onSurfaceVariant}>
              الإصدار ١.٠.٠ • هدوء وسكينة
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
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  recitersList: {
    gap: spacing.sm,
  },
  reciterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: 10,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  reciterItemActive: {
    borderColor: colors.gold,
    backgroundColor: '#FAF7F0',
  },
  reciterRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gold,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceContainer,
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
});
