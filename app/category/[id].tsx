import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES, EPISODES, Episode, formatDuration, getCoverImage } from '@/constants/mockData';
import { usePlayer } from '@/context/PlayerContext';

const PLAYER_SPACE = Platform.OS === 'web' ? 84 + 64 : 60 + 64;

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { play, setQueue } = usePlayer();

  const category = CATEGORIES.find(c => c.id === id);
  const episodes = EPISODES.filter(e => e.categoryId === id);

  function handlePlay(ep: Episode) {
    setQueue(episodes);
    play(ep);
    router.push('/player');
  }

  if (category?.comingSoon) {
    return (
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: category?.color ?? '#1DB954' }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color="#FFF" />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={2}>{category?.name ?? 'Category'}</Text>
          </View>
          <View style={[styles.iconWrap, { backgroundColor: (category?.color ?? '#1DB954') + '22' }]}>
            <Feather name={(category?.icon ?? 'star') as any} size={22} color={category?.color ?? '#1DB954'} />
          </View>
        </View>
        <View style={styles.comingSoonContainer}>
          <View style={[styles.comingSoonIcon, { backgroundColor: (category?.color ?? '#1DB954') + '22' }]}>
            <Feather name="clock" size={48} color={category?.color ?? '#1DB954'} />
          </View>
          <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          <Text style={styles.comingSoonSub}>
            Is category ke episodes bahut jald aane wale hain.{'\n'}Hame follow karo aur notified raho!
          </Text>
          <Pressable style={[styles.notifyBtn, { backgroundColor: category?.color ?? '#1DB954' }]} onPress={() => router.back()}>
            <Text style={styles.notifyBtnText}>Wapas Jao</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16, borderBottomColor: category?.color ?? '#1DB954' }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={2}>{category?.name ?? 'Category'}</Text>
          {category?.tagline ? (
            <Text style={[styles.tagline, { color: category.color }]} numberOfLines={1}>{category.tagline}</Text>
          ) : null}
        </View>
        <View style={[styles.iconWrap, { backgroundColor: (category?.color ?? '#1DB954') + '22' }]}>
          <Feather name={(category?.icon ?? 'star') as any} size={22} color={category?.color ?? '#1DB954'} />
        </View>
      </View>

      <FlatList
        data={episodes}
        keyExtractor={i => i.id}
        contentContainerStyle={{ paddingBottom: PLAYER_SPACE, paddingTop: 8 }}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => handlePlay(item)}>
            <Image source={getCoverImage(item.coverKey)} style={styles.cover} />
            <View style={styles.info}>
              <Text style={styles.epTitle} numberOfLines={2}>{item.title}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>{formatDuration(item.duration)}</Text>
                {item.isPremium && (
                  <View style={styles.proBadge}>
                    <Text style={styles.proBadgeText}>PRO</Text>
                  </View>
                )}
                {item.trending && (
                  <View style={styles.trendingBadge}>
                    <Feather name="trending-up" size={10} color="#1DB954" />
                    <Text style={styles.trendingText}>Trending</Text>
                  </View>
                )}
                {item.isNew && !item.trending && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                )}
              </View>
              <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            </View>
            <View style={styles.playBtn}>
              <Feather name="play" size={16} color="#000" />
            </View>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <Text style={styles.episodeCount}>{episodes.length} Episodes</Text>
            {category?.tagline ? (
              <Text style={styles.taglineDesc}>{category.tagline}</Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, gap: 12, borderBottomWidth: 2 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800' as const, color: '#FFF', lineHeight: 26 },
  tagline: { fontSize: 12, fontWeight: '500' as const, marginTop: 2, fontStyle: 'italic' },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  listHeader: { paddingHorizontal: 20, paddingVertical: 12 },
  episodeCount: { color: '#B3B3B3', fontSize: 13 },
  taglineDesc: { color: '#555', fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  item: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20, paddingVertical: 14, gap: 12 },
  cover: { width: 68, height: 68, borderRadius: 10, flexShrink: 0 },
  info: { flex: 1 },
  epTitle: { color: '#FFF', fontSize: 14, fontWeight: '600' as const, lineHeight: 20, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  meta: { color: '#666', fontSize: 11 },
  description: { color: '#666', fontSize: 12, lineHeight: 17 },
  proBadge: { backgroundColor: '#1DB95422', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: '#1DB95444' },
  proBadgeText: { color: '#1DB954', fontSize: 10, fontWeight: '700' as const },
  trendingBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  trendingText: { color: '#1DB954', fontSize: 10 },
  newBadge: { backgroundColor: '#45B7D122', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: '#45B7D144' },
  newBadgeText: { color: '#45B7D1', fontSize: 10, fontWeight: '700' as const },
  playBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#1DB954', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 },
  separator: { height: 1, backgroundColor: '#1A1A1A', marginHorizontal: 20 },
  comingSoonContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  comingSoonIcon: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  comingSoonTitle: { color: '#FFF', fontSize: 28, fontWeight: '800' as const, marginBottom: 12, textAlign: 'center' },
  comingSoonSub: { color: '#B3B3B3', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  notifyBtn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 30 },
  notifyBtnText: { color: '#000', fontSize: 15, fontWeight: '700' as const },
});
