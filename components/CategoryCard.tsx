import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Category } from '@/constants/mockData';

interface Props {
  category: Category;
  onPress: (category: Category) => void;
  width: number;
}

export function CategoryCard({ category, onPress, width }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, { width, backgroundColor: category.color + '22', borderColor: category.color + '44', opacity: pressed ? 0.8 : 1 }]}
      onPress={() => onPress(category)}
    >
      <View style={[styles.iconWrap, { backgroundColor: category.color + '33' }]}>
        <Feather name={category.icon as any} size={24} color={category.color} />
      </View>
      <Text style={[styles.name, { color: '#FFFFFF' }]} numberOfLines={1}>{category.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    justifyContent: 'space-between',
    minHeight: 100,
  },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  name: { fontSize: 13, fontWeight: '700' as const, letterSpacing: 0.2 },
});
