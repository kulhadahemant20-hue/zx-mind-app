import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList, Platform, Pressable, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AudioCard } from '@/components/AudioCard';
import { CategoryCard } from '@/components/CategoryCard';
import { Category, CATEGORIES, Episode, EPISODES } from '@/constants/mockData';
import { usePlayer } from '@/context/PlayerContext';

const PLAYER_SPACE = Platform.OS === 'web' ? 84 + 64 : 60 + 64;

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { play } = usePlayer();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const results = useMemo(() => {
    let eps = EPISODES;
    if (activeCategory) eps = eps.filter(e => e.categoryId === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      eps = eps.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.categoryId.toLowerCase().includes(q)
      );
    }
    return eps;
  }, [query, activeCategory]);

  function handleEpisodePress(ep: Episode) {
    play(ep);
    router.push('/player');
  }

  function handleCategoryPress(cat: Category) {
    setActiveCategory(prev => prev === cat.id ? null : cat.id);
  }

  const isSearching = query.trim() !== '' || activeCategory !== null;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16) }]}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#B3B3B3" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search episodes and categories..."
            placeholderTextColor="#666"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <Feather name="x" size={18} color="#B3B3B3" />
            </Pressable>
          )}
        </View>
      </View>

      {!isSearching ? (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: PLAYER_SPACE }]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(cat => {
              const colW = Platform.OS === 'web' ? 160 : (300 / 2) - 6;
              return (
                <CategoryCard key={cat.id} category={cat} onPress={handleCategoryPress} width={colW} />
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.filterChip, activeCategory === cat.id && styles.filterChipActive]}
                onPress={() => handleCategoryPress(cat)}
              >
                <Text style={[styles.filterChipText, activeCategory === cat.id && { color: '#000' }]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {results.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="search" size={40} color="#444" />
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>Try a different keyword</Text>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={i => i.id}
              contentContainerStyle={{ paddingTop: 8, paddingBottom: PLAYER_SPACE }}
              renderItem={({ item }) => (
                <Pressable style={styles.listItem} onPress={() => handleEpisodePress(item)}>
                  <AudioCard episode={item} onPress={handleEpisodePress} width={72} />
                  <View style={styles.listInfo}>
                    <Text style={styles.listTitle} numberOfLines={2}>{item.title}</Text>
                    {item.isPremium && (
                      <View style={styles.proBadge}>
                        <Text style={styles.proBadgeText}>PRO</Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: { paddingHorizontal: 20, paddingBottom: 16, backgroundColor: '#000' },
  title: { fontSize: 28, fontWeight: '800' as const, color: '#FFF', marginBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 12, paddingHorizontal: 14, height: 48, gap: 10, borderWidth: 1, borderColor: '#333' },
  searchInput: { flex: 1, color: '#FFF', fontSize: 15 },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700' as const, color: '#FFF', marginBottom: 16 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filterScroll: { flexGrow: 0, marginBottom: 8, paddingVertical: 8 },
  filterChip: { backgroundColor: '#1A1A1A', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#333' },
  filterChipActive: { backgroundColor: '#1DB954', borderColor: '#1DB954' },
  filterChipText: { color: '#FFF', fontSize: 13, fontWeight: '500' as const },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, gap: 12 },
  listInfo: { flex: 1 },
  listTitle: { color: '#FFF', fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  proBadge: { backgroundColor: '#1DB954', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 6 },
  proBadgeText: { color: '#000', fontSize: 10, fontWeight: '700' as const },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' as const },
  emptySubtitle: { color: '#666', fontSize: 14 },
});
