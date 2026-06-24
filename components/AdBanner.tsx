/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║              ZX MIND — GOOGLE ADMOB INTEGRATION                 ║
 * ║                                                                  ║
 * ║  SETUP STEPS (Jab AdMob Account ready ho):                      ║
 * ║                                                                  ║
 * ║  1. Install:                                                     ║
 * ║     pnpm add react-native-google-mobile-ads                     ║
 * ║                                                                  ║
 * ║  2. app.json mein add karo:                                      ║
 * ║     "react-native-google-mobile-ads": {                          ║
 * ║       "android_app_id": "ca-app-pub-XXXXXXXX~XXXXXXXX",         ║
 * ║       "ios_app_id": "ca-app-pub-XXXXXXXX~XXXXXXXX"              ║
 * ║     }                                                            ║
 * ║                                                                  ║
 * ║  3. Niche ADMOB_CONFIG mein apne real IDs daal do               ║
 * ║                                                                  ║
 * ║  4. IS_LIVE = true karo production mein                         ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// ─── AdMob Configuration ───────────────────────────────────────────────────
// TODO: Yahan apni real AdMob IDs daal do
export const ADMOB_CONFIG = {
  // App IDs (AdMob dashboard se)
  ANDROID_APP_ID: 'ca-app-pub-3940256099942544~3347511713',  // ← REPLACE WITH YOUR ID
  IOS_APP_ID: 'ca-app-pub-3940256099942544~1458002511',       // ← REPLACE WITH YOUR ID

  // Ad Unit IDs
  BANNER_ANDROID: 'ca-app-pub-3940256099942544/6300978111',   // ← REPLACE
  BANNER_IOS: 'ca-app-pub-3940256099942544/2934735716',       // ← REPLACE
  INTERSTITIAL_ANDROID: 'ca-app-pub-3940256099942544/1033173712', // ← REPLACE
  INTERSTITIAL_IOS: 'ca-app-pub-3940256099942544/4411468910', // ← REPLACE
  REWARDED_ANDROID: 'ca-app-pub-3940256099942544/5224354917', // ← REPLACE
  REWARDED_IOS: 'ca-app-pub-3940256099942544/3812604823',     // ← REPLACE

  // true = live ads, false = test ads
  IS_LIVE: false,
};

/*
 * ─── REAL ADMOB CODE (Development Build mein use karo) ───────────────────
 *
 * Jab react-native-google-mobile-ads install ho jaye, yeh code uncomment karo:
 *
 * import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
 * import { Platform } from 'react-native';
 *
 * const adUnitId = ADMOB_CONFIG.IS_LIVE
 *   ? (Platform.OS === 'android' ? ADMOB_CONFIG.BANNER_ANDROID : ADMOB_CONFIG.BANNER_IOS)
 *   : TestIds.ADAPTIVE_BANNER;
 *
 * export function RealAdBanner() {
 *   return (
 *     <BannerAd
 *       unitId={adUnitId}
 *       size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
 *       requestOptions={{ requestNonPersonalizedAdsOnly: true }}
 *       onAdLoaded={() => console.log('Ad loaded')}
 *       onAdFailedToLoad={(err) => console.log('Ad failed:', err)}
 *     />
 *   );
 * }
 *
 * Interstitial Ad:
 * import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
 * const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);
 * interstitial.load();
 * interstitial.show();
 *
 * Rewarded Ad (Premium content unlock ke liye):
 * import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
 * const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED);
 * ─────────────────────────────────────────────────────────────────────────
 */

// ─── Expo Go Preview ke liye Simulated Test Ads ───────────────────────────
import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

const { width: SW } = Dimensions.get('window');

// Simulated test ads — bilkul Google ad format jaisi
const TEST_ADS = [
  {
    id: 'test_1',
    brand: 'ZX Mind Pro',
    headline: 'Apni Zindagi Badlo — Abhi Shuru Karo!',
    body: '500+ premium audio episodes sirf ₹99/month mein.',
    cta: 'Try Free',
    color: '#1DB954',
    icon: 'headphones' as const,
  },
  {
    id: 'test_2',
    brand: 'Success Formula',
    headline: 'Ameer Sochne Ka Tarika Seekho',
    body: 'India ke top creators ke saath exclusive masterclass.',
    cta: 'Learn More',
    color: '#FFE66D',
    icon: 'zap' as const,
  },
  {
    id: 'test_3',
    brand: 'Mind Mastery',
    headline: 'Daily 10 Minute Se Zindagi Badlegi',
    body: 'Confidence, discipline, success — sab ek jagah.',
    cta: 'Start Now',
    color: '#4ECDC4',
    icon: 'sun' as const,
  },
];

interface Props {
  onPress?: () => void;
}

export function AdBanner({ onPress }: Props) {
  const [adIndex, setAdIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
      setTimeout(() => setAdIndex(prev => (prev + 1) % TEST_ADS.length), 250);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const ad = TEST_ADS[adIndex];

  return (
    <Pressable style={styles.wrapper} onPress={onPress} accessibilityRole="button" accessibilityLabel="Advertisement">
      {/* Label row — exactly like Google/Spotify format */}
      <View style={styles.labelRow}>
        <View style={styles.googleBadge}>
          <Text style={styles.googleG}>G</Text>
          <Text style={styles.googleRest}>oogle</Text>
        </View>
        <View style={styles.adLabelPill}>
          <Text style={styles.adLabelText}>Advertisement</Text>
        </View>
        <Pressable style={styles.moreBtn}>
          <Feather name="more-horizontal" size={16} color="#555" />
        </Pressable>
      </View>

      {/* Ad content */}
      <Animated.View style={[styles.adBody, { opacity }]}>
        <View style={[styles.adThumb, { backgroundColor: ad.color + '18' }]}>
          <Feather name={ad.icon} size={32} color={ad.color} />
        </View>
        <View style={styles.adText}>
          <Text style={[styles.adBrand, { color: ad.color }]}>{ad.brand}</Text>
          <Text style={styles.adHeadline} numberOfLines={2}>{ad.headline}</Text>
          <Text style={styles.adBodyText} numberOfLines={1}>{ad.body}</Text>
        </View>
      </Animated.View>

      {/* Footer */}
      <View style={styles.adFooter}>
        <Text style={styles.adFooterNote}>Sponsored</Text>
        <Pressable style={[styles.ctaBtn, { backgroundColor: ad.color }]} onPress={onPress}>
          <Text style={styles.ctaText}>{ad.cta}</Text>
        </Pressable>
      </View>

      {/* Dot indicators */}
      <View style={styles.dotsRow}>
        {TEST_ADS.map((_, i) => (
          <View key={i} style={[styles.dot, i === adIndex && [styles.dotActive, { backgroundColor: ad.color }]]} />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#0C0C0C',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#202020',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#181818',
  },
  googleBadge: { flexDirection: 'row', alignItems: 'center' },
  googleG: { color: '#4285F4', fontSize: 13, fontWeight: '900' as const },
  googleRest: { color: '#888', fontSize: 12, fontWeight: '500' as const },
  adLabelPill: {
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  adLabelText: { color: '#555', fontSize: 10, fontWeight: '600' as const, letterSpacing: 0.3 },
  moreBtn: { padding: 4 },
  adBody: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
    minHeight: 90,
  },
  adThumb: {
    width: 70,
    height: 70,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  adText: { flex: 1 },
  adBrand: { fontSize: 10, fontWeight: '700' as const, letterSpacing: 0.5, textTransform: 'uppercase' as const, marginBottom: 4 },
  adHeadline: { color: '#FFF', fontSize: 14, fontWeight: '700' as const, lineHeight: 19, marginBottom: 3 },
  adBodyText: { color: '#666', fontSize: 11 },
  adFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#181818',
  },
  adFooterNote: { color: '#444', fontSize: 11 },
  ctaBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  ctaText: { color: '#000', fontSize: 13, fontWeight: '700' as const },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    paddingBottom: 10,
  },
  dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#282828' },
  dotActive: { width: 14 },
});
