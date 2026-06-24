import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Episode, formatDuration, getCoverImage } from '@/constants/mockData';

interface Props {
  episode: Episode;
  onPress: (episode: Episode) => void;
  width?: number;
}

export function AudioCard({ episode, onPress, width = 190 }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, { width, opacity: pressed ? 0.85 : 1 }]}
      onPress={() => onPress(episode)}
    >
      <View style={styles.imageWrap}>
        <Image source={getCoverImage(episode.coverKey)} style={styles.image} resizeMode="cover" />
        {episode.isPremium && (
          <View style={styles.premiumBadge}>
            <Feather name="lock" size={10} color="#000" />
            <Text style={styles.premiumText}>PRO</Text>
          </View>
        )}
        {(episode.isNew && !episode.isPremium) && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
        <View style={styles.playBtn}>
          <Feather name="play" size={18} color="#000" />
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>{episode.title}</Text>
      <View style={styles.metaRow}>
        <Feather name="clock" size={11} color="#666" />
        <Text style={styles.duration}>{formatDuration(episode.duration)}</Text>
        {episode.trending && (
          <>
            <View style={styles.dot} />
            <Feather name="trending-up" size={11} color="#1DB954" />
            <Text style={styles.trendingText}>Trending</Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111111',
    borderRadius: 14,
    marginRight: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: '#1A1A1A',
  },
  image: { width: '100%', height: '100%' },
  premiumBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#1DB954',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  premiumText: { fontSize: 9, fontWeight: '800' as const, color: '#000', letterSpacing: 0.5 },
  newBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#45B7D1',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  newBadgeText: { fontSize: 9, fontWeight: '800' as const, color: '#000', letterSpacing: 0.5 },
  playBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
    ...(Platform.OS !== 'web' ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 6,
    } : {}),
  },
  title: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 6,
    paddingHorizontal: 12,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  duration: { fontSize: 11, color: '#666' },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#444' },
  trendingText: { fontSize: 11, color: '#1DB954' },
});
