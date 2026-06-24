import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, Pressable,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

export default function ForgotPasswordScreen() {
  const { forgotPassword } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await forgotPassword(email);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </Pressable>

        <View style={styles.iconWrap}>
          <Feather name="lock" size={40} color="#1DB954" />
        </View>

        <Text style={styles.heading}>Password Reset</Text>
        <Text style={styles.sub}>A reset link will be sent to your email address</Text>

        {sent ? (
          <View style={styles.successBox}>
            <Feather name="check-circle" size={20} color="#1DB954" />
            <Text style={styles.successText}>Email sent! Check your inbox.</Text>
          </View>
        ) : (
          <>
            <View style={styles.inputWrap}>
              <Feather name="mail" size={18} color="#B3B3B3" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <Pressable onPress={handleSend} disabled={loading || !email.trim()} style={{ marginTop: 8 }}>
              <LinearGradient
                colors={email.trim() ? ['#1DB954', '#17a348'] : ['#333', '#333']}
                style={styles.sendBtn}
              >
                {loading ? <ActivityIndicator color="#000" /> : <Text style={[styles.sendBtnText, { color: email.trim() ? '#000' : '#666' }]}>Send Reset Link</Text>}
              </LinearGradient>
            </Pressable>
          </>
        )}

        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Back to Login</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  container: { flex: 1, paddingHorizontal: 24 },
  backBtn: { marginBottom: 40 },
  iconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  heading: { fontSize: 26, fontWeight: '700' as const, color: '#FFF', marginBottom: 8 },
  sub: { fontSize: 14, color: '#B3B3B3', marginBottom: 32, lineHeight: 20 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 12, borderWidth: 1, borderColor: '#333', paddingHorizontal: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 52, color: '#FFF', fontSize: 15 },
  sendBtn: { height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { fontSize: 16, fontWeight: '700' as const },
  successBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#1DB95422', borderWidth: 1, borderColor: '#1DB95444', borderRadius: 12, padding: 16, marginBottom: 20 },
  successText: { color: '#1DB954', fontSize: 14, flex: 1 },
  backLink: { marginTop: 32, alignItems: 'center' },
  backLinkText: { color: '#1DB954', fontSize: 14, fontWeight: '500' as const },
});
