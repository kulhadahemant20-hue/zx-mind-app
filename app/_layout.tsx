import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Feather } from '@expo/vector-icons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { AppState, AppStateStatus, Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PlayerProvider } from '@/context/PlayerContext';
import { startSession, endSession } from '@/services/streak';

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

function AuthNavigator() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) {
      router.replace('/(auth)/login');
    } else if (user && inAuth) {
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments]);

  return null;
}

function RootLayoutNav() {
  const [fontsLoaded] = useFonts({
    ...Feather.font,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    startSession();
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'background' || state === 'inactive') endSession();
      if (state === 'active') startSession();
    });
    return () => { endSession(); sub.remove(); };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <>
      <AuthNavigator />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000000' } }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="player"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="category/[id]" />
        <Stack.Screen name="subscription" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="preferences" />
        <Stack.Screen name="rewards" />
        <Stack.Screen name="chat-room/[id]" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const isWeb = Platform.OS === 'web';
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AuthProvider>
          <PlayerProvider>
            <QueryClientProvider client={queryClient}>
              <GestureHandlerRootView style={isWeb ? styles.webOuter : { flex: 1, backgroundColor: '#000000' }}>
                {isWeb ? (
                  <View style={styles.webInner}>
                    <KeyboardProvider>
                      <RootLayoutNav />
                    </KeyboardProvider>
                  </View>
                ) : (
                  <KeyboardProvider>
                    <RootLayoutNav />
                  </KeyboardProvider>
                )}
              </GestureHandlerRootView>
            </QueryClientProvider>
          </PlayerProvider>
        </AuthProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webOuter: {
    flex: 1,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  webInner: {
    width: '100%',
    maxWidth: 430,
    flex: 1,
    backgroundColor: '#000000',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
  },
});
