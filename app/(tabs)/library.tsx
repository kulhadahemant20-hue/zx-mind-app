import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Episode, EPISODES, formatDuration, getCoverImage } from '@/constants/mockData';
import { usePlayer } from '@/context/PlayerContext';
import { filterEpisodes, getFavorites, getHistory } from '@/services/storage';

type Tab = 'favorites' | 'history' | 'downloads';

const PLAYER_SPACE = Platform.OS === 'web' ? 84 + 64 : 60 + 64;

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('favorites');
  const [favorites, setFavorites] = useState<Episode[]>([]);
  const [history, setHistory] = useState<Episode[]>([]);
  const { play } = usePlayer();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    const favIds = await getFavorites();
    setFavorites(filterEpisodes(EPISODES, favIds));
    const histIds = await getHistory();
    setHistory(filterEpisodes(EPISODES, histIds));
  }

  function handlePlay(ep: Episode) {
    play(ep);
    router.push('/player');
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'favorites', label: 'Favorites', icon: 'heart' },
    { key: 'history', label: 'History', icon: 'clock' },
    { key: 'downloads', label: 'Downloads', icon: 'download' },
  ];

  const data: Episode[] = activeTab === 'favorites' ? favorites : activeTab === 'history' ? history : [];

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16) }]}>
        <Text style={styles.title}>My Library</Text>
        <View style={styles.tabs}>
          {tabs.map(t => (
            <TouchableOpacity key={t.key} style={[styles.tab, activeTab === t.key && styles.tabActive]} onPress={() => setActiveTab(t.key)}>
              <Feather name={t.icon as any} size={14} color={activeTab === t.key ? '#000' : '#B3B3B3'} />
              <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === 'downloads' ? (
        <View style={styles.emptyState}>
          <View style={styles.lockCircle}>
            <Feather name="lock" size={32} color="#1DB954" />
          </View>
          <Text style={styles.emptyTitle}>Downloads — Pro Feature</Text>
          <Text style={styles.emptySub}>Subscribe to Pro plan to listen offline</Text>
          <Pressable style={styles.upgradeBtn} onPress={() => router.push('/subscription')}>
            <Text style={styles.upgradeBtnText}>View Pro Plan</Text>
          </Pressable>
        </View>
      ) : data.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name={activeTab === 'favorites' ? 'heart' : 'clock'} size={48} color="#444" />
          <Text style={styles.emptyTitle}>{activeTab === 'favorites' ? 'No favorites yet' : 'No history yet'}</Text>
          <Text style={styles.emptySub}>{activeTab === 'favorites' ? 'Mark episodes as favorites' : 'Start listening to episodes'}</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingBottom: PLAYER_SPACE, paddingTop: 8 }}
          renderItem={({ item }) => (
            <Pressable style={styles.item} onPress={() => handlePlay(item)}>
              <Image source={getCoverImage(item.coverKey)} style={styles.cover} />
              <View style={styles.info}>
                <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.itemDuration}>{formatDuration(item.duration)}</Text>
              </View>
              <Pressable style={styles.playCircle} onPress={() => handlePlay(item)}>
                <Feather name="play" size={16} color="#000" />
              </Pressable>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '800' as const, color: '#FFF', marginBottom: 16 },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1A1A1A', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  tabActive: { backgroundColor: '#1DB954', borderColor: '#1DB954' },
  tabText: { color: '#B3B3B3', fontSize: 13, fontWeight: '500' as const },
  tabTextActive: { color: '#000', fontWeight: '700' as const },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 14 },
  cover: { width: 60, height: 60, borderRadius: 8 },
  info: { flex: 1 },
  itemTitle: { color: '#FFF', fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  itemDuration: { color: '#666', fontSize: 11, marginTop: 4 },
  playCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#1DB954', alignItems: 'center', justifyContent: 'center' },
  separator: { height: 1, backgroundColor: '#1A1A1A', marginHorizontal: 20 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 40 },
  lockCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' as const, textAlign: 'center' },
  emptySub: { color: '#666', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  upgradeBtn: { backgroundColor: '#1DB954', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 8 },
  upgradeBtnText: { color: '#000', fontSize: 14, fontWeight: '700' as const },
});
