import { Feather } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FAQS = [
  {
    category: 'Getting Started',
    items: [
      {
        q: 'How do I create an account?',
        a: 'Open ZX Mind, tap "Sign Up" on the login screen. Enter your name, email address, and a password (minimum 6 characters). Tap "Create Account" and you are ready to go.',
      },
      {
        q: 'How do I play an episode?',
        a: 'Browse the Home tab or Search tab to find an episode. Tap any episode card to open it. Tap the green Play button to start playback. The Mini Player will appear at the bottom while audio is playing.',
      },
      {
        q: 'What languages are the episodes in?',
        a: 'ZX Mind episodes are primarily in Hindi with some English mixed in (Hinglish). This makes the content relatable and easy to understand for Indian audiences.',
      },
    ],
  },
  {
    category: 'Playback & Audio',
    items: [
      {
        q: 'Can I change the playback speed?',
        a: 'Yes. Open the full Player screen (tap the Mini Player or tap an episode). Use the speed chips at the bottom — choose 1x, 1.25x, 1.5x, or 2x.',
      },
      {
        q: 'How do I skip forward or backward?',
        a: 'In the Player screen, use the Rewind (⏪) button to go back 10 seconds and the Fast Forward (⏩) button to skip ahead 10 seconds.',
      },
      {
        q: 'Audio is not playing. What should I do?',
        a: 'Check that your device volume is not muted. Ensure you have a stable internet connection for streaming. Close and reopen the app. If the issue persists, contact support at support@zxmind.app.',
      },
      {
        q: 'Can I download episodes for offline listening?',
        a: 'Offline downloads are planned for a future update. Currently, episodes require an internet connection to stream.',
      },
    ],
  },
  {
    category: 'Account & Profile',
    items: [
      {
        q: 'How do I change my password?',
        a: 'Go to Profile → Privacy & Security → Change Password. Enter your registered email and follow the instructions sent to your inbox.',
      },
      {
        q: 'How do I save my favourite episodes?',
        a: 'Open any episode in the Player screen. Tap the Heart (♥) icon next to the episode title to add it to your favourites. View all favourites in the Library tab.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Go to Profile → Privacy & Security → Delete My Account. Read the warning carefully — this action permanently removes all your data and cannot be undone.',
      },
    ],
  },
  {
    category: 'Subscription & Plans',
    items: [
      {
        q: 'What is the difference between Free and Premium?',
        a: 'Free plan gives you access to all non-premium episodes. Premium unlocks all episodes including PRO-marked content, and will include additional features in future updates.',
      },
      {
        q: 'Is there a free trial?',
        a: 'Yes, a 3-Day Free Trial is available for new users to experience Premium content before subscribing.',
      },
      {
        q: 'How do I cancel my subscription?',
        a: 'Premium subscriptions are managed through the Google Play Store or Apple App Store. To cancel, go to your Play Store or App Store subscription settings and cancel from there.',
      },
    ],
  },
  {
    category: 'Technical Issues',
    items: [
      {
        q: 'The app is crashing. What should I do?',
        a: 'Force-close the app and reopen it. Ensure you have the latest version installed from the Play Store. If the problem continues, uninstall and reinstall the app. Contact us at support@zxmind.app with your device model and Android version.',
      },
      {
        q: 'The app is slow or laggy.',
        a: 'Close other background apps to free up memory. Check your internet connection speed. Restart your device. If the issue persists, please contact our support team.',
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable style={s.faqItem} onPress={() => setOpen(o => !o)}>
      <View style={s.faqRow}>
        <Text style={s.faqQ}>{q}</Text>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={16} color="#555" />
      </View>
      {open && <Text style={s.faqA}>{a}</Text>}
    </Pressable>
  );
}

export default function HelpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </Pressable>
        <Text style={s.headerTitle}>Help Center</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        <View style={s.heroBanner}>
          <View style={s.heroIcon}>
            <Feather name="help-circle" size={28} color="#1DB954" />
          </View>
          <Text style={s.heroTitle}>How can we help?</Text>
          <Text style={s.heroSub}>Find answers to common questions or reach our support team.</Text>
        </View>

        <View style={s.contactStrip}>
          <Pressable style={s.contactCard} onPress={() => Linking.openURL('mailto:support@zxmind.app')}>
            <Feather name="mail" size={20} color="#1DB954" />
            <Text style={s.contactLabel}>Email Support</Text>
            <Text style={s.contactSub}>Reply within 24–48 hrs</Text>
          </Pressable>
          <Pressable style={s.contactCard} onPress={() => router.push('/settings/feedback' as any)}>
            <Feather name="message-circle" size={20} color="#1DB954" />
            <Text style={s.contactLabel}>Send Feedback</Text>
            <Text style={s.contactSub}>Bug reports & ideas</Text>
          </Pressable>
        </View>

        {FAQS.map(group => (
          <View key={group.category} style={s.faqGroup}>
            <Text style={s.groupTitle}>{group.category}</Text>
            {group.items.map(item => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </View>
        ))}

        <View style={s.bottomContact}>
          <Text style={s.bottomTitle}>Still need help?</Text>
          <Text style={s.bottomSub}>Our support team is happy to assist you.</Text>
          <Pressable style={s.emailBtn} onPress={() => Linking.openURL('mailto:support@zxmind.app')}>
            <Feather name="mail" size={16} color="#000" />
            <Text style={s.emailBtnText}>support@zxmind.app</Text>
          </Pressable>
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
  heroTitle: { fontSize: 20, fontWeight: '700' as const, color: '#FFF', marginBottom: 6 },
  heroSub: { fontSize: 14, color: '#B3B3B3', textAlign: 'center' },
  contactStrip: { flexDirection: 'row', padding: 16, gap: 12 },
  contactCard: { flex: 1, backgroundColor: '#0D2A19', borderRadius: 14, padding: 16, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#1DB95433' },
  contactLabel: { fontSize: 13, fontWeight: '700' as const, color: '#FFF' },
  contactSub: { fontSize: 11, color: '#888', textAlign: 'center' },
  faqGroup: { paddingHorizontal: 20, paddingTop: 20 },
  groupTitle: { fontSize: 11, fontWeight: '700' as const, color: '#1DB954', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },
  faqItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#111' },
  faqRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  faqQ: { flex: 1, fontSize: 14, fontWeight: '600' as const, color: '#FFF', lineHeight: 20 },
  faqA: { fontSize: 13, color: '#888', lineHeight: 20, marginTop: 10 },
  bottomContact: { margin: 20, padding: 20, backgroundColor: '#0D0D0D', borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#1A1A1A' },
  bottomTitle: { fontSize: 16, fontWeight: '700' as const, color: '#FFF', marginBottom: 6 },
  bottomSub: { fontSize: 13, color: '#888', marginBottom: 16, textAlign: 'center' },
  emailBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1DB954', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  emailBtnText: { color: '#000', fontSize: 14, fontWeight: '700' as const },
});
