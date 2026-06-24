import AsyncStorage from '@react-native-async-storage/async-storage';

const MESSAGES_KEY = '@zxmind:chat_messages';
const FRIENDS_KEY = '@zxmind:friends';
const PROFILE_KEY = '@zxmind:chat_profile';

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userInitials: string;
  userColor: string;
  text: string;
  timestamp: number;
  isMine?: boolean;
  liked?: boolean;
  likeCount?: number;
}

export interface CommunityUser {
  id: string;
  name: string;
  initials: string;
  color: string;
  bio: string;
  joinedDays: number;
  favoriteCategory: string;
}

export interface ChatProfile {
  name: string;
  initials: string;
  color: string;
}

export const MOCK_USERS: CommunityUser[] = [
  { id: 'u1', name: 'Rahul Sharma', initials: 'RS', color: '#FF6B6B', bio: 'Confidence pe kaam kar raha hoon daily 🔥', joinedDays: 120, favoriteCategory: 'confidence' },
  { id: 'u2', name: 'Priya Singh', initials: 'PS', color: '#4ECDC4', bio: 'Money mindset badal raha hai dheere dheere 💰', joinedDays: 85, favoriteCategory: 'money' },
  { id: 'u3', name: 'Arjun Mehta', initials: 'AM', color: '#FFE66D', bio: 'Discipline is my superpower 💪', joinedDays: 200, favoriteCategory: 'discipline' },
  { id: 'u4', name: 'Sneha Patel', initials: 'SP', color: '#C3A6FF', bio: 'Success stories se daily motivation milti hai!', joinedDays: 45, favoriteCategory: 'success' },
  { id: 'u5', name: 'Vikram Rao', initials: 'VR', color: '#98D8C8', bio: 'Legends ke baare mein padhna pasand hai', joinedDays: 310, favoriteCategory: 'legends' },
  { id: 'u6', name: 'Ananya Joshi', initials: 'AJ', color: '#FF8B94', bio: 'Apne aap ko pehchaan rahi hoon ✨', joinedDays: 60, favoriteCategory: 'heartgrowth' },
  { id: 'u7', name: 'Dev Kumar', initials: 'DK', color: '#45B7D1', bio: 'ZX Mind ne zindagi badal di!', joinedDays: 150, favoriteCategory: 'confidence' },
  { id: 'u8', name: 'Riya Kapoor', initials: 'RK', color: '#F7DC6F', bio: 'Har din ek naya lesson 📚', joinedDays: 90, favoriteCategory: 'discipline' },
  { id: 'u9', name: 'Mohit Gupta', initials: 'MG', color: '#1DB954', bio: 'Paisa aata hai jab mindset clear ho 💵', joinedDays: 75, favoriteCategory: 'money' },
  { id: 'u10', name: 'Pooja Verma', initials: 'PV', color: '#FF6B6B', bio: 'Apni kahani khud likh rahi hoon ✍️', joinedDays: 180, favoriteCategory: 'success' },
];

// Pre-seeded community messages per room
const SEED_MESSAGES: Record<string, Omit<ChatMessage, 'id'>[]> = {
  confidence: [
    { roomId: 'confidence', userId: 'u1', userName: 'Rahul Sharma', userInitials: 'RS', userColor: '#FF6B6B', text: 'Bhai aaj "The Confidence Trap" suna — ekdum mind-blowing! 🔥', timestamp: Date.now() - 3600000 * 5, likeCount: 12 },
    { roomId: 'confidence', userId: 'u7', userName: 'Dev Kumar', userInitials: 'DK', userColor: '#45B7D1', text: 'Haan yaar! Mujhe sabse zyada pasand aaya ki self-doubt ko kaise handle karein wala part', timestamp: Date.now() - 3600000 * 4, likeCount: 8 },
    { roomId: 'confidence', userId: 'u6', userName: 'Ananya Joshi', userInitials: 'AJ', userColor: '#FF8B94', text: 'Main roz ek episode sunta/sunti hoon confidence series ka. Life mein fark dikh raha hai 🙏', timestamp: Date.now() - 3600000 * 2, likeCount: 15 },
    { roomId: 'confidence', userId: 'u1', userName: 'Rahul Sharma', userInitials: 'RS', userColor: '#FF6B6B', text: 'Yaar kaun log hain jo roz 5+ minutes listen karte hain? Hamara ek group bana sakte hain! 💪', timestamp: Date.now() - 1800000, likeCount: 6 },
  ],
  money: [
    { roomId: 'money', userId: 'u2', userName: 'Priya Singh', userInitials: 'PS', userColor: '#4ECDC4', text: 'Money episode ne meri soch badal di — pehle main sirf salary bachane ki sochti thi 💰', timestamp: Date.now() - 3600000 * 6, likeCount: 20 },
    { roomId: 'money', userId: 'u9', userName: 'Mohit Gupta', userInitials: 'MG', userColor: '#1DB954', text: 'Assets aur liabilities ka fark samajh aaya finally! Abhi mutual fund start kiya hai 📈', timestamp: Date.now() - 3600000 * 3, likeCount: 18 },
    { roomId: 'money', userId: 'u2', userName: 'Priya Singh', userInitials: 'PS', userColor: '#4ECDC4', text: 'Mohit bhai share karo kaise start kiya please!', timestamp: Date.now() - 3600000 * 2, likeCount: 5 },
    { roomId: 'money', userId: 'u9', userName: 'Mohit Gupta', userInitials: 'MG', userColor: '#1DB954', text: 'Groww app se karo — SIP se 500 se shuru karo, fir badhate jao! DM karo doubt ho toh 😊', timestamp: Date.now() - 900000, likeCount: 22 },
  ],
  discipline: [
    { roomId: 'discipline', userId: 'u3', userName: 'Arjun Mehta', userInitials: 'AM', userColor: '#FFE66D', text: '90 din ho gaye mujhe — aaj pehla reward unlock hua! ZX Mind Bottle claim kiya 🏆', timestamp: Date.now() - 3600000 * 8, likeCount: 45 },
    { roomId: 'discipline', userId: 'u8', userName: 'Riya Kapoor', initials: 'RK', userInitials: 'RK', userColor: '#F7DC6F', text: 'Arjun bhai congratulations!! 🎉 Main 67 din pe hoon, aur thoda karna hai!', timestamp: Date.now() - 3600000 * 7, likeCount: 12 },
    { roomId: 'discipline', userId: 'u3', userName: 'Arjun Mehta', userInitials: 'AM', userColor: '#FFE66D', text: 'Riya bas lagey raho! Ek cheez jo kaam aai mujhe — roz subah 6 baje ek episode. Chai ke saath 🍵', timestamp: Date.now() - 3600000 * 6, likeCount: 30 },
    { roomId: 'discipline', userId: 'u8', userName: 'Riya Kapoor', userInitials: 'RK', userColor: '#F7DC6F', text: 'Ye tip gold hai yaar! Aaj se try karta/karti hoon 💪', timestamp: Date.now() - 1800000, likeCount: 8 },
  ],
  success: [
    { roomId: 'success', userId: 'u4', userName: 'Sneha Patel', userInitials: 'SP', userColor: '#C3A6FF', text: 'APJ Abdul Kalam wala episode kisi ne suna? Ekdum rula diya yaar 😭', timestamp: Date.now() - 3600000 * 10, likeCount: 55 },
    { roomId: 'success', userId: 'u10', userName: 'Pooja Verma', userInitials: 'PV', userColor: '#FF6B6B', text: 'Haan Sneha! Unki story se seekha ki failure sirf ek step hai, end nahi 🙏', timestamp: Date.now() - 3600000 * 9, likeCount: 40 },
    { roomId: 'success', userId: 'u4', userName: 'Sneha Patel', userInitials: 'SP', userColor: '#C3A6FF', text: 'Exactly! Aur Dhirubhai Ambani wala bhi sun lena — woh bhi superb hai!', timestamp: Date.now() - 3600000 * 4, likeCount: 28 },
  ],
  legends: [
    { roomId: 'legends', userId: 'u5', userName: 'Vikram Rao', userInitials: 'VR', userColor: '#98D8C8', text: 'Elon Musk wala episode 3 baar sun chuka hoon 😄 Har baar kuch naya milta hai', timestamp: Date.now() - 3600000 * 12, likeCount: 60 },
    { roomId: 'legends', userId: 'u7', userName: 'Dev Kumar', userInitials: 'DK', userColor: '#45B7D1', text: 'Vikram bhai Steve Jobs wala bhi hai? Unki story mujhe most inspire karti hai', timestamp: Date.now() - 3600000 * 10, likeCount: 25 },
    { roomId: 'legends', userId: 'u5', userName: 'Vikram Rao', userInitials: 'VR', userColor: '#98D8C8', text: 'Haan ek toh hai! Uske alawa Warren Buffett wala bhi — money + patience ka combination samjhaya', timestamp: Date.now() - 3600000 * 5, likeCount: 35 },
  ],
  heartgrowth: [
    { roomId: 'heartgrowth', userId: 'u6', userName: 'Ananya Joshi', userInitials: 'AJ', userColor: '#FF8B94', text: 'Yaar is category ne sach mein andar se hilaya. "Apne Aap Ko Pehchano" — ye sirf words nahi hain 💫', timestamp: Date.now() - 3600000 * 7, likeCount: 48 },
    { roomId: 'heartgrowth', userId: 'u10', userName: 'Pooja Verma', userInitials: 'PV', userColor: '#FF6B6B', text: 'Bilkul sahi kaha! Mujhe pata hi nahi tha ki main kya chahti hoon life mein — ab clarity aayi hai', timestamp: Date.now() - 3600000 * 5, likeCount: 38 },
    { roomId: 'heartgrowth', userId: 'u6', userName: 'Ananya Joshi', userInitials: 'AJ', userColor: '#FF8B94', text: 'Pooja ji ye community ek family jaisi lag rahi hai yaar! Itna support! 🤗', timestamp: Date.now() - 1200000, likeCount: 55 },
  ],
};

export async function getChatProfile(): Promise<ChatProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export async function saveChatProfile(profile: ChatProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function getMessages(roomId: string): Promise<ChatMessage[]> {
  try {
    const raw = await AsyncStorage.getItem(`${MESSAGES_KEY}:${roomId}`);
    const userMessages: ChatMessage[] = raw ? JSON.parse(raw) : [];
    const seeds = (SEED_MESSAGES[roomId] || []).map((m, i) => ({ ...m, id: `seed_${roomId}_${i}` }));
    const all = [...seeds, ...userMessages];
    all.sort((a, b) => a.timestamp - b.timestamp);
    return all;
  } catch { return []; }
}

export async function sendMessage(roomId: string, text: string, profile: ChatProfile): Promise<ChatMessage> {
  const msg: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    roomId,
    userId: 'me',
    userName: profile.name,
    userInitials: profile.initials,
    userColor: profile.color,
    text,
    timestamp: Date.now(),
    isMine: true,
    likeCount: 0,
  };
  const raw = await AsyncStorage.getItem(`${MESSAGES_KEY}:${roomId}`);
  const existing: ChatMessage[] = raw ? JSON.parse(raw) : [];
  existing.push(msg);
  await AsyncStorage.setItem(`${MESSAGES_KEY}:${roomId}`, JSON.stringify(existing));
  return msg;
}

export async function getFriends(): Promise<CommunityUser[]> {
  try {
    const raw = await AsyncStorage.getItem(FRIENDS_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    return MOCK_USERS.filter(u => ids.includes(u.id));
  } catch { return []; }
}

export async function addFriend(userId: string): Promise<void> {
  const raw = await AsyncStorage.getItem(FRIENDS_KEY);
  const ids: string[] = raw ? JSON.parse(raw) : [];
  if (!ids.includes(userId)) {
    ids.push(userId);
    await AsyncStorage.setItem(FRIENDS_KEY, JSON.stringify(ids));
  }
}

export async function removeFriend(userId: string): Promise<void> {
  const raw = await AsyncStorage.getItem(FRIENDS_KEY);
  const ids: string[] = raw ? JSON.parse(raw) : [];
  await AsyncStorage.setItem(FRIENDS_KEY, JSON.stringify(ids.filter(id => id !== userId)));
}

export async function isFriend(userId: string): Promise<boolean> {
  const friends = await getFriends();
  return friends.some(f => f.id === userId);
}

export function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'abhi';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min pehle`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} ghante pehle`;
  return `${Math.floor(diff / 86400000)} din pehle`;
}

const USER_COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#C3A6FF', '#98D8C8', '#FF8B94', '#45B7D1', '#1DB954', '#F7DC6F'];
export function getRandomColor(): string {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}
