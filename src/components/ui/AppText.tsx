import { Text, type TextProps } from 'react-native';

import { colors, typography } from '@/theme';

type Variant = keyof typeof typography;

interface Props extends TextProps {
  variant?: Variant;
  color?: string;
  align?: 'left' | 'right' | 'center';
  leading?: 'relaxed' | 'tight' | 'normal';
}

export function AppText({
  variant = 'bodyMd',
  color = colors.onSurface,
  align = 'right',
  leading,
  style,
  children,
  ...rest
}: Props) {
  const lineMultiplier = leading === 'relaxed' ? 1.4 : leading === 'tight' ? 0.9 : 1;
  const baseLineHeight = typography[variant].lineHeight;

  return (
    <Text
      {...rest}
      style={[
        typography[variant],
        leading ? { lineHeight: Math.round(baseLineHeight * lineMultiplier) } : null,
        { color, textAlign: align, writingDirection: 'rtl' },
        style,
      ]}>
      {children}
    </Text>
  );
}
