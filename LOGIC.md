# ZX Mind — App Logic Documentation

## Architecture Overview

ZX Mind ek Hindi/English self-improvement audio app hai jo Expo (React Native) pe bani hai.

```
artifacts/zx-mind/
├── app/                    # Expo Router screens
│   ├── (auth)/             # Login, Register, Forgot Password
│   ├── (tabs)/             # Main 4 tabs: Home, Search, Library, Profile
│   ├── category/[id].tsx   # Category episode list
│   ├── player.tsx          # Full-screen audio player
│   ├── subscription.tsx    # Premium plans screen
│   └── settings/           # 7 settings pages
├── components/             # Reusable UI components
├── constants/mockData.ts   # All episode + category data
├── context/
│   ├── AuthContext.tsx     # User login/logout state
│   └── PlayerContext.tsx   # Audio playback engine
└── services/storage.ts     # AsyncStorage (favorites, history)
```

---

## PlayerContext — Audio Engine

**File:** `context/PlayerContext.tsx`

### How Audio Plays

1. User calls `play(episode)` → `unloadSound()` se pehla sound band hota hai
2. Agar `episode.audioUrl` hai:
   - Google Drive URL → `toDriveDirectUrl()` se direct download URL banta hai
   - `Audio.Sound.createAsync()` se audio load hoti hai (expo-av)
   - Status callback se real-time position + duration milti hai
3. Agar `audioUrl` nahi hai → timer fallback (1 second interval, fake progress)

### Google Drive URL Conversion

```
Input:  https://drive.google.com/file/d/FILE_ID/view?usp=drivesdk
Output: https://drive.usercontent.google.com/download?id=FILE_ID&export=download&authuser=0&confirm=t
```

`drive.usercontent.google.com` use karte hain kyunki `drive.google.com/uc` confirmation page serve karta hai mobile pe.

### Auto-Play Next Episode

- `queueRef` — category ke saare episodes ka array (ref, re-render nahi karti)
- `playRef` — latest `play` function ka ref (circular dependency avoid karta hai)
- Jab episode khatam hota hai (`didJustFinish`): queue mein current episode ka index dhundha jaata hai, next episode 800ms baad play hota hai
- Queue set karne ke liye: category screen pe `setQueue(episodes)` call karo episode play karne se pehle

### Context Interface

| Function | Description |
|---|---|
| `play(episode)` | Episode shuru karo |
| `pause()` | Pause karo |
| `resume()` | Dobara shuru karo |
| `stop()` | Band karo + reset |
| `seek(seconds)` | Position set karo |
| `skipForward()` | +10 seconds |
| `skipBackward()` | -10 seconds |
| `setSpeed(n)` | Playback speed (1, 1.25, 1.5, 2x) |
| `setQueue(episodes)` | Category queue set karo |
| `playNext()` | Queue mein agle episode pe jao |
| `playPrev()` | Queue mein pichle episode pe jao |

---

## AuthContext — User State

**File:** `context/AuthContext.tsx`

- Mock authentication (AsyncStorage mein user save hota hai)
- `user.isPremium` se premium content ka access control hota hai
- Login/Register/Logout functions

---

## Data Layer

**File:** `constants/mockData.ts`

### Categories (12 total)
Confidence, Communication, Discipline, Stress Relief, Career, Legends, Pyaar Dard Aur Jeet, Success Stories, Relationships, Money, Decision Making, Self Growth

### Episodes
- Confidence category: 5 real episodes with Google Drive audio URLs (c1–c5)
- Baaki categories: placeholder episodes (timer fallback)
- `isPremium: true` wale episodes subscription ke peeche lock hain

### Cover Images (5)
`confidence`, `communication`, `discipline`, `stress`, `career` — `assets/images/` mein stored

---

## Storage Service

**File:** `services/storage.ts` (AsyncStorage)

| Key | Data |
|---|---|
| `zx_favorites` | Favorite episode IDs array |
| `zx_history` | Recently played episode IDs array |

---

## Navigation Flow

```
App Start
  └── (auth)/login       ← agar user nahi hai
        ↓ login success
  └── (tabs)/            ← main app
        ├── index         Home screen
        ├── search        Categories + search
        ├── library       Favorites + history
        └── profile       Settings + account
              ↓ episode tap
        category/[id]     Episode list
              ↓ play
        player            Full-screen player (modal)
```

---

## Settings Pages (7)

| Screen | Route |
|---|---|
| Notifications | `settings/notifications` |
| Current Plan | `settings/plan` |
| Payment History | `settings/payment-history` |
| Privacy Policy | `settings/privacy` |
| Help & FAQ | `settings/help` |
| Send Feedback | `settings/feedback` |
| About ZX Mind | `settings/about` |

---

## Font Loading

`_layout.tsx` mein `useFonts()` se yeh fonts load hoti hain app render se pehle:
- `Feather` (from `@expo/vector-icons`) — saare icons
- `Inter_400Regular`, `Inter_600SemiBold`, `Inter_700Bold` — text fonts

`if (!fontsLoaded) return null;` — fonts load hone tak blank screen dikhti hai, broken boxes nahi.

---

## Icon System

Saare icons `@expo/vector-icons` ke `Feather` set se hain.
Category icons: `star`, `message-circle`, `target`, `heart`, `briefcase`, `zap`, `sun`, `award`, `users`, `dollar-sign`, `compass`, `trending-up`

---

## Play Store Compliance

- No fake payment processing — premium is "Coming Soon"
- Real account deletion option in profile
- Privacy policy screen present
- No misleading subscription claims
- Content in Hindi/English (target market: India)
