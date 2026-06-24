import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';

const PLAYER_SPACE = Platform.OS === 'web' ? 84 + 64 : 60 + 64;

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  value?: string;
  color?: string;
}

function MenuItem({ icon, label, onPress, value, color = '#FFF' }: MenuItemProps) {
  return (
    <Pressable style={({ pressed }) => [styles.menuItem, { opacity: pressed ? 0.7 : 1 }]} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIconWrap}>
          <Feather name={icon as any} size={18} color={color} />
        </View>
        <Text style={[styles.menuLabel, { color }]}>{label}</Text>
      </View>
      <View style={styles.menuRight}>
        {value && <Text style={styles.menuValue}>{value}</Text>}
        <Feather name="chevron-right" size={16} color="#555" />
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  async function handleSignOut() {
    if (Platform.OS !== 'web') {
      Alert.alert('Sign Out', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: doSignOut },
      ]);
    } else {
      doSignOut();
    }
  }

  async function doSignOut() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signOut();
    router.replace('/(auth)/login');
  }

  const initials = (user?.name ?? 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: PLAYER_SPACE }}>
      <View style={[styles.hero, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 24) }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.name ?? 'User'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>
        <View style={[styles.planBadge, { backgroundColor: user?.isPremium ? '#1DB95422' : '#28282888', borderColor: user?.isPremium ? '#1DB95444' : '#444' }]}>
          <Feather name={user?.isPremium ? 'star' : 'user'} size={12} color={user?.isPremium ? '#1DB954' : '#B3B3B3'} />
          <Text style={[styles.planText, { color: user?.isPremium ? '#1DB954' : '#B3B3B3' }]}>
            {user?.plan === 'pro' ? 'Pro Member' : user?.plan === 'basic' ? 'Basic Member' : 'Free Plan'}
          </Text>
        </View>
        {!user?.isPremium && (
          <Pressable style={styles.upgradeBtn} onPress={() => router.push('/subscription')}>
            <Feather name="zap" size={14} color="#000" />
            <Text style={styles.upgradeBtnText}>Upgrade to Premium</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <MenuItem icon="bell" label="Notifications" onPress={() => router.push('/settings/notifications' as any)} />
        <MenuItem icon="shield" label="Privacy & Security" onPress={() => router.push('/settings/privacy' as any)} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <MenuItem icon="star" label="Current Plan" value={user?.plan === 'pro' ? 'Pro' : user?.plan === 'basic' ? 'Basic' : 'Free'} onPress={() => router.push('/settings/plan' as any)} />
        <MenuItem icon="credit-card" label="Payment History" onPress={() => router.push('/settings/payment-history' as any)} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <MenuItem icon="help-circle" label="Help Center" onPress={() => router.push('/settings/help' as any)} />
        <MenuItem icon="message-circle" label="Give Feedback" onPress={() => router.push('/settings/feedback' as any)} />
        <MenuItem icon="info" label="About ZX Mind" onPress={() => router.push('/settings/about' as any)} />
      </View>

      <View style={styles.section}>
        <MenuItem icon="log-out" label="Sign Out" onPress={handleSignOut} color="#F15E6C" />
      </View>

      <Text style={styles.version}>ZX Mind v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  hero: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 32 },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#1DB954', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  avatarText: { fontSize: 32, fontWeight: '700' as const, color: '#000' },
  name: { fontSize: 22, fontWeight: '700' as const, color: '#FFF', marginBottom: 4 },
  email: { fontSize: 14, color: '#B3B3B3', marginBottom: 12 },
  planBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  planText: { fontSize: 12, fontWeight: '600' as const },
  upgradeBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1DB954', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  upgradeBtnText: { color: '#000', fontSize: 13, fontWeight: '700' as const },
  section: { marginTop: 8, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '600' as const, color: '#666', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 15 },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  menuValue: { color: '#B3B3B3', fontSize: 13 },
  version: { textAlign: 'center', color: '#333', fontSize: 12, marginTop: 32, marginBottom: 16 },
});
