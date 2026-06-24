import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, FlatList, KeyboardAvoidingView, Platform,
  Pressable, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES } from '@/constants/mockData';
import {
  ChatMessage, ChatProfile, formatTime, getChatProfile,
  getMessages, getRandomColor, MOCK_USERS, saveChatProfile, sendMessage,
} from '@/services/chat';

function Avatar({ initials, color, size = 34 }: { initials: string; color: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color + '22', borderWidth: 1.5, borderColor: color + '55', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Text style={{ color, fontSize: size * 0.36, fontWeight: '700' as const }}>{initials}</Text>
    </View>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isMine = msg.isMine;
  return (
    <View style={[styles.msgRow, isMine && styles.msgRowMine]}>
      {!isMine && <Avatar initials={msg.userInitials} color={msg.userColor} />}
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
        {!isMine && <Text style={[styles.bubbleName, { color: msg.userColor }]}>{msg.userName}</Text>}
        <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>{msg.text}</Text>
        <Text style={[styles.bubbleTime, isMine && { color: '#ffffff55' }]}>{formatTime(msg.timestamp)}</Text>
      </View>
      {isMine && <Avatar initials={msg.userInitials} color={msg.userColor} />}
    </View>
  );
}

function OnlineUsers({ roomId }: { roomId: string }) {
  const visible = MOCK_USERS.slice(0, 5);
  return (
    <View style={styles.onlineBar}>
      <View style={styles.onlineAvatars}>
        {visible.map((u, i) => (
          <View key={u.id} style={[styles.onlineAvatar, { zIndex: 10 - i, marginLeft: i === 0 ? 0 : -10 }]}>
            <Avatar initials={u.initials} color={u.color} size={28} />
          </View>
        ))}
        <View style={styles.onlinePlus}>
          <Text style={styles.onlinePlusText}>+{MOCK_USERS.length - 5}</Text>
        </View>
      </View>
      <View style={styles.onlineDotWrap}>
        <View style={styles.onlineDot} />
        <Text style={styles.onlineCount}>{(MOCK_USERS.length * 12).toLocaleString()} online</Text>
      </View>
    </View>
  );
}

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ChatProfile | null>(null);
  const [setupMode, setSetupMode] = useState(false);
  const [setupName, setSetupName] = useState('');
  const [sending, setSending] = useState(false);

  const category = CATEGORIES.find(c => c.id === id);

  useEffect(() => { load(); }, [id]);

  async function load() {
    setLoading(true);
    const [msgs, prof] = await Promise.all([getMessages(id), getChatProfile()]);
    setMessages(msgs);
    setProfile(prof);
    setLoading(false);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 100);
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

  async function handleSend() {
    if (!text.trim() || !profile || sending) return;
    setSending(true);
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const msg = await sendMessage(id, text.trim(), profile);
    setMessages(prev => [...prev, msg]);
    setText('');
    setSending(false);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }

  if (!category) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666' }}>Room not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 60 : 12) }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#FFF" />
        </Pressable>
        <View style={[styles.roomIconSmall, { backgroundColor: category.color + '20' }]}>
          <Feather name={category.icon as any} size={18} color={category.color} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{category.name}</Text>
          <View style={styles.headerOnline}>
            <View style={styles.onlineDot} />
            <Text style={styles.headerOnlineText}>{(MOCK_USERS.length * 12).toLocaleString()} online</Text>
          </View>
        </View>
        <Pressable style={styles.ruleBtn}>
          <Feather name="info" size={18} color="#555" />
        </Pressable>
      </View>

      {/* Online bar */}
      <OnlineUsers roomId={id} />

      {/* Messages */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#1DB954" size="large" />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          renderItem={({ item }) => <MessageBubble msg={item} />}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />
      )}

      {/* Profile setup or input */}
      {setupMode ? (
        <View style={[styles.setupBox, { paddingBottom: insets.bottom + 12 }]}>
          <Text style={styles.setupTitle}>Apna naam batao agar batate ho 👋</Text>
          <View style={styles.setupRow}>
            <TextInput
              style={styles.setupInput}
              placeholder="Jaise: Rahul Sharma"
              placeholderTextColor="#444"
              value={setupName}
              onChangeText={setSetupName}
              returnKeyType="done"
              onSubmitEditing={handleSetup}
              autoFocus
            />
            <Pressable style={styles.setupSendBtn} onPress={handleSetup}>
              <Text style={styles.setupSendText}>Join</Text>
            </Pressable>
          </View>
        </View>
      ) : profile ? (
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          <TextInput
            style={styles.input}
            placeholder={`${category.name} ke baare mein kuch likho...`}
            placeholderTextColor="#444"
            value={text}
            onChangeText={setText}
            multiline
            maxLength={500}
          />
          <Pressable
            style={[styles.sendBtn, (!text.trim() || sending) && { opacity: 0.4 }]}
            onPress={handleSend}
            disabled={!text.trim() || sending}
          >
            {sending
              ? <ActivityIndicator size="small" color="#000" />
              : <Feather name="send" size={17} color="#000" />
            }
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={[styles.joinBar, { paddingBottom: insets.bottom + 12 }]}
          onPress={() => setSetupMode(true)}
        >
          <Feather name="edit-3" size={16} color="#1DB954" />
          <Text style={styles.joinBarText}>Is room mein join karo — apna naam batao 👆</Text>
        </Pressable>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 10, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  roomIconSmall: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  headerInfo: { flex: 1 },
  headerTitle: { color: '#FFF', fontSize: 15, fontWeight: '800' as const },
  headerOnline: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#1DB954' },
  headerOnlineText: { color: '#1DB954', fontSize: 11 },
  ruleBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  onlineBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#080808', borderBottomWidth: 1, borderBottomColor: '#141414' },
  onlineAvatars: { flexDirection: 'row', alignItems: 'center' },
  onlineAvatar: {},
  onlinePlus: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center', marginLeft: -10, zIndex: 0 },
  onlinePlusText: { color: '#888', fontSize: 9, fontWeight: '700' as const },
  onlineDotWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  onlineCount: { color: '#555', fontSize: 11 },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  messageList: { paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '85%' },
  msgRowMine: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  bubble: { borderRadius: 16, padding: 12, maxWidth: '100%', gap: 4 },
  bubbleOther: { backgroundColor: '#141414', borderBottomLeftRadius: 4 },
  bubbleMine: { backgroundColor: '#1DB954', borderBottomRightRadius: 4 },
  bubbleName: { fontSize: 11, fontWeight: '700' as const },
  bubbleText: { color: '#DDD', fontSize: 14, lineHeight: 19 },
  bubbleTextMine: { color: '#000' },
  bubbleTime: { color: '#555', fontSize: 10, alignSelf: 'flex-end' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, paddingTop: 10, gap: 10, borderTopWidth: 1, borderTopColor: '#1A1A1A', backgroundColor: '#050505' },
  input: { flex: 1, backgroundColor: '#141414', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: '#FFF', fontSize: 14, maxHeight: 100, borderWidth: 1, borderColor: '#222' },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#1DB954', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  joinBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 20, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#1A1A1A', backgroundColor: '#050505' },
  joinBarText: { color: '#1DB954', fontSize: 13, fontWeight: '600' as const },
  setupBox: { paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1A1A1A', backgroundColor: '#050505', gap: 8 },
  setupTitle: { color: '#FFF', fontSize: 13, fontWeight: '700' as const },
  setupRow: { flexDirection: 'row', gap: 8 },
  setupInput: { flex: 1, backgroundColor: '#141414', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, color: '#FFF', fontSize: 14, borderWidth: 1, borderColor: '#222' },
  setupSendBtn: { backgroundColor: '#1DB954', paddingHorizontal: 18, borderRadius: 14, justifyContent: 'center' },
  setupSendText: { color: '#000', fontWeight: '700' as const, fontSize: 14 },
});
