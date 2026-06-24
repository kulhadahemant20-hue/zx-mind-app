import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { usePlayer } from '@/context/PlayerContext';
import { getCoverImage } from '@/constants/mockData';

const TAB_BAR_HEIGHT = Platform.OS === 'web' ? 84 : 60;

export function MiniPlayer() {
  const { currentEpisode, isPlaying, position, pause, resume } = usePlayer();
  const router = useRouter();

  if (!currentEpisode) return null;

  const progress = currentEpisode.duration > 0 ? position / currentEpisode.duration : 0;

  return (
    <Pressable style={[styles.container, { bottom: TAB_BAR_HEIGHT }]} onPress={() => router.push('/player')}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#1A1A1A' }]} />
      )}
      <View style={styles.content}>
        <Image source={getCoverImage(currentEpisode.coverKey)} style={styles.cover} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{currentEpisode.title}</Text>
          <Text style={styles.creator} numberOfLines={1}>{currentEpisode.creator}</Text>
        </View>
        <Pressable style={styles.playBtn} onPress={(e) => { e.stopPropagation(); isPlaying ? pause() : resume(); }}>
          <Feather name={isPlaying ? 'pause' : 'play'} size={22} color="#1DB954" />
        </Pressable>
        <Pressable style={styles.nextBtn} onPress={(e) => { e.stopPropagation(); }}>
          <Feather name="skip-forward" size={20} color="#B3B3B3" />
        </Pressable>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 64,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: '#282828',
    zIndex: 100,
  },
  content: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 62 },
  cover: { width: 44, height: 44, borderRadius: 6, marginRight: 12 },
  info: { flex: 1, marginRight: 8 },
  title: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' as const },
  creator: { color: '#B3B3B3', fontSize: 12, marginTop: 2 },
  playBtn: { padding: 8 },
  nextBtn: { padding: 8 },
  progressBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: '#282828' },
  progressFill: { height: 2, backgroundColor: '#1DB954' },
});
