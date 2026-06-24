import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions, Image, Platform, Pressable, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AdBanner } from '@/components/AdBanner';
import { AudioCard } from '@/components/AudioCard';
import { SectionHeader } from '@/components/SectionHeader';
import {
  CATEGORIES, Category, EPISODES, Episode,
  TRENDING_EPISODES, NEW_EPISODES,
  getCoverImage, formatDuration,
} from '@/constants/mockData';
import { useAuth } from '@/context/AuthContext';
import { usePlayer } from '@/context/PlayerContext';
import { getHistory, filterEpisodes } from '@/services/storage';

const { width: SCREEN_W } = Dimensions.get('window');
const TAB_BAR_H = Platform.OS === 'web' ? 84 : 60;
const MINI_PLAYER_H = 64;
const CARD_W = Math.min(190, (SCREEN_W - 60) * 0.55);

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { play, currentEpisode } = usePlayer();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [continueList, setContinueList] = useState<Episode[]>([]);

  useEffect(() => {
    getHistory().then(ids => {
      const eps = filterEpisodes(EPISODES, ids).slice(0, 8);
      setContinueList(eps);
    });
  }, []);

  function handlePlay(ep: Episode) {
    play(ep);
    router.push('/player');
  }

  function handleCategory(cat: Category) {
    router.push({ pathname: '/category/[id]', params: { id: cat.id } });
  }

  const bottomPad = (currentEpisode ? MINI_PLAYER_H : 0) + TAB_BAR_H + 16;
  const topPad = insets.top + (Platform.OS === 'web' ? 67 : 16);
  const catW = Math.floor((SCREEN_W - 52) / 2);

  const activeCategories = CATEGORIES.filter(c => !c.comingSoon);
  const comingSoonCategories = CATEGORIES.filter(c => c.comingSoon);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topPad }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name ?? 'U')[0].toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name ?? 'Listener'}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/subscription')}>
            {user?.isPremium ? (
              <Feather name="star" size={20} color="#1DB954" />
            ) : (
              <Feather name="zap" size={20} color="#FFE66D" />
            )}
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Feather name="bell" size={20} color="#B3B3B3" />
          </Pressable>
        </View>
      </View>

      {/* ── Search Bar ── */}
      <Pressable style={styles.searchBar} onPress={() => router.push('/(tabs)/search' as any)}>
        <Feather name="search" size={16} color="#666" />
        <Text style={styles.searchPlaceholder}>Search episodes and categories...</Text>
      </Pressable>

      {/* ── Premium Banner ── */}
      {!user?.isPremium && (
        <Pressable style={styles.premiumBanner} onPress={() => router.push('/subscription')}>
          <View>
            <Text style={styles.bannerTitle}>3-Day Free Trial</Text>
            <Text style={styles.bannerSub}>Unlock all premium content</Text>
          </View>
          <View style={styles.bannerBtn}>
            <Text style={styles.bannerBtnText}>Try Free</Text>
          </View>
        </Pressable>
      )}

      {/* ── Quick Category Grid (Spotify-style 2-col) ── */}
      <View style={styles.section}>
        <View style={styles.quickGrid}>
          {activeCategories.map(cat => (
            <Pressable
              key={cat.id}
              style={[styles.quickCard, { borderLeftColor: cat.color, backgroundColor: cat.color + '18' }]}
              onPress={() => handleCategory(cat)}
            >
              <View style={[styles.quickIcon, { backgroundColor: cat.color + '30' }]}>
                <Feather name={cat.icon as any} size={20} color={cat.color} />
              </View>
              <Text style={styles.quickName} numberOfLines={1}>{cat.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── Trending Audios ── */}
      <View style={styles.section}>
        <SectionHeader
          title="Trending Audios"
          onSeeAll={() => router.push('/(tabs)/search' as any)}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.hList, { paddingRight: 20 }]}
        >
          {TRENDING_EPISODES.map(ep => (
            <AudioCard key={ep.id} episode={ep} onPress={handlePlay} width={CARD_W} />
          ))}
        </ScrollView>
      </View>

      {/* ── ADVERTISEMENT BANNER ── */}
      <AdBanner onPress={() => router.push('/subscription')} />

      {/* ── Continue Listening ── */}
      {continueList.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Continue Listening" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.hList, { paddingRight: 20 }]}
          >
            {continueList.map(ep => (
              <AudioCard key={ep.id} episode={ep} onPress={handlePlay} width={CARD_W} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── Editor's Pick (Featured) ── */}
      {TRENDING_EPISODES[0] && (
        <View style={styles.featuredSection}>
          <Text style={styles.sectionLabel}>Editor's Pick</Text>
          <Pressable style={styles.featured} onPress={() => handlePlay(TRENDING_EPISODES[0])}>
            <Image source={getCoverImage(TRENDING_EPISODES[0].coverKey)} style={StyleSheet.absoluteFill} />
            <View style={styles.featuredOverlay}>
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTag}>MOST PLAYED TODAY</Text>
                <Text style={styles.featuredTitle} numberOfLines={2}>{TRENDING_EPISODES[0].title}</Text>
                <Text style={styles.featuredDuration}>{formatDuration(TRENDING_EPISODES[0].duration)}</Text>
              </View>
              <View style={styles.featuredPlay}>
                <Feather name="play" size={24} color="#000" />
              </View>
            </View>
          </Pressable>
        </View>
      )}

      {/* ── New Releases ── */}
      <View style={styles.section}>
        <SectionHeader title="New Releases" onSeeAll={() => router.push('/(tabs)/search' as any)} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.hList, { paddingRight: 20 }]}
        >
          {NEW_EPISODES.map(ep => (
            <AudioCard key={ep.id} episode={ep} onPress={handlePlay} width={CARD_W} />
          ))}
        </ScrollView>
      </View>

      {/* ── SECOND AD (After new releases) ── */}
      <AdBanner onPress={() => router.push('/subscription')} />

      {/* ── Coming Soon ── */}
      <View style={styles.section}>
        <SectionHeader title="Coming Soon" />
        <View style={styles.comingSoonGrid}>
          {comingSoonCategories.map(cat => (
            <View key={cat.id} style={[styles.comingSoonCard, { borderColor: cat.color + '33' }]}>
              <View style={[styles.comingSoonIcon, { backgroundColor: cat.color + '20' }]}>
                <Feather name={cat.icon as any} size={18} color={cat.color} />
              </View>
              <Text style={styles.comingSoonName} numberOfLines={1}>{cat.name}</Text>
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonBadgeText}>Soon</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ── Stats ── */}
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>ZX Mind Community</Text>
        <View style={styles.statsRow}>
          {[['50K+', 'Learners'], ['500+', 'Episodes'], ['10', 'Categories']].map(([val, label]) => (
            <View key={label} style={styles.statCard}>
              <Text style={styles.statVal}>{val}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#000', fontSize: 16, fontWeight: '700' as const },
  greeting: { color: '#B3B3B3', fontSize: 12 },
  userName: { color: '#FFF', fontSize: 16, fontWeight: '700' as const },
  headerRight: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#282828',
  },
  searchPlaceholder: { color: '#555', fontSize: 14, flex: 1 },

  premiumBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#0D2A19',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1DB95444',
  },
  bannerTitle: { color: '#1DB954', fontSize: 15, fontWeight: '700' as const },
  bannerSub: { color: '#B3B3B3', fontSize: 12, marginTop: 2 },
  bannerBtn: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 18,
  },
  bannerBtnText: { color: '#000', fontSize: 13, fontWeight: '700' as const },

  section: { marginBottom: 24 },
  hList: { paddingLeft: 20, gap: 0 },

  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
  },
  quickCard: {
    width: '47.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#111',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quickName: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700' as const,
    flex: 1,
  },

  featuredSection: { marginHorizontal: 20, marginBottom: 24 },
  sectionLabel: {
    color: '#B3B3B3',
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    marginBottom: 10,
  },
  featured: {
    borderRadius: 18,
    overflow: 'hidden',
    height: 200,
    backgroundColor: '#1A1A1A',
  },
  featuredOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 18,
    gap: 14,
  },
  featuredContent: { flex: 1 },
  featuredTag: {
    color: '#1DB954',
    fontSize: 10,
    fontWeight: '800' as const,
    letterSpacing: 1,
    marginBottom: 6,
  },
  featuredTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800' as const,
    lineHeight: 23,
    marginBottom: 6,
  },
  featuredDuration: { color: '#B3B3B3', fontSize: 12 },
  featuredPlay: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    paddingLeft: 4,
  },

  comingSoonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
  },
  comingSoonCard: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: '#0E0E0E',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    gap: 6,
  },
  comingSoonIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonName: {
    color: '#777',
    fontSize: 10,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  comingSoonBadge: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  comingSoonBadgeText: { color: '#555', fontSize: 9, fontWeight: '700' as const },

  statsSection: {
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: '#111',
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  statsTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statCard: { alignItems: 'center' },
  statVal: { color: '#1DB954', fontSize: 22, fontWeight: '800' as const },
  statLabel: { color: '#B3B3B3', fontSize: 11, marginTop: 3 },
});
