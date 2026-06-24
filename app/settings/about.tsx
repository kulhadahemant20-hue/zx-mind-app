import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const APP_VERSION = '1.0.0';
const BUILD = '2025.06';

function LinkRow({ icon, label, value, onPress }: { icon: string; label: string; value: string; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [s.linkRow, { opacity: pressed ? 0.7 : 1 }]} onPress={onPress}>
      <View style={s.linkIcon}>
        <Feather name={icon as any} size={16} color="#1DB954" />
      </View>
      <View style={s.linkText}>
        <Text style={s.linkLabel}>{label}</Text>
        <Text style={s.linkValue}>{value}</Text>
      </View>
      <Feather name="external-link" size={14} color="#555" />
    </Pressable>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.infoBlock}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  );
}

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </Pressable>
        <Text style={s.headerTitle}>About ZX Mind</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        <View style={s.hero}>
          <View style={s.logoCircle}>
            <Feather name="headphones" size={36} color="#1DB954" />
          </View>
          <Text style={s.appName}>ZX Mind</Text>
          <Text style={s.tagline}>Transform Your Life, One Audio At A Time</Text>
          <View style={s.versionBadge}>
            <Text style={s.versionText}>Version {APP_VERSION} · Build {BUILD}</Text>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Our Mission</Text>
          <View style={s.missionCard}>
            <Text style={s.missionText}>
              ZX Mind is built with one goal — to make self-improvement accessible to every Indian. We believe that great knowledge should not be locked behind expensive books or English-only content.
            </Text>
            <Text style={[s.missionText, { marginTop: 10 }]}>
              Through short, powerful audio episodes in Hindi and Hinglish, we help you grow your confidence, sharpen your communication, build discipline, and live a more fulfilling life — one listen at a time.
            </Text>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>App Information</Text>
          <InfoBlock label="App Name" value="ZX Mind" />
          <InfoBlock label="Version" value={`${APP_VERSION} (${BUILD})`} />
          <InfoBlock label="Platform" value="Android & iOS" />
          <InfoBlock label="Content Language" value="Hindi / Hinglish" />
          <InfoBlock label="Category" value="Self Improvement · Podcasts & Audio" />
          <InfoBlock label="Target Audience" value="18+ years" />
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Content Categories</Text>
          <View style={s.tagWrap}>
            {['Confidence', 'Communication', 'Discipline', 'Stress Relief', 'Career', 'Legends', 'Success Stories', 'Relationships', 'Money', 'Decision Making', 'Self Growth'].map(tag => (
              <View key={tag} style={s.tag}>
                <Text style={s.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Contact & Support</Text>
          <LinkRow
            icon="mail"
            label="General Support"
            value="support@zxmind.app"
            onPress={() => Linking.openURL('mailto:support@zxmind.app')}
          />
          <LinkRow
            icon="shield"
            label="Privacy Concerns"
            value="privacy@zxmind.app"
            onPress={() => Linking.openURL('mailto:privacy@zxmind.app')}
          />
          <LinkRow
            icon="globe"
            label="Website"
            value="www.zxmind.app"
            onPress={() => Linking.openURL('https://www.zxmind.app')}
          />
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Legal</Text>
          <LinkRow
            icon="file-text"
            label="Privacy Policy"
            value="View our privacy policy"
            onPress={() => router.push('/settings/privacy' as any)}
          />
          <LinkRow
            icon="check-square"
            label="Terms of Service"
            value="View terms of use"
            onPress={() => Linking.openURL('mailto:legal@zxmind.app?subject=Terms of Service Request')}
          />
        </View>

        <View style={s.copyrightBox}>
          <Feather name="headphones" size={16} color="#333" />
          <Text style={s.copyrightText}>
            © {new Date().getFullYear()} ZX Mind. All rights reserved.
          </Text>
          <Text style={s.copyrightSub}>
            All audio content, brand assets, and app design are the intellectual property of ZX Mind. Unauthorised reproduction or distribution is prohibited.
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
  hero: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#0D2A19', alignItems: 'center', justifyContent: 'center', marginBottom: 14, borderWidth: 1, borderColor: '#1DB95444' },
  appName: { fontSize: 28, fontWeight: '800' as const, color: '#1DB954', letterSpacing: 1, marginBottom: 6 },
  tagline: { fontSize: 14, color: '#B3B3B3', textAlign: 'center', marginBottom: 14 },
  versionBadge: { backgroundColor: '#1A1A1A', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 },
  versionText: { fontSize: 12, color: '#666' },
  section: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
  sectionTitle: { fontSize: 11, fontWeight: '700' as const, color: '#1DB954', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 },
  missionCard: { backgroundColor: '#0D0D0D', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1A1A1A' },
  missionText: { fontSize: 14, color: '#B3B3B3', lineHeight: 22 },
  infoBlock: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#111' },
  infoLabel: { fontSize: 14, color: '#888' },
  infoValue: { fontSize: 14, color: '#FFF', fontWeight: '500' as const, maxWidth: '55%', textAlign: 'right' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#0D2A19', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#1DB95433' },
  tagText: { fontSize: 12, color: '#1DB954', fontWeight: '600' as const },
  linkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#111', gap: 12 },
  linkIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#0D2A19', alignItems: 'center', justifyContent: 'center' },
  linkText: { flex: 1 },
  linkLabel: { fontSize: 14, fontWeight: '600' as const, color: '#FFF' },
  linkValue: { fontSize: 12, color: '#666', marginTop: 2 },
  copyrightBox: { margin: 20, padding: 20, backgroundColor: '#0D0D0D', borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#1A1A1A', gap: 8 },
  copyrightText: { fontSize: 13, color: '#555', fontWeight: '500' as const },
  copyrightSub: { fontSize: 11, color: '#333', textAlign: 'center', lineHeight: 17 },
});
