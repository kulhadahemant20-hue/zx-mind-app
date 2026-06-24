import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NOTIF_KEY = '@zxmind:notifications';

interface NotifPrefs {
  newContent: boolean;
  recommendations: boolean;
  appUpdates: boolean;
  marketing: boolean;
}

const DEFAULT: NotifPrefs = {
  newContent: true,
  recommendations: true,
  appUpdates: true,
  marketing: false,
};

const ITEMS: { key: keyof NotifPrefs; icon: string; title: string; desc: string }[] = [
  {
    key: 'newContent',
    icon: 'bell',
    title: 'New Content Alerts',
    desc: 'Get notified when new episodes and categories are added.',
  },
  {
    key: 'recommendations',
    icon: 'star',
    title: 'Personalised Recommendations',
    desc: 'Receive episode suggestions based on your listening history.',
  },
  {
    key: 'appUpdates',
    icon: 'download-cloud',
    title: 'App Updates',
    desc: 'Important updates, new features, and performance improvements.',
  },
  {
    key: 'marketing',
    icon: 'tag',
    title: 'Promotional Notifications',
    desc: 'Offers, subscription deals, and marketing communications. You can opt out at any time.',
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(NOTIF_KEY).then(data => {
      if (data) setPrefs({ ...DEFAULT, ...JSON.parse(data) });
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  async function toggle(key: keyof NotifPrefs) {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!loaded) return <View style={[s.root, { paddingTop: insets.top }]} />;

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </Pressable>
        <Text style={s.headerTitle}>Notifications</Text>
        {saved ? (
          <View style={s.savedBadge}>
            <Feather name="check" size={12} color="#1DB954" />
            <Text style={s.savedText}>Saved</Text>
          </View>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        <View style={s.heroBanner}>
          <View style={s.heroIcon}>
            <Feather name="bell" size={28} color="#1DB954" />
          </View>
          <Text style={s.heroTitle}>Notification Preferences</Text>
          <Text style={s.heroSub}>
            Choose which notifications you want to receive. You can change these settings at any time.
          </Text>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Notification Types</Text>
          {ITEMS.map((item, i) => (
            <View key={item.key} style={[s.row, i < ITEMS.length - 1 && s.rowBorder]}>
              <View style={s.rowIcon}>
                <Feather name={item.icon as any} size={18} color={prefs[item.key] ? '#1DB954' : '#555'} />
              </View>
              <View style={s.rowText}>
                <Text style={s.rowTitle}>{item.title}</Text>
                <Text style={s.rowDesc}>{item.desc}</Text>
              </View>
              <Switch
                value={prefs[item.key]}
                onValueChange={() => toggle(item.key)}
                trackColor={{ false: '#282828', true: '#1DB95466' }}
                thumbColor={prefs[item.key] ? '#1DB954' : '#555'}
                ios_backgroundColor="#282828"
              />
            </View>
          ))}
        </View>

        <View style={s.infoBox}>
          <Feather name="info" size={14} color="#555" style={{ marginTop: 1 }} />
          <Text style={s.infoText}>
            Notification delivery depends on your device settings. To fully disable all notifications, you can also turn off ZX Mind notifications in your device's Settings app. Marketing notifications are always opt-in and you may withdraw consent at any time.
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
  savedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#0D2A19', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  savedText: { fontSize: 12, color: '#1DB954', fontWeight: '600' as const },
  heroBanner: { alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  heroIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#0D2A19', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#1DB95444' },
  heroTitle: { fontSize: 20, fontWeight: '700' as const, color: '#FFF', marginBottom: 6 },
  heroSub: { fontSize: 14, color: '#B3B3B3', textAlign: 'center', lineHeight: 20 },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 11, fontWeight: '700' as const, color: '#1DB954', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#111' },
  rowIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '600' as const, color: '#FFF', marginBottom: 3 },
  rowDesc: { fontSize: 12, color: '#666', lineHeight: 17 },
  infoBox: { flexDirection: 'row', gap: 10, margin: 20, padding: 16, backgroundColor: '#0D0D0D', borderRadius: 12, borderWidth: 1, borderColor: '#1A1A1A' },
  infoText: { flex: 1, fontSize: 12, color: '#555', lineHeight: 18 },
});
