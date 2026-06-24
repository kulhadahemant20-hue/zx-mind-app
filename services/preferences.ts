import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFS_KEY = '@zxmind:user_preferences';
const PART2_KEY = '@zxmind:part2_requests';

export interface UserPreferences {
  favoriteCategories: string[];  // max 2 category IDs
  updatedAt?: string;
}

export interface Part2Request {
  id: string;
  categoryId: string;
  episodeTitle?: string;
  message: string;
  submittedAt: string;
}

export async function getUserPreferences(): Promise<UserPreferences> {
  try {
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : { favoriteCategories: [] };
  } catch { return { favoriteCategories: [] }; }
}

export async function saveUserPreferences(prefs: UserPreferences): Promise<void> {
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify({
    ...prefs,
    updatedAt: new Date().toISOString(),
  }));
}

export async function getPart2Requests(): Promise<Part2Request[]> {
  try {
    const raw = await AsyncStorage.getItem(PART2_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function submitPart2Request(req: Omit<Part2Request, 'id' | 'submittedAt'>): Promise<void> {
  const existing = await getPart2Requests();
  const newReq: Part2Request = {
    ...req,
    id: `req_${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };
  existing.push(newReq);
  await AsyncStorage.setItem(PART2_KEY, JSON.stringify(existing));
}
