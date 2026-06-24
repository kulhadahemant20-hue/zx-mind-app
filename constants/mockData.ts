export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  tagline?: string;
  comingSoon?: boolean;
}

export interface Episode {
  id: string;
  title: string;
  creator: string;
  categoryId: string;
  duration: number;
  isPremium: boolean;
  coverKey: string;
  playCount: number;
  description: string;
  trending?: boolean;
  isNew?: boolean;
  audioUrl?: string;
}

export const COVER_IMAGES: Record<string, any> = {
  confidence: require('../assets/images/confidence.png'),
  communication: require('../assets/images/communication.png'),
  discipline: require('../assets/images/discipline.png'),
  stress: require('../assets/images/stress.png'),
  career: require('../assets/images/career.png'),
};

export function getCoverImage(key: string): any {
  return COVER_IMAGES[key] ?? COVER_IMAGES['confidence'];
}

function driveUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

export const CATEGORIES: Category[] = [
  { id: 'confidence', name: 'Confidence', icon: 'star', color: '#FF6B6B', tagline: 'Apne aap par yakeen karo.' },
  { id: 'heartgrowth', name: 'Apne Aap Ko Pehchano', icon: 'sun', color: '#FF8B94', tagline: 'Apni asli pehchaan dhundho.' },
  { id: 'money', name: 'Money', icon: 'dollar-sign', color: '#98D8C8', tagline: 'Paise ki asli duniya samjho.' },
  { id: 'discipline', name: 'Discipline', icon: 'target', color: '#FFE66D', tagline: 'Roz thoda behtar bano.' },
  { id: 'success', name: 'Success Stories', icon: 'award', color: '#F7DC6F', tagline: 'Unki kahaniyan, teri prerna.' },
  { id: 'legends', name: 'Legends Behind The Success', icon: 'zap', color: '#C3A6FF', tagline: 'Safalta ke peeche chhupi asli kahani.' },
  { id: 'communication', name: 'Communication', icon: 'message-circle', color: '#4ECDC4', comingSoon: true },
  { id: 'stress', name: 'Stress Relief', icon: 'heart', color: '#A8E6CF', comingSoon: true },
  { id: 'career', name: 'Career', icon: 'briefcase', color: '#45B7D1', comingSoon: true },
  { id: 'relationships', name: 'Relationships', icon: 'users', color: '#FF8B94', comingSoon: true },
  { id: 'decision', name: 'Decision Making', icon: 'compass', color: '#F7DC6F', comingSoon: true },
  { id: 'selfgrowth', name: 'Self Growth', icon: 'trending-up', color: '#1DB954', comingSoon: true },
];

export const EPISODES: Episode[] = [
  // ── Confidence ──────────────────────────────────────────────────────────────
  { id: 'c1', title: 'The Confidence Trap (Aapka Sabse Bada Dhokha)', creator: 'ZX Mind', categoryId: 'confidence', duration: 600, isPremium: false, coverKey: 'confidence', playCount: 45230, description: 'Aapka sabse bada dhokha khud aap hi hain. Is episode mein jaano ki confidence trap kya hai aur isse kaise bacho. Ek powerful reality check jo aapki zindagi badal dega.', trending: true, audioUrl: driveUrl('1-0bXPiKCCegbuDvUQ2dBy4lGwPLfOb0N') },
  { id: 'c2', title: 'The Hardware Hack (Apne Dimaag Ko Bewakoof Banao)', creator: 'ZX Mind', categoryId: 'confidence', duration: 600, isPremium: false, coverKey: 'confidence', playCount: 38100, description: 'Aapka dimaag ek machine hai — aur har machine ko hack kiya ja sakta hai. Is episode mein seekho apne khud ke brain ko kaise reprogram karo confidence ke liye.', isNew: true, audioUrl: driveUrl('1-0ubfyF498z_xzg42v3ZtQuWZob6EjMQ') },
  { id: 'c3', title: 'Status Levelling (Ameer Aur Powerful Logo Ka Dimaag Padho)', creator: 'ZX Mind', categoryId: 'confidence', duration: 600, isPremium: false, coverKey: 'confidence', playCount: 29800, description: 'Ameer aur powerful log alag tarah sochte hain. Is episode mein unke mindset aur confidence ke raaz kholo — aur unhe apni zindagi mein apply karo.', audioUrl: driveUrl('1-1Jcy2-Wp-1OS5EAYT13ituGBEkmPv7S') },
  { id: 'c4', title: 'The Power of Silence (Beizzati Ko Apna Hathiyar Banao)', creator: 'ZX Mind', categoryId: 'confidence', duration: 600, isPremium: false, coverKey: 'confidence', playCount: 52100, description: 'Silence sabse bada jawab hai. Jab koi aapko neeche dikhaye, tab chup rehna aur kaam karna hi sabse bada badla hai. Is episode mein sikho beizzati ko fuel kaise banate hain.', trending: true, audioUrl: driveUrl('1-20cCal97REbjUvlZEweAAObPH8ESYe6') },
  { id: 'c5', title: 'The Final Boss (Apne Sabse Bade Dushman Ko Harao)', creator: 'ZX Mind', categoryId: 'confidence', duration: 600, isPremium: false, coverKey: 'confidence', playCount: 41700, description: 'Aapka sabse bada dushman koi aur nahi — aap khud hain. Apni limitations, fears, aur self-doubt ko defeat karo. Ye episode hai un sab ke liye jo truly unbeatable banna chahte hain.', isNew: true, audioUrl: driveUrl('1-3WtosTMEBukKi2tM8RdHiOHSZTVOj2D') },

  // ── Apne Aap Ko Pehchano ─────────────────────────────────────────────────────
  { id: 'ap1', title: 'Tum Asal Mein Kaun Ho? (The Hidden Face)', creator: 'ZX Mind', categoryId: 'heartgrowth', duration: 720, isPremium: false, coverKey: 'stress', playCount: 89400, description: 'Duniya ko jo face dikhate ho, woh tum nahi ho. Apni asli identity dhundho — woh chehra jo sirf tum jaante ho. Ek powerful journey apni pehchaan ki taraf.', trending: true, isNew: true, audioUrl: driveUrl('1-hh5FZ61V8B6oJXHNWw749zwNDTQ2oDz') },
  { id: 'ap2', title: 'Dimaag Ki Battery Drain (Overthinking Ka Jal)', creator: 'ZX Mind', categoryId: 'heartgrowth', duration: 900, isPremium: false, coverKey: 'confidence', playCount: 74300, description: 'Zyaada sochna khatam karo. Overthinking ek trap hai — is episode mein jaano kaise apne dimaag ki energy ko sahi jagah lagao aur peaceful bano.', audioUrl: driveUrl('1-ud7wXPlPWNuOplLWA_4yaMDYKull7Pb') },
  { id: 'ap3', title: 'Matrix Ke Bahar (Log Kya Kahenge?)', creator: 'ZX Mind', categoryId: 'heartgrowth', duration: 840, isPremium: false, coverKey: 'discipline', playCount: 61200, description: '"Log kya kahenge" — ye ek jail hai. Is episode mein seekho dusron ki raaye se azaad kaise ho aur apni zindagi apni marzi se jiyo.', isNew: true, audioUrl: driveUrl('1-xCOd5Gci5y2WB9xsikCL6y_yeBN-TeG') },
  { id: 'ap4', title: 'Apni Dark Side Ko Pehchano (Aakhiri Mulaqat)', creator: 'ZX Mind', categoryId: 'heartgrowth', duration: 660, isPremium: false, coverKey: 'career', playCount: 53800, description: 'Har insaan mein ek dark side hoti hai. Use ignore karne se kuch nahi hoga — use pehchano, samjho, aur apni strength bana lo. Ye hai tumhari aakhiri asli mulaqat.', audioUrl: driveUrl('1-xXCm58G2k4iXYbzsAPK8y1FX5F-KxEv') },

  // ── Money ──────────────────────────────────────────────────────────────────
  { id: 'mn1', title: 'Middle-Class Trap (Paise Bachane Ka Jhooth)', creator: 'ZX Mind', categoryId: 'money', duration: 720, isPremium: false, coverKey: 'career', playCount: 71200, description: 'Paise bachana hi kaafi nahi — yeh soch hi tumhe middle-class mein rokti hai. Is episode mein jaano ki ameer log alag kya sochte hain paise ke baare mein.', trending: true, isNew: true, audioUrl: driveUrl('10CeZkhpnfzRtFdtwk7o3zSvS-KNhBae0') },
  { id: 'mn2', title: 'The Arbitrage Secret (Time Aur Paise Ka Dhokha)', creator: 'ZX Mind', categoryId: 'money', duration: 900, isPremium: false, coverKey: 'discipline', playCount: 63800, description: 'Time aur paise ka asli rishta kya hai? Arbitrage ka secret jaano aur samjho kaise smart log kam kaam mein zyaada kamaa lete hain.', audioUrl: driveUrl('10F1oFr1J8AWbaqj-UFyHyklTmykHUZPG') },
  { id: 'mn3', title: 'Risk Ka Asli Game (Market Ki Hidden Reality)', creator: 'ZX Mind', categoryId: 'money', duration: 1080, isPremium: false, coverKey: 'confidence', playCount: 48200, description: 'Risk lene se nahi, risk samajhne se fark padta hai. Market ki hidden reality aur risk ka asli game samjho is powerful episode mein.', audioUrl: driveUrl('10Fux5abTyVm8mXr05fWN4Hbh2JSbpADo') },
  { id: 'mn4', title: 'The Ultimate Currency (Paise Se Power Tak)', creator: 'ZX Mind', categoryId: 'money', duration: 840, isPremium: false, coverKey: 'career', playCount: 42500, description: 'Paise ek zariya hain, manzil nahi. Asli power kya hai aur paise se us power tak kaise pahuncho — is episode mein milega complete blueprint.', isNew: true, audioUrl: driveUrl('10GMR072z2DtmMLqknRWRIPWzZXNXgSc9') },

  // ── Discipline ──────────────────────────────────────────────────────────────
  { id: 'd1', title: 'Subah Ka Sabse Bada Jhooth (5 AM Club Ka Dhokha)', creator: 'ZX Mind', categoryId: 'discipline', duration: 900, isPremium: false, coverKey: 'discipline', playCount: 67800, description: '5 AM uthna solution nahi hai. Is episode mein jaano ki morning routine ka asli game kya hai aur kaise apni zindagi ke liye ek system banao jo actually kaam kare.', trending: true, isNew: true, audioUrl: driveUrl('10R_stXulbP_1JXJpY9Qd2jykpnkaqTrt') },
  { id: 'd2', title: 'Aalas Nahi, Ye Tumhara Darr Hai (Matrix of Procrastination)', creator: 'ZX Mind', categoryId: 'discipline', duration: 600, isPremium: false, coverKey: 'confidence', playCount: 54300, description: 'Tum lazy nahi ho — tum darte ho. Procrastination ke peeche ka asli psychology jaano aur ise hamesha ke liye band karo.', audioUrl: driveUrl('10a1_RnikPEczJdes3d1Vsu886G63Sql4') },
  { id: 'd3', title: '21 Din Ka Scam (Identity Hack)', creator: 'ZX Mind', categoryId: 'discipline', duration: 1200, isPremium: false, coverKey: 'discipline', playCount: 43100, description: '"21 din mein aadat banti hai" — yeh ek jhooth hai. Asli science kya kehti hai aur kaise apni identity ko hack karke permanent change laao.', audioUrl: driveUrl('10fY2zYecMO4NCuDWu7cdHWpRCeksBwMo') },
  { id: 'd4', title: 'Saste Dopamine Ka Jaal (Asli Chhoti Jeet)', creator: 'ZX Mind', categoryId: 'discipline', duration: 720, isPremium: false, coverKey: 'stress', playCount: 31200, description: 'Phone, social media, junk food — sab saste dopamine hain. Inse bachne ka aur asli chhoti jeeton se bade goals tak pahunchne ka formula jaano.', isNew: true, audioUrl: driveUrl('10oblfPr6xuTBWKIXpJM_STT_WimNqvAQ') },

  // ── Success Stories ──────────────────────────────────────────────────────────
  { id: 'su1', title: 'Ratan Tata – The Unbreakable Ethics (Duniya Ke Khilaaf Imaandari)', creator: 'ZX Mind', categoryId: 'success', duration: 1200, isPremium: false, coverKey: 'confidence', playCount: 112400, description: 'Jab poori duniya shortcuts le rahi thi, Ratan Tata ne imaandari ka raasta chuna. Ek aisi kahani jo batati hai ki asli success ethics ke bina nahi milti.', trending: true, isNew: true, audioUrl: driveUrl('11B8CIoGjBWFYkfqH1jmG2UFCwA01nH2W') },
  { id: 'su2', title: 'APJ Abdul Kalam – The Psychology of Failure (Kaamyabi Se Pehle Ka Andhera)', creator: 'ZX Mind', categoryId: 'success', duration: 900, isPremium: false, coverKey: 'confidence', playCount: 98700, description: 'Kalam sahab ne kitni baar haar maani? Kabhi nahi. Is episode mein unka failure psychology jaano — aur samjho ki andhera hamesha savere se pehle aata hai.', audioUrl: driveUrl('11BwSeQ_0ihJMsbqvRf11PWPv4bXHEr3h') },
  { id: 'su3', title: 'Dhirubhai Ambani – The Visionary Hustle (Zero Se Hero Tak)', creator: 'ZX Mind', categoryId: 'success', duration: 1500, isPremium: false, coverKey: 'confidence', playCount: 87300, description: 'Gas station attendant se India ke sabse ameer aadmi tak. Dhirubhai ka vision aur hustle — yeh sirf motivation nahi, yeh ek complete mindset manual hai.', audioUrl: driveUrl('11DasBTWrN9c4_qdqHGOP-dHZWqlxQJ0e') },
  { id: 'su4', title: 'The Legend Mindset (Aapka Asli Safar)', creator: 'ZX Mind', categoryId: 'success', duration: 780, isPremium: false, coverKey: 'discipline', playCount: 71500, description: 'Legends alag planet se nahi aate — woh same struggles face karte hain jo tum karte ho. Is episode mein jaano legend mindset kya hota hai aur apna safar kaise shuru karo.', isNew: true, audioUrl: driveUrl('11Dlw48UOj2Brz3IC0fKl7EId1mmooWVo') },

  // ── Legends Behind The Success ───────────────────────────────────────────────
  { id: 'leg1', title: 'Ek Chai Bechne Wale Ki Kahani (Market Psychology Ka Asli Master)', creator: 'ZX Mind', categoryId: 'legends', duration: 1200, isPremium: false, coverKey: 'career', playCount: 134200, description: 'Woh chai bechta tha — lekin uska dimaag market psychology ka master tha. Footpath se business empire tak ka safar. Struggle, patience, aur ek sapne ki takat ki asli kahani.', trending: true, isNew: true, audioUrl: driveUrl('1105qwHDVkX8VJapA9hmrA95-RNU9BcAk') },
  { id: 'leg2', title: 'School Dropout Se Millionaire Tak (The Survival Instinct)', creator: 'ZX Mind', categoryId: 'legends', duration: 1500, isPremium: false, coverKey: 'discipline', playCount: 98700, description: 'Padhai chhodni padi — paisa nahi tha, network nahi tha. Lekin survival instinct tha. Is dropout ki kahani sunke samjhoge ki degree nahi, mindset kaam aata hai.', audioUrl: driveUrl('111DYDXk9d_rhB2dSajW7tOIXTJeFb-z_') },
  { id: 'leg3', title: '100 Baar Reject Hone Ke Baad Success (The Data Collection Strategy)', creator: 'ZX Mind', categoryId: 'legends', duration: 1080, isPremium: false, coverKey: 'confidence', playCount: 87300, description: 'Har rejection ek data point tha unke liye. 100 baar "na" sunke bhi nahi ruke — kyunki woh jaante the ki yeh data collection hai, defeat nahi. Is episode mein yeh strategy seekho.', trending: true, audioUrl: driveUrl('114doWVOH5HQiPiOy5qbTcgz39_PACEW4') },
  { id: 'leg4', title: 'Jab Sabne Mana Kiya, Tab Usne Shuru Kiya (The Crab Mentality)', creator: 'ZX Mind', categoryId: 'legends', duration: 900, isPremium: false, coverKey: 'communication', playCount: 71500, description: 'Ghar wale naraaz the, dost hanse, society ne rokne ki koshish ki. Crab mentality kya hoti hai aur us insaan ne ise kaise overcome kiya — ek lesson jo aapko bhi chahiye.', isNew: true, audioUrl: driveUrl('115TrS-SLm1l5n2BiUaxNLLZdL9UM4Xf0') },
];

export const TRENDING_EPISODES = EPISODES.filter(e => e.trending).slice(0, 8);
export const NEW_EPISODES = EPISODES.filter(e => e.isNew).slice(0, 8);
export const PREMIUM_EPISODES = EPISODES.filter(e => e.isPremium).slice(0, 8);

export function filterEpisodes(all: Episode[], ids: string[]): Episode[] {
  const set = new Set(ids);
  return all.filter(e => set.has(e.id));
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const totalSec = Math.floor(seconds);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return `${h}h ${rm}m`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatPlayCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}
