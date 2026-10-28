import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';

interface Props {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  bottomInset?: number;
}

export function Screen({ children, scroll = true, padded = true, bottomInset = 112 }: Props) {
  const insets = useSafeAreaInsets();
  const contentStyle = [
    styles.content,
    padded && { paddingHorizontal: spacing.margin },
    {
      paddingBottom: bottomInset + insets.bottom,
      paddingTop: insets.top + 8,
    },
  ];

  if (scroll) {
    return (
      <ScrollView
        style={styles.flex}
        contentContainerStyle={contentStyle}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    );
  }

  return <View style={[styles.flex, contentStyle]}>{children}</View>;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    gap: spacing.md,
  },
});
