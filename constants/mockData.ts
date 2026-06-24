export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  tagline?: string;
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

export const CATEGORIES: Category[] = [
  { id: 'confidence', name: 'Confidence', icon: 'star', color: '#FF6B6B' },
  { id: 'communication', name: 'Communication', icon: 'message-circle', color: '#4ECDC4' },
  { id: 'discipline', name: 'Discipline', icon: 'target', color: '#FFE66D' },
  { id: 'stress', name: 'Stress Relief', icon: 'heart', color: '#A8E6CF' },
  { id: 'career', name: 'Career', icon: 'briefcase', color: '#45B7D1' },
  { id: 'legends', name: 'Legends Behind The Success', icon: 'zap', color: '#F7DC6F', tagline: 'Safalta ke peeche chhupi asli kahani.' },
  { id: 'heartgrowth', name: 'Pyaar, Dard Aur Jeet', icon: 'sun', color: '#FF8B94', tagline: 'Dard se dil tak, haar se jeet tak.' },
  { id: 'success', name: 'Success Stories', icon: 'award', color: '#F7DC6F' },
  { id: 'relationships', name: 'Relationships', icon: 'users', color: '#FF8B94' },
  { id: 'money', name: 'Money', icon: 'dollar-sign', color: '#98D8C8' },
  { id: 'decision', name: 'Decision Making', icon: 'compass', color: '#C3A6FF' },
  { id: 'selfgrowth', name: 'Self Growth', icon: 'trending-up', color: '#1DB954' },
];

export const EPISODES: Episode[] = [
  // Confidence
  { id: 'c1', title: 'The Confidence Trap (Aapka Sabse Bada Dhokha)', creator: 'ZX Mind', categoryId: 'confidence', duration: 600, isPremium: false, coverKey: 'confidence', playCount: 45230, description: 'Aapka sabse bada dhokha khud aap hi hain. Is episode mein jaano ki confidence trap kya hai aur isse kaise bacho. Ek powerful reality check jo aapki zindagi badal dega.', trending: true, audioUrl: 'https://drive.google.com/file/d/1-0bXPiKCCegbuDvUQ2dBy4lGwPLfOb0N/view?usp=drivesdk' },
  { id: 'c2', title: 'The Hardware Hack (Apne Dimaag Ko Bewakoof Banao)', creator: 'ZX Mind', categoryId: 'confidence', duration: 600, isPremium: false, coverKey: 'confidence', playCount: 38100, description: 'Aapka dimaag ek machine hai — aur har machine ko hack kiya ja sakta hai. Is episode mein seekho apne khud ke brain ko kaise reprogram karo confidence ke liye.', isNew: true, audioUrl: 'https://drive.google.com/file/d/1-0ubfyF498z_xzg42v3ZtQuWZob6EjMQ/view?usp=drivesdk' },
  { id: 'c3', title: 'Status Levelling (Ameer Aur Powerful Logo Ka Dimaag Padho)', creator: 'ZX Mind', categoryId: 'confidence', duration: 600, isPremium: false, coverKey: 'confidence', playCount: 29800, description: 'Ameer aur powerful log alag tarah sochte hain. Is episode mein unke mindset aur confidence ke raaz kholo — aur unhe apni zindagi mein apply karo.', audioUrl: 'https://drive.google.com/file/d/1-1Jcy2-Wp-1OS5EAYT13ituGBEkmPv7S/view?usp=drivesdk' },
  { id: 'c4', title: 'The Power of Silence (Beizzati Ko Apna Hathiyar Banao)', creator: 'ZX Mind', categoryId: 'confidence', duration: 600, isPremium: false, coverKey: 'confidence', playCount: 52100, description: 'Silence sabse bada jawab hai. Jab koi aapko neeche dikhaye, tab chup rehna aur kaam karna hi sabse bada badla hai. Is episode mein sikho beizzati ko fuel kaise banate hain.', trending: true, audioUrl: 'https://drive.google.com/file/d/1-20cCal97REbjUvlZEweAAObPH8ESYe6/view?usp=drivesdk' },
  { id: 'c5', title: 'The Final Boss (Apne Sabse Bade Dushman Ko Harao)', creator: 'ZX Mind', categoryId: 'confidence', duration: 600, isPremium: false, coverKey: 'confidence', playCount: 41700, description: 'Aapka sabse bada dushman koi aur nahi — aap khud hain. Apni limitations, fears, aur self-doubt ko defeat karo. Ye episode hai un sab ke liye jo truly unbeatable banna chahte hain.', isNew: true, audioUrl: 'https://drive.google.com/file/d/1-3WtosTMEBukKi2tM8RdHiOHSZTVOj2D/view?usp=drivesdk' },

  // Communication
  { id: 'cm1', title: 'Prabhavi Bolne Ki Kala', creator: '', categoryId: 'communication', duration: 600, isPremium: false, coverKey: 'communication', playCount: 41200, description: 'Prabhavi tarike se apni baat dusron tak pahunchana seekho. Art of effective communication.', trending: true },
  { id: 'cm2', title: 'Suno Gehrai Se', creator: '', categoryId: 'communication', duration: 480, isPremium: false, coverKey: 'communication', playCount: 28900, description: 'Active listening relationships ko transform kar sakta hai. Deep listening techniques.' },
  { id: 'cm3', title: 'Conflict Resolution Tips', creator: '', categoryId: 'communication', duration: 1080, isPremium: true, coverKey: 'communication', playCount: 19200, description: 'Jhagde ko khatam karna ek art hai. Peaceful conflict resolution strategies.', isNew: true },
  { id: 'cm4', title: 'Email aur Writing Skills', creator: '', categoryId: 'communication', duration: 720, isPremium: true, coverKey: 'communication', playCount: 15600, description: 'Professional writing jo impact create kare. Business communication mastery.' },

  // Discipline
  { id: 'd1', title: 'Subah Ki Aadat Jo Badal De Zindagi', creator: '', categoryId: 'discipline', duration: 900, isPremium: false, coverKey: 'discipline', playCount: 67800, description: 'Subah 5 baje uthne se lekar meditation tak, perfect morning routine guide.', trending: true },
  { id: 'd2', title: 'Prokrastination Band Karo Aaj Se', creator: '', categoryId: 'discipline', duration: 600, isPremium: false, coverKey: 'discipline', playCount: 54300, description: 'Kaam ko kal par na talo. Anti-procrastination strategies that actually work.' },
  { id: 'd3', title: '21 Din Ka Habit Challenge', creator: '', categoryId: 'discipline', duration: 1200, isPremium: true, coverKey: 'discipline', playCount: 43100, description: '21 din mein nai aadat banana ka proven formula from neuroscience.' },
  { id: 'd4', title: 'Power of Small Wins', creator: '', categoryId: 'discipline', duration: 720, isPremium: true, coverKey: 'discipline', playCount: 31200, description: 'Choti jeet bade goals tak pahunchane ka rasta hai. Celebrate progress.', isNew: true },

  // Stress
  { id: 's1', title: 'Shwas Se Shanti — Breathing Guide', creator: '', categoryId: 'stress', duration: 480, isPremium: false, coverKey: 'stress', playCount: 89200, description: '5 breathing exercises jo turant stress kam karein. Science-backed relaxation.', trending: true },
  { id: 's2', title: '5 Minute Guided Meditation', creator: '', categoryId: 'stress', duration: 300, isPremium: false, coverKey: 'stress', playCount: 76500, description: 'Sirf 5 minute mein mann ko shant karo. Perfect for busy schedules.' },
  { id: 's3', title: 'Anxiety Ko Manage Karen', creator: '', categoryId: 'stress', duration: 900, isPremium: true, coverKey: 'stress', playCount: 34800, description: 'Anxiety se larne ke practical tips jo kaam aate hain. CBT techniques.', isNew: true },
  { id: 's4', title: 'Sleep Better Tonight', creator: '', categoryId: 'stress', duration: 720, isPremium: true, coverKey: 'stress', playCount: 28900, description: 'Neend ki samasyaon ka saral hal. Sleep hygiene and relaxation techniques.' },

  // Career
  { id: 'ca1', title: 'Interview Mein Chhaen', creator: '', categoryId: 'career', duration: 1080, isPremium: false, coverKey: 'career', playCount: 58900, description: 'HR ke sawalo ke jawab jo aapko naukri dila den. Interview mastery guide.', trending: true },
  { id: 'ca2', title: 'Salary Negotiate Karna Seekho', creator: '', categoryId: 'career', duration: 720, isPremium: false, coverKey: 'career', playCount: 47200, description: 'Jo maangna chahte hain woh paao. Salary negotiation scripts and strategies.' },
  { id: 'ca3', title: 'Leadership Skills Jo Agey Le Jayen', creator: '', categoryId: 'career', duration: 1500, isPremium: true, coverKey: 'career', playCount: 39100, description: 'Leader bano, manager nahi. Real leadership principles from top executives.', isNew: true },
  { id: 'ca4', title: 'Professional Network Banao', creator: '', categoryId: 'career', duration: 900, isPremium: true, coverKey: 'career', playCount: 25600, description: 'LinkedIn aur events se powerful network kaise banayein. Networking mastery.' },

  // ── NEW: Legends Behind The Success ──────────────────────────────────────
  { id: 'leg1', title: 'Ek Chai Bechne Wale Ki Kahani', creator: '', categoryId: 'legends', duration: 1200, isPremium: false, coverKey: 'career', playCount: 134200, description: 'Footpath se Fortune 500 tak. Ek insaan ki kahani jo chai bechta tha aur aaj hazaron logo ko roti deta hai. Struggle, discipline, aur ek sapne ki takat.', trending: true, isNew: true },
  { id: 'leg2', title: 'School Dropout Se Millionaire Tak', creator: '', categoryId: 'legends', duration: 1500, isPremium: false, coverKey: 'discipline', playCount: 98700, description: 'Padhai chhodni padi thi — paisa nahi tha. Lekin us failure ne use duniya ka sabse bada risk-taker bana diya. Ye hai ek dropout ki asli story.' },
  { id: 'leg3', title: '100 Baar Reject Hone Ke Baad Success', creator: '', categoryId: 'legends', duration: 1080, isPremium: true, coverKey: 'confidence', playCount: 87300, description: 'Investors ne na kaha. Banks ne na kaha. Family ne bhi shak kiya. Phir bhi usne ek aur baar try kiya. Is episode mein suno rejection ko fuel kaise banate hain.', trending: true },
  { id: 'leg4', title: 'Jab Sabne Mana Kiya, Tab Usne Shuru Kiya', creator: '', categoryId: 'legends', duration: 900, isPremium: false, coverKey: 'communication', playCount: 71500, description: 'Ghar wale naraaz the. Dost hanse. Boss ne job chhudwa di. Aur phir usne khud ka empire khada kar liya. Sunno kaise naa sunte hain woh log jo history banate hain.' },
  { id: 'leg5', title: 'Pyaar Mein Haar, Zindagi Mein Jeet', creator: '', categoryId: 'legends', duration: 1200, isPremium: true, coverKey: 'stress', playCount: 112400, description: 'Usne usse dil diya tha. Usne chhod diya. Toot gaya tha — lekin usi toote hue hisse se unhone apna sabse bada kaam khada kiya. Real story of turning heartbreak into success.', isNew: true },
  { id: 'leg6', title: 'Failure Se Empire Tak', creator: '', categoryId: 'legends', duration: 1800, isPremium: true, coverKey: 'career', playCount: 143600, description: 'Pehla business doob gaya. Dusra bhi fail hua. Teen saal tak ek room mein soye. Aaj unke paas 500+ employees hain. Ye episode sirf motivation nahi — ye blueprint hai.', trending: true },
  { id: 'leg7', title: 'Chhote Shehar Ka Bada Sapna', creator: '', categoryId: 'legends', duration: 1080, isPremium: false, coverKey: 'confidence', playCount: 68900, description: 'Tier-3 city mein paida hua. English nahi aati thi. Network zero tha. Phir bhi usne metro city mein apna naam banaya. Sunno kaise humari limitations humari sab se badi strength ban sakti hain.' },

  // ── NEW: Pyaar, Dard Aur Jeet ─────────────────────────────────────────────
  { id: 'pdj1', title: 'Dil Tootne Ke Baad Comeback', creator: '', categoryId: 'heartgrowth', duration: 720, isPremium: false, coverKey: 'stress', playCount: 89400, description: 'Rishta toot gaya — duniya nahi. Is episode mein jaano kaise log apne sabse dardnaak waqt ke baad apni zindagi ki sabse badi leap lete hain. Practical aur honest.', trending: true, isNew: true },
  { id: 'pdj2', title: 'Breakup Ke Baad Career Banana', creator: '', categoryId: 'heartgrowth', duration: 900, isPremium: false, coverKey: 'career', playCount: 74300, description: 'Jab relationship ka khatma hua, tabhi career ka asal shuruwat hui. Kaise akela rehna tumhe focus deta hai jo crowd mein milna mushkil tha. Real strategies for channeling pain into progress.' },
  { id: 'pdj3', title: 'Self-Confidence Wapas Paana', creator: '', categoryId: 'heartgrowth', duration: 840, isPremium: true, coverKey: 'confidence', playCount: 61200, description: 'Kisi ne tumhe chhodne ke baad lagta hai tum kaafi nahi. Ye feeling real hai — lekin ye sach nahi. Is episode mein milega step-by-step guide to rebuilding your self-worth.', isNew: true },
  { id: 'pdj4', title: 'Failure Ko Fuel Banana', creator: '', categoryId: 'heartgrowth', duration: 660, isPremium: false, coverKey: 'discipline', playCount: 53800, description: 'Dard ek energy hai. Tum decide karte ho ki use kahan lagana hai. Is episode mein suno kaise logo ne apne sabse mushkil moments ko apni sabse badi motivation banayi.' },
  { id: 'pdj5', title: 'Akele Se Aage — Solo Journey', creator: '', categoryId: 'heartgrowth', duration: 1020, isPremium: true, coverKey: 'communication', playCount: 47600, description: 'Akela rehna aur lonely rehna mein farq hai. Jab tum apne saath comfortable ho jaate ho, tab koi bhi tumhara peace nahi chura sakta. Ye episode hai un sab ke liye jinhe abhi sirf apna saath chahiye.' },
  { id: 'pdj6', title: 'Naya Main, Naya Safar', creator: '', categoryId: 'heartgrowth', duration: 780, isPremium: false, coverKey: 'stress', playCount: 38900, description: 'Har toot ek nayi shuruaat ka signal hai. Identity rebuild karne ka, nayi aadat banana ka, aur woh insaan banne ka jo tum hamesha se banna chahte the. Start fresh — seriously.', trending: true },

  // Success Stories
  { id: 'su1', title: 'Ratan Tata Ki Prerna Dayak Kahani', creator: '', categoryId: 'success', duration: 1200, isPremium: false, coverKey: 'confidence', playCount: 112400, description: 'Ek aam insaan se business legend banne ka safar. Tata Group ka itihaas.', trending: true },
  { id: 'su2', title: 'APJ Abdul Kalam: Sapno Ka Scientist', creator: '', categoryId: 'success', duration: 900, isPremium: false, coverKey: 'confidence', playCount: 98700, description: 'Rameswaram se Rashtrapati Bhavan tak ka pyara safar. Inspire yourself.' },
  { id: 'su3', title: 'Dhirubhai Ambani: Zero Se Hero', creator: '', categoryId: 'success', duration: 1500, isPremium: true, coverKey: 'confidence', playCount: 87300, description: 'Gas station se India ke sabse ameer aadmi banne ki kahani. Pure inspiration.', isNew: true },

  // Relationships
  { id: 'r1', title: 'Rishton Mein Vishwas Kaisa Banayein', creator: '', categoryId: 'relationships', duration: 600, isPremium: false, coverKey: 'stress', playCount: 43200, description: 'Trust build karna kisi bhi rishte ki neenv hai. Building lasting bonds.' },
  { id: 'r2', title: 'Baat Karein Dil Se', creator: '', categoryId: 'relationships', duration: 720, isPremium: false, coverKey: 'stress', playCount: 38100, description: 'Emotional conversations ko kaise handle karein. Heart-to-heart communication.', trending: true },
  { id: 'r3', title: 'Healthy Boundaries Kyon Zaroori Hain', creator: '', categoryId: 'relationships', duration: 900, isPremium: true, coverKey: 'stress', playCount: 29400, description: 'Na kahna seekho, rishton ko toxic hone se bachao. Setting healthy limits.', isNew: true },

  // Money
  { id: 'm1', title: 'Paise Bachane Ki Golden Rules', creator: '', categoryId: 'money', duration: 600, isPremium: false, coverKey: 'career', playCount: 71200, description: 'Salary aane ke baad kaise manage karein apna budget. 50-30-20 rule explained.', trending: true },
  { id: 'm2', title: 'Investment Ki Pehli Seedh', creator: '', categoryId: 'money', duration: 900, isPremium: false, coverKey: 'career', playCount: 63800, description: 'Share market, FD, gold — kahaan lagayein apna paisa. Beginners guide.' },
  { id: 'm3', title: 'SIP aur Mutual Funds: Asaan Guide', creator: '', categoryId: 'money', duration: 1200, isPremium: true, coverKey: 'career', playCount: 48200, description: 'SIP se crorepati kaise bante hain. Step-by-step mutual fund guide.', isNew: true },

  // Decision Making
  { id: 'de1', title: 'Sahi Nirnay Kaise Lein', creator: '', categoryId: 'decision', duration: 720, isPremium: false, coverKey: 'discipline', playCount: 36700, description: 'Mushkil faislon mein clarity kaise layen. Practical decision framework.' },
  { id: 'de2', title: 'Overthinking Band Karo Abhi', creator: '', categoryId: 'decision', duration: 480, isPremium: false, coverKey: 'discipline', playCount: 52300, description: 'Zyaada sochna khatam karo, action lo. Stop the overthinking spiral.', trending: true },
  { id: 'de3', title: 'Data-Driven Life Decisions', creator: '', categoryId: 'decision', duration: 1080, isPremium: true, coverKey: 'discipline', playCount: 21800, description: 'Logic aur emotion ka sahi balance kaise rakhein. Rational decision making.', isNew: true },

  // Self Growth
  { id: 'sg1', title: 'Best Version of Yourself Bano', creator: '', categoryId: 'selfgrowth', duration: 900, isPremium: false, coverKey: 'communication', playCount: 84100, description: 'Har roz thoda behtar hona hi asli growth hai. Daily self-improvement practices.', trending: true },
  { id: 'sg2', title: 'Apni Soch Ko Badlo', creator: '', categoryId: 'selfgrowth', duration: 600, isPremium: false, coverKey: 'communication', playCount: 71500, description: 'Negative thoughts ko positive mein convert karna seekho. Mindset shift guide.' },
  { id: 'sg3', title: 'Comfort Zone Chhodo Aur Bado', creator: '', categoryId: 'selfgrowth', duration: 1200, isPremium: true, coverKey: 'communication', playCount: 59200, description: 'Apne comfort zone se bahar nikalna hi growth ka rasta hai. Push your limits.', isNew: true },
  { id: 'sg4', title: 'Growth Mindset: Puri Guide', creator: '', categoryId: 'selfgrowth', duration: 900, isPremium: true, coverKey: 'communication', playCount: 43800, description: 'Fixed vs Growth mindset — aap kahan hain? Carol Dweck ki theory explained.' },
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
