import { useState } from 'react';
import { Image, StyleSheet, View, type ViewStyle } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';

interface Props {
  uri?: string;
  fallback: IconName;
  size: number;
  color: string;
  style?: ViewStyle;
}

/** Displays an API-provided icon when available, with a local icon as fallback. */
export function ApiIcon({ uri, fallback, size, color, style }: Props) {
  const [failedUri, setFailedUri] = useState<string>();
  const imageUri = uri?.trim();
  const canDisplayImage = Boolean(imageUri && failedUri !== imageUri);

  return (
    <View style={[styles.container, style]}>
      {canDisplayImage ? (
        <Image
          source={{ uri: imageUri }}
          style={{ width: size, height: size }}
          resizeMode="contain"
          onError={() => setFailedUri(imageUri)}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Icon name={fallback} size={size} color={color} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
