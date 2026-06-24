import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    color: '#444',
    features: [
      'Access to all free episodes',
      'All content categories',
      'Personalised recommendations',
      'Play history & favourites',
      'Basic playback controls',
    ],
    locked: [],
    comingSoon: false,
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '₹99',
    period: 'per month',
    color: '#1DB954',
    features: [
      'Everything in Free',
      'Unlimited premium episodes',
      'Ad-free experience',
      'Speed control (1x–2x)',
      'Priority content access',
    ],
    locked: ['Offline downloads'],
    comingSoon: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹199',
    period: 'per month',
    color: '#F7DC6F',
    features: [
      'Everything in Basic',
      'Offline downloads',
      'Early access to new content',
      'Exclusive Pro-only episodes',
      'Priority customer support',
    ],
    locked: [],
    comingSoon: true,
  },
];

function FeatureRow({ text, locked }: { text: string; locked?: boolean }) {
  return (
    <View style={s.featureRow}>
      <Feather name={locked ? 'lock' : 'check'} size={14} color={locked ? '#444' : '#1DB954'} />
      <Text style={[s.featureText, locked && { color: '#444' }]}>{text}</Text>
    </View>
  );
}

export default function PlanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const activePlan = user?.plan ?? 'free';

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </Pressable>
        <Text style={s.headerTitle}>Subscription Plans</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        <View style={s.heroBanner}>
          <View style={s.heroIcon}>
            <Feather name="star" size={28} color="#1DB954" />
          </View>
          <Text style={s.heroTitle}>Your Current Plan</Text>
          <View style={s.activeBadge}>
            <Feather name="check-circle" size={14} color="#1DB954" />
            <Text style={s.activeBadgeText}>
              {activePlan === 'pro' ? 'Pro Member' : activePlan === 'basic' ? 'Basic Member' : 'Free Plan'} — Active
            </Text>
          </View>
          <Text style={s.heroSub}>
            Premium plans are coming soon. We will notify you when they are available.
          </Text>
        </View>

        <View style={s.plansContainer}>
          {PLANS.map(plan => {
            const isActive = plan.id === activePlan;
            return (
              <View key={plan.id} style={[s.planCard, isActive && s.planCardActive]}>
                {isActive && (
                  <View style={s.activePill}>
                    <Text style={s.activePillText}>CURRENT PLAN</Text>
                  </View>
                )}
                {plan.comingSoon && (
                  <View style={s.comingSoonPill}>
                    <Text style={s.comingSoonText}>COMING SOON</Text>
                  </View>
                )}

                <View style={s.planHeader}>
                  <Text style={[s.planName, { color: plan.color }]}>{plan.name}</Text>
                  <View style={s.planPriceWrap}>
                    <Text style={[s.planPrice, { color: plan.color }]}>{plan.price}</Text>
                    <Text style={s.planPeriod}>/{plan.period}</Text>
                  </View>
                </View>

                <View style={s.divider} />

                {plan.features.map(f => <FeatureRow key={f} text={f} />)}
                {plan.locked.map(f => <FeatureRow key={f} text={f} locked />)}

                {plan.comingSoon && !isActive && (
                  <View style={s.comingSoonBtn}>
                    <Text style={s.comingSoonBtnText}>Coming Soon</Text>
                  </View>
                )}
                {isActive && (
                  <View style={s.activeBtn}>
                    <Feather name="check" size={14} color="#1DB954" />
                    <Text style={s.activeBtnText}>Active Plan</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={s.noticeBox}>
          <Feather name="info" size={14} color="#555" />
          <Text style={s.noticeText}>
            Premium subscriptions are not yet available. No charges will be made. When premium plans launch, they will be processed securely through Google Play or the Apple App Store. You will be notified before any billing begins.
          </Text>
        </View>

        <View style={s.faqSection}>
          <Text style={s.faqTitle}>Plan FAQ</Text>
          {[
            ['Can I cancel anytime?', 'Yes. You can cancel your subscription at any time through the Google Play Store or Apple App Store. You will retain access until the end of your billing period.'],
            ['Is there a free trial?', 'A 3-Day Free Trial will be available when premium plans launch. No payment method is required to use the Free plan.'],
            ['How do I know when premium launches?', 'Enable notifications in Settings to receive an alert when premium plans become available.'],
          ].map(([q, a]) => (
            <View key={q} style={s.faqItem}>
              <Text style={s.faqQ}>{q}</Text>
              <Text style={s.faqA}>{a}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#1A1A1A' },
  headerTitle: { fontSize: 17, fontWeight: '700' as const, color: '#FFF' },
  heroBanner: { alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  heroIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#0D2A19', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#1DB95444' },
  heroTitle: { fontSize: 20, fontWeight: '700' as const, color: '#FFF', marginBottom: 10 },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#0D2A19', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16, borderWidth: 1, borderColor: '#1DB95444', marginBottom: 12 },
  activeBadgeText: { fontSize: 13, fontWeight: '700' as const, color: '#1DB954' },
  heroSub: { fontSize: 13, color: '#666', textAlign: 'center' },
  plansContainer: { padding: 16, gap: 14 },
  planCard: { backgroundColor: '#0D0D0D', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1A1A1A', position: 'relative' },
  planCardActive: { borderColor: '#1DB95466', backgroundColor: '#0A1F12' },
  activePill: { position: 'absolute', top: -1, right: 14, backgroundColor: '#1DB954', paddingHorizontal: 10, paddingVertical: 4, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
  activePillText: { fontSize: 10, fontWeight: '800' as const, color: '#000', letterSpacing: 0.5 },
  comingSoonPill: { position: 'absolute', top: -1, right: 14, backgroundColor: '#333', paddingHorizontal: 10, paddingVertical: 4, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
  comingSoonText: { fontSize: 10, fontWeight: '700' as const, color: '#888', letterSpacing: 0.5 },
  planHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14, marginTop: 8 },
  planName: { fontSize: 22, fontWeight: '800' as const },
  planPriceWrap: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  planPrice: { fontSize: 22, fontWeight: '800' as const },
  planPeriod: { fontSize: 12, color: '#666' },
  divider: { height: 1, backgroundColor: '#1A1A1A', marginBottom: 14 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  featureText: { fontSize: 13, color: '#B3B3B3', flex: 1 },
  comingSoonBtn: { marginTop: 16, alignItems: 'center', padding: 12, borderRadius: 24, borderWidth: 1, borderColor: '#282828' },
  comingSoonBtnText: { color: '#555', fontSize: 14, fontWeight: '600' as const },
  activeBtn: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#0D2A19', padding: 12, borderRadius: 24, borderWidth: 1, borderColor: '#1DB95444' },
  activeBtnText: { color: '#1DB954', fontSize: 14, fontWeight: '600' as const },
  noticeBox: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginBottom: 16, padding: 14, backgroundColor: '#0D0D0D', borderRadius: 12, borderWidth: 1, borderColor: '#1A1A1A' },
  noticeText: { flex: 1, fontSize: 12, color: '#555', lineHeight: 18 },
  faqSection: { paddingHorizontal: 20, paddingTop: 8 },
  faqTitle: { fontSize: 11, fontWeight: '700' as const, color: '#1DB954', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 },
  faqItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#111' },
  faqQ: { fontSize: 14, fontWeight: '600' as const, color: '#FFF', marginBottom: 6 },
  faqA: { fontSize: 13, color: '#666', lineHeight: 19 },
});
