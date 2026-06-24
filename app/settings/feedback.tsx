import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

type FeedbackType = 'general' | 'bug' | 'feature';

const TYPES: { key: FeedbackType; icon: string; label: string; desc: string }[] = [
  { key: 'general', icon: 'message-circle', label: 'General Feedback', desc: 'Share your thoughts' },
  { key: 'bug', icon: 'alert-triangle', label: 'Report a Bug', desc: 'Something is broken' },
  { key: 'feature', icon: 'zap', label: 'Feature Request', desc: 'Suggest an improvement' },
];

export default function FeedbackScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [type, setType] = useState<FeedbackType>('general');
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email address.'); return; }
    if (message.trim().length < 10) { setError('Please enter a message of at least 10 characters.'); return; }
    setError('');
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <View style={[s.root, { paddingTop: insets.top }]}>
        <View style={s.header}>
          <Pressable onPress={() => router.back()} style={s.backBtn}>
            <Feather name="arrow-left" size={22} color="#FFF" />
          </Pressable>
          <Text style={s.headerTitle}>Give Feedback</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={s.thankYou}>
          <View style={s.thankIcon}>
            <Feather name="check-circle" size={40} color="#1DB954" />
          </View>
          <Text style={s.thankTitle}>Thank You!</Text>
          <Text style={s.thankSub}>
            Your feedback has been received. We read every message and use it to make ZX Mind better for everyone.
          </Text>
          <Text style={s.thankNote}>
            If you reported a bug or requested a feature, our team will review it. For urgent issues, email us at support@zxmind.app.
          </Text>
          <Pressable style={s.doneBtn} onPress={() => router.back()}>
            <Text style={s.doneBtnText}>Back to Profile</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </Pressable>
        <Text style={s.headerTitle}>Give Feedback</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 32 }]} keyboardShouldPersistTaps="handled">

          <View style={s.typeSection}>
            <Text style={s.typeLabel}>Feedback Type</Text>
            <View style={s.typeGrid}>
              {TYPES.map(t => (
                <Pressable
                  key={t.key}
                  style={[s.typeCard, type === t.key && s.typeCardActive]}
                  onPress={() => setType(t.key)}
                >
                  <Feather name={t.icon as any} size={20} color={type === t.key ? '#1DB954' : '#666'} />
                  <Text style={[s.typeCardLabel, type === t.key && { color: '#1DB954' }]}>{t.label}</Text>
                  <Text style={s.typeCardDesc}>{t.desc}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={s.formSection}>
            <Text style={s.formLabel}>YOUR DETAILS</Text>

            <Text style={s.fieldLabel}>Name</Text>
            <View style={s.inputWrap}>
              <Feather name="user" size={16} color="#666" style={s.inputIcon} />
              <TextInput
                style={s.input}
                placeholder="Your name"
                placeholderTextColor="#444"
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={s.fieldLabel}>Email</Text>
            <View style={s.inputWrap}>
              <Feather name="mail" size={16} color="#666" style={s.inputIcon} />
              <TextInput
                style={s.input}
                placeholder="your@email.com"
                placeholderTextColor="#444"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Text style={s.fieldLabel}>
              {type === 'bug' ? 'Describe the Bug' : type === 'feature' ? 'Describe the Feature' : 'Your Message'}
            </Text>
            <View style={[s.inputWrap, s.textAreaWrap]}>
              <TextInput
                style={[s.input, s.textArea]}
                placeholder={
                  type === 'bug'
                    ? 'What happened? How can we reproduce it? What did you expect?'
                    : type === 'feature'
                    ? 'What feature would you like? How would it improve your experience?'
                    : 'Share your thoughts, suggestions, or anything else...'
                }
                placeholderTextColor="#444"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                value={message}
                onChangeText={setMessage}
              />
            </View>
            <Text style={s.charCount}>{message.length} characters (minimum 10)</Text>
          </View>

          {error ? (
            <View style={s.errorBox}>
              <Feather name="alert-circle" size={14} color="#F15E6C" />
              <Text style={s.errorText}>{error}</Text>
            </View>
          ) : null}

          <Pressable style={[s.submitBtn, submitting && { opacity: 0.7 }]} onPress={handleSubmit} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Feather name="send" size={16} color="#000" />
                <Text style={s.submitBtnText}>Submit Feedback</Text>
              </>
            )}
          </Pressable>

          <Text style={s.privacyNote}>
            Your feedback is used solely to improve ZX Mind. We will not share it with third parties. For urgent support, contact support@zxmind.app.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#1A1A1A' },
  headerTitle: { fontSize: 17, fontWeight: '700' as const, color: '#FFF' },
  scroll: { padding: 20 },
  typeSection: { marginBottom: 24 },
  typeLabel: { fontSize: 11, fontWeight: '700' as const, color: '#1DB954', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 },
  typeGrid: { gap: 10 },
  typeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, backgroundColor: '#0D0D0D', borderWidth: 1, borderColor: '#1A1A1A' },
  typeCardActive: { borderColor: '#1DB95466', backgroundColor: '#0D2A19' },
  typeCardLabel: { fontSize: 14, fontWeight: '600' as const, color: '#FFF', flex: 1 },
  typeCardDesc: { fontSize: 12, color: '#555' },
  formSection: { marginBottom: 20 },
  formLabel: { fontSize: 11, fontWeight: '700' as const, color: '#1DB954', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '600' as const, color: '#B3B3B3', marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderRadius: 12, borderWidth: 1, borderColor: '#222', marginBottom: 14, paddingHorizontal: 12 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 48, color: '#FFF', fontSize: 14 },
  textAreaWrap: { alignItems: 'flex-start', paddingTop: 12, paddingBottom: 12 },
  textArea: { height: 120, paddingTop: 0 },
  charCount: { fontSize: 11, color: '#444', marginTop: -8, marginBottom: 8 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#2A0D0D', borderWidth: 1, borderColor: '#F15E6C44', borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText: { color: '#F15E6C', fontSize: 13, flex: 1 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1DB954', borderRadius: 28, height: 54, marginBottom: 16 },
  submitBtnText: { color: '#000', fontSize: 16, fontWeight: '700' as const },
  privacyNote: { fontSize: 12, color: '#444', textAlign: 'center', lineHeight: 18 },
  thankYou: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  thankIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#0D2A19', alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#1DB95444' },
  thankTitle: { fontSize: 26, fontWeight: '800' as const, color: '#FFF', marginBottom: 12 },
  thankSub: { fontSize: 15, color: '#B3B3B3', textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  thankNote: { fontSize: 13, color: '#555', textAlign: 'center', lineHeight: 19, marginBottom: 32 },
  doneBtn: { backgroundColor: '#1DB954', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 28 },
  doneBtnText: { color: '#000', fontSize: 15, fontWeight: '700' as const },
});
