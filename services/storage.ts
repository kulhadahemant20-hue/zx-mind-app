import AsyncStorage from '@react-native-async-storage/async-storage';
import { Episode } from '@/constants/mockData';

const FAVORITES_KEY = '@zxmind:favorites';
const HISTORY_KEY = '@zxmind:history';
const PROGRESS_KEY = '@zxmind:progress';

export async function getFavorites(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export async function isFavorite(episodeId: string): Promise<boolean> {
  const favs = await getFavorites();
  return favs.includes(episodeId);
}

export async function toggleFavorite(episodeId: string): Promise<boolean> {
  const favs = await getFavorites();
  const idx = favs.indexOf(episodeId);
  if (idx >= 0) {
    favs.splice(idx, 1);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    return false;
  } else {
    favs.unshift(episodeId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    return true;
  }
}

export async function getHistory(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export async function addToHistory(episodeId: string): Promise<void> {
  const history = await getHistory();
  const filtered = history.filter(id => id !== episodeId);
  filtered.unshift(episodeId);
  const trimmed = filtered.slice(0, 50);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

export async function saveProgress(episodeId: string, position: number): Promise<void> {
  try {
    const data = await AsyncStorage.getItem(PROGRESS_KEY);
    const progress: Record<string, number> = data ? JSON.parse(data) : {};
    progress[episodeId] = position;
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {}
}

export async function getProgress(episodeId: string): Promise<number> {
  try {
    const data = await AsyncStorage.getItem(PROGRESS_KEY);
    const progress: Record<string, number> = data ? JSON.parse(data) : {};
    return progress[episodeId] ?? 0;
  } catch { return 0; }
}

export function filterEpisodes(episodes: Episode[], ids: string[]): Episode[] {
  const idSet = new Set(ids);
  return ids
    .map(id => episodes.find(e => e.id === id))
    .filter((e): e is Episode => !!e && idSet.has(e.id));
}
