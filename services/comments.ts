import AsyncStorage from '@react-native-async-storage/async-storage';

const COMMENTS_KEY = '@zxmind:comments';
const LIKES_KEY = '@zxmind:comment_likes';

export interface Comment {
  id: string;
  episodeId: string;
  userId: string;
  userName: string;
  userInitials: string;
  userColor: string;
  text: string;
  timestamp: number;
  likeCount: number;
  isMine?: boolean;
  replyTo?: string;
}

const SEED_COMMENTS: Record<string, Omit<Comment, 'id'>[]> = {
  c1: [
    { episodeId: 'c1', userId: 'u1', userName: 'Rahul Sharma', userInitials: 'RS', userColor: '#FF6B6B', text: 'Yaar ye episode sunke andar kuch badal gaya! "Self-doubt hi sabse bada dushman hai" — ye line dil pe lagi 🔥', timestamp: Date.now() - 86400000 * 3, likeCount: 234 },
    { episodeId: 'c1', userId: 'u6', userName: 'Ananya Joshi', userInitials: 'AJ', userColor: '#FF8B94', text: 'Main isko 5 baar sun chuki hoon. Har baar naya perspective milta hai. ZX Mind ne sach mein zindagi badal di! 🙏', timestamp: Date.now() - 86400000 * 2, likeCount: 189 },
    { episodeId: 'c1', userId: 'u3', userName: 'Arjun Mehta', userInitials: 'AM', userColor: '#FFE66D', text: 'Ek cheez jo mujhe sabse zyada pasand aayi — "confidence perform karna nahi, apne aap ko accept karna hai". Gold! 💪', timestamp: Date.now() - 86400000, likeCount: 156 },
    { episodeId: 'c1', userId: 'u7', userName: 'Dev Kumar', userInitials: 'DK', userColor: '#45B7D1', text: 'Mera dost bhi sun raha tha mere saath — dono ne bahut kuch seekha. Recommended to everyone!', timestamp: Date.now() - 43200000, likeCount: 78 },
    { episodeId: 'c1', userId: 'u4', userName: 'Sneha Patel', userInitials: 'SP', userColor: '#C3A6FF', text: 'Roz subah is episode ka ek part sunti hoon. Din acha jaata hai! ☀️', timestamp: Date.now() - 7200000, likeCount: 92 },
  ],
  c2: [
    { episodeId: 'c2', userId: 'u9', userName: 'Mohit Gupta', userInitials: 'MG', userColor: '#1DB954', text: '"Brain ko hack karo" — ye concept ekdum naya tha mere liye. Sach mein kaam karta hai yeh!', timestamp: Date.now() - 86400000 * 4, likeCount: 145 },
    { episodeId: 'c2', userId: 'u2', userName: 'Priya Singh', userInitials: 'PS', userColor: '#4ECDC4', text: 'Mirror exercise try kiya jo bataya tha. Pehle awkward laga, ab confidence real feel hota hai!', timestamp: Date.now() - 86400000 * 2, likeCount: 203 },
    { episodeId: 'c2', userId: 'u5', userName: 'Vikram Rao', userInitials: 'VR', userColor: '#98D8C8', text: 'Is episode ke baad mera morning routine bilkul badal gaya. Shukriya ZX Mind! 🙌', timestamp: Date.now() - 3600000 * 5, likeCount: 67 },
  ],
  d1: [
    { episodeId: 'd1', userId: 'u3', userName: 'Arjun Mehta', userInitials: 'AM', userColor: '#FFE66D', text: '90 din discipline maintain ki, aur aaj reward claim kiya! Yahi real victory hai 🏆', timestamp: Date.now() - 86400000 * 5, likeCount: 512 },
    { episodeId: 'd1', userId: 'u8', userName: 'Riya Kapoor', userInitials: 'RK', userColor: '#F7DC6F', text: '"Discipline is choosing between what you want now and what you want most" — life changing quote', timestamp: Date.now() - 86400000, likeCount: 234 },
  ],
  m1: [
    { episodeId: 'm1', userId: 'u2', userName: 'Priya Singh', userInitials: 'PS', userColor: '#4ECDC4', text: 'Is episode ne meri financial thinking hi badal di! Pehle sirf saving, ab investing ke baare mein sochti hoon 💰', timestamp: Date.now() - 86400000 * 6, likeCount: 389 },
    { episodeId: 'm1', userId: 'u9', userName: 'Mohit Gupta', userInitials: 'MG', userColor: '#1DB954', text: '"Ameer log assets khareedte hain, garib log liabilities" — Robert Kiyosaki wali baat yaad aa gayi!', timestamp: Date.now() - 86400000 * 3, likeCount: 276 },
  ],
};

export async function getComments(episodeId: string): Promise<Comment[]> {
  try {
    const raw = await AsyncStorage.getItem(`${COMMENTS_KEY}:${episodeId}`);
    const userComments: Comment[] = raw ? JSON.parse(raw) : [];
    const seeds = (SEED_COMMENTS[episodeId] || []).map((c, i) => ({ ...c, id: `seed_${episodeId}_${i}` }));
    const all = [...seeds, ...userComments];
    all.sort((a, b) => b.likeCount - a.likeCount);
    return all;
  } catch { return []; }
}

export async function addComment(episodeId: string, text: string, profile: { name: string; initials: string; color: string }): Promise<Comment> {
  const comment: Comment = {
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    episodeId,
    userId: 'me',
    userName: profile.name,
    userInitials: profile.initials,
    userColor: profile.color,
    text,
    timestamp: Date.now(),
    likeCount: 0,
    isMine: true,
  };
  const raw = await AsyncStorage.getItem(`${COMMENTS_KEY}:${episodeId}`);
  const existing: Comment[] = raw ? JSON.parse(raw) : [];
  existing.unshift(comment);
  await AsyncStorage.setItem(`${COMMENTS_KEY}:${episodeId}`, JSON.stringify(existing));
  return comment;
}

export async function getLikedCommentIds(episodeId: string): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(`${LIKES_KEY}:${episodeId}`);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

export async function toggleCommentLike(episodeId: string, commentId: string): Promise<boolean> {
  const liked = await getLikedCommentIds(episodeId);
  if (liked.has(commentId)) { liked.delete(commentId); } else { liked.add(commentId); }
  await AsyncStorage.setItem(`${LIKES_KEY}:${episodeId}`, JSON.stringify([...liked]));
  return liked.has(commentId);
}

export function formatCommentTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'Abhi';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min pehle`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} ghante pehle`;
  const days = Math.floor(diff / 86400000);
  if (days < 7) return `${days} din pehle`;
  if (days < 30) return `${Math.floor(days / 7)} hafte pehle`;
  return `${Math.floor(days / 30)} mahine pehle`;
}
