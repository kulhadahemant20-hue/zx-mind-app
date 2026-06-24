import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions, Image, Platform, Pressable, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AudioCard } from '@/components/AudioCard';
import { CategoryCard } from '@/components/CategoryCard';
import { SectionHeader } from '@/components/SectionHeader';
import {
  CATEGORIES, Category, EPISODES, Episode,
  TRENDING_EPISODES, NEW_EPISODES, PREMIUM_EPISODES,
  getCoverImage, formatDuration,
} from '@/constants/mockData';
import { useAuth } from '@/context/AuthContext';
import { usePlayer } from '@/context/PlayerContext';
import { getHistory, filterEpisodes } from '@/services/storage';

const { width: SCREEN_W } = Dimensions.get('window');
const TAB_BAR_H = Platform.OS === 'web' ? 84 : 60;
const MINI_PLAYER_H = 64;

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
  const catColW = Math.floor((SCREEN_W - 50) / 2);
  const topPad = insets.top + (Platform.OS === 'web' ? 67 : 16);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
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
              <Feather name="zap" size={20} color="#B3B3B3" />
            )}
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Feather name="bell" size={20} color="#B3B3B3" />
          </Pressable>
        </View>
      </View>

      {/* Search Bar */}
      <Pressable style={styles.searchBar} onPress={() => router.push('/(tabs)/search' as any)}>
        <Feather name="search" size={16} color="#666" />
        <Text style={styles.searchPlaceholder}>Search episodes and categories...</Text>
      </Pressable>

      {/* Premium Banner */}
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

      {/* Continue Listening */}
      {continueList.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Continue Listening" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
            {continueList.map(ep => (
              <AudioCard key={ep.id} episode={ep} onPress={handlePlay} width={160} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Trending */}
      <View style={styles.section}>
        <SectionHeader
          title="Trending Audios"
          onSeeAll={() => router.push('/(tabs)/search' as any)}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
          {TRENDING_EPISODES.map(ep => (
            <AudioCard key={ep.id} episode={ep} onPress={handlePlay} width={160} />
          ))}
        </ScrollView>
      </View>

      {/* Featured Episode */}
      {TRENDING_EPISODES[0] && (
        <View style={styles.featuredSection}>
          <Text style={styles.sectionLabel}>Editor's Pick</Text>
          <Pressable style={styles.featured} onPress={() => handlePlay(TRENDING_EPISODES[0])}>
            <Image source={getCoverImage(TRENDING_EPISODES[0].coverKey)} style={styles.featuredImg} />
            <View style={styles.featuredOverlay}>
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTag}>MOST PLAYED TODAY</Text>
                <Text style={styles.featuredTitle} numberOfLines={2}>{TRENDING_EPISODES[0].title}</Text>
                <Text style={styles.featuredDuration}>{formatDuration(TRENDING_EPISODES[0].duration)}</Text>
              </View>
              <View style={styles.featuredPlay}>
                <Feather name="play" size={22} color="#000" />
              </View>
            </View>
          </Pressable>
        </View>
      )}

      {/* Categories */}
      <View style={styles.section}>
        <SectionHeader
          title="Popular Categories"
          onSeeAll={() => router.push('/(tabs)/search' as any)}
        />
        <View style={styles.categoryGrid}>
          {CATEGORIES.slice(0, 6).map(cat => (
            <CategoryCard key={cat.id} category={cat} onPress={handleCategory} width={catColW} />
          ))}
        </View>
        <Pressable style={styles.allCategoriesBtn} onPress={() => router.push('/(tabs)/search' as any)}>
          <Text style={styles.allCategoriesText}>See All Categories ({CATEGORIES.length})</Text>
          <Feather name="chevron-right" size={14} color="#1DB954" />
        </Pressable>
      </View>

      {/* New Releases */}
      <View style={styles.section}>
        <SectionHeader title="New Releases" onSeeAll={() => router.push('/(tabs)/search' as any)} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
          {NEW_EPISODES.map(ep => (
            <AudioCard key={ep.id} episode={ep} onPress={handlePlay} width={160} />
          ))}
        </ScrollView>
      </View>

      {/* Premium Content */}
      <View style={styles.section}>
        <View style={styles.premiumSectionHeader}>
          <SectionHeader title="Premium Content" />
          <View style={styles.lockBadge}>
            <Feather name="lock" size={12} color="#1DB954" />
            <Text style={styles.lockBadgeText}>PRO</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
          {PREMIUM_EPISODES.map(ep => (
            <Pressable
              key={ep.id}
              onPress={() => {
                if (user?.isPremium) handlePlay(ep);
                else router.push('/subscription');
              }}
            >
              <AudioCard episode={ep} onPress={() => {}} width={160} />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Quick Stats */}
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#1DB954', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#000', fontSize: 16, fontWeight: '700' as const },
  greeting: { color: '#B3B3B3', fontSize: 12 },
  userName: { color: '#FFF', fontSize: 16, fontWeight: '700' as const },
  headerRight: { flexDirection: 'row', gap: 4 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center' },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginBottom: 16, backgroundColor: '#1A1A1A', borderRadius: 12, paddingHorizontal: 14, height: 44, borderWidth: 1, borderColor: '#282828' },
  searchPlaceholder: { color: '#666', fontSize: 14, flex: 1 },
  premiumBanner: { marginHorizontal: 20, marginBottom: 20, backgroundColor: '#0D2A19', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#1DB95444' },
  bannerTitle: { color: '#1DB954', fontSize: 15, fontWeight: '700' as const },
  bannerSub: { color: '#B3B3B3', fontSize: 12, marginTop: 2 },
  bannerBtn: { backgroundColor: '#1DB954', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  bannerBtnText: { color: '#000', fontSize: 13, fontWeight: '700' as const },
  section: { marginBottom: 24 },
  hList: { paddingHorizontal: 20 },
  featuredSection: { marginHorizontal: 20, marginBottom: 24 },
  sectionLabel: { color: '#B3B3B3', fontSize: 12, fontWeight: '600' as const, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  featured: { borderRadius: 16, overflow: 'hidden', height: 180 },
  featuredImg: { width: '100%', height: '100%', position: 'absolute' },
  featuredOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', flexDirection: 'row', alignItems: 'flex-end', padding: 16, gap: 12 },
  featuredContent: { flex: 1 },
  featuredTag: { color: '#1DB954', fontSize: 10, fontWeight: '700' as const, letterSpacing: 1, marginBottom: 6 },
  featuredTitle: { color: '#FFF', fontSize: 16, fontWeight: '700' as const, lineHeight: 22, marginBottom: 4 },
  featuredDuration: { color: '#B3B3B3', fontSize: 12 },
  featuredPlay: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#1DB954', alignItems: 'center', justifyContent: 'center', flexShrink: 0, paddingLeft: 3 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 10 },
  allCategoriesBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8, paddingVertical: 10 },
  allCategoriesText: { color: '#1DB954', fontSize: 13, fontWeight: '600' as const },
  premiumSectionHeader: { position: 'relative' },
  lockBadge: { position: 'absolute', right: 20, top: -2, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1DB95422', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#1DB95444' },
  lockBadgeText: { color: '#1DB954', fontSize: 11, fontWeight: '700' as const },
  statsSection: { marginHorizontal: 20, marginBottom: 8, backgroundColor: '#121212', borderRadius: 16, padding: 20 },
  statsTitle: { color: '#FFF', fontSize: 16, fontWeight: '700' as const, marginBottom: 16, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statCard: { alignItems: 'center' },
  statVal: { color: '#1DB954', fontSize: 20, fontWeight: '800' as const },
  statLabel: { color: '#B3B3B3', fontSize: 11, marginTop: 2 },
});
