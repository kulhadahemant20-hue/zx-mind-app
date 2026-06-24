import AsyncStorage from '@react-native-async-storage/async-storage';

const STREAK_KEY = '@zxmind:streak_days';
const SESSION_KEY = '@zxmind:session_today';
const REWARDS_KEY = '@zxmind:claimed_rewards';

export interface DayRecord {
  date: string;   // 'YYYY-MM-DD'
  minutes: number;
}

export interface RewardClaimed {
  tier: 1 | 2;
  gift: string;
  claimedAt: string;
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export async function getDayRecords(): Promise<DayRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(STREAK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function recordSessionMinutes(minutes: number): Promise<void> {
  try {
    const today = todayStr();
    const records = await getDayRecords();
    const existing = records.find(r => r.date === today);
    if (existing) {
      existing.minutes += minutes;
    } else {
      records.push({ date: today, minutes });
    }
    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(records));
  } catch {}
}

export async function getQualifyingDays(): Promise<number> {
  const records = await getDayRecords();
  return records.filter(r => r.minutes >= 5).length;
}

export async function getCurrentStreak(): Promise<number> {
  const records = await getDayRecords();
  const qualDates = new Set(
    records.filter(r => r.minutes >= 5).map(r => r.date)
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const s = d.toISOString().split('T')[0];
    if (qualDates.has(s)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

export async function getClaimedRewards(): Promise<RewardClaimed[]> {
  try {
    const raw = await AsyncStorage.getItem(REWARDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function claimReward(tier: 1 | 2): Promise<RewardClaimed> {
  const tier1Gifts = [
    'ZX Mind Scented Candle 🕯️',
    'ZX Mind Sipper Bottle 💧',
    'ZX Mind Premium Pen 🖊️',
    'ZX Mind Sticker Pack 🎯',
    'ZX Mind Keychain 🗝️',
    'ZX Mind Udi (Incense) 🪷',
  ];
  const tier2Gifts = [
    'ZX Mind T-Shirt 👕',
    'ZX Mind Hoodie 🧥',
    'ZX Mind Backpack 🎒',
    'ZX Mind Cap 🧢',
    'ZX Mind Tote Bag 👜',
    'ZX Mind Notebook + Pen Set 📒',
  ];
  const pool = tier === 1 ? tier1Gifts : tier2Gifts;
  const gift = pool[Math.floor(Math.random() * pool.length)];
  const claimed: RewardClaimed = { tier, gift, claimedAt: new Date().toISOString() };
  const existing = await getClaimedRewards();
  existing.push(claimed);
  await AsyncStorage.setItem(REWARDS_KEY, JSON.stringify(existing));
  return claimed;
}

export async function getSessionStart(): Promise<number | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (obj.date !== todayStr()) return null;
    return obj.startTime;
  } catch { return null; }
}

export async function startSession(): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({
    date: todayStr(),
    startTime: Date.now(),
  }));
}

export async function endSession(): Promise<void> {
  try {
    const start = await getSessionStart();
    if (!start) return;
    const minutes = Math.floor((Date.now() - start) / 60000);
    if (minutes > 0) await recordSessionMinutes(minutes);
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch {}
}
