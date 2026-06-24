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

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message ?? 'Login failed. Please try again.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Feather name="headphones" size={36} color="#1DB954" />
          </View>
          <Text style={styles.appName}>ZX Mind</Text>
          <Text style={styles.tagline}>Transform Your Life, One Audio At A Time</Text>
        </View>

        <Text style={styles.heading}>Welcome Back</Text>
        <Text style={styles.subheading}>Sign in to your account</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Feather name="alert-circle" size={14} color="#F15E6C" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

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
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry={!showPw}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable onPress={() => setShowPw(p => !p)} style={styles.eyeBtn}>
            <Feather name={showPw ? 'eye-off' : 'eye'} size={18} color="#B3B3B3" />
          </Pressable>
        </View>

        <Link href="/(auth)/forgot-password" asChild>
          <Pressable style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>
        </Link>

        <Pressable onPress={handleLogin} disabled={loading} style={{ marginTop: 8 }}>
          <LinearGradient colors={['#1DB954', '#17a348']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.loginBtn}>
            {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.loginBtnText}>Login</Text>}
          </LinearGradient>
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable style={styles.googleBtn}>
          <Feather name="globe" size={20} color="#FFF" />
          <Text style={styles.googleBtnText}>Continue with Google</Text>
        </Pressable>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable><Text style={styles.signupLink}>Sign Up</Text></Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  scroll: { paddingHorizontal: 24 },
  logoWrap: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  appName: { fontSize: 28, fontWeight: '800' as const, color: '#1DB954', letterSpacing: 1 },
  tagline: { fontSize: 13, color: '#B3B3B3', marginTop: 4, textAlign: 'center' },
  heading: { fontSize: 26, fontWeight: '700' as const, color: '#FFF', marginBottom: 6 },
  subheading: { fontSize: 14, color: '#B3B3B3', marginBottom: 24 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F15E6C22', borderWidth: 1, borderColor: '#F15E6C44', borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText: { color: '#F15E6C', fontSize: 13, flex: 1 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 12, borderWidth: 1, borderColor: '#333', marginBottom: 14, paddingHorizontal: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 52, color: '#FFF', fontSize: 15 },
  eyeBtn: { padding: 6 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20, marginTop: 4 },
  forgotText: { color: '#1DB954', fontSize: 13, fontWeight: '500' as const },
  loginBtn: { height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  loginBtnText: { color: '#000', fontSize: 16, fontWeight: '700' as const },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#282828' },
  dividerText: { color: '#666', fontSize: 13 },
  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#1A1A1A', borderRadius: 27, height: 54, borderWidth: 1, borderColor: '#333' },
  googleBtnText: { color: '#FFF', fontSize: 15, fontWeight: '600' as const },
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  signupText: { color: '#B3B3B3', fontSize: 14 },
  signupLink: { color: '#1DB954', fontSize: 14, fontWeight: '600' as const },
});
