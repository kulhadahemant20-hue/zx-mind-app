import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions, Pressable, ScrollView,
  StyleSheet, Text, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES } from '@/constants/mockData';
import {
  CommunityUser, getFriends, MOCK_USERS,
  addFriend, removeFriend, isFriend, ChatProfile, getChatProfile,
  saveChatProfile, getRandomColor,
} from '@/services/chat';
import { TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const { width: SW } = Dimensions.get('window');

const ROOM_ACTIVITY = {
  confidence: { online: 128, messages: '2 min pehle' },
  heartgrowth: { online: 84, messages: '5 min pehle' },
  money: { online: 201, messages: 'Abhi' },
  discipline: { online: 156, messages: '1 min pehle' },
  success: { online: 93, messages: '3 min pehle' },
  legends: { online: 67, messages: '8 min pehle' },
};

function Avatar({ initials, color, size = 40 }: { initials: string; color: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color + '22', borderWidth: 1.5, borderColor: color + '55', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color, fontSize: size * 0.36, fontWeight: '700' as const }}>{initials}</Text>
    </View>
  );
}

function RoomCard({ cat, onPress }: { cat: typeof CATEGORIES[0]; onPress: () => void }) {
  const activity = ROOM_ACTIVITY[cat.id as keyof typeof ROOM_ACTIVITY] || { online: 42, messages: '10 min pehle' };
  return (
    <Pressable style={[styles.roomCard, { borderColor: cat.color + '30' }]} onPress={onPress}>
      <View style={[styles.roomIcon, { backgroundColor: cat.color + '18' }]}>
        <Feather name={cat.icon as any} size={24} color={cat.color} />
        <View style={styles.onlineDot} />
      </View>
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{cat.name}</Text>
        <Text style={styles.roomTagline} numberOfLines={1}>{cat.tagline}</Text>
        <View style={styles.roomMeta}>
          <Feather name="users" size={11} color="#555" />
          <Text style={styles.roomMetaText}>{activity.online} online</Text>
          <View style={styles.metaDot} />
          <Text style={styles.roomMetaText}>{activity.messages}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={18} color="#444" />
    </Pressable>
  );
}

function MemberCard({ user, onFriendToggle, friendStatus }: { user: CommunityUser; onFriendToggle: () => void; friendStatus: boolean }) {
  return (
    <View style={styles.memberCard}>
      <Avatar initials={user.initials} color={user.color} size={44} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{user.name}</Text>
        <Text style={styles.memberBio} numberOfLines={1}>{user.bio}</Text>
        <View style={styles.memberMeta}>
          <Text style={styles.memberDays}>{user.joinedDays} din se active</Text>
        </View>
      </View>
      <Pressable
        style={[styles.friendBtn, friendStatus && styles.friendBtnActive]}
        onPress={onFriendToggle}
      >
        <Feather name={friendStatus ? 'user-check' : 'user-plus'} size={14} color={friendStatus ? '#000' : '#1DB954'} />
      </Pressable>
    </View>
  );
}

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'rooms' | 'members' | 'friends'>('rooms');
  const [friends, setFriends] = useState<CommunityUser[]>([]);
  const [friendIds, setFriendIds] = useState<Set<string>>(new Set());
  const [profile, setProfile] = useState<ChatProfile | null>(null);
  const [setupMode, setSetupMode] = useState(false);
  const [setupName, setSetupName] = useState('');

  const activeRooms = CATEGORIES.filter(c => !c.comingSoon);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const [f, prof] = await Promise.all([getFriends(), getChatProfile()]);
    setFriends(f);
    setFriendIds(new Set(f.map(u => u.id)));
    setProfile(prof);
  }

  async function handleFriendToggle(user: CommunityUser) {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (friendIds.has(user.id)) {
      await removeFriend(user.id);
      setFriendIds(prev => { const s = new Set(prev); s.delete(user.id); return s; });
      setFriends(prev => prev.filter(f => f.id !== user.id));
    } else {
      await addFriend(user.id);
      setFriendIds(prev => new Set([...prev, user.id]));
      setFriends(prev => [...prev, user]);
    }
  }

  async function handleSetup() {
    if (!setupName.trim()) return;
    const words = setupName.trim().split(' ');
    const initials = words.length >= 2
      ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
      : setupName.trim().slice(0, 2).toUpperCase();
    const prof = { name: setupName.trim(), initials, color: getRandomColor() };
    await saveChatProfile(prof);
    setProfile(prof);
    setSetupMode(false);
    setSetupName('');
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>ZX Chat 💬</Text>
          <Text style={styles.headerSub}>Apni community ke saath judo</Text>
        </View>
        {profile ? (
          <Avatar initials={profile.initials} color={profile.color} size={38} />
        ) : (
          <Pressable style={styles.joinHeaderBtn} onPress={() => setSetupMode(true)}>
            <Text style={styles.joinHeaderText}>Join Karo</Text>
          </Pressable>
        )}
      </View>

      {/* Profile Setup */}
      {setupMode && (
        <View style={styles.setupBox}>
          <Text style={styles.setupTitle}>Community mein apna naam batao 👋</Text>
          <TextInput
            style={styles.setupInput}
            placeholder="Apna poora naam likho..."
            placeholderTextColor="#444"
            value={setupName}
            onChangeText={setSetupName}
            returnKeyType="done"
            onSubmitEditing={handleSetup}
            autoFocus
          />
          <View style={styles.setupRow}>
            <Pressable style={[styles.setupBtn, { backgroundColor: '#222', flex: 1 }]} onPress={() => setSetupMode(false)}>
              <Text style={[styles.setupBtnText, { color: '#666' }]}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.setupBtn, { flex: 2 }]} onPress={handleSetup}>
              <Text style={styles.setupBtnText}>Community Join Karo 🚀</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNum}>729</Text>
          <Text style={styles.statLbl}>Online</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNum}>6</Text>
          <Text style={styles.statLbl}>Rooms</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: '#1DB954' }]}>{friends.length}</Text>
          <Text style={styles.statLbl}>Friends</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {[
          { key: 'rooms', label: '🏠 Rooms', count: activeRooms.length },
          { key: 'members', label: '👥 Members', count: MOCK_USERS.length },
          { key: 'friends', label: '❤️ Friends', count: friends.length },
        ].map(t => (
          <Pressable
            key={t.key}
            style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
            onPress={() => setTab(t.key as any)}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
            {t.count > 0 && (
              <View style={[styles.tabCount, tab === t.key && styles.tabCountActive]}>
                <Text style={[styles.tabCountText, tab === t.key && { color: '#000' }]}>{t.count}</Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {tab === 'rooms' && (
          <View style={styles.roomsList}>
            <Text style={styles.sectionTitle}>Chat Rooms mein enter karo 👇</Text>
            {activeRooms.map(cat => (
              <RoomCard
                key={cat.id}
                cat={cat}
                onPress={() => router.push(`/chat-room/${cat.id}` as any)}
              />
            ))}
            <View style={styles.comingSoonRooms}>
              <Text style={styles.comingSoonLabel}>🔜 Jald aane waale rooms</Text>
              <View style={styles.comingSoonChips}>
                {CATEGORIES.filter(c => c.comingSoon).map(c => (
                  <View key={c.id} style={[styles.comingChip, { borderColor: c.color + '40' }]}>
                    <Feather name={c.icon as any} size={12} color={c.color} />
                    <Text style={[styles.comingChipText, { color: c.color }]}>{c.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {tab === 'members' && (
          <View style={styles.membersList}>
            <Text style={styles.sectionTitle}>Apni ZX Family 🫂</Text>
            {MOCK_USERS.map(user => (
              <MemberCard
                key={user.id}
                user={user}
                onFriendToggle={() => handleFriendToggle(user)}
                friendStatus={friendIds.has(user.id)}
              />
            ))}
          </View>
        )}

        {tab === 'friends' && (
          <View style={styles.friendsTab}>
            {friends.length === 0 ? (
              <View style={styles.emptyFriends}>
                <Text style={styles.emptyEmoji}>👥</Text>
                <Text style={styles.emptyTitle}>Abhi koi friend nahi hai</Text>
                <Text style={styles.emptySub}>Members tab mein jao aur "+" button se friends add karo!</Text>
                <Pressable style={styles.goMembersBtn} onPress={() => setTab('members')}>
                  <Text style={styles.goMembersBtnText}>Members Dekho →</Text>
                </Pressable>
              </View>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Tumhare ZX Friends ❤️</Text>
                {friends.map(user => (
                  <MemberCard
                    key={user.id}
                    user={user}
                    onFriendToggle={() => handleFriendToggle(user)}
                    friendStatus={true}
                  />
                ))}
              </>
            )}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, paddingTop: 10 },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: '900' as const },
  headerSub: { color: '#555', fontSize: 12, marginTop: 2 },
  joinHeaderBtn: { backgroundColor: '#1DB95420', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#1DB95440' },
  joinHeaderText: { color: '#1DB954', fontSize: 12, fontWeight: '700' as const },
  setupBox: { marginHorizontal: 20, backgroundColor: '#0F1F14', borderRadius: 16, padding: 16, gap: 12, borderWidth: 1, borderColor: '#1DB95430', marginBottom: 12 },
  setupTitle: { color: '#FFF', fontSize: 14, fontWeight: '700' as const },
  setupInput: { backgroundColor: '#151515', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, color: '#FFF', fontSize: 14, borderWidth: 1, borderColor: '#282828' },
  setupRow: { flexDirection: 'row', gap: 8 },
  setupBtn: { backgroundColor: '#1DB954', borderRadius: 10, paddingVertical: 12, alignItems: 'center', flex: 1 },
  setupBtnText: { color: '#000', fontWeight: '700' as const, fontSize: 13 },
  statsBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0C0C0C', marginHorizontal: 20, borderRadius: 14, paddingVertical: 12, marginBottom: 16, borderWidth: 1, borderColor: '#1A1A1A' },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { color: '#FFF', fontSize: 18, fontWeight: '900' as const },
  statLbl: { color: '#555', fontSize: 10, fontWeight: '600' as const, marginTop: 2 },
  statDivider: { width: 1, height: 28, backgroundColor: '#1E1E1E' },
  tabRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 10, borderRadius: 12, backgroundColor: '#111', borderWidth: 1, borderColor: '#1E1E1E' },
  tabBtnActive: { backgroundColor: '#1DB954', borderColor: '#1DB954' },
  tabText: { color: '#666', fontSize: 11, fontWeight: '700' as const },
  tabTextActive: { color: '#000' },
  tabCount: { backgroundColor: '#1E1E1E', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  tabCountActive: { backgroundColor: '#00000030' },
  tabCountText: { color: '#888', fontSize: 10, fontWeight: '700' as const },
  content: { flex: 1 },
  sectionTitle: { color: '#888', fontSize: 12, fontWeight: '600' as const, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 12, paddingHorizontal: 20 },
  roomsList: { paddingTop: 4, gap: 10, paddingHorizontal: 20 },
  roomCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0E0E0E', borderRadius: 16, padding: 14, borderWidth: 1, gap: 12 },
  roomIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 },
  onlineDot: { position: 'absolute', top: 4, right: 4, width: 10, height: 10, borderRadius: 5, backgroundColor: '#1DB954', borderWidth: 1.5, borderColor: '#0E0E0E' },
  roomInfo: { flex: 1, gap: 3 },
  roomName: { color: '#FFF', fontSize: 14, fontWeight: '700' as const },
  roomTagline: { color: '#666', fontSize: 11 },
  roomMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  roomMetaText: { color: '#555', fontSize: 10 },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#444' },
  comingSoonRooms: { backgroundColor: '#0C0C0C', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#1E1E1E', gap: 10 },
  comingSoonLabel: { color: '#666', fontSize: 12, fontWeight: '600' as const },
  comingSoonChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  comingChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#151515', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1 },
  comingChipText: { fontSize: 11, fontWeight: '600' as const },
  membersList: { paddingTop: 4, gap: 10, paddingHorizontal: 20 },
  memberCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0E0E0E', borderRadius: 14, padding: 12, gap: 12, borderWidth: 1, borderColor: '#1A1A1A' },
  memberInfo: { flex: 1, gap: 3 },
  memberName: { color: '#FFF', fontSize: 14, fontWeight: '700' as const },
  memberBio: { color: '#666', fontSize: 11 },
  memberMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  memberDays: { color: '#444', fontSize: 10 },
  friendBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1DB95440' },
  friendBtnActive: { backgroundColor: '#1DB954', borderColor: '#1DB954' },
  friendsTab: { paddingTop: 4 },
  emptyFriends: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32, gap: 10 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { color: '#FFF', fontSize: 18, fontWeight: '800' as const },
  emptySub: { color: '#666', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  goMembersBtn: { backgroundColor: '#1DB95420', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1DB95440', marginTop: 8 },
  goMembersBtnText: { color: '#1DB954', fontWeight: '700' as const, fontSize: 14 },
});
