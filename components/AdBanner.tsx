import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View, Animated } from 'react-native';

const { width: SW } = Dimensions.get('window');

const TEST_ADS = [
  {
    id: 'ad1',
    brand: 'ZX Mind Pro',
    headline: 'Apni Zindagi Badlo — Abhi Shuru Karo!',
    body: 'Unlimited access to 500+ premium audio episodes. ₹99/month only.',
    cta: 'Try Free',
    color: '#1DB954',
    icon: 'headphones',
  },
  {
    id: 'ad2',
    brand: 'Meditation Masterclass',
    headline: '10 Minute Meditation Se Din Badal Jayega',
    body: 'Join 50,000+ learners improving their mental health daily.',
    cta: 'Learn More',
    color: '#4ECDC4',
    icon: 'sun',
  },
  {
    id: 'ad3',
    brand: 'Success Formula',
    headline: 'Ameer Logo Ki Soch Seekho — Free Webinar',
    body: 'Register now for our exclusive online masterclass this weekend.',
    cta: 'Register Free',
    color: '#FFE66D',
    icon: 'zap',
  },
];

interface Props {
  onPress?: () => void;
}

export function AdBanner({ onPress }: Props) {
  const [adIndex, setAdIndex] = useState(0);
  const opacity = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      setTimeout(() => {
        setAdIndex(prev => (prev + 1) % TEST_ADS.length);
      }, 300);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const ad = TEST_ADS[adIndex];

  return (
    <Pressable style={styles.wrapper} onPress={onPress}>
      <View style={styles.labelRow}>
        <View style={styles.adLabel}>
          <Text style={styles.adLabelText}>Advertisement</Text>
        </View>
        <Pressable style={styles.closeHint}>
          <Feather name="more-horizontal" size={16} color="#666" />
        </Pressable>
      </View>

      <Animated.View style={[styles.card, { opacity }]}>
        <View style={[styles.adImageArea, { backgroundColor: ad.color + '15', borderColor: ad.color + '33' }]}>
          <View style={[styles.adIconBg, { backgroundColor: ad.color + '22' }]}>
            <Feather name={ad.icon as any} size={36} color={ad.color} />
          </View>
          <View style={styles.adTextArea}>
            <Text style={[styles.brandName, { color: ad.color }]}>{ad.brand}</Text>
            <Text style={styles.adHeadline} numberOfLines={2}>{ad.headline}</Text>
            <Text style={styles.adBody} numberOfLines={2}>{ad.body}</Text>
          </View>
        </View>

        <View style={styles.adFooter}>
          <View style={styles.googleBadge}>
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.googleOogle}>oogle</Text>
          </View>
          <Pressable style={[styles.ctaBtn, { backgroundColor: ad.color }]} onPress={onPress}>
            <Text style={styles.ctaText}>{ad.cta}</Text>
          </Pressable>
        </View>
      </Animated.View>

      <View style={styles.dotsRow}>
        {TEST_ADS.map((_, i) => (
          <View key={i} style={[styles.dot, i === adIndex && styles.dotActive]} />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#0E0E0E',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#282828',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  adLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adLabelText: {
    color: '#555',
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  closeHint: { padding: 4 },
  card: {
    padding: 0,
  },
  adImageArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    minHeight: 100,
    borderWidth: 0,
  },
  adIconBg: {
    width: 72,
    height: 72,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  adTextArea: { flex: 1 },
  brandName: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
    marginBottom: 4,
  },
  adHeadline: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700' as const,
    lineHeight: 19,
    marginBottom: 4,
  },
  adBody: {
    color: '#888',
    fontSize: 11,
    lineHeight: 15,
  },
  adFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  googleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleG: {
    color: '#4285F4',
    fontSize: 14,
    fontWeight: '900' as const,
  },
  googleOogle: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500' as const,
  },
  ctaBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ctaText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '700' as const,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    paddingBottom: 10,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#333',
  },
  dotActive: {
    backgroundColor: '#1DB954',
    width: 14,
  },
});
