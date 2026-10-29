import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { AppText } from "@/components/ui/AppText";
import { Icon } from "@/components/ui/Icon";
import { ApiIcon } from "@/components/ui/ApiIcon";
import { useCategories, useSubcategories } from "@/features/azkar/hooks/useAzkar";
import type { Subcategory } from "@/features/azkar/types";
import { Screen } from "@/layouts/Screen";
import { colors, radii, spacing } from "@/theme";
import { toEasternNumerals } from "@/utils/numerals";

const toneColor = {
  gold: colors.secondary,
  teal: colors.primaryContainer,
  slate: colors.tertiary,
};

export function AzkarCategoriesScreen({ categoryId }: { categoryId: string }) {
  const { data: categories, isLoading: catLoading, isError: categoryError, refetch: refetchCategories } = useCategories();
  const { data: items, isLoading, isError, refetch } = useSubcategories(categoryId);
  const category = categories?.find((item) => item.id === categoryId);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!items) return [];
    if (!query.trim()) return items;
    return items.filter(
      (item) => item.title.includes(query) || item.meta.includes(query),
    );
  }, [items, query]);

  if (catLoading || isLoading) return <LoadingState />;
  if (isError || categoryError) return <ErrorState onRetry={() => { void refetch(); void refetchCategories(); }} />;

  return (
    <Screen>
      <View style={styles.titleRow}>
        <AppText variant="headlineLg" color={colors.primary}>
          {category?.title ?? "الأذكار اليومية"}
        </AppText>
        {category ? (
          <View style={[styles.categoryIcon, { backgroundColor: `${toneColor[category.accent]}22` }]}>
            <ApiIcon
              uri={category.iconUrl}
              fallback={category.icon as 'spa'}
              size={22}
              color={toneColor[category.accent]}
            />
          </View>
        ) : null}
        <View style={styles.badge}>
          <AppText variant="labelMd" color={colors.secondary}>
            {toEasternNumerals(items?.length ?? 0)} أقسام رئيسية
          </AppText>
        </View>
        <Pressable
          accessibilityLabel="رجوع"
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace('/(tabs)');
          }}
          style={styles.backButton}
        >
          <Icon name="arrow-forward" size={22} color={colors.primary} />
        </Pressable>
      </View>
      <View style={styles.searchWrap}>
        <Icon name="search" size={20} color={colors.outline} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="ابحث في الأذكار والأدعية..."
          placeholderTextColor={colors.outlineVariant}
          style={styles.input}
          textAlign="right"
        />
      </View>

      {items && items.length > 0 ? (
        <Pressable
          style={styles.banner}
          onPress={() =>
            router.push({ pathname: "/azkar/read/[dhikrId]", params: { dhikrId: "0", subcategoryId: items[0].id, categoryId, subcategoryTitle: items[0].title } })
          }
        >
          <View style={{ flex: 1 }}>
            <AppText variant="labelSm" color={colors.secondaryFixed}>
              الورد الحالي المقترح
            </AppText>
            <AppText variant="headlineMd" color={colors.onPrimary}>
              {items[0].title}
            </AppText>
            <AppText variant="bodySm" color={colors.primaryFixedDim}>
              حصن يومك بذكر الله وطمأنينة القلب
            </AppText>
          </View>
          <View style={styles.bannerIcon}>
            <ApiIcon
              uri={items[0].iconUrl}
              fallback={items[0].icon as 'spa'}
              size={26}
              color={colors.secondaryFixed}
            />
          </View>
        </Pressable>
      ) : null}

      <View style={styles.titleRow}>
        <AppText variant="labelLg" color={colors.primary}>
          تصفح الأقسام
        </AppText>
        <AppText variant="labelSm" color={colors.onSurfaceVariant}>
          اضغط لبدء القراءة مباشرة
        </AppText>
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          title="لا توجد نتائج مطابقة"
          message='جرّب البحث بكلمات أخرى مثل "الصباح"، "السفر"، أو "النوم"'
        />
      ) : (
        <View style={styles.grid}>
          {filtered.map((item) => (
            <SubcategoryCard key={item.id} item={item} />
          ))}
        </View>
      )}

      <View style={styles.note}>
        <View style={styles.noteIcon}>
          <Icon name="verified" size={18} color={colors.onPrimary} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="labelLg" color={colors.primary}>
            مرويات موثوقة
          </AppText>
          <AppText variant="bodySm" color={colors.onSurfaceVariant}>
            جميع الأذكار والأدعية مدققة ومأخوذة من صحيح السنة النبوية الشريفة
            وحصن المسلم.
          </AppText>
        </View>
      </View>
    </Screen>
  );
}

function SubcategoryCard({ item }: { item: Subcategory }) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push({ pathname: "/azkar/read/[dhikrId]", params: { dhikrId: "0", subcategoryId: item.id, categoryId: item.categoryId, subcategoryTitle: item.title } })}
    >
      <View style={styles.cardTop}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: `${toneColor[item.iconTone]}22` },
          ]}
        >
          <ApiIcon
            uri={item.iconUrl}
            fallback={item.icon as 'spa'}
            size={24}
            color={toneColor[item.iconTone]}
          />
        </View>
        <View style={styles.arrow}>
          <Icon name="arrow-back-ios" size={16} color={colors.primary} />
        </View>
      </View>
      <AppText variant="bodyLg" color={colors.primary}>
        {item.title}
      </AppText>
      <AppText variant="labelSm" color={colors.onSurfaceVariant}>
        {toEasternNumerals(item.itemCount)} ذكر • {item.meta}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    backgroundColor: "rgba(255,219,148,0.4)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceContainerLowest,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    gap: 8,
  },
  input: { flex: 1, color: colors.onSurface, fontSize: 16 },
  banner: {
    backgroundColor: colors.primaryContainer,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  card: {
    width: "48%",
    flexGrow: 1,
    minHeight: 140,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.lg,
    padding: spacing.md,
    justifyContent: "space-between",
    gap: 8,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between" },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  note: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: "row",
    gap: spacing.md,
  },
  noteIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
