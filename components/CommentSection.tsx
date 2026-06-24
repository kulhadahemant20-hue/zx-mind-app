import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Platform, Pressable, StyleSheet,
  Text, TextInput, View,
} from 'react-native';
import {
  addComment, Comment, formatCommentTime,
  getComments, getLikedCommentIds, toggleCommentLike,
} from '@/services/comments';
import { getChatProfile, saveChatProfile, getRandomColor } from '@/services/chat';

interface Props {
  episodeId: string;
}

function Avatar({ initials, color, size = 36 }: { initials: string; color: string; size?: number }) {
  return (
    <View style={[styles.avatar, { backgroundColor: color + '25', width: size, height: size, borderRadius: size / 2, borderColor: color + '60' }]}>
      <Text style={[styles.avatarText, { color, fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

function CommentRow({ comment, onLike }: { comment: Comment & { liked?: boolean }; onLike: (id: string) => void }) {
  return (
    <View style={styles.commentRow}>
      <Avatar initials={comment.userInitials} color={comment.userColor} />
      <View style={styles.commentBody}>
        <View style={styles.commentMeta}>
          <Text style={[styles.commentName, comment.isMine && { color: '#1DB954' }]}>
            {comment.userName} {comment.isMine && '(You)'}
          </Text>
          <Text style={styles.commentTime}>{formatCommentTime(comment.timestamp)}</Text>
        </View>
        <Text style={styles.commentText}>{comment.text}</Text>
        <Pressable style={styles.likeRow} onPress={() => onLike(comment.id)}>
          <Feather name="thumbs-up" size={13} color={comment.liked ? '#1DB954' : '#555'} />
          <Text style={[styles.likeCount, comment.liked && { color: '#1DB954' }]}>
            {(comment.likeCount || 0) + (comment.liked ? 1 : 0)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function CommentSection({ episodeId }: Props) {
  const [comments, setComments] = useState<(Comment & { liked?: boolean })[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [setupMode, setSetupMode] = useState(false);
  const [profile, setProfile] = useState<{ name: string; initials: string; color: string } | null>(null);

  useEffect(() => { load(); }, [episodeId]);

  async function load() {
    setLoading(true);
    const [cs, liked, prof] = await Promise.all([
      getComments(episodeId),
      getLikedCommentIds(episodeId),
      getChatProfile(),
    ]);
    setLikedIds(liked);
    setComments(cs.map(c => ({ ...c, liked: liked.has(c.id) })));
    setProfile(prof);
    setLoading(false);
  }

  async function handleLike(commentId: string) {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await toggleCommentLike(episodeId, commentId);
    const newLiked = new Set(likedIds);
    if (newLiked.has(commentId)) { newLiked.delete(commentId); } else { newLiked.add(commentId); }
    setLikedIds(newLiked);
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, liked: newLiked.has(commentId) } : c));
  }

  async function handleSetupProfile() {
    if (!profileName.trim()) return;
    const words = profileName.trim().split(' ');
    const initials = words.length >= 2
      ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
      : profileName.trim().slice(0, 2).toUpperCase();
    const color = getRandomColor();
    const prof = { name: profileName.trim(), initials, color };
    await saveChatProfile(prof);
    setProfile(prof);
    setSetupMode(false);
    setProfileName('');
  }

  async function handleSend() {
    if (!text.trim() || !profile) return;
    setSending(true);
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newComment = await addComment(episodeId, text.trim(), profile);
    setComments(prev => [{ ...newComment, liked: false }, ...prev]);
    setText('');
    setSending(false);
  }

  const visibleComments = showAll ? comments : comments.slice(0, 3);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Feather name="message-circle" size={18} color="#FFF" />
        <Text style={styles.headerTitle}>Comments</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{comments.length}</Text>
        </View>
      </View>

      {/* Input area */}
      {setupMode ? (
        <View style={styles.setupBox}>
          <Text style={styles.setupTitle}>Pehle apna naam batao 👋</Text>
          <TextInput
            style={styles.setupInput}
            placeholder="Jaise: Rahul Sharma"
            placeholderTextColor="#444"
            value={profileName}
            onChangeText={setProfileName}
            returnKeyType="done"
            onSubmitEditing={handleSetupProfile}
            autoFocus
          />
          <Pressable style={styles.setupBtn} onPress={handleSetupProfile}>
            <Text style={styles.setupBtnText}>Start Commenting</Text>
          </Pressable>
        </View>
      ) : profile ? (
        <View style={styles.inputRow}>
          <Avatar initials={profile.initials} color={profile.color} size={34} />
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Apna comment likho..."
              placeholderTextColor="#444"
              value={text}
              onChangeText={setText}
              multiline
              maxLength={500}
            />
          </View>
          <Pressable
            style={[styles.sendBtn, (!text.trim() || sending) && { opacity: 0.4 }]}
            onPress={handleSend}
            disabled={!text.trim() || sending}
          >
            {sending
              ? <ActivityIndicator size="small" color="#000" />
              : <Feather name="send" size={16} color="#000" />
            }
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.joinBtn} onPress={() => setSetupMode(true)}>
          <Feather name="edit-3" size={15} color="#1DB954" />
          <Text style={styles.joinBtnText}>Comment karne ke liye naam daalo</Text>
        </Pressable>
      )}

      {/* Comments list */}
      {loading ? (
        <ActivityIndicator color="#1DB954" style={{ marginTop: 20 }} />
      ) : comments.length === 0 ? (
        <View style={styles.emptyBox}>
          <Feather name="message-square" size={32} color="#333" />
          <Text style={styles.emptyText}>Pehle comment karo! 🎤</Text>
        </View>
      ) : (
        <View style={styles.commentsList}>
          {visibleComments.map(c => (
            <CommentRow key={c.id} comment={c} onLike={handleLike} />
          ))}
          {comments.length > 3 && (
            <Pressable style={styles.showMoreBtn} onPress={() => setShowAll(s => !s)}>
              <Text style={styles.showMoreText}>
                {showAll ? 'Kam dikhao ▲' : `Aur ${comments.length - 3} comments dikhao ▼`}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: '#0A0A0A', borderTopWidth: 1, borderTopColor: '#1A1A1A', paddingTop: 20, paddingHorizontal: 20, paddingBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  headerTitle: { color: '#FFF', fontSize: 16, fontWeight: '800' as const, flex: 1 },
  countBadge: { backgroundColor: '#1A1A1A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countText: { color: '#888', fontSize: 12, fontWeight: '600' as const },
  joinBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#111', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#1DB95430' },
  joinBtnText: { color: '#1DB954', fontSize: 13, fontWeight: '600' as const },
  setupBox: { backgroundColor: '#111', borderRadius: 14, padding: 16, marginBottom: 16, gap: 12, borderWidth: 1, borderColor: '#222' },
  setupTitle: { color: '#FFF', fontSize: 14, fontWeight: '700' as const },
  setupInput: { backgroundColor: '#1A1A1A', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, color: '#FFF', fontSize: 14, borderWidth: 1, borderColor: '#282828' },
  setupBtn: { backgroundColor: '#1DB954', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  setupBtnText: { color: '#000', fontWeight: '700' as const, fontSize: 14 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginBottom: 16 },
  avatar: { borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontWeight: '700' as const },
  inputWrap: { flex: 1, backgroundColor: '#151515', borderRadius: 12, borderWidth: 1, borderColor: '#282828', paddingHorizontal: 12, paddingVertical: 8 },
  input: { color: '#FFF', fontSize: 14, maxHeight: 100, minHeight: 36 },
  sendBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#1DB954', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  commentsList: { gap: 16 },
  commentRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  commentBody: { flex: 1, gap: 5 },
  commentMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  commentName: { color: '#CCC', fontSize: 13, fontWeight: '700' as const },
  commentTime: { color: '#555', fontSize: 11 },
  commentText: { color: '#AAA', fontSize: 13, lineHeight: 19 },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  likeCount: { color: '#555', fontSize: 12 },
  showMoreBtn: { alignItems: 'center', paddingVertical: 12 },
  showMoreText: { color: '#1DB954', fontSize: 13, fontWeight: '600' as const },
  emptyBox: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyText: { color: '#444', fontSize: 13 },
});
