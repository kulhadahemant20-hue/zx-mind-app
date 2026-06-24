import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface Props {
  title: string;
  onSeeAll?: () => void;
}

export function SectionHeader({ title, onSeeAll }: Props) {
  const colors = useColors();
  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>Sab Dekho</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 14, marginTop: 4 },
  title: { fontSize: 18, fontWeight: '700' as const, letterSpacing: 0.3 },
  seeAll: { fontSize: 13, fontWeight: '600' as const },
});
