import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const isPremium = user?.isPremium ?? false;

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </Pressable>
        <Text style={s.headerTitle}>Payment History</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        {isPremium ? (
          <>
            <View style={s.infoStrip}>
              <Feather name="credit-card" size={16} color="#1DB954" />
              <Text style={s.infoStripText}>
                Your subscription is managed through the Google Play Store or Apple App Store. Transaction receipts and invoices are available there.
              </Text>
            </View>

            <View style={s.section}>
              <Text style={s.sectionTitle}>Subscription Status</Text>
              <View style={s.statusCard}>
                <View style={s.statusRow}>
                  <Text style={s.statusLabel}>Plan</Text>
                  <View style={s.statusBadge}>
                    <Feather name="star" size={12} color="#1DB954" />
                    <Text style={s.statusBadgeText}>{user?.plan === 'pro' ? 'Pro' : 'Basic'}</Text>
                  </View>
                </View>
                <View style={s.statusRow}>
                  <Text style={s.statusLabel}>Status</Text>
                  <Text style={s.statusValue}>Active</Text>
                </View>
                <View style={[s.statusRow, { borderBottomWidth: 0 }]}>
                  <Text style={s.statusLabel}>Manage</Text>
                  <Pressable onPress={() => Linking.openURL('https://play.google.com/store/account/subscriptions')}>
                    <Text style={s.manageLink}>Google Play →</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={s.section}>
              <Text style={s.sectionTitle}>Transaction Records</Text>
              <View style={s.emptyTxn}>
                <Feather name="file-text" size={32} color="#282828" />
                <Text style={s.emptyTxnTitle}>No Transactions Found</Text>
                <Text style={s.emptyTxnSub}>
                  Transactions are processed and stored by Google Play or the Apple App Store. View your full billing history there.
                </Text>
                <Pressable style={s.viewStoreBtn} onPress={() => Linking.openURL('https://play.google.com/store/account/subscriptions')}>
                  <Text style={s.viewStoreBtnText}>View on Google Play</Text>
                </Pressable>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={s.emptyState}>
              <View style={s.emptyIcon}>
                <Feather name="credit-card" size={36} color="#282828" />
              </View>
              <Text style={s.emptyTitle}>No Payment History</Text>
              <Text style={s.emptySub}>
                You are currently on the Free plan. No payments have been made.
              </Text>
              <Text style={s.emptySub2}>
                When you subscribe to a premium plan, your transaction history will appear here. All payments are processed securely through the Google Play Store or Apple App Store.
              </Text>
            </View>

            <View style={s.section}>
              <Text style={s.sectionTitle}>Free Plan — What's Included</Text>
              <View style={s.freeCard}>
                {[
                  'Access to all free episodes',
                  'All content categories (Confidence, Discipline, Career, and more)',
                  'Play history and favourites',
                  'No credit card required',
                  'No subscription — free forever',
                ].map(f => (
                  <View key={f} style={s.freeRow}>
                    <Feather name="check" size={14} color="#1DB954" />
                    <Text style={s.freeText}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={s.section}>
              <Text style={s.sectionTitle}>Premium Plans</Text>
              <View style={s.comingCard}>
                <Feather name="clock" size={20} color="#555" />
                <View style={{ flex: 1 }}>
                  <Text style={s.comingTitle}>Coming Soon</Text>
                  <Text style={s.comingSub}>
                    Premium subscriptions are not yet available. No payment will be collected until plans officially launch. Enable notifications to be alerted when they do.
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        <View style={s.legalBox}>
          <Text style={s.legalTitle}>Billing & Refund Policy</Text>
          <Text style={s.legalText}>
            All payments are processed by Google Play or the Apple App Store. ZX Mind does not store your payment information. For refunds or billing disputes, contact Google Play or Apple Support directly. For questions about your ZX Mind subscription, email us at support@zxmind.app.
          </Text>
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
  infoStrip: { flexDirection: 'row', gap: 10, margin: 16, padding: 14, backgroundColor: '#0D2A19', borderRadius: 12, borderWidth: 1, borderColor: '#1DB95444' },
  infoStripText: { flex: 1, fontSize: 13, color: '#B3B3B3', lineHeight: 18 },
  section: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  sectionTitle: { fontSize: 11, fontWeight: '700' as const, color: '#1DB954', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 },
  statusCard: { backgroundColor: '#0D0D0D', borderRadius: 14, borderWidth: 1, borderColor: '#1A1A1A', paddingHorizontal: 16 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#111' },
  statusLabel: { fontSize: 14, color: '#888' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#0D2A19', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusBadgeText: { fontSize: 13, color: '#1DB954', fontWeight: '600' as const },
  statusValue: { fontSize: 14, color: '#FFF', fontWeight: '500' as const },
  manageLink: { fontSize: 13, color: '#1DB954', fontWeight: '600' as const },
  emptyTxn: { backgroundColor: '#0D0D0D', borderRadius: 14, borderWidth: 1, borderColor: '#1A1A1A', padding: 24, alignItems: 'center' },
  emptyTxnTitle: { fontSize: 16, fontWeight: '700' as const, color: '#FFF', marginTop: 10, marginBottom: 6 },
  emptyTxnSub: { fontSize: 13, color: '#666', textAlign: 'center', lineHeight: 19, marginBottom: 16 },
  viewStoreBtn: { backgroundColor: '#1A1A1A', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  viewStoreBtnText: { color: '#FFF', fontSize: 13, fontWeight: '600' as const },
  emptyState: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 32 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#0D0D0D', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#1A1A1A' },
  emptyTitle: { fontSize: 20, fontWeight: '700' as const, color: '#FFF', marginBottom: 10 },
  emptySub: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 21, marginBottom: 10 },
  emptySub2: { fontSize: 13, color: '#555', textAlign: 'center', lineHeight: 19 },
  freeCard: { backgroundColor: '#0D2A19', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1DB95433', gap: 10 },
  freeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  freeText: { fontSize: 13, color: '#B3B3B3', flex: 1 },
  comingCard: { flexDirection: 'row', gap: 12, backgroundColor: '#0D0D0D', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1A1A1A', alignItems: 'flex-start' },
  comingTitle: { fontSize: 14, fontWeight: '700' as const, color: '#888', marginBottom: 4 },
  comingSub: { fontSize: 13, color: '#555', lineHeight: 18 },
  legalBox: { margin: 20, padding: 16, backgroundColor: '#0D0D0D', borderRadius: 12, borderWidth: 1, borderColor: '#1A1A1A' },
  legalTitle: { fontSize: 12, color: '#555', fontWeight: '700' as const, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  legalText: { fontSize: 12, color: '#444', lineHeight: 18 },
});
