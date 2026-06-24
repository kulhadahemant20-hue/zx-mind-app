# ZX Mind 🧠🎧

> *Apni zindagi khud likho — Hindi/Urdu motivational audio app*

ZX Mind ek premium audio app hai jo Hindi aur Urdu mein motivational, self-growth, aur life-changing episodes deliver karta hai. Spotify jaisi clean design ke saath, ek poori community bhi hai jahan users ek doosre se inspire ho sakte hain.

---

## 📱 App Features

### 🎵 Audio Player
- **Premium audio episodes** — Google Drive hosted, high quality
- **6 active categories** — Confidence, Money, Discipline, Apne Aap Ko Pehchano, Success Stories, Legends
- **Spotify-style home screen** — 2-column category grid, bade audio cards, trending badges
- **Playback controls** — Play/Pause, 10-sec skip, speed control (1x, 1.25x, 1.5x, 2x)
- **Progress saving** — jo suna tha wahan se shuru karo
- **Favorites & History** — apne pasandida episodes save karo

### 💬 ZX Chat (Community)
- **Category-based rooms** — har topic ka ek dedicated chat room
- **Live community feel** — real users ki tarah messages aate hain
- **Friend system** — dusre members ko friend add karo
- **Family jaisi vibe** — ek doosre ko motivate karo, share karo

### 📝 Comments (Episode ke niche)
- **YouTube-jaisi comment section** — har audio episode ke niche
- **Like system** — sabse helpful comments upar aate hain
- **Apna naam customize karo** — personalized profile

### 🎁 Loyalty Rewards
- **Daily session tracking** — app open karke 5+ minute suno
- **90-Day Milestone** → ZX Mind branded gift (Bottle, Udi, Pen, Candle...)
- **180-Day Milestone** → Premium gift (T-Shirt, Hoodie, Bag, Cap...)
- **Activity calendar** — pichle 30 din ka heatmap

### ❤️ Preferences & Part 2 Requests
- **Favorite categories chunao** — 2 max, home screen personalize hota hai
- **Part 2 request** — batao kaun sa episode ka sequel chahiye

### 📢 Advertisements
- **Google AdMob ready** — placeholder IDs ke saath setup complete
- **Simulated test ads** — Expo Go preview mein kaam karte hain (rotate every 8 sec)
- **Real ads activate karna** — `AdBanner.tsx` mein sirf apni publisher ID daalo aur `IS_LIVE: true` karo

---

## 🗂️ App Structure

```
artifacts/zx-mind/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        ← Home screen (Spotify-style)
│   │   ├── chat.tsx         ← ZX Chat community
│   │   ├── search.tsx       ← Search episodes
│   │   ├── library.tsx      ← Favorites & history
│   │   └── profile.tsx      ← User profile
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── player.tsx           ← Full audio player + comments
│   ├── chat-room/[id].tsx   ← Individual chat room
│   ├── category/[id].tsx    ← Category episodes list
│   ├── preferences.tsx      ← Category preferences + Part 2 request
│   ├── rewards.tsx          ← Loyalty rewards & streaks
│   └── subscription.tsx
├── components/
│   ├── AdBanner.tsx         ← Google AdMob integration
│   ├── CommentSection.tsx   ← YouTube-style comments
│   ├── AudioCard.tsx        ← Episode card (Spotify-sized)
│   ├── MiniPlayer.tsx       ← Bottom mini player
│   └── ...
├── services/
│   ├── streak.ts            ← Daily session tracking
│   ├── preferences.ts       ← User preferences
│   ├── chat.ts              ← Community chat
│   ├── comments.ts          ← Episode comments
│   └── storage.ts           ← Favorites, history, progress
└── constants/
    └── mockData.ts          ← All categories & episodes (Google Drive audio)
```

---

## 🎙️ Categories

| Category | Color | Status |
|----------|-------|--------|
| Confidence | 🔴 #FF6B6B | ✅ Active |
| Apne Aap Ko Pehchano | 🩷 #FF8B94 | ✅ Active |
| Money | 🩵 #98D8C8 | ✅ Active |
| Discipline | 💛 #FFE66D | ✅ Active |
| Success Stories | 🌟 #F7DC6F | ✅ Active |
| Legends Behind The Success | 💜 #C3A6FF | ✅ Active |
| Communication | 🩵 #4ECDC4 | 🔜 Coming Soon |
| Stress Relief | 🟢 #A8E6CF | 🔜 Coming Soon |
| Career | 🔵 #45B7D1 | 🔜 Coming Soon |
| Relationships | 🩷 #FF8B94 | 🔜 Coming Soon |
| Decision Making | 💛 #F7DC6F | 🔜 Coming Soon |
| Self Growth | 🟢 #1DB954 | 🔜 Coming Soon |

---

## 💰 Google AdMob Setup

Jab AdMob publisher account ready ho:

1. Install karo: `pnpm add react-native-google-mobile-ads`
2. `app.json` mein apna App ID daalo:
   ```json
   "react-native-google-mobile-ads": {
     "android_app_id": "ca-app-pub-XXXXXXXX~XXXXXXXX",
     "ios_app_id": "ca-app-pub-XXXXXXXX~XXXXXXXX"
   }
   ```
3. `components/AdBanner.tsx` mein `ADMOB_CONFIG` update karo:
   ```ts
   ANDROID_APP_ID: 'ca-app-pub-YOURPUBLISHERID~APPID',
   BANNER_ANDROID: 'ca-app-pub-YOURPUBLISHERID/UNITID',
   IS_LIVE: true,
   ```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo (React Native) |
| Navigation | Expo Router (file-based) |
| Audio | expo-av |
| Storage | AsyncStorage |
| UI | React Native + Feather Icons |
| Animations | Animated API + expo-haptics |
| Fonts | Inter (Google Fonts) |
| Auth | Custom AuthContext |

---

## 🚀 Run Kaise Karein

```bash
# Install dependencies
pnpm install

# Start Expo
pnpm --filter @workspace/zx-mind run dev

# Expo Go app se QR scan karo (Android/iOS)
```

---

## 🏆 Reward System Logic

```
Har din app open karo → 5+ min suno → Qualifying day ✅

90 Qualifying Days  → Tier 1 Gift (ZX Mind branded goodies)
180 Qualifying Days → Tier 2 Gift (Premium apparel & accessories)

Gifts are RANDOM from curated pool — kisi ko bhi kuch bhi mil sakta hai!
```

---

## 📞 Contact

ZX Mind by the ZX Mind Team 🇮🇳  
For Part 2 requests, feedback, and reward claims — app ke andar hi karo!

---

*"Apni zindagi khud likho."* ✍️
