import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { AllahNameDetailModal } from '@/features/allah-names/components/AllahNameDetailModal';
import { useAllahNames } from '@/features/allah-names/hooks/useAllahNames';
import type { AllahName } from '@/features/allah-names/types';
import { colors, radii, spacing } from '@/theme';
import { toEasternNumerals } from '@/utils/numerals';

export function AllahNamesScreen() {
  const { data: names, isLoading } = useAllahNames();
  const [search, setSearch] = useState('');
  const [selectedName, setSelectedName] = useState<AllahName | null>(null);

  const filteredNames = useMemo(() => {
    if (!names) return [];
    if (!search.trim()) return names;
    const q = search.trim();
    return names.filter(
      (n) =>
        (n.arabic || n.name || '').includes(q) ||
        n.meaning.includes(q) ||
        n.explanation.includes(q) ||
        String(n.number) === q,
    );
  }, [names, search]);

  if (isLoading) return <LoadingState label="جاري تحميل أسماء الله الحسنى..." />;

  const renderItem = ({ item }: { item: AllahName }) => (
    <Pressable
      onPress={() => setSelectedName(item)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}>
      {/* Top Number */}
      <View style={styles.cardTop}>
        <View style={styles.numberBadge}>
          <AppText variant="labelSm" color={colors.goldDark}>
            {toEasternNumerals(item.number)}
          </AppText>
        </View>
        <Icon name="chevron-left" size={16} color={colors.outlineVariant} />
      </View>

      {/* Arabic Calligraphy Name */}
      <AppText
        variant="quranVerse"
        color={colors.primary}
        align="center"
        style={styles.nameText}>
        {item.arabic}
      </AppText>

      {/* Meaning */}
      <AppText
        variant="labelSm"
        color={colors.onSurfaceVariant}
        align="center"
        numberOfLines={1}>
        {item.meaning}
      </AppText>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="أسماء الله الحسنى" subtitle="٩٩ اسماً مباركاً" showBack showBrand={false} />

      {/* Header Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <Icon name="search" size={20} color={colors.outline} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="ابحث في أسماء الله الحسنى ومعانيها..."
            placeholderTextColor={colors.outlineVariant}
            style={styles.searchInput}
            textAlign="right"
          />
          {search ? (
            <Pressable onPress={() => setSearch('')}>
              <Icon name="close" size={18} color={colors.outline} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.countBadge}>
          <AppText variant="labelSm" color={colors.primary}>
            عرض {toEasternNumerals(filteredNames.length)} من ٩٩ اسماً
          </AppText>
        </View>
      </View>

      {/* Names Grid */}
      <FlatList
        data={filteredNames}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.number)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Detail Modal */}
      <AllahNameDetailModal
        name={selectedName}
        visible={Boolean(selectedName)}
        onClose={() => setSelectedName(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  searchSection: {
    paddingHorizontal: spacing.margin,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    gap: spacing.xs,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
    shadowColor: '#091F26',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.onSurface,
  },
  countBadge: {
    paddingHorizontal: 4,
  },
  listContent: {
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  columnWrapper: {
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 130,
    borderWidth: 1,
    borderColor: 'rgba(181,150,85,0.15)',
    shadowColor: '#091F26',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#FAF8F4',
  },
  cardTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 22,
    lineHeight: 34,
    marginVertical: 4,
  },
});
