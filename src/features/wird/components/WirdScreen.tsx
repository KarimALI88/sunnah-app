import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/shared/AppHeader';
import { AppText } from '@/components/ui/AppText';
import { Icon } from '@/components/ui/Icon';
import { CreateWirdModal } from '@/features/wird/components/CreateWirdModal';
import { useWirdMutations, useWirds } from '@/features/wird/hooks/useWirds';
import type { WirdDraft, WirdItem } from '@/features/wird/types';
import { colors, radii, spacing } from '@/theme';
import { toEasternNumerals } from '@/utils/numerals';

export function WirdScreen() {
  const { data: wirds, isLoading, isError, refetch } = useWirds();
  const { create, increment, reset, remove, update } = useWirdMutations();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WirdItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [resetId, setResetId] = useState<string | null>(null);

  const handleIncrement = (id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const item = (wirds ?? []).find((wird) => wird.id === id);
    if (item) increment.mutate(item);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: WirdItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSubmit = (draft: WirdDraft) => {
    if (editingItem) {
      update.mutate({ id: editingItem.id, patch: draft }, {
        onError: (error) => Alert.alert('تعذر حفظ الورد', error.message),
      });
    } else {
      create.mutate(draft, {
        onError: (error) => Alert.alert('تعذر إضافة الورد', error.message),
      });
    }
  };

  if (isLoading) return <LoadingState label="جاري تحميل الأوراد..." />;
  if (isError) return <ErrorState onRetry={() => { void refetch(); }} />;

  const list = wirds ?? [];
  const totalCount = list.reduce((acc, curr) => acc + curr.currentCount, 0);

  return (
    <View style={styles.container}>
      <AppHeader title="الورد اليومي" subtitle="الأوراد والسنن الراتبة" showBrand={true} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Top Summary Banner */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryCol}>
            <AppText variant="labelSm" color={colors.secondaryFixed}>
              مجموع التسبيحات اليوم
            </AppText>
            <AppText variant="displayLg" color={colors.onPrimary}>
              {toEasternNumerals(totalCount)}
            </AppText>
          </View>
          <View style={styles.summaryBadge}>
            <Icon name="verified" size={20} color={colors.secondaryFixed} />
            <AppText variant="labelMd" color={colors.secondaryFixed}>
              {toEasternNumerals(list.length)} أوراد نشطة
            </AppText>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <AppText variant="labelLg" color={colors.primary}>
            قائمة أورادي الشخصية
          </AppText>
          <Pressable onPress={handleOpenCreate} style={styles.addTextBtn}>
            <Icon name="add" size={18} color={colors.secondary} />
            <AppText variant="labelSm" color={colors.secondary}>
              إضافة جديد
            </AppText>
          </Pressable>
        </View>

        {/* Wird Cards */}
        {list.length === 0 ? (
          <EmptyState
            title="لا توجد أوراد شخصية حتى الآن"
            message="أضف وردك الخاص من الاستغفار أو الصلاة على النبي لتثبيت عادتك اليومية."
            actionLabel="إضافة ورد جديد"
            onAction={handleOpenCreate}
          />
        ) : (
          <View style={styles.list}>
            {list.map((item) => {
              const isCompleted = item.currentCount >= item.targetCount;
              const percent = Math.min(
                100,
                Math.round((item.currentCount / item.targetCount) * 100),
              );

              return (
                <View
                  key={item.id}
                  style={[
                    styles.wirdCard,
                    isCompleted && styles.wirdCardCompleted,
                  ]}>
                  {/* Card Header & Actions */}
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTitleWrap}>
                      <AppText
                        variant="headlineMd"
                        color={colors.primary}
                        style={styles.wirdTitle}>
                        {item.title}
                      </AppText>
                      <View style={styles.metaRow}>
                        <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                          الهدف: {toEasternNumerals(item.targetCount)} مرة
                        </AppText>
                        {isCompleted ? (
                          <View style={styles.completeBadge}>
                            <Icon name="check-circle" size={14} color={colors.tertiary} />
                            <AppText variant="labelSm" color={colors.tertiary}>
                              أُتم بنجاح
                            </AppText>
                          </View>
                        ) : null}
                      </View>
                    </View>

                    {/* Options (Edit / Delete) */}
                    <View style={styles.cardActions}>
                      <Pressable
                        onPress={() => handleOpenEdit(item)}
                        style={styles.actionBtn}>
                        <Icon name="edit" size={18} color={colors.outline} />
                      </Pressable>
                      <Pressable
                        onPress={() => setDeleteId(item.id)}
                        style={styles.actionBtn}>
                        <Icon name="delete-outline" size={18} color={colors.outline} />
                      </Pressable>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.track}>
                    <View
                      style={[
                        styles.fill,
                        {
                          width: `${percent}%`,
                          backgroundColor: isCompleted ? colors.tertiary : colors.gold,
                        },
                      ]}
                    />
                  </View>

                  {/* Counter Interaction Row */}
                  <View style={styles.counterRow}>
                    <View style={styles.countsDisplay}>
                      <AppText
                        variant="displaySm"
                        color={isCompleted ? colors.goldDark : colors.primary}>
                        {toEasternNumerals(item.currentCount)}
                      </AppText>
                      <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                        / {toEasternNumerals(item.targetCount)}
                      </AppText>
                    </View>

                    <View style={styles.buttonsGroup}>
                      <Pressable
                        onPress={() => setResetId(item.id)}
                        style={styles.resetBtn}>
                        <Icon name="restart-alt" size={18} color={colors.secondary} />
                        <AppText variant="labelSm" color={colors.secondary}>
                          إعادة
                        </AppText>
                      </Pressable>

                      {/* Big Tap Button */}
                      <Pressable
                        onPress={() => handleIncrement(item.id)}
                        style={({ pressed }) => [
                          styles.tapBtn,
                          pressed && styles.tapBtnPressed,
                        ]}>
                        <Icon name="touch-app" size={20} color={colors.onPrimary} />
                        <AppText variant="labelMd" color={colors.onPrimary}>
                          تسبيح (+١)
                        </AppText>
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Add Personal Awrad Dashed Card (from Stitch design specification) */}
        <Pressable onPress={handleOpenCreate} style={styles.dashedCard}>
          <View style={styles.dashedIconCircle}>
            <Icon name="add" size={24} color={colors.gold} />
          </View>
          <AppText variant="headlineMd" color={colors.primary}>
            إضافة ورد أو تسبيح جديد
          </AppText>
          <AppText variant="bodySm" color={colors.onSurfaceVariant} align="center">
            حدد صيغة الذكر والعدد المستهدف لتتبع إنجازك اليومي
          </AppText>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Create / Edit Modal */}
      <CreateWirdModal
        key={modalOpen ? editingItem?.id ?? 'new' : 'closed'}
        visible={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        initialItem={editingItem}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        visible={Boolean(deleteId)}
        title="حذف هذا الورد؟"
        message="هل أنت متأكد من رغبتك في حذف هذا الورد من قائمتك؟ لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="حذف الورد"
        cancelLabel="إلغاء"
        destructive
        onConfirm={() => {
          if (deleteId) remove.mutate(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />

      {/* Reset Confirmation */}
      <ConfirmDialog
        visible={Boolean(resetId)}
        title="تصفير العداد؟"
        message="هل ترغب في إعادة العداد إلى الصفر لبدء الورد من جديد؟"
        confirmLabel="نعم، تصفير"
        cancelLabel="تراجع"
        onConfirm={() => {
          const item = list.find((wird) => wird.id === resetId);
          if (item) reset.mutate(item);
          setResetId(null);
        }}
        onCancel={() => setResetId(null)}
      />
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
  summaryCard: {
    backgroundColor: colors.primaryContainer,
    borderRadius: radii.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    shadowColor: colors.primaryContainer,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  summaryCol: {
    gap: 2,
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  addTextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  list: {
    gap: spacing.md,
  },
  wirdCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#091F26',
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },
  wirdCardCompleted: {
    borderColor: 'rgba(181,150,85,0.3)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardTitleWrap: {
    flex: 1,
    gap: 4,
  },
  wirdTitle: {
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceContainer,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  countsDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  buttonsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.lg,
  },
  tapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.lg,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  tapBtnPressed: {
    transform: [{ scale: 0.96 }],
    backgroundColor: colors.primaryContainer,
  },
  dashedCard: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D8D1C5',
    borderRadius: radii.xl,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginVertical: spacing.xs,
  },
  dashedIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
});
