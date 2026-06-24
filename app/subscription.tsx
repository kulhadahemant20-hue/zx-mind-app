import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

const PLANS = [
  {
    id: 'trial',
    name: '3-Day Free Trial',
    price: '₹0',
    period: 'for 3 days',
    color: '#4ECDC4',
    features: ['All standard content', 'Ad-free experience', 'No credit card needed'],
    badge: 'FREE',
    highlight: false,
  },
  {
    id: 'basic',
    name: 'Basic Plan',
    price: '₹59',
    period: 'per month',
    color: '#45B7D1',
    features: ['All standard episodes', 'Offline unavailable', '10 categories access', 'Ad-free'],
    badge: null,
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: '₹99',
    period: 'per month',
    color: '#1DB954',
    features: ['All premium episodes', 'Offline downloads', 'All categories', 'Ad-free', 'Early access to new episodes', 'Priority support'],
    badge: 'BEST VALUE',
    highlight: true,
  },
];

export default function SubscriptionScreen() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('pro');
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await new Promise(r => setTimeout(r, 1500));
    const plan = selected as 'free' | 'basic' | 'pro';
    await updateUser({ isPremium: selected !== 'trial', plan: selected === 'trial' ? 'free' : plan });
    setLoading(false);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 20) }]}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.title}>ZX Mind Premium</Text>
        <Text style={styles.subtitle}>Invest in your growth journey</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.statsRow}>
          {[['50+', 'Expert Creators'], ['500+', 'Premium Episodes'], ['10', 'Categories']].map(([val, label]) => (
            <View key={label} style={styles.stat}>
              <Text style={styles.statVal}>{val}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {PLANS.map(plan => (
          <Pressable
            key={plan.id}
            style={[styles.planCard, selected === plan.id && { borderColor: plan.color, borderWidth: 2 }, plan.highlight && styles.planHighlight]}
            onPress={() => setSelected(plan.id)}
          >
            {plan.badge && (
              <View style={[styles.planBadge, { backgroundColor: plan.color }]}>
                <Text style={styles.planBadgeText}>{plan.badge}</Text>
              </View>
            )}
            <View style={styles.planHeader}>
              <View style={styles.radioOuter}>
                {selected === plan.id && <View style={[styles.radioInner, { backgroundColor: plan.color }]} />}
              </View>
              <View style={styles.planInfo}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={[styles.planPeriod, { color: plan.color }]}>{plan.period}</Text>
              </View>
              <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
            </View>
            <View style={styles.featureList}>
              {plan.features.map(f => (
                <View key={f} style={styles.featureRow}>
                  <Feather name="check" size={14} color={plan.color} />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
          </Pressable>
        ))}

        <Pressable onPress={handleSubscribe} disabled={loading} style={{ marginTop: 8 }}>
          <LinearGradient colors={['#1DB954', '#17a348']} style={styles.subscribeBtn}>
            <Text style={styles.subscribeBtnText}>{loading ? 'Processing...' : selected === 'trial' ? 'Start Free Trial' : `Subscribe for ${selected === 'basic' ? '₹59' : '₹99'}/month`}</Text>
          </LinearGradient>
        </Pressable>

        <Text style={styles.note}>Powered by Razorpay • Secure Payment • Cancel anytime</Text>
        <Text style={styles.currentPlan}>Current Plan: {user?.plan === 'pro' ? 'Pro' : user?.plan === 'basic' ? 'Basic' : 'Free'}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: { paddingHorizontal: 24, paddingBottom: 20 },
  closeBtn: { marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800' as const, color: '#FFF', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#B3B3B3' },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#121212', borderRadius: 16, padding: 20, marginBottom: 20 },
  stat: { alignItems: 'center' },
  statVal: { fontSize: 24, fontWeight: '800' as const, color: '#1DB954' },
  statLabel: { fontSize: 11, color: '#B3B3B3', marginTop: 2, textAlign: 'center' },
  planCard: { backgroundColor: '#121212', borderRadius: 16, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#282828' },
  planHighlight: { backgroundColor: '#0A1F11' },
  planBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  planBadgeText: { color: '#000', fontSize: 11, fontWeight: '800' as const, letterSpacing: 0.5 },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#444', alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  planInfo: { flex: 1 },
  planName: { color: '#FFF', fontSize: 16, fontWeight: '700' as const },
  planPeriod: { fontSize: 12, marginTop: 2 },
  planPrice: { fontSize: 22, fontWeight: '800' as const },
  featureList: { gap: 8, paddingLeft: 34 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { color: '#B3B3B3', fontSize: 13 },
  subscribeBtn: { height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  subscribeBtnText: { color: '#000', fontSize: 16, fontWeight: '700' as const },
  note: { color: '#555', fontSize: 12, textAlign: 'center', marginTop: 16, lineHeight: 18 },
  currentPlan: { color: '#444', fontSize: 12, textAlign: 'center', marginTop: 8 },
});
