import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister() {
    setError('');
    setLoading(true);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await signUp(email, password, name);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message ?? 'Registration failed. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { top: insets.top + 10 }]}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </Pressable>

        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Feather name="headphones" size={28} color="#1DB954" />
          </View>
          <Text style={styles.appName}>ZX Mind</Text>
        </View>

        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.subheading}>Start with a 3-day free trial</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={14} color="#F15E6C" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.inputWrap}>
          <Feather name="user" size={18} color="#B3B3B3" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />
        </View>

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

        <View style={styles.inputWrap}>
          <Feather name="lock" size={18} color="#B3B3B3" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password (min 6 characters)"
            placeholderTextColor="#666"
            secureTextEntry={!showPw}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable onPress={() => setShowPw(p => !p)} style={styles.eyeBtn}>
            <Feather name={showPw ? 'eye-off' : 'eye'} size={18} color="#B3B3B3" />
          </Pressable>
        </View>

        <View style={styles.trialBox}>
          <Feather name="gift" size={16} color="#1DB954" />
          <Text style={styles.trialText}>3-Day Free Trial — No credit card required!</Text>
        </View>

        <Pressable onPress={handleRegister} disabled={loading} style={{ marginTop: 8 }}>
          <LinearGradient colors={['#1DB954', '#17a348']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.registerBtn}>
            {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.registerBtnText}>Start Free Trial</Text>}
          </LinearGradient>
        </Pressable>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable><Text style={styles.loginLink}>Login</Text></Pressable>
          </Link>
        </View>

        <Text style={styles.terms}>By registering, you agree to our Terms of Service and Privacy Policy.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  scroll: { paddingHorizontal: 24 },
  backBtn: { position: 'absolute', left: 20, zIndex: 10 },
  logoWrap: { alignItems: 'center', marginBottom: 32, marginTop: 20 },
  logoCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  appName: { fontSize: 22, fontWeight: '800' as const, color: '#1DB954', letterSpacing: 1 },
  heading: { fontSize: 24, fontWeight: '700' as const, color: '#FFF', marginBottom: 6 },
  subheading: { fontSize: 14, color: '#B3B3B3', marginBottom: 24 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F15E6C22', borderWidth: 1, borderColor: '#F15E6C44', borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText: { color: '#F15E6C', fontSize: 13, flex: 1 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 12, borderWidth: 1, borderColor: '#333', marginBottom: 14, paddingHorizontal: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 52, color: '#FFF', fontSize: 15 },
  eyeBtn: { padding: 6 },
  trialBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1DB95422', borderWidth: 1, borderColor: '#1DB95444', borderRadius: 10, padding: 12, marginBottom: 20 },
  trialText: { color: '#1DB954', fontSize: 13, fontWeight: '500' as const, flex: 1 },
  registerBtn: { height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  registerBtnText: { color: '#000', fontSize: 16, fontWeight: '700' as const },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  loginText: { color: '#B3B3B3', fontSize: 14 },
  loginLink: { color: '#1DB954', fontSize: 14, fontWeight: '600' as const },
  terms: { color: '#555', fontSize: 11, textAlign: 'center', marginTop: 20, lineHeight: 16 },
});
