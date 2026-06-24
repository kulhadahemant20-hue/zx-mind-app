import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert, Animated, Dimensions, Platform, Pressable,
  ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  claimReward, getClaimedRewards, getCurrentStreak,
  getDayRecords, getQualifyingDays, RewardClaimed,
} from '@/services/streak';

const { width: SW } = Dimensions.get('window');

const TIER1_DAYS = 90;
const TIER2_DAYS = 180;

function GiftCard({ tier, days, qualifying, claimed, onClaim }: {
  tier: 1 | 2;
  days: number;
  qualifying: number;
  claimed: RewardClaimed | undefined;
  onClaim: () => void;
}) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(!!claimed);
  const target = tier === 1 ? TIER1_DAYS : TIER2_DAYS;
  const progress = Math.min(qualifying / target, 1);
  const unlocked = qualifying >= target;
  const color = tier === 1 ? '#4ECDC4' : '#FFE66D';
  const bgColor = tier === 1 ? '#0B2222' : '#1F1A00';

  const gifts1 = ['ZX Mind Bottle 💧', 'ZX Mind Udi 🪷', 'ZX Mind Pen 🖊️', 'ZX Mind Candle 🕯️', 'ZX Mind Keychain 🗝️', 'ZX Mind Stickers 🎯'];
  const gifts2 = ['ZX Mind T-Shirt 👕', 'ZX Mind Hoodie 🧥', 'ZX Mind Bag 🎒', 'ZX Mind Cap 🧢', 'ZX Mind Tote 👜', 'ZX Mind Notebook 📒'];

  function doFlip() {
    if (!unlocked || claimed) return;
    Animated.spring(flipAnim, { toValue: 1, friction: 8, tension: 80, useNativeDriver: true }).start(() => {
      setFlipped(true);
    });
    onClaim();
  }

  const rotateY = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  return (
    <View style={[styles.giftOuter, { backgroundColor: bgColor, borderColor: unlocked ? color : '#1E1E1E' }]}>
      {/* Progress */}
      <View style={styles.giftHeader}>
        <View style={[styles.tierBadge, { backgroundColor: color + '20', borderColor: color + '40' }]}>
          <Feather name={tier === 1 ? 'award' : 'star'} size={14} color={color} />
          <Text style={[styles.tierLabel, { color }]}>
            {tier === 1 ? '90-Day Reward' : '180-Day Reward'}
          </Text>
        </View>
        {unlocked && !claimed && (
          <View style={styles.unlockBadge}>
            <Feather name="unlock" size={12} color="#000" />
            <Text style={styles.unlockText}>UNLOCKED</Text>
          </View>
        )}
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
        </View>
        <Text style={[styles.progressLabel, { color }]}>
          {qualifying >= target ? `${target}/${target} days ✓` : `${qualifying}/${target} days`}
        </Text>
      </View>

      {/* Gift hints */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.giftHints} contentContainerStyle={{ gap: 6, paddingHorizontal: 4 }}>
        {(tier === 1 ? gifts1 : gifts2).map(g => (
          <View key={g} style={[styles.giftHintChip, { borderColor: color + '30' }]}>
            <Text style={styles.giftHintText}>{g}</Text>
          </View>
        ))}
      </ScrollView>
      <Text style={styles.giftHintNote}>⬆️ In mein se koi random gift milega</Text>

      {/* Claim button / claimed state */}
      {claimed ? (
        <Animated.View style={[styles.claimedCard, { borderColor: color, transform: [{ rotateY }] }]}>
          <Feather name="gift" size={32} color={color} />
          <Text style={[styles.claimedTitle, { color }]}>Congratulations! 🎉</Text>
          <Text style={styles.claimedGift}>{claimed.gift}</Text>
          <Text style={styles.claimedNote}>ZX Mind team se tumhare paas pahunchega jald hi!</Text>
        </Animated.View>
      ) : unlocked ? (
        <Pressable
          style={[styles.claimBtn, { backgroundColor: color }]}
          onPress={doFlip}
        >
          <Feather name="gift" size={18} color="#000" />
          <Text style={styles.claimBtnText}>Gift Reveal Karo!</Text>
        </Pressable>
      ) : (
        <View style={styles.lockedInfo}>
          <Feather name="lock" size={14} color="#444" />
          <Text style={styles.lockedText}>
            {target - qualifying} din aur baaki hain ({target - qualifying} more qualifying days)
          </Text>
        </View>
      )}
    </View>
  );
}

export default function RewardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [qualifying, setQualifying] = useState(0);
  const [streak, setStreak] = useState(0);
  const [claimed, setClaimed] = useState<RewardClaimed[]>([]);
  const [dayRecords, setDayRecords] = useState<{ date: string; minutes: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [q, s, c, dr] = await Promise.all([
      getQualifyingDays(),
      getCurrentStreak(),
      getClaimedRewards(),
      getDayRecords(),
    ]);
    setQualifying(q);
    setStreak(s);
    setClaimed(c);
    setDayRecords(dr.slice(-30));
    setLoading(false);
  }

  async function handleClaim(tier: 1 | 2) {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    const reward = await claimReward(tier);
    setClaimed(prev => [...prev, reward]);
    Alert.alert(
      '🎉 Badhai ho!',
      `Tumhara gift: ${reward.gift}\n\nZX Mind team tumse contact karegi. Profile mein apna address fill karo.`,
      [{ text: 'Shukriya! 🙏', style: 'default' }]
    );
  }

  const tier1Claimed = claimed.find(c => c.tier === 1);
  const tier2Claimed = claimed.find(c => c.tier === 2);

  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split('T')[0];
    const rec = dayRecords.find(r => r.date === dateStr);
    return { dateStr, minutes: rec?.minutes ?? 0, day: d.getDate() };
  });

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 20) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>ZX Mind Rewards</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{streak}</Text>
          <Text style={styles.statLabel}>🔥 Current Streak</Text>
        </View>
        <View style={[styles.statBox, { borderColor: '#1DB95440' }]}>
          <Text style={[styles.statNum, { color: '#1DB954' }]}>{qualifying}</Text>
          <Text style={styles.statLabel}>✅ Qualifying Days</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{claimed.length}</Text>
          <Text style={styles.statLabel}>🎁 Gifts Won</Text>
        </View>
      </View>

      {/* Rule box */}
      <View style={styles.ruleBox}>
        <Feather name="info" size={14} color="#45B7D1" />
        <Text style={styles.ruleText}>
          Har din app pe <Text style={{ color: '#FFF', fontWeight: '700' }}>5 minute</Text> spend karo to qualifying day count hoga. 90 ya 180 qualifying days puri karo aur free gift jeet lo!
        </Text>
      </View>

      {/* Activity calendar (last 30 days) */}
      <View style={styles.calSection}>
        <Text style={styles.calTitle}>Pichle 30 Din Ki Activity</Text>
        <View style={styles.calGrid}>
          {last30.map((d, i) => (
            <View
              key={i}
              style={[
                styles.calDot,
                d.minutes >= 5 && styles.calDotGreen,
                d.minutes > 0 && d.minutes < 5 && styles.calDotYellow,
              ]}
            >
              <Text style={styles.calDotText}>{d.day}</Text>
            </View>
          ))}
        </View>
        <View style={styles.calLegend}>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#1DB954' }]} /><Text style={styles.legendText}>5+ min ✅</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#FFE66D' }]} /><Text style={styles.legendText}>&lt;5 min</Text></View>
          <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#1E1E1E' }]} /><Text style={styles.legendText}>Not opened</Text></View>
        </View>
      </View>

      {/* Gift cards */}
      <View style={styles.giftsSection}>
        <Text style={styles.giftsTitle}>Rewards Milestones</Text>
        <GiftCard tier={1} days={TIER1_DAYS} qualifying={qualifying} claimed={tier1Claimed} onClaim={() => handleClaim(1)} />
        <GiftCard tier={2} days={TIER2_DAYS} qualifying={qualifying} claimed={tier2Claimed} onClaim={() => handleClaim(2)} />
      </View>

      {/* Motivation */}
      <View style={styles.motivationBox}>
        <Text style={styles.motivationEmoji}>💪</Text>
        <Text style={styles.motivationTitle}>Lagey Raho!</Text>
        <Text style={styles.motivationSub}>
          {qualifying < TIER1_DAYS
            ? `Sirf ${TIER1_DAYS - qualifying} din aur — aur pehla gift tumhara hoga!`
            : qualifying < TIER2_DAYS
            ? `Pehla gift jeet liya! Ab ${TIER2_DAYS - qualifying} din aur aur bada reward milega!`
            : 'Dono milestones complete! Aap ZX Mind ke superstar ho! 🌟'}
        </Text>
      </View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '800' as const },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  statNum: { fontSize: 26, fontWeight: '900' as const, color: '#FF6B6B' },
  statLabel: { color: '#666', fontSize: 10, fontWeight: '600' as const, marginTop: 4, textAlign: 'center' },
  ruleBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#0A1822',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#45B7D130',
  },
  ruleText: { color: '#888', fontSize: 12, flex: 1, lineHeight: 18 },
  calSection: {
    marginHorizontal: 20,
    backgroundColor: '#0E0E0E',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  calTitle: { color: '#FFF', fontSize: 14, fontWeight: '700' as const, marginBottom: 14 },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 12 },
  calDot: {
    width: (SW - 82) / 10,
    height: (SW - 82) / 10,
    borderRadius: 6,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDotGreen: { backgroundColor: '#1DB95488' },
  calDotYellow: { backgroundColor: '#FFE66D40' },
  calDotText: { color: '#555', fontSize: 8, fontWeight: '600' as const },
  calLegend: { flexDirection: 'row', gap: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 3 },
  legendText: { color: '#555', fontSize: 11 },
  giftsSection: { paddingHorizontal: 20, gap: 14, marginBottom: 16 },
  giftsTitle: { color: '#FFF', fontSize: 17, fontWeight: '800' as const, marginBottom: 4 },
  giftOuter: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    gap: 14,
  },
  giftHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  tierLabel: { fontSize: 13, fontWeight: '700' as const },
  unlockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1DB954',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  unlockText: { color: '#000', fontSize: 10, fontWeight: '900' as const, letterSpacing: 0.5 },
  progressSection: { gap: 6 },
  progressBar: { height: 8, backgroundColor: '#1A1A1A', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  progressLabel: { fontSize: 12, fontWeight: '700' as const },
  giftHints: { flexGrow: 0 },
  giftHintChip: {
    backgroundColor: '#151515',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  giftHintText: { color: '#666', fontSize: 11 },
  giftHintNote: { color: '#444', fontSize: 11, textAlign: 'center' },
  claimedCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
  },
  claimedTitle: { fontSize: 16, fontWeight: '800' as const },
  claimedGift: { color: '#FFF', fontSize: 22, fontWeight: '900' as const, textAlign: 'center' },
  claimedNote: { color: '#666', fontSize: 12, textAlign: 'center', lineHeight: 17 },
  claimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
  },
  claimBtnText: { color: '#000', fontSize: 15, fontWeight: '800' as const },
  lockedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#151515',
    borderRadius: 10,
    padding: 12,
  },
  lockedText: { color: '#444', fontSize: 12, flex: 1 },
  motivationBox: {
    marginHorizontal: 20,
    backgroundColor: '#0A1F11',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#1DB95430',
  },
  motivationEmoji: { fontSize: 36 },
  motivationTitle: { color: '#1DB954', fontSize: 20, fontWeight: '900' as const },
  motivationSub: { color: '#888', fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
