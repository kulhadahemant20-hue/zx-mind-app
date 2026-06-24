import { Audio, AVPlaybackStatus } from 'expo-av';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { Episode } from '@/constants/mockData';

interface PlayerContextType {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  speed: number;
  play: (episode: Episode) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seek: (seconds: number) => void;
  skipForward: () => void;
  skipBackward: () => void;
  setSpeed: (speed: number) => void;
  setQueue: (episodes: Episode[]) => void;
  playNext: () => void;
  playPrev: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

function toDriveDirectUrl(url: string): string {
  const match = url.match(/\/file\/d\/([^/?]+)/);
  if (match) {
    const id = match[1];
    return `https://drive.usercontent.google.com/download?id=${id}&export=download&authuser=0&confirm=t`;
  }
  return url;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeedState] = useState(1);

  const soundRef = useRef<Audio.Sound | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speedRef = useRef(1);
  const episodeRef = useRef<Episode | null>(null);
  const usingAvRef = useRef(false);
  const queueRef = useRef<Episode[]>([]);
  const playRef = useRef<(ep: Episode) => Promise<void>>(() => Promise.resolve());

  speedRef.current = speed;
  episodeRef.current = currentEpisode;

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    intervalRef.current = setInterval(() => {
      setPosition(prev => {
        const ep = episodeRef.current;
        if (!ep) return prev;
        const next = prev + speedRef.current;
        if (next >= ep.duration) {
          stopTimer();
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    }, 1000);
  }, [stopTimer]);

  const unloadSound = useCallback(async () => {
    const snd = soundRef.current;
    if (snd) {
      soundRef.current = null;
      usingAvRef.current = false;
      try { await snd.unloadAsync(); } catch {}
    }
    stopTimer();
  }, [stopTimer]);

  useEffect(() => {
    return () => {
      unloadSound();
    };
  }, [unloadSound]);

  const play = useCallback(async (episode: Episode) => {
    await unloadSound();
    setCurrentEpisode(episode);
    setPosition(0);
    setIsPlaying(true);

    const url = episode.audioUrl;
    if (url && Platform.OS !== 'web') {
      try {
        const directUrl = toDriveDirectUrl(url);
        const { sound } = await Audio.Sound.createAsync(
          { uri: directUrl },
          { shouldPlay: true, rate: speedRef.current, volume: 1, isLooping: false },
          (status: AVPlaybackStatus) => {
            if (!status.isLoaded) return;
            const rawPos = status.positionMillis;
            const rawDur = status.durationMillis;
            const safePos = (typeof rawPos === 'number' && Number.isFinite(rawPos)) ? Math.floor(rawPos / 1000) : 0;
            const safeDur = (typeof rawDur === 'number' && Number.isFinite(rawDur) && rawDur > 0)
              ? Math.floor(rawDur / 1000)
              : episode.duration;
            setPosition(safePos);
            setDuration(safeDur);
            setIsPlaying(status.isPlaying ?? false);
            if (status.didJustFinish) {
              setIsPlaying(false);
              setPosition(0);
              const ep = episodeRef.current;
              if (ep) {
                const q = queueRef.current;
                const idx = q.findIndex(e => e.id === ep.id);
                if (idx !== -1 && idx < q.length - 1) {
                  setTimeout(() => playRef.current(q[idx + 1]), 800);
                }
              }
            }
          }
        );
        soundRef.current = sound;
        usingAvRef.current = true;
        await sound.setRateAsync(speedRef.current, true);
        return;
      } catch {
        usingAvRef.current = false;
      }
    }

    if (url && Platform.OS === 'web') {
      try {
        const directUrl = toDriveDirectUrl(url);
        const { sound } = await Audio.Sound.createAsync(
          { uri: directUrl },
          { shouldPlay: true, volume: 1, isLooping: false },
          (status: AVPlaybackStatus) => {
            if (!status.isLoaded) return;
            const rawPos = status.positionMillis;
            const rawDur = status.durationMillis;
            const safePos = (typeof rawPos === 'number' && Number.isFinite(rawPos)) ? Math.floor(rawPos / 1000) : 0;
            const safeDur = (typeof rawDur === 'number' && Number.isFinite(rawDur) && rawDur > 0)
              ? Math.floor(rawDur / 1000)
              : episode.duration;
            setPosition(safePos);
            setDuration(safeDur);
            setIsPlaying(status.isPlaying ?? false);
            if (status.didJustFinish) {
              setIsPlaying(false);
              setPosition(0);
              const ep = episodeRef.current;
              if (ep) {
                const q = queueRef.current;
                const idx = q.findIndex(e => e.id === ep.id);
                if (idx !== -1 && idx < q.length - 1) {
                  setTimeout(() => playRef.current(q[idx + 1]), 800);
                }
              }
            }
          }
        );
        soundRef.current = sound;
        usingAvRef.current = true;
        return;
      } catch {
        usingAvRef.current = false;
      }
    }

    setDuration(episode.duration);
    startTimer();
  }, [unloadSound, startTimer]);

  const pause = useCallback(async () => {
    setIsPlaying(false);
    if (usingAvRef.current && soundRef.current) {
      try { await soundRef.current.pauseAsync(); } catch {}
    } else {
      stopTimer();
    }
  }, [stopTimer]);

  const resume = useCallback(async () => {
    setIsPlaying(true);
    if (usingAvRef.current && soundRef.current) {
      try { await soundRef.current.playAsync(); } catch {}
    } else {
      startTimer();
    }
  }, [startTimer]);

  const stop = useCallback(async () => {
    await unloadSound();
    setIsPlaying(false);
    setPosition(0);
    setCurrentEpisode(null);
  }, [unloadSound]);

  const seek = useCallback(async (seconds: number) => {
    const ep = episodeRef.current;
    if (!ep) return;
    const dur = duration || ep.duration;
    const clamped = Math.max(0, Math.min(seconds, dur));
    setPosition(clamped);
    if (usingAvRef.current && soundRef.current) {
      try { await soundRef.current.setPositionAsync(clamped * 1000); } catch {}
    }
  }, [duration]);

  const skipForward = useCallback(() => {
    setPosition(prev => {
      const dur = duration || (episodeRef.current?.duration ?? 0);
      const next = Math.min(prev + 10, dur);
      if (usingAvRef.current && soundRef.current) {
        soundRef.current.setPositionAsync(next * 1000).catch(() => {});
      }
      return next;
    });
  }, [duration]);

  const skipBackward = useCallback(() => {
    setPosition(prev => {
      const next = Math.max(prev - 10, 0);
      if (usingAvRef.current && soundRef.current) {
        soundRef.current.setPositionAsync(next * 1000).catch(() => {});
      }
      return next;
    });
  }, []);

  const setSpeed = useCallback(async (s: number) => {
    setSpeedState(s);
    speedRef.current = s;
    if (usingAvRef.current && soundRef.current) {
      try { await soundRef.current.setRateAsync(s, true); } catch {}
    }
  }, []);

  const setQueue = useCallback((episodes: Episode[]) => {
    queueRef.current = episodes;
  }, []);

  const playNext = useCallback(() => {
    const ep = episodeRef.current;
    if (!ep) return;
    const q = queueRef.current;
    const idx = q.findIndex(e => e.id === ep.id);
    if (idx !== -1 && idx < q.length - 1) playRef.current(q[idx + 1]);
  }, []);

  const playPrev = useCallback(() => {
    const ep = episodeRef.current;
    if (!ep) return;
    const q = queueRef.current;
    const idx = q.findIndex(e => e.id === ep.id);
    if (idx > 0) playRef.current(q[idx - 1]);
  }, []);

  playRef.current = play;

  return (
    <PlayerContext.Provider value={{
      currentEpisode, isPlaying, position, duration, speed,
      play, pause, resume, stop, seek, skipForward, skipBackward, setSpeed,
      setQueue, playNext, playPrev,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be inside PlayerProvider');
  return ctx;
}
