import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions, Image, Platform, Pressable, ScrollView,
  Share, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlayer } from '@/context/PlayerContext';
import { getCoverImage, formatDuration } from '@/constants/mockData';
import { isFavorite, toggleFavorite, addToHistory } from '@/services/storage';
import { CommentSection } from '@/components/CommentSection';

const { width } = Dimensions.get('window');
const SPEEDS = [1, 1.25, 1.5, 2];

export default function PlayerScreen() {
  const { currentEpisode, isPlaying, position, duration: avDuration, speed, pause, resume, seek, skipForward, skipBackward, setSpeed } = usePlayer();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [fav, setFav] = useState(false);

  useEffect(() => {
    if (!currentEpisode) return;
    isFavorite(currentEpisode.id).then(setFav);
    addToHistory(currentEpisode.id);
  }, [currentEpisode?.id]);

  async function handleToggleFavorite() {
    if (!currentEpisode) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nowFav = await toggleFavorite(currentEpisode.id);
    setFav(nowFav);
  }

  async function handleShare() {
    if (!currentEpisode) return;
    await Share.share({ message: `Listening to "${currentEpisode.title}" on ZX Mind! 🎧` });
  }

  async function handlePlayPause() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    isPlaying ? pause() : resume();
  }

  async function handleSkipForward() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    skipForward();
  }

  async function handleSkipBackward() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    skipBackward();
  }

  if (!currentEpisode) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <Feather name="music" size={48} color="#444" />
        <Text style={{ color: '#666', marginTop: 12 }}>No episode selected</Text>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={24} color="#FFF" />
        </Pressable>
      </View>
    );
  }

  const totalDuration = avDuration || currentEpisode.duration;
  const progress = totalDuration > 0 ? position / totalDuration : 0;
  const remaining = totalDuration - position;

  return (
    <View style={styles.root}>
      <Image source={getCoverImage(currentEpisode.coverKey)} style={StyleSheet.absoluteFill} blurRadius={40} />
      <LinearGradient colors={['rgba(0,0,0,0.3)', '#000000', '#000000']} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]} scrollEnabled={true} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} style={styles.downBtn}>
            <Feather name="chevron-down" size={28} color="#FFF" />
          </Pressable>
          <Text style={styles.nowPlaying}>Now Playing</Text>
          <Pressable onPress={handleShare} style={styles.shareBtn}>
            <Feather name="share-2" size={20} color="#FFF" />
          </Pressable>
        </View>

        <View style={styles.artWrap}>
          <Image source={getCoverImage(currentEpisode.coverKey)} style={styles.art} />
          {currentEpisode.isPremium && (
            <View style={styles.proBadge}>
              <Feather name="star" size={12} color="#000" />
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          )}
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoText}>
            <Text style={styles.epTitle} numberOfLines={2}>{currentEpisode.title}</Text>
          </View>
          <Pressable onPress={handleToggleFavorite} style={styles.favBtn}>
            <Feather name="heart" size={24} color={fav ? '#1DB954' : '#B3B3B3'} />
          </Pressable>
        </View>

        <View style={styles.progressSection}>
          <Pressable
            style={styles.progressBarWrap}
            onPress={(e) => {
              const pW = width - 48;
              const tapX = e.nativeEvent.locationX;
              const ratio = Math.max(0, Math.min(1, tapX / pW));
              seek(ratio * totalDuration);
            }}
          >
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              <View style={[styles.progressThumb, { left: `${progress * 100}%` }]} />
            </View>
          </Pressable>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatDuration(Math.floor(position))}</Text>
            <Text style={styles.timeText}>-{formatDuration(Math.max(0, Math.floor(remaining)))}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <Pressable onPress={handleSkipBackward} style={styles.skipBtn}>
            <Feather name="rewind" size={22} color="#FFF" />
            <Text style={styles.skipLabel}>10</Text>
          </Pressable>
          <Pressable onPress={handlePlayPause} style={styles.playBtn}>
            <Feather name={isPlaying ? 'pause' : 'play'} size={34} color="#000" />
          </Pressable>
          <Pressable onPress={handleSkipForward} style={styles.skipBtn}>
            <Feather name="fast-forward" size={22} color="#FFF" />
            <Text style={styles.skipLabel}>10</Text>
          </Pressable>
        </View>

        <View style={styles.bottomRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {SPEEDS.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.speedChip, speed === s && styles.speedChipActive]}
                onPress={() => setSpeed(s)}
              >
                <Text style={[styles.speedText, speed === s && { color: '#000' }]}>{s}x</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {currentEpisode.isPremium ? (
            <Pressable style={styles.downloadBtn}>
              <Feather name="download" size={18} color="#1DB954" />
            </Pressable>
          ) : (
            <Pressable style={styles.downloadBtn} onPress={() => router.push('/subscription')}>
              <Feather name="lock" size={18} color="#666" />
            </Pressable>
          )}
        </View>

        <Text style={styles.description}>{currentEpisode.description}</Text>

        <CommentSection episodeId={currentEpisode.id} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  scroll: { paddingHorizontal: 24, flexGrow: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  downBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  nowPlaying: { color: '#B3B3B3', fontSize: 13, fontWeight: '600' as const, letterSpacing: 1, textTransform: 'uppercase' },
  shareBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  artWrap: { alignSelf: 'center', marginBottom: 28, position: 'relative' },
  art: { width: width - 80, height: width - 80, borderRadius: 16 },
  proBadge: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#1DB954', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  proBadgeText: { color: '#000', fontSize: 10, fontWeight: '700' as const },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  infoText: { flex: 1, marginRight: 12 },
  epTitle: { fontSize: 20, fontWeight: '700' as const, color: '#FFF', lineHeight: 26 },
  favBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  progressSection: { marginBottom: 24 },
  progressBarWrap: { paddingVertical: 12 },
  progressTrack: { height: 4, backgroundColor: '#282828', borderRadius: 2, position: 'relative' },
  progressFill: { height: 4, backgroundColor: '#1DB954', borderRadius: 2, position: 'absolute', top: 0, left: 0 },
  progressThumb: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#1DB954', position: 'absolute', top: -5, marginLeft: -7 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  timeText: { color: '#B3B3B3', fontSize: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 28 },
  skipBtn: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  skipLabel: { position: 'absolute', color: '#FFF', fontSize: 10, fontWeight: '700' as const, bottom: -2 },
  playBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#1DB954', alignItems: 'center', justifyContent: 'center', paddingLeft: 4 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  speedChip: { backgroundColor: '#1A1A1A', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#333' },
  speedChipActive: { backgroundColor: '#1DB954', borderColor: '#1DB954' },
  speedText: { color: '#FFF', fontSize: 13, fontWeight: '600' as const },
  downloadBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333' },
  description: { color: '#B3B3B3', fontSize: 13, lineHeight: 20 },
  closeBtn: { position: 'absolute', top: 48, right: 24, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1A1A', borderRadius: 20 },
});
