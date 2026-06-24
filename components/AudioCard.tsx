import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Episode, formatDuration, getCoverImage } from '@/constants/mockData';
import { useColors } from '@/hooks/useColors';

interface Props {
  episode: Episode;
  onPress: (episode: Episode) => void;
  width?: number;
}

export function AudioCard({ episode, onPress, width = 160 }: Props) {
  const colors = useColors();
  return (
    <Pressable
      style={({ pressed }) => [styles.card, { width, opacity: pressed ? 0.85 : 1, backgroundColor: colors.card }]}
      onPress={() => onPress(episode)}
    >
      <View style={styles.imageWrap}>
        <Image source={getCoverImage(episode.coverKey)} style={styles.image} />
        {episode.isPremium && (
          <View style={[styles.premiumBadge, { backgroundColor: '#1DB954' }]}>
            <Feather name="lock" size={10} color="#000" />
            <Text style={styles.premiumText}>PRO</Text>
          </View>
        )}
        <View style={[styles.playBtn, { backgroundColor: '#1DB954' }]}>
          <Feather name="play" size={16} color="#000" />
        </View>
      </View>
      <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
        {episode.title}
      </Text>
      <Text style={[styles.duration, { color: colors.mutedForeground }]}>
        {formatDuration(episode.duration)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 0, marginRight: 12, overflow: 'hidden' },
  imageWrap: { width: '100%', aspectRatio: 1, position: 'relative' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  premiumBadge: {
    position: 'absolute', top: 8, left: 8,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4,
  },
  premiumText: { fontSize: 9, fontWeight: '700' as const, color: '#000', letterSpacing: 0.5 },
  playBtn: {
    position: 'absolute', bottom: 8, right: 8,
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
    ...(Platform.OS !== 'web' ? {
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
    } : {}),
  },
  title: { fontSize: 13, fontWeight: '600' as const, marginTop: 10, paddingHorizontal: 10, lineHeight: 18 },
  duration: { fontSize: 11, marginTop: 4, marginBottom: 10, paddingHorizontal: 10 },
});
