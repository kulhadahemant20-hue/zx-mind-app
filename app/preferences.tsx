import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES, EPISODES } from '@/constants/mockData';
import { getUserPreferences, saveUserPreferences, submitPart2Request } from '@/services/preferences';

const MAX_CATS = 2;

export default function PreferencesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string[]>([]);
  const [part2Cat, setPart2Cat] = useState('');
  const [part2Ep, setPart2Ep] = useState('');
  const [part2Msg, setPart2Msg] = useState('');
  const [saved, setSaved] = useState(false);
  const [reqSent, setReqSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserPreferences().then(p => {
      setSelected(p.favoriteCategories ?? []);
    });
  }, []);

  function toggleCat(id: string) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(c => c !== id);
      if (prev.length >= MAX_CATS) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
        return prev;
      }
      return [...prev, id];
    });
    setSaved(false);
  }

  async function handleSavePrefs() {
    if (selected.length === 0) {
      Alert.alert('Koi category select nahi ki', 'Please kam se kam ek category select karo.');
      return;
    }
    setLoading(true);
    await saveUserPreferences({ favoriteCategories: selected });
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setLoading(false);
    setSaved(true);
  }

  async function handleSendPart2() {
    if (!part2Cat) {
      Alert.alert('Category select karo', 'Pehle category choose karo.');
      return;
    }
    if (!part2Msg.trim()) {
      Alert.alert('Message likho', 'Thoda batao aapko kya chahiye Part 2 mein.');
      return;
    }
    setLoading(true);
    await submitPart2Request({
      categoryId: part2Cat,
      episodeTitle: part2Ep.trim() || undefined,
      message: part2Msg.trim(),
    });
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setLoading(false);
    setReqSent(true);
    setPart2Cat('');
    setPart2Ep('');
    setPart2Msg('');
  }

  const activeCategories = CATEGORIES.filter(c => !c.comingSoon);

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 20) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Apni Pasand Batao</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── Section 1: Favorite Categories ── */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <View style={styles.sectionIconWrap}>
            <Feather name="heart" size={18} color="#FF6B6B" />
          </View>
          <View style={styles.sectionHeadText}>
            <Text style={styles.sectionTitle}>Favorite Categories</Text>
            <Text style={styles.sectionSub}>Wo 2 topics chuno jisme tumhari sabse zyada dilchaspi hai</Text>
          </View>
        </View>

        <View style={styles.catGrid}>
          {activeCategories.map(cat => {
            const isSelected = selected.includes(cat.id);
            const isDisabled = !isSelected && selected.length >= MAX_CATS;
            return (
              <Pressable
                key={cat.id}
                style={[
                  styles.catCard,
                  { borderColor: isSelected ? cat.color : '#222' },
                  isSelected && { backgroundColor: cat.color + '20' },
                  isDisabled && { opacity: 0.35 },
                ]}
                onPress={() => !isDisabled && toggleCat(cat.id)}
              >
                <View style={[styles.catIcon, { backgroundColor: cat.color + '25' }]}>
                  <Feather name={cat.icon as any} size={22} color={cat.color} />
                </View>
                <Text style={[styles.catName, isSelected && { color: cat.color }]}>{cat.name}</Text>
                {isSelected && (
                  <View style={[styles.checkBadge, { backgroundColor: cat.color }]}>
                    <Feather name="check" size={12} color="#000" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.selectedInfo}>
          <Feather name="info" size={13} color="#555" />
          <Text style={styles.selectedInfoText}>
            {selected.length === 0
              ? 'Koi category select nahi hui'
              : `${selected.length}/2 categories selected`}
          </Text>
        </View>

        {saved && (
          <View style={styles.successBanner}>
            <Feather name="check-circle" size={16} color="#1DB954" />
            <Text style={styles.successText}>Pasand save ho gayi! Home screen personalize ho jayega.</Text>
          </View>
        )}

        <Pressable
          style={[styles.saveBtn, loading && { opacity: 0.6 }]}
          onPress={handleSavePrefs}
          disabled={loading}
        >
          <Feather name="save" size={16} color="#000" />
          <Text style={styles.saveBtnText}>{loading ? 'Save ho raha hai...' : 'Pasand Save Karo'}</Text>
        </Pressable>
      </View>

      {/* ── Section 2: Part 2 Request ── */}
      <View style={[styles.section, { marginTop: 8 }]}>
        <View style={styles.sectionHead}>
          <View style={[styles.sectionIconWrap, { backgroundColor: '#45B7D120' }]}>
            <Feather name="send" size={18} color="#45B7D1" />
          </View>
          <View style={styles.sectionHeadText}>
            <Text style={styles.sectionTitle}>Part 2 Request Karo</Text>
            <Text style={styles.sectionSub}>Batao kaun sa episode ya category ka agle part chahiye</Text>
          </View>
        </View>

        <Text style={styles.fieldLabel}>Category choose karo *</Text>
        <View style={styles.catChipRow}>
          {CATEGORIES.filter(c => !c.comingSoon).map(cat => (
            <Pressable
              key={cat.id}
              style={[styles.chip, part2Cat === cat.id && { backgroundColor: cat.color + '30', borderColor: cat.color }]}
              onPress={() => { setPart2Cat(cat.id); setReqSent(false); }}
            >
              <Feather name={cat.icon as any} size={13} color={part2Cat === cat.id ? cat.color : '#666'} />
              <Text style={[styles.chipText, part2Cat === cat.id && { color: '#FFF' }]}>{cat.name}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.fieldLabel}>Episode ka naam (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Jaise: The Confidence Trap Part 2..."
          placeholderTextColor="#444"
          value={part2Ep}
          onChangeText={v => { setPart2Ep(v); setReqSent(false); }}
          returnKeyType="next"
        />

        <Text style={styles.fieldLabel}>Tumhe kya chahiye Part 2 mein? *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Yahan likho... jaise ki 'Confidence ki aur deep techniques chahiye' ya 'Real life examples aur stories chahiye'"
          placeholderTextColor="#444"
          value={part2Msg}
          onChangeText={v => { setPart2Msg(v); setReqSent(false); }}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {reqSent && (
          <View style={styles.successBanner}>
            <Feather name="check-circle" size={16} color="#45B7D1" />
            <Text style={[styles.successText, { color: '#45B7D1' }]}>Request send ho gayi! Hum jald hi is par kaam karenge. 🙏</Text>
          </View>
        )}

        <Pressable
          style={[styles.saveBtn, { backgroundColor: '#45B7D1' }, loading && { opacity: 0.6 }]}
          onPress={handleSendPart2}
          disabled={loading}
        >
          <Feather name="send" size={16} color="#000" />
          <Text style={styles.saveBtnText}>{loading ? 'Send ho raha hai...' : 'Part 2 Request Bhejo'}</Text>
        </Pressable>
      </View>

      <View style={{ height: 60 }} />
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
  section: {
    marginHorizontal: 20,
    backgroundColor: '#0E0E0E',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 20 },
  sectionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FF6B6B20',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sectionHeadText: { flex: 1 },
  sectionTitle: { color: '#FFF', fontSize: 17, fontWeight: '800' as const },
  sectionSub: { color: '#666', fontSize: 12, marginTop: 4, lineHeight: 17 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  catCard: {
    width: '47%',
    backgroundColor: '#151515',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    position: 'relative',
    alignItems: 'flex-start',
    gap: 8,
  },
  catIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  catName: { color: '#CCC', fontSize: 12, fontWeight: '700' as const, lineHeight: 16 },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  selectedInfoText: { color: '#555', fontSize: 12 },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#1DB95415',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1DB95430',
  },
  successText: { color: '#1DB954', fontSize: 12, flex: 1, lineHeight: 17 },
  saveBtn: {
    backgroundColor: '#1DB954',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveBtnText: { color: '#000', fontSize: 15, fontWeight: '700' as const },
  fieldLabel: { color: '#888', fontSize: 12, fontWeight: '600' as const, marginBottom: 8, marginTop: 4 },
  catChipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#151515',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  chipText: { color: '#666', fontSize: 12, fontWeight: '600' as const },
  input: {
    backgroundColor: '#151515',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#282828',
    color: '#FFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 14,
  },
  textArea: { minHeight: 100, paddingTop: 12 },
});
