import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert, Linking, Platform, Pressable, ScrollView,
  StyleSheet, Text, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  );
}

function ActionRow({ icon, label, desc, onPress, danger }: {
  icon: string; label: string; desc?: string; onPress: () => void; danger?: boolean;
}) {
  return (
    <Pressable style={({ pressed }) => [s.actionRow, { opacity: pressed ? 0.7 : 1 }]} onPress={onPress}>
      <View style={[s.actionIcon, danger && s.actionIconDanger]}>
        <Feather name={icon as any} size={16} color={danger ? '#F15E6C' : '#1DB954'} />
      </View>
      <View style={s.actionText}>
        <Text style={[s.actionLabel, danger && { color: '#F15E6C' }]}>{label}</Text>
        {desc && <Text style={s.actionDesc}>{desc}</Text>}
      </View>
      <Feather name="chevron-right" size={16} color="#555" />
    </Pressable>
  );
}

export default function PrivacyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const [deleting, setDeleting] = useState(false);

  function handleDeleteAccount() {
    const msg =
      'Deleting your account will permanently remove all your data including play history, favorites, and profile information. This action cannot be undone.';
    if (Platform.OS !== 'web') {
      Alert.alert('Delete Account', msg, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]);
    } else {
      if (window.confirm('Delete your account? This cannot be undone.')) {
        signOut().then(() => router.replace('/(auth)/login'));
      }
    }
  }

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </Pressable>
        <Text style={s.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        <View style={s.heroBanner}>
          <View style={s.heroIcon}>
            <Feather name="shield" size={28} color="#1DB954" />
          </View>
          <Text style={s.heroTitle}>Your Privacy Matters</Text>
          <Text style={s.heroSub}>
            ZX Mind is committed to protecting your personal information and being transparent about what we collect.
          </Text>
        </View>

        <Section title="Data We Collect">
          <InfoRow label="Account Info" value="Email address and display name you provide during sign-up." />
          <InfoRow label="Usage Data" value="Episodes you play, categories you browse, and playback history — used to personalise your experience." />
          <InfoRow label="Device Info" value="Device type and OS version for app compatibility and bug fixes." />
          <InfoRow label="Preferences" value="Your favourite episodes, bookmarks, and notification settings stored locally on your device." />
        </Section>

        <Section title="How We Use Your Data">
          <InfoRow label="Personalisation" value="To recommend relevant content and remember your listening history." />
          <InfoRow label="App Improvement" value="Anonymous usage analytics help us fix bugs and improve performance." />
          <InfoRow label="Communication" value="Important service updates and security notifications (no spam)." />
          <InfoRow label="Legal Compliance" value="To comply with applicable laws and protect user rights." />
        </Section>

        <Section title="Data Protection">
          <InfoRow label="Storage" value="Your data is stored securely on your device using encrypted local storage." />
          <InfoRow label="No Sale of Data" value="We do not sell, rent, or trade your personal information to third parties." />
          <InfoRow label="Third Parties" value="We do not share personal data with advertisers or marketing companies." />
          <InfoRow label="Retention" value="Account data is retained until you delete your account. You may request deletion at any time." />
        </Section>

        <Section title="Your Rights">
          <InfoRow label="Access" value="You can view all your account data in the Profile section." />
          <InfoRow label="Correction" value="Update your name and preferences anytime in Profile settings." />
          <InfoRow label="Deletion" value="Delete your account and all associated data at any time (see below)." />
          <InfoRow label="Portability" value="Contact us at privacy@zxmind.app to request a copy of your data." />
        </Section>

        <Section title="Account & Security">
          <ActionRow
            icon="mail"
            label="Contact Privacy Team"
            desc="privacy@zxmind.app"
            onPress={() => Linking.openURL('mailto:privacy@zxmind.app')}
          />
          <ActionRow
            icon="lock"
            label="Change Password"
            desc="Update your account password"
            onPress={() => router.push('/(auth)/forgot-password')}
          />
          <ActionRow
            icon="trash-2"
            label="Delete My Account"
            desc="Permanently remove all your data"
            onPress={handleDeleteAccount}
            danger
          />
        </Section>

        <View style={s.legalBox}>
          <Text style={s.legalTitle}>Last Updated: June 2025</Text>
          <Text style={s.legalText}>
            This privacy policy applies to the ZX Mind mobile application. By using ZX Mind, you agree to the practices described in this policy. For questions or concerns, contact us at privacy@zxmind.app.
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
  heroBanner: { alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  heroIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#0D2A19', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#1DB95444' },
  heroTitle: { fontSize: 20, fontWeight: '700' as const, color: '#FFF', marginBottom: 8 },
  heroSub: { fontSize: 14, color: '#B3B3B3', textAlign: 'center', lineHeight: 20 },
  section: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
  sectionTitle: { fontSize: 11, fontWeight: '700' as const, color: '#1DB954', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },
  infoRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#111' },
  infoLabel: { fontSize: 13, fontWeight: '600' as const, color: '#FFF', marginBottom: 4 },
  infoValue: { fontSize: 13, color: '#888', lineHeight: 18 },
  actionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#111', gap: 12 },
  actionIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#0D2A19', alignItems: 'center', justifyContent: 'center' },
  actionIconDanger: { backgroundColor: '#2A0D0D' },
  actionText: { flex: 1 },
  actionLabel: { fontSize: 15, color: '#FFF', fontWeight: '600' as const },
  actionDesc: { fontSize: 12, color: '#666', marginTop: 2 },
  legalBox: { margin: 20, padding: 16, backgroundColor: '#0D0D0D', borderRadius: 12, borderWidth: 1, borderColor: '#1A1A1A' },
  legalTitle: { fontSize: 12, color: '#555', marginBottom: 8, fontWeight: '600' as const },
  legalText: { fontSize: 12, color: '#555', lineHeight: 18 },
});
