import { useState } from "react";
import Icon from "@/components/ui/icon";

type Section = "menu" | "play" | "shop" | "market" | "inventory" | "cases" | "rating" | "settings" | "faq" | "collection" | "match";

const ARENA_IMAGE = "https://cdn.poehali.dev/projects/dc723a4d-7da4-4eb3-9533-f186e94ee645/files/d8152b98-3553-4f5e-97eb-11f436aa1982.jpg";
const SKINS_IMAGE = "https://cdn.poehali.dev/projects/dc723a4d-7da4-4eb3-9533-f186e94ee645/files/c2892e5f-0128-4f82-82d6-bfe9d3c52aa2.jpg";
const MATCH_HUD_IMAGE = "https://cdn.poehali.dev/projects/dc723a4d-7da4-4eb3-9533-f186e94ee645/files/4bc4d3dd-4a88-4e97-bbdb-81db6349c2f1.jpg";
const CASES_IMAGE = "https://cdn.poehali.dev/projects/dc723a4d-7da4-4eb3-9533-f186e94ee645/files/cecdc870-8167-4fbf-83c1-611c489737e6.jpg";
const AK_SKIN_IMAGE = "https://cdn.poehali.dev/projects/dc723a4d-7da4-4eb3-9533-f186e94ee645/files/8acd270b-e9a6-496d-9b4d-3246cb4f5815.jpg";
const M4_SKIN_IMAGE = "https://cdn.poehali.dev/projects/dc723a4d-7da4-4eb3-9533-f186e94ee645/files/68ce775e-d151-47e1-94c0-4f3df6ae34f8.jpg";
const KARAMBIT_IMAGE = "https://cdn.poehali.dev/projects/dc723a4d-7da4-4eb3-9533-f186e94ee645/files/04b2d8fb-cbcb-4c0f-8c0a-2d4c14c6a58f.jpg";
const SNIPER_SKIN_IMAGE = "https://cdn.poehali.dev/projects/dc723a4d-7da4-4eb3-9533-f186e94ee645/files/467f0d16-eca2-4e29-a638-2e7b8459fefc.jpg";

const RANKS = [
  { name: "Рекрут", min: 0, max: 499, color: "#aaaaaa", icon: "Shield" },
  { name: "Боец", min: 500, max: 999, color: "#4d9fff", icon: "Swords" },
  { name: "Ветеран", min: 1000, max: 1999, color: "#b44fff", icon: "Star" },
  { name: "Элита", min: 2000, max: 3499, color: "#ffd700", icon: "Crown" },
  { name: "Мастер", min: 3500, max: 4999, color: "#ff6b35", icon: "Flame" },
  { name: "Командир", min: 5000, max: 99999, color: "#00f5ff", icon: "Trophy" },
];

const getRank = (xp: number) => RANKS.find(r => xp >= r.min && xp <= r.max) || RANKS[0];
const getNextRank = (xp: number) => {
  const idx = RANKS.findIndex(r => xp >= r.min && xp <= r.max);
  return RANKS[idx + 1] || null;
};

const PLAYERS = [
  { name: "ShadowX_Pro", xp: 5840, kills: 1247, wins: 342, country: "🇷🇺" },
  { name: "NightStrike", xp: 4920, kills: 987, wins: 278, country: "🇺🇦" },
  { name: "Кибер_Волк", xp: 4410, kills: 876, wins: 241, country: "🇷🇺" },
  { name: "PhantomGhost", xp: 3870, kills: 754, wins: 198, country: "🇩🇪" },
  { name: "IceSniper777", xp: 3210, kills: 634, wins: 167, country: "🇺🇸" },
  { name: "Тень_Воина", xp: 2780, kills: 543, wins: 143, country: "🇷🇺" },
  { name: "VortexKiller", xp: 2340, kills: 478, wins: 124, country: "🇫🇷" },
  { name: "DarkPulse", xp: 1890, kills: 389, wins: 98, country: "🇧🇷" },
  { name: "Огненный", xp: 1340, kills: 287, wins: 76, country: "🇷🇺" },
  { name: "Новобранец", xp: 620, kills: 134, wins: 32, country: "🇰🇿" },
];

const MAPS = [
  { id: 1, name: "Завод «Авангард»", desc: "Цеха, склады, мосты, трубы", icon: "Factory", color: "#ff6b35", tags: ["Промышленная", "Средняя"] },
  { id: 2, name: "Мегаполис", desc: "Узкие улицы, высотки, подземные переходы", icon: "Building2", color: "#00f5ff", tags: ["Городская", "Крупная"] },
  { id: 3, name: "Пустыня «Сахара»", desc: "Открытые зоны, руины, песчаные бури", icon: "Sun", color: "#ffd700", tags: ["Открытая", "Крупная"] },
  { id: 4, name: "Лаборатория X-17", desc: "Коридоры, лаборатории, аварийное освещение", icon: "FlaskConical", color: "#39ff14", tags: ["Тесная", "Малая"] },
  { id: 5, name: "Порт «Атлантис»", desc: "Контейнеры, корабли, краны, туман", icon: "Ship", color: "#b44fff", tags: ["Смешанная", "Средняя"] },
];

const BOT_LEVELS = [
  { id: "novice", name: "Новичок", desc: "Низкая точность, медленные реакции", color: "#39ff14", icon: "Baby", stats: { accuracy: 20, speed: 25, aggro: 15 } },
  { id: "experienced", name: "Опытный", desc: "Средняя меткость, базовые манёвры", color: "#4d9fff", icon: "User", stats: { accuracy: 50, speed: 55, aggro: 45 } },
  { id: "pro", name: "Профессионал", desc: "Высокая точность, агрессивные атаки", color: "#ffd700", icon: "Star", stats: { accuracy: 75, speed: 75, aggro: 80 } },
  { id: "elite", name: "Элита", desc: "Максимальная сложность, продвинутые тактики", color: "#ff6b35", icon: "Flame", stats: { accuracy: 95, speed: 92, aggro: 95 } },
  { id: "custom", name: "Кастомный", desc: "Ручная настройка всех параметров", color: "#b44fff", icon: "Sliders", stats: { accuracy: 60, speed: 60, aggro: 60 } },
];

const KNIVES = [
  { id: 1, name: "Керамбит", skins: ["Тень", "Ледник"], icon: "Scissors", color: "#00f5ff" },
  { id: 2, name: "Бабочка", skins: ["Феникс", "Вулкан"], icon: "Wind", color: "#ff6b35" },
  { id: 3, name: "Стилет", skins: ["Призрак", "Мрак"], icon: "Minus", color: "#b44fff" },
  { id: 4, name: "Тактический", skins: ["Шторм", "Буря"], icon: "Zap", color: "#ffd700" },
  { id: 5, name: "Баллистический", skins: ["Кобра", "Аспид"], icon: "ArrowUp", color: "#39ff14" },
];

const SHOP_CASES = [
  { id: 1, name: "Базовый кейс", price: 100, color: "#aaaaaa", rarity: "common", items: "Скины оружия, брелоки", img: CASES_IMAGE },
  { id: 2, name: "Теневой кейс", price: 300, color: "#00f5ff", rarity: "rare", items: "Редкие скины, агенты", img: CASES_IMAGE },
  { id: 3, name: "Пурпурный кейс", price: 750, color: "#b44fff", rarity: "epic", items: "Эпические скины, ножи", img: CASES_IMAGE },
  { id: 4, name: "Огненный кейс", price: 2000, color: "#ff6b35", rarity: "epic", items: "Редкие ножи, легендарные скины", img: CASES_IMAGE },
  { id: 5, name: "Элитный кейс", price: 5000, color: "#ffd700", rarity: "legendary", items: "Легенды, эксклюзив", img: CASES_IMAGE },
  { id: 6, name: "Ультра-кейс", price: 10000, color: "#ff00ff", rarity: "ultra", items: "Ультраредкие предметы", img: CASES_IMAGE },
];

const RAIDS = [
  { id: 1, name: "Операция «Шторм»", days: 7, price: 500, color: "#00f5ff", ends: "5 дней", reward: "Агент «Командос», эксклюзивный скин AK" },
  { id: 2, name: "Сезон «Феникс»", days: 14, price: 1200, color: "#ff6b35", ends: "12 дней", reward: "Набор «Феникс»: нож + скин + агент" },
];

const OC_PACKS = [
  { oc: 100, price: 50, bonus: 0, label: "Старт" },
  { oc: 500, price: 220, bonus: 10, label: "Популярный" },
  { oc: 1200, price: 500, bonus: 20, label: "Выгодный" },
  { oc: 3000, price: 1100, bonus: 30, label: "Продвинутый" },
  { oc: 7000, price: 2400, bonus: 40, label: "Элитный" },
  { oc: 15000, price: 4500, bonus: 50, label: "Командирский" },
];

const MARKET_LISTINGS = [
  { id: 1, name: "AK-Shadow «Ночь»", type: "skin", rarity: "legendary", price: 3200, seller: "ShadowX_Pro", icon: "Crosshair" },
  { id: 2, name: "Керамбит «Тень»", type: "knife", rarity: "epic", price: 1800, seller: "NightStrike", icon: "Scissors" },
  { id: 3, name: "Агент «Призрак»", type: "agent", rarity: "epic", price: 950, seller: "Кибер_Волк", icon: "User" },
  { id: 4, name: "M4-Киберпанк", type: "skin", rarity: "rare", price: 420, seller: "IceSniper777", icon: "Crosshair" },
  { id: 5, name: "Брелок «Дракон»", type: "charm", rarity: "epic", price: 680, seller: "Тень_Воина", icon: "KeyRound" },
  { id: 6, name: "Стикер «Череп»", type: "sticker", rarity: "rare", price: 150, seller: "VortexKiller", icon: "Tag" },
  { id: 7, name: "Бабочка «Феникс»", type: "knife", rarity: "legendary", price: 5500, seller: "PhantomGhost", icon: "Wind" },
  { id: 8, name: "USP-Aurora", type: "skin", rarity: "epic", price: 780, seller: "DarkPulse", icon: "Crosshair" },
];

const INVENTORY_ITEMS = [
  { id: 1, name: "AK-Shadow", type: "skin", rarity: "legendary", equipped: true, icon: "Crosshair", img: AK_SKIN_IMAGE },
  { id: 2, name: "Агент Призрак", type: "agent", rarity: "epic", equipped: true, icon: "User", img: null },
  { id: 3, name: "Неон-Найф", type: "skin", rarity: "rare", equipped: false, icon: "Crosshair", img: M4_SKIN_IMAGE },
  { id: 4, name: "Командир Х", type: "agent", rarity: "rare", equipped: false, icon: "User", img: null },
  { id: 5, name: "Дракон", type: "charm", rarity: "epic", equipped: true, icon: "KeyRound", img: null },
  { id: 6, name: "M4-Киберпанк", type: "skin", rarity: "rare", equipped: false, icon: "Crosshair", img: M4_SKIN_IMAGE },
  { id: 7, name: "Агент Тень", type: "agent", rarity: "common", equipped: false, icon: "User", img: null },
  { id: 8, name: "Skull Key", type: "charm", rarity: "common", equipped: false, icon: "KeyRound", img: null },
  { id: 9, name: "Снайпер X", type: "skin", rarity: "legendary", equipped: false, icon: "Crosshair", img: SNIPER_SKIN_IMAGE },
  { id: 10, name: "Кибер-Кот", type: "charm", rarity: "rare", equipped: false, icon: "KeyRound", img: null },
  { id: 11, name: "USP-Aurora", type: "skin", rarity: "epic", equipped: false, icon: "Crosshair", img: AK_SKIN_IMAGE },
  { id: 12, name: "Керамбит Тень", type: "knife", rarity: "epic", equipped: true, icon: "Scissors", img: KARAMBIT_IMAGE },
  { id: 13, name: "Стикер Феникс", type: "sticker", rarity: "rare", equipped: false, icon: "Tag", img: null },
  { id: 14, name: "Стикер Волк", type: "sticker", rarity: "common", equipped: false, icon: "Tag", img: null },
];

const CASE_REEL = [
  { name: "Агент Тень", rarity: "common" },
  { name: "Skull Key", rarity: "common" },
  { name: "Неон-Найф", rarity: "rare" },
  { name: "USP-Aurora", rarity: "epic" },
  { name: "AK-Shadow", rarity: "legendary" },
  { name: "M4-Кибер", rarity: "rare" },
  { name: "Дракон", rarity: "epic" },
  { name: "Командир Х", rarity: "rare" },
  { name: "Снайпер X", rarity: "legendary" },
  { name: "Кибер-Кот", rarity: "rare" },
  { name: "Агент Тень", rarity: "common" },
  { name: "Skull Key", rarity: "common" },
  { name: "Неон-Найф", rarity: "rare" },
  { name: "USP-Aurora", rarity: "epic" },
  { name: "AK-Shadow", rarity: "legendary" },
  { name: "M4-Кибер", rarity: "rare" },
];

const rarityLabel: Record<string, string> = {
  common: "Обычный", rare: "Редкий", epic: "Эпический",
  legendary: "Легендарный", ultra: "Ультраредкий",
};
const rarityColor: Record<string, string> = {
  common: "#aaa", rare: "#4d9fff", epic: "#b44fff",
  legendary: "#ffd700", ultra: "#ff00ff",
};

const typeLabel: Record<string, string> = {
  skin: "Скин", agent: "Агент", charm: "Брелок",
  knife: "Нож", sticker: "Наклейка",
};

const playerXP = 1340;
const playerOC = 850;

export default function Index() {
  const [section, setSection] = useState<Section>("menu");
  const [animating, setAnimating] = useState(false);

  // Play
  const [selectedMap, setSelectedMap] = useState<number | null>(null);
  const [selectedBot, setSelectedBot] = useState<string | null>(null);
  const [customBot, setCustomBot] = useState({ accuracy: 60, speed: 60, aggro: 60, health: 100 });
  const [playStep, setPlayStep] = useState<"map" | "bot" | "ready">("map");

  // Match
  const [matchTime, setMatchTime] = useState(0);
  const [matchScore, setMatchScore] = useState({ me: 0, bots: 0 });
  const [matchKills, setMatchKills] = useState(0);
  const [matchAlive, setMatchAlive] = useState(true);
  const [matchHealth, setMatchHealth] = useState(100);
  const [matchAmmo, setMatchAmmo] = useState({ current: 30, reserve: 90 });
  const [matchLog, setMatchLog] = useState<{ text: string; color: string; id: number }[]>([
    { text: "Матч начался!", color: "#00f5ff", id: 1 },
  ]);
  // Player position on minimap (0..100)
  const [playerPos, setPlayerPos] = useState({ x: 45, y: 55 });
  const [playerDir, setPlayerDir] = useState<"N"|"S"|"E"|"W"|"">("");
  // Bots with positions, state, skin
  const [bots, setBots] = useState([
    { id: 1, name: "Bot_Alpha", x: 65, y: 25, hp: 100, state: "patrol", skin: AK_SKIN_IMAGE, color: "#ff6b35" },
    { id: 2, name: "Bot_Sigma", x: 30, y: 70, hp: 100, state: "patrol", skin: M4_SKIN_IMAGE, color: "#b44fff" },
    { id: 3, name: "Bot_Omega", x: 75, y: 40, hp: 100, state: "idle",   skin: SNIPER_SKIN_IMAGE, color: "#ffd700" },
  ]);
  const [selectedWeaponSkin, setSelectedWeaponSkin] = useState(0);
  const [matchTab, setMatchTab] = useState<"game"|"bots"|"skins">("game");
  const weaponSkins = [
    { name: "AK-Shadow", img: AK_SKIN_IMAGE, rarity: "legendary" },
    { name: "M4-Киберпанк", img: M4_SKIN_IMAGE, rarity: "rare" },
    { name: "Снайпер X", img: SNIPER_SKIN_IMAGE, rarity: "legendary" },
    { name: "Керамбит Тень", img: KARAMBIT_IMAGE, rarity: "epic" },
  ];

  const movePlayer = (dir: "N"|"S"|"E"|"W") => {
    const step = 6;
    setPlayerDir(dir);
    setPlayerPos(p => ({
      x: Math.min(95, Math.max(5, p.x + (dir==="E" ? step : dir==="W" ? -step : 0))),
      y: Math.min(95, Math.max(5, p.y + (dir==="S" ? step : dir==="N" ? -step : 0))),
    }));
    const id = Date.now();
    const botNear = bots.find(b => Math.abs(b.x - playerPos.x) < 20 && Math.abs(b.y - playerPos.y) < 20);
    if (botNear) {
      setBots(bs => bs.map(b => b.id === botNear.id ? { ...b, state: "chase" } : b));
      setMatchLog(l => [...l, { text: `${botNear.name} обнаружил вас!`, color: "#ff6b35", id }]);
    }
    setTimeout(() => setPlayerDir(""), 300);
  };

  const botAct = () => {
    const id = Date.now();
    setBots(prev => prev.map(b => {
      if (b.hp <= 0) return b;
      const dist = Math.sqrt((b.x - playerPos.x)**2 + (b.y - playerPos.y)**2);
      let newState = b.state;
      let nx = b.x + (Math.random() > 0.5 ? 4 : -4);
      let ny = b.y + (Math.random() > 0.5 ? 4 : -4);
      if (b.state === "chase" || dist < 25) {
        newState = "chase";
        nx = b.x + (playerPos.x > b.x ? 3 : -3);
        ny = b.y + (playerPos.y > b.y ? 3 : -3);
      }
      return { ...b, x: Math.min(95, Math.max(5, nx)), y: Math.min(95, Math.max(5, ny)), state: newState };
    }));
    // Bot shoots if close
    const chasing = bots.find(b => b.hp > 0 && b.state === "chase");
    if (chasing) {
      const botLevel = BOT_LEVELS.find(bl => bl.id === selectedBot);
      const hitChance = (botLevel?.stats.accuracy ?? 50) / 100;
      if (Math.random() < hitChance * 0.6) {
        const dmg = Math.floor(Math.random() * 20 + 5);
        setMatchHealth(h => Math.max(0, h - dmg));
        setMatchLog(l => [...l, { text: `${chasing.name} попал! −${dmg} HP`, color: "#ff4444", id }]);
        if (matchHealth - dmg <= 0) {
          setMatchAlive(false);
          setMatchScore(s => ({ ...s, bots: s.bots + 1 }));
        }
      } else {
        setMatchLog(l => [...l, { text: `${chasing.name} промахнулся`, color: "rgba(255,255,255,0.4)", id }]);
      }
    }
  };

  // Shop
  const [shopTab, setShopTab] = useState<"cases" | "raids" | "oc">("cases");

  // Market
  const [marketFilter, setMarketFilter] = useState<string>("all");

  // Inventory
  const [inventoryFilter, setInventoryFilter] = useState<string>("all");

  // Cases
  const [openingCase, setOpeningCase] = useState<typeof SHOP_CASES[0] | null>(null);
  const [caseResult, setCaseResult] = useState<{ name: string; rarity: string } | null>(null);
  const [caseSpinning, setCaseSpinning] = useState(false);
  const [spinOffset, setSpinOffset] = useState(0);

  // Rating
  const [ratingTab, setRatingTab] = useState<"table" | "ranks">("table");

  // Settings
  const [settingsTab, setSettingsTab] = useState("graphics");
  const [graphics, setGraphics] = useState({ quality: "Высокое", fps: "120", shadows: true, blur: true });
  const [audio, setAudio] = useState({ master: 80, music: 60, effects: 90, voice: 70 });

  // FAQ
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Collection
  const [collectionTab, setCollectionTab] = useState<"weapons" | "agents" | "knives" | "stickers" | "charms">("weapons");

  const rank = getRank(playerXP);
  const nextRank = getNextRank(playerXP);
  const xpProgress = nextRank ? ((playerXP - rank.min) / (nextRank.min - rank.min)) * 100 : 100;

  const navigate = (s: Section) => {
    if (s === section) return;
    setAnimating(true);
    setTimeout(() => { setSection(s); setAnimating(false); }, 180);
  };

  const spinCase = () => {
    if (caseSpinning) return;
    setCaseSpinning(true);
    setCaseResult(null);
    const target = Math.floor(Math.random() * CASE_REEL.length);
    const offset = (target + CASE_REEL.length * 3) * 108;
    setSpinOffset(offset);
    setTimeout(() => {
      setCaseSpinning(false);
      setCaseResult(CASE_REEL[target % CASE_REEL.length]);
    }, 3500);
  };

  const navItems: { id: Section; label: string; icon: string }[] = [
    { id: "menu", label: "Главная", icon: "Home" },
    { id: "play", label: "Играть", icon: "Play" },
    { id: "shop", label: "Магазин", icon: "ShoppingBag" },
    { id: "market", label: "Рынок", icon: "TrendingUp" },
    { id: "inventory", label: "Инвентарь", icon: "Package" },
    { id: "rating", label: "Рейтинг", icon: "Trophy" },
    { id: "collection", label: "Коллекция", icon: "LayoutGrid" },
    { id: "settings", label: "Настройки", icon: "Settings" },
  ];

  return (
    <div className="min-h-screen grid-bg" style={{ background: "var(--dark-bg)" }}>

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-3"
        style={{ background: "rgba(7,7,15,0.97)", borderBottom: "1px solid rgba(0,245,255,0.08)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex-shrink-0">
            <div className="absolute inset-0 rounded" style={{ background: "linear-gradient(135deg, #00f5ff, #b44fff)", boxShadow: "0 0 15px rgba(0,245,255,0.5)" }} />
            <div className="absolute inset-0.5 rounded" style={{ background: "var(--dark-bg)" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon name="Swords" size={14} style={{ color: "var(--neon-cyan)" }} />
            </div>
          </div>
          <span className="font-oswald font-bold text-lg tracking-widest hidden sm:block"
            style={{ color: "var(--neon-cyan)", textShadow: "0 0 15px rgba(0,245,255,0.4)" }}>
            SHADOW<span style={{ color: "var(--neon-purple)" }}>WAR</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-0.5">
          {navItems.map(item => (
            <button key={item.id} onClick={() => navigate(item.id)}
              className={`nav-item text-xs ${section === item.id ? "active" : ""}`}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* OC Balance */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded"
            style={{ background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.2)" }}>
            <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{ background: "var(--neon-cyan)", color: "#07070f" }}>C</div>
            <span className="font-oswald text-sm font-bold" style={{ color: "var(--neon-cyan)" }}>{playerOC}</span>
            <span className="text-[10px] hidden sm:block" style={{ color: "rgba(255,255,255,0.3)" }}>OC</span>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center border-2"
            style={{ borderColor: rank.color, background: "rgba(0,0,0,0.5)" }}>
            <Icon name="User" size={14} style={{ color: rank.color }} />
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-1.5"
        style={{ background: "rgba(7,7,15,0.97)", borderTop: "1px solid rgba(0,245,255,0.1)" }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => navigate(item.id)}
            className="flex flex-col items-center gap-0.5 p-1.5 rounded transition-all"
            style={section === item.id ? { color: "var(--neon-cyan)" } : { color: "rgba(255,255,255,0.3)" }}>
            <Icon name={item.icon} size={17} />
            <span className="text-[8px] font-oswald tracking-wide uppercase">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <main style={{
        paddingTop: "4rem", paddingBottom: "5rem",
        opacity: animating ? 0 : 1,
        transform: animating ? "translateY(6px)" : "translateY(0)",
        transition: "opacity 0.18s ease, transform 0.18s ease"
      }}>

        {/* ===== MAIN MENU ===== */}
        {section === "menu" && (
          <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute w-[500px] h-[500px] rounded-full opacity-8" style={{ background: "radial-gradient(circle, #00f5ff, transparent)", top: "5%", left: "-5%", filter: "blur(90px)" }} />
              <div className="absolute w-96 h-96 rounded-full opacity-8" style={{ background: "radial-gradient(circle, #b44fff, transparent)", bottom: "5%", right: "-5%", filter: "blur(90px)" }} />
            </div>

            <div className="relative z-10 text-center max-w-2xl mx-auto animate-slide-up">
              <div className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-oswald tracking-widest uppercase"
                style={{ background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.2)", color: "var(--neon-cyan)" }}>
                <div className="w-2 h-2 rounded-full animate-pulse-neon" style={{ background: "var(--neon-cyan)" }} />
                Сезон 5 · Рейд «Шторм» активен
              </div>

              <h1 className="font-oswald text-7xl md:text-9xl font-black tracking-widest mb-3 leading-none select-none">
                <span style={{ color: "white" }}>SHADOW</span><br />
                <span style={{ color: "var(--neon-cyan)", textShadow: "0 0 40px rgba(0,245,255,0.5)" }}>WAR</span>
              </h1>
              <p className="font-roboto text-base mb-10" style={{ color: "rgba(255,255,255,0.4)" }}>
                Тактический шутер нового поколения
              </p>

              {/* Main menu buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto mb-8">
                <button onClick={() => { navigate("play"); setPlayStep("map"); }}
                  className="btn-solid-cyan py-5 rounded-xl text-lg font-bold col-span-1 sm:col-span-2">
                  ⚔️ Играть
                </button>
                <button onClick={() => navigate("shop")} className="btn-neon-cyan py-4 rounded-xl text-base">
                  🛍️ Магазин
                </button>
                <button onClick={() => navigate("market")} className="btn-neon-purple py-4 rounded-xl text-base">
                  📈 Рынок
                </button>
              </div>

              {/* Player card */}
              <div className="card-dark rounded-xl p-5">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: rank.color, background: `${rank.color}12` }}>
                    <Icon name={rank.icon} size={20} style={{ color: rank.color }} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-oswald text-base font-bold text-white">Огненный</div>
                    <div className="font-rajdhani font-bold text-sm" style={{ color: rank.color }}>{rank.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-oswald font-bold" style={{ color: "var(--neon-cyan)" }}>{playerOC} OC</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>баланс</div>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Прогресс до «{nextRank?.name}»</span>
                  <span className="text-xs font-rajdhani" style={{ color: "rgba(255,255,255,0.4)" }}>{playerXP} / {nextRank?.min} XP</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="xp-bar h-full rounded-full" style={{ width: `${xpProgress}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[{ label: "Победы", value: "76" }, { label: "Убийства", value: "287" }, { label: "Место", value: "#9" }].map(s => (
                    <div key={s.label} className="text-center">
                      <div className="font-oswald text-xl font-bold" style={{ color: "var(--neon-cyan)" }}>{s.value}</div>
                      <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== PLAY: MAP + BOT SELECTION ===== */}
        {section === "play" && (
          <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
            {/* Steps */}
            <div className="flex items-center gap-3 mb-8 animate-slide-up">
              {[
                { id: "map", label: "1. Карта", icon: "Map" },
                { id: "bot", label: "2. Боты", icon: "Bot" },
                { id: "ready", label: "3. Старт", icon: "Play" },
              ].map((step, i) => (
                <div key={step.id} className="flex items-center gap-2">
                  {i > 0 && <div className="w-8 h-px" style={{ background: playStep === "map" && i > 0 ? "rgba(255,255,255,0.15)" : "rgba(0,245,255,0.4)" }} />}
                  <button onClick={() => { if (step.id === "bot" && selectedMap) setPlayStep("bot"); if (step.id === "map") setPlayStep("map"); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded font-oswald text-xs tracking-wide uppercase transition-all"
                    style={playStep === step.id
                      ? { background: "rgba(0,245,255,0.12)", border: "1px solid var(--neon-cyan)", color: "var(--neon-cyan)" }
                      : { background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)" }}>
                    <Icon name={step.icon} size={12} />
                    {step.label}
                  </button>
                </div>
              ))}
            </div>

            {/* STEP 1: MAP */}
            {playStep === "map" && (
              <div>
                <h2 className="section-title text-2xl md:text-3xl text-white mb-5">Выбор карты</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MAPS.map(map => (
                    <div key={map.id}
                      className="card-dark rounded-xl p-5 cursor-pointer transition-all"
                      style={{
                        borderColor: selectedMap === map.id ? map.color : `${map.color}18`,
                        boxShadow: selectedMap === map.id ? `0 0 20px ${map.color}25` : "none",
                        background: selectedMap === map.id ? `${map.color}08` : ""
                      }}
                      onClick={() => setSelectedMap(map.id)}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ background: `${map.color}15`, border: `1px solid ${map.color}30` }}>
                          <Icon name={map.icon} size={20} style={{ color: map.color }} />
                        </div>
                        <div>
                          <div className="font-oswald font-bold text-sm text-white">{map.name}</div>
                          <div className="flex gap-1 mt-0.5">
                            {map.tags.map(t => (
                              <span key={t} className="text-[9px] px-1.5 py-0.5 rounded font-oswald"
                                style={{ background: `${map.color}12`, color: map.color, border: `1px solid ${map.color}25` }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        {selectedMap === map.id && <Icon name="CheckCircle" size={18} style={{ color: map.color, marginLeft: "auto" }} />}
                      </div>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{map.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => selectedMap && setPlayStep("bot")}
                    className="btn-solid-cyan px-10 py-3 rounded-lg font-bold"
                    style={{ opacity: selectedMap ? 1 : 0.4 }}>
                    Далее →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: BOT LEVEL */}
            {playStep === "bot" && (
              <div>
                <h2 className="section-title text-2xl md:text-3xl text-white mb-5">Уровень ботов</h2>
                <div className="space-y-3">
                  {BOT_LEVELS.map(bot => (
                    <div key={bot.id}
                      className="card-dark rounded-xl p-4 cursor-pointer flex items-center gap-4"
                      style={{
                        borderColor: selectedBot === bot.id ? bot.color : `${bot.color}15`,
                        background: selectedBot === bot.id ? `${bot.color}06` : ""
                      }}
                      onClick={() => setSelectedBot(bot.id)}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${bot.color}15`, border: `1px solid ${bot.color}30` }}>
                        <Icon name={bot.icon} size={20} style={{ color: bot.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-oswald font-bold text-sm" style={{ color: bot.color }}>{bot.name}</span>
                          {selectedBot === bot.id && <Icon name="CheckCircle2" size={14} style={{ color: bot.color }} />}
                        </div>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{bot.desc}</p>
                      </div>
                      {/* Stats mini bars */}
                      <div className="hidden md:flex gap-3">
                        {[
                          { label: "Точность", val: bot.stats.accuracy },
                          { label: "Скорость", val: bot.stats.speed },
                          { label: "Агрессия", val: bot.stats.aggro },
                        ].map(s => (
                          <div key={s.label} className="w-16 text-center">
                            <div className="text-[9px] mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
                            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                              <div className="h-full rounded-full" style={{ width: `${s.val}%`, background: bot.color }} />
                            </div>
                            <div className="text-[9px] mt-0.5 font-rajdhani font-bold" style={{ color: bot.color }}>{s.val}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom bot settings */}
                {selectedBot === "custom" && (
                  <div className="mt-4 card-dark rounded-xl p-5">
                    <div className="font-oswald text-sm text-white mb-4 tracking-wide uppercase">Кастомные параметры</div>
                    {[
                      { label: "Точность", key: "accuracy" as const },
                      { label: "Скорость", key: "speed" as const },
                      { label: "Агрессия", key: "aggro" as const },
                      { label: "Здоровье (%)", key: "health" as const },
                    ].map(s => (
                      <div key={s.key} className="mb-4">
                        <div className="flex justify-between mb-1.5">
                          <span className="font-rajdhani font-bold text-sm text-white">{s.label}</span>
                          <span className="font-rajdhani text-sm" style={{ color: "var(--neon-purple)" }}>{customBot[s.key]}%</span>
                        </div>
                        <input type="range" min="0" max="100" value={customBot[s.key]}
                          onChange={e => setCustomBot(b => ({ ...b, [s.key]: +e.target.value }))}
                          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                          style={{ background: `linear-gradient(90deg, var(--neon-purple) ${customBot[s.key]}%, rgba(255,255,255,0.08) ${customBot[s.key]}%)` }} />
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <button onClick={() => setPlayStep("map")} className="btn-neon-cyan px-6 py-3 rounded-lg">← Назад</button>
                  <button onClick={() => selectedBot && setPlayStep("ready")}
                    className="btn-solid-cyan px-10 py-3 rounded-lg font-bold"
                    style={{ opacity: selectedBot ? 1 : 0.4 }}>
                    Далее →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: READY */}
            {playStep === "ready" && (
              <div className="text-center max-w-md mx-auto animate-slide-up">
                <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center animate-pulse-neon"
                  style={{ background: "rgba(0,245,255,0.1)", border: "2px solid var(--neon-cyan)" }}>
                  <Icon name="Play" size={36} style={{ color: "var(--neon-cyan)" }} />
                </div>
                <h2 className="section-title text-3xl text-white mb-2">Готово к бою!</h2>

                <div className="card-dark rounded-xl p-5 mb-6 text-left">
                  <div className="flex justify-between mb-3 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Карта</span>
                    <span className="font-rajdhani font-bold text-sm text-white">{MAPS.find(m => m.id === selectedMap)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Сложность ботов</span>
                    <span className="font-rajdhani font-bold text-sm" style={{ color: BOT_LEVELS.find(b => b.id === selectedBot)?.color }}>
                      {BOT_LEVELS.find(b => b.id === selectedBot)?.name}
                    </span>
                  </div>
                </div>

                <button className="btn-solid-cyan w-full py-5 rounded-xl text-xl font-black tracking-widest"
                  onClick={() => {
                    setMatchTime(0);
                    setMatchScore({ me: 0, bots: 0 });
                    setMatchKills(0);
                    setMatchAlive(true);
                    setMatchHealth(100);
                    setMatchAmmo({ current: 30, reserve: 90 });
                    setMatchLog([{ text: "Матч начался!", color: "#00f5ff", id: Date.now() }]);
                    navigate("match");
                  }}>
                  ⚔️ В БОЙ!
                </button>
                <button onClick={() => setPlayStep("map")} className="mt-3 text-sm font-oswald tracking-wide uppercase"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  Изменить настройки
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===== SHOP ===== */}
        {section === "shop" && (
          <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 animate-slide-up">
              <div>
                <h2 className="section-title text-3xl md:text-4xl text-white mb-1">🛍️ Магазин</h2>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Валюта: Оперативные кредиты (OC) · 100 OC = 50 руб.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.2)" }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                  style={{ background: "var(--neon-cyan)", color: "#07070f" }}>C</div>
                <span className="font-oswald font-bold text-lg" style={{ color: "var(--neon-cyan)" }}>{playerOC}</span>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>OC</span>
                <button onClick={() => setShopTab("oc")} className="ml-2 text-xs font-oswald tracking-wide"
                  style={{ color: "var(--neon-cyan)" }}>+ Пополнить</button>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              {[
                { id: "cases" as const, label: "Кейсы", icon: "Gift" },
                { id: "raids" as const, label: "Рейды", icon: "Rocket" },
                { id: "oc" as const, label: "Валюта OC", icon: "Coins" },
              ].map(tab => (
                <button key={tab.id} onClick={() => setShopTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded font-oswald text-sm tracking-wide uppercase transition-all"
                  style={shopTab === tab.id
                    ? { background: "rgba(0,245,255,0.12)", border: "1px solid var(--neon-cyan)", color: "var(--neon-cyan)" }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}>
                  <Icon name={tab.icon} size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {shopTab === "cases" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {SHOP_CASES.map(c => (
                  <div key={c.id} className="card-dark rounded-xl overflow-hidden cursor-pointer"
                    style={{ borderColor: `${c.color}25` }}
                    onClick={() => { setOpeningCase(c); setCaseResult(null); setCaseSpinning(false); navigate("cases"); }}>
                    <div className="h-36 relative overflow-hidden">
                      <img src={c.img} alt={c.name} className="w-full h-full object-cover" style={{ filter: `hue-rotate(${c.id * 40}deg) saturate(1.4)` }} />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(7,7,15,0.85) 0%, transparent 60%)` }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center animate-float"
                          style={{ background: `${c.color}20`, border: `2px solid ${c.color}50`, boxShadow: `0 0 20px ${c.color}40` }}>
                          <Icon name="Gift" size={30} style={{ color: c.color }} />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="font-oswald text-sm font-bold mb-1" style={{ color: c.color }}>{c.name}</div>
                      <p className="text-[11px] mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>{c.items}</p>
                      <button className="w-full py-2 rounded font-oswald tracking-widest uppercase text-xs font-bold"
                        style={{ background: `${c.color}15`, border: `1px solid ${c.color}40`, color: c.color }}>
                        {c.price} OC
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {shopTab === "raids" && (
              <div className="space-y-4">
                {RAIDS.map(raid => (
                  <div key={raid.id} className="card-dark rounded-xl p-5" style={{ borderColor: `${raid.color}25` }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${raid.color}12`, border: `2px solid ${raid.color}35` }}>
                          <Icon name="Rocket" size={28} style={{ color: raid.color }} />
                        </div>
                        <div>
                          <div className="font-oswald text-lg font-bold mb-1" style={{ color: raid.color }}>{raid.name}</div>
                          <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>{raid.reward}</div>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                              <Icon name="Clock" size={12} />
                              {raid.days} дней · осталось {raid.ends}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="btn-neon-cyan px-8 py-3 rounded-lg text-sm font-bold flex-shrink-0">
                        {raid.price} OC
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {shopTab === "oc" && (
              <div>
                <div className="card-dark rounded-xl p-4 mb-5" style={{ borderColor: "rgba(0,245,255,0.15)" }}>
                  <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                    <Icon name="Info" size={15} style={{ color: "var(--neon-cyan)" }} />
                    Оперативные кредиты (OC) — игровая валюта Shadow War. Курс: <strong className="text-white">100 OC = 50 руб.</strong>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {OC_PACKS.map(pack => (
                    <div key={pack.oc} className="card-dark rounded-xl p-4 text-center cursor-pointer transition-all"
                      style={{ borderColor: pack.bonus >= 40 ? "rgba(255,215,0,0.25)" : "rgba(0,245,255,0.1)" }}>
                      {pack.bonus > 0 && (
                        <div className="inline-block mb-2 text-[10px] px-2 py-0.5 rounded font-oswald tracking-widest uppercase"
                          style={{ background: "rgba(57,255,20,0.1)", color: "#39ff14", border: "1px solid rgba(57,255,20,0.25)" }}>
                          +{pack.bonus}% бонус
                        </div>
                      )}
                      <div className="font-oswald text-3xl font-black mb-1" style={{ color: pack.bonus >= 40 ? "#ffd700" : "var(--neon-cyan)" }}>
                        {pack.oc.toLocaleString()}
                      </div>
                      <div className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>OC · {pack.label}</div>
                      <button className="w-full py-2.5 rounded font-oswald tracking-widest uppercase text-sm font-bold"
                        style={{
                          background: pack.bonus >= 40 ? "linear-gradient(135deg,#c8a800,#ffd700)" : "rgba(0,245,255,0.12)",
                          color: pack.bonus >= 40 ? "#07070f" : "var(--neon-cyan)",
                          border: pack.bonus >= 40 ? "none" : "1px solid rgba(0,245,255,0.3)"
                        }}>
                        {pack.price} ₽
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== MARKET ===== */}
        {section === "market" && (
          <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-up">
              <div>
                <h2 className="section-title text-3xl md:text-4xl text-white mb-1">📈 Рынок игроков</h2>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Обмен и продажа предметов между игроками за OC</p>
              </div>
              <button className="btn-neon-cyan px-5 py-2.5 rounded-lg text-sm flex items-center gap-2">
                <Icon name="Plus" size={14} />
                Выставить предмет
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {["all", "skin", "knife", "agent", "charm", "sticker"].map(f => (
                <button key={f} onClick={() => setMarketFilter(f)}
                  className="px-3 py-1.5 rounded text-xs font-oswald tracking-widest uppercase transition-all"
                  style={marketFilter === f
                    ? { background: "rgba(0,245,255,0.15)", border: "1px solid var(--neon-cyan)", color: "var(--neon-cyan)" }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}>
                  {f === "all" ? "Все" : typeLabel[f] || f}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MARKET_LISTINGS
                .filter(item => marketFilter === "all" || item.type === marketFilter)
                .map(item => (
                <div key={item.id} className={`card-dark rounded-xl p-4 flex items-center gap-4`}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${rarityColor[item.rarity]}10`, border: `1px solid ${rarityColor[item.rarity]}30` }}>
                    <Icon name={item.icon} size={26} style={{ color: rarityColor[item.rarity] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-rajdhani font-bold text-sm text-white">{item.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-oswald" style={{ color: rarityColor[item.rarity] }}>{rarityLabel[item.rarity]}</span>
                      <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>· {item.seller}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-oswald font-bold text-base" style={{ color: "var(--neon-cyan)" }}>{item.price}</div>
                    <div className="text-[10px] mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>OC</div>
                    <button className="px-3 py-1 rounded text-[10px] font-oswald tracking-wide uppercase"
                      style={{ background: "rgba(0,245,255,0.12)", border: "1px solid rgba(0,245,255,0.3)", color: "var(--neon-cyan)" }}>
                      Купить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== INVENTORY ===== */}
        {section === "inventory" && (
          <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-up">
              <div>
                <h2 className="section-title text-3xl md:text-4xl text-white mb-1">📦 Инвентарь</h2>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{INVENTORY_ITEMS.length} предметов</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["all", "skin", "knife", "agent", "charm", "sticker"].map(f => (
                  <button key={f} onClick={() => setInventoryFilter(f)}
                    className="px-3 py-1.5 rounded text-xs font-oswald tracking-widest uppercase transition-all"
                    style={inventoryFilter === f
                      ? { background: "rgba(0,245,255,0.15)", border: "1px solid var(--neon-cyan)", color: "var(--neon-cyan)" }
                      : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}>
                    {f === "all" ? "Все" : typeLabel[f] || f}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4 rounded-xl overflow-hidden">
              <img src={SKINS_IMAGE} alt="Skins" className="w-full h-28 object-cover" style={{ objectPosition: "center 30%" }} />
            </div>

            {/* Knives section */}
            {(inventoryFilter === "all" || inventoryFilter === "knife") && (
              <div className="mb-6">
                <div className="font-oswald text-sm tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Ножи</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {KNIVES.map(knife => (
                    <div key={knife.id} className="card-dark rounded-xl p-3 cursor-pointer"
                      style={{ borderColor: `${knife.color}20` }}>
                      <div className="aspect-square rounded-lg mb-2 flex items-center justify-center"
                        style={{ background: `${knife.color}10`, border: `1px solid ${knife.color}25` }}>
                        <Icon name={knife.icon} size={32} style={{ color: knife.color }} />
                      </div>
                      <div className="font-rajdhani font-bold text-xs text-white">{knife.name}</div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {knife.skins.map(s => (
                          <span key={s} className="text-[9px] px-1 py-0.5 rounded"
                            style={{ background: `${knife.color}10`, color: knife.color, border: `1px solid ${knife.color}20` }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {INVENTORY_ITEMS
                .filter(item => inventoryFilter === "all" || item.type === inventoryFilter)
                .map(item => (
                <div key={item.id} className={`card-dark rounded-xl p-3 cursor-pointer rarity-${item.rarity}`}
                  style={{ borderColor: item.equipped ? "rgba(0,245,255,0.3)" : "" }}>
                  <div className="aspect-square rounded-lg mb-2 flex items-center justify-center overflow-hidden"
                    style={{ background: `${rarityColor[item.rarity]}08` }}>
                    {item.img
                      ? <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      : <Icon name={item.icon} size={26} />}
                  </div>
                  <div className="font-rajdhani font-bold text-xs text-white leading-tight">{item.name}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: rarityColor[item.rarity] }}>{rarityLabel[item.rarity]}</div>
                  {item.equipped && (
                    <div className="mt-1 text-center text-[9px] font-oswald tracking-widest px-1 py-0.5 rounded"
                      style={{ background: "rgba(0,245,255,0.1)", color: "var(--neon-cyan)", border: "1px solid rgba(0,245,255,0.2)" }}>
                      АКТИВЕН
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== CASES ===== */}
        {section === "cases" && (
          <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
            <div className="mb-6 animate-slide-up">
              <h2 className="section-title text-3xl md:text-4xl text-white mb-1">🎁 Открытие кейса</h2>
            </div>

            {!openingCase ? (
              <div className="text-center py-16">
                <p className="text-lg mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Выберите кейс в Магазине</p>
                <button onClick={() => navigate("shop")} className="btn-solid-cyan px-8 py-3 rounded-lg font-bold">
                  Перейти в магазин
                </button>
              </div>
            ) : (
              <div className="text-center max-w-2xl mx-auto">
                <button onClick={() => { setOpeningCase(null); setCaseResult(null); setCaseSpinning(false); navigate("shop"); }}
                  className="mb-6 flex items-center gap-2 text-sm font-oswald tracking-wide uppercase"
                  style={{ color: "rgba(255,255,255,0.4)" }}>
                  <Icon name="ChevronLeft" size={16} /> Назад в магазин
                </button>

                {/* Case preview image */}
                <div className="relative w-36 h-36 mx-auto mb-5 rounded-2xl overflow-hidden animate-float"
                  style={{ border: `2px solid ${openingCase.color}50`, boxShadow: `0 0 40px ${openingCase.color}30` }}>
                  <img src={openingCase.img} alt={openingCase.name} className="w-full h-full object-cover"
                    style={{ filter: `hue-rotate(${openingCase.id * 40}deg) saturate(1.5)` }} />
                  <div className="absolute inset-0 flex items-center justify-center"
                    style={{ background: `radial-gradient(circle, transparent 30%, ${openingCase.color}20 100%)` }}>
                    <Icon name="Gift" size={42} style={{ color: openingCase.color, filter: `drop-shadow(0 0 10px ${openingCase.color})` }} />
                  </div>
                </div>
                <div className="font-oswald text-2xl font-bold mb-2" style={{ color: openingCase.color }}>{openingCase.name}</div>
                <div className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>Цена: {openingCase.price} OC</div>

                {/* Reel */}
                <div className="relative overflow-hidden rounded-xl mb-8" style={{ border: `1px solid ${openingCase.color}30`, height: "116px" }}>
                  {/* center marker */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 z-10"
                    style={{ background: openingCase.color, boxShadow: `0 0 10px ${openingCase.color}`, transform: "translateX(-50%)" }} />
                  <div className="absolute top-0 left-1/2 w-0 h-0 z-10"
                    style={{ borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: `8px solid ${openingCase.color}`, transform: "translateX(-50%)" }} />

                  <div className="flex gap-2 p-2 absolute transition-transform"
                    style={{
                      transform: caseSpinning ? `translateX(-${spinOffset}px)` : "translateX(0)",
                      transition: caseSpinning ? "transform 3.5s cubic-bezier(0.12, 0.67, 0.08, 0.99)" : "none"
                    }}>
                    {[...CASE_REEL, ...CASE_REEL, ...CASE_REEL, ...CASE_REEL].map((item, idx) => (
                      <div key={idx} className="flex-shrink-0 w-24 h-24 rounded-lg flex flex-col items-center justify-center gap-1"
                        style={{
                          background: `${rarityColor[item.rarity]}10`,
                          border: `1px solid ${rarityColor[item.rarity]}40`
                        }}>
                        <Icon name="Crosshair" size={20} style={{ color: rarityColor[item.rarity] }} />
                        <div className="text-[9px] text-center px-1 leading-tight font-rajdhani font-bold"
                          style={{ color: rarityColor[item.rarity] }}>{item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Result */}
                {caseResult ? (
                  <div className="animate-slide-up">
                    <div className="w-20 h-20 rounded-xl mx-auto mb-3 flex items-center justify-center"
                      style={{ background: `${rarityColor[caseResult.rarity]}12`, border: `2px solid ${rarityColor[caseResult.rarity]}`, boxShadow: `0 0 30px ${rarityColor[caseResult.rarity]}40` }}>
                      <Icon name="Gift" size={36} style={{ color: rarityColor[caseResult.rarity] }} />
                    </div>
                    <div className="font-oswald text-2xl font-bold mb-1" style={{ color: rarityColor[caseResult.rarity] }}>{caseResult.name}</div>
                    <div className="text-sm mb-6 font-rajdhani font-bold" style={{ color: rarityColor[caseResult.rarity] }}>
                      {rarityLabel[caseResult.rarity]}
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button onClick={spinCase} className="btn-solid-cyan px-8 py-3 rounded-lg font-bold">Ещё раз</button>
                      <button onClick={() => navigate("inventory")} className="btn-neon-purple px-8 py-3 rounded-lg">В инвентарь</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={spinCase} disabled={caseSpinning}
                    className="btn-solid-cyan px-12 py-4 rounded-xl text-base font-black tracking-widest"
                    style={{ opacity: caseSpinning ? 0.6 : 1 }}>
                    {caseSpinning ? "Крутится..." : "🎰 Открыть кейс"}
                  </button>
                )}

                {/* Probabilities */}
                <div className="mt-6 card-dark rounded-xl p-4 text-left">
                  <div className="font-oswald text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Вероятности</div>
                  {[
                    { rarity: "common", prob: "55%" },
                    { rarity: "rare", prob: "30%" },
                    { rarity: "epic", prob: "12%" },
                    { rarity: "legendary", prob: "2.8%" },
                    { rarity: "ultra", prob: "0.2%" },
                  ].map(p => (
                    <div key={p.rarity} className="flex items-center justify-between mb-2">
                      <span className="text-sm font-rajdhani font-bold" style={{ color: rarityColor[p.rarity] }}>{rarityLabel[p.rarity]}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full" style={{ width: p.prob, background: rarityColor[p.rarity] }} />
                        </div>
                        <span className="text-sm font-bold font-rajdhani text-white w-10 text-right">{p.prob}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== RATING ===== */}
        {section === "rating" && (
          <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
            <div className="mb-6 animate-slide-up">
              <h2 className="section-title text-3xl md:text-4xl text-white mb-1">🏆 Рейтинг</h2>
              <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Топ бойцов Shadow War</p>
              <div className="flex gap-2">
                {[{ id: "table", label: "Таблица" }, { id: "ranks", label: "Ранги" }].map(t => (
                  <button key={t.id} onClick={() => setRatingTab(t.id as "table" | "ranks")}
                    className="px-4 py-1.5 rounded font-oswald text-xs tracking-wide uppercase transition-all"
                    style={ratingTab === t.id
                      ? { background: "rgba(0,245,255,0.12)", border: "1px solid var(--neon-cyan)", color: "var(--neon-cyan)" }
                      : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {ratingTab === "table" && (
              <>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[PLAYERS[1], PLAYERS[0], PLAYERS[2]].map((player, i) => {
                    const podiumPos = [2, 1, 3][i];
                    const heights = ["h-24", "h-32", "h-20"][i];
                    const colors = ["#C0C0C0", "#FFD700", "#CD7F32"][i];
                    return (
                      <div key={player.name} className="flex flex-col items-center">
                        <div className="font-rajdhani font-bold text-xs mb-1 text-center truncate w-full px-1"
                          style={{ color: "rgba(255,255,255,0.6)" }}>{player.name}</div>
                        <div className={`w-full ${heights} rounded-t-lg flex flex-col items-center justify-center`}
                          style={{ background: `linear-gradient(180deg, ${colors}18, ${colors}06)`, border: `1px solid ${colors}30` }}>
                          <div className="font-oswald text-3xl font-black" style={{ color: colors }}>{podiumPos}</div>
                          <div className="text-xs font-rajdhani" style={{ color: `${colors}80` }}>{player.xp} XP</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  {PLAYERS.map((player, i) => {
                    const r = getRank(player.xp);
                    const isMe = player.name === "Огненный";
                    return (
                      <div key={player.name} className="card-dark rounded-xl px-4 py-3 flex items-center gap-3"
                        style={{ borderColor: isMe ? "rgba(0,245,255,0.3)" : "", background: isMe ? "rgba(0,245,255,0.03)" : "" }}>
                        <div className="font-oswald text-base font-black w-6 text-center"
                          style={{ color: i < 3 ? ["#FFD700","#C0C0C0","#CD7F32"][i] : "rgba(255,255,255,0.2)" }}>
                          {i + 1}
                        </div>
                        <div className="text-lg w-6">{player.country}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-rajdhani font-bold text-sm truncate" style={{ color: isMe ? "var(--neon-cyan)" : "white" }}>{player.name}</span>
                            {isMe && <span className="text-[9px] px-1.5 py-0.5 rounded font-oswald flex-shrink-0" style={{ background: "rgba(0,245,255,0.1)", color: "var(--neon-cyan)", border: "1px solid rgba(0,245,255,0.2)" }}>ВЫ</span>}
                          </div>
                          <div className="text-xs font-rajdhani" style={{ color: r.color }}>{r.name}</div>
                        </div>
                        <div className="hidden sm:flex gap-4">
                          <div className="text-center">
                            <div className="font-rajdhani font-bold text-sm" style={{ color: "var(--neon-cyan)" }}>{player.kills}</div>
                            <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>убийств</div>
                          </div>
                          <div className="text-center">
                            <div className="font-rajdhani font-bold text-sm" style={{ color: "var(--neon-purple)" }}>{player.wins}</div>
                            <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>побед</div>
                          </div>
                        </div>
                        <div className="font-oswald font-bold text-sm" style={{ color: r.color }}>{player.xp}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {ratingTab === "ranks" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RANKS.map(r => (
                  <div key={r.name} className="card-dark rounded-xl p-4 flex items-center gap-4"
                    style={{ borderColor: `${r.color}20` }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${r.color}12`, border: `2px solid ${r.color}35` }}>
                      <Icon name={r.icon} size={22} style={{ color: r.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="font-oswald font-bold text-lg" style={{ color: r.color }}>{r.name}</div>
                      <div className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{r.min.toLocaleString()} – {r.max === 99999 ? "∞" : r.max.toLocaleString()} XP</div>
                    </div>
                    {playerXP >= r.min && playerXP <= r.max && (
                      <span className="text-[10px] px-2 py-1 rounded font-oswald tracking-wide"
                        style={{ background: `${r.color}15`, color: r.color, border: `1px solid ${r.color}30` }}>
                        Ваш ранг
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== COLLECTION ===== */}
        {section === "collection" && (
          <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
            <div className="mb-6 animate-slide-up">
              <h2 className="section-title text-3xl md:text-4xl text-white mb-1">🗂️ Коллекции</h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Собирайте полные коллекции и получайте награды</p>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
              {[
                { id: "weapons" as const, label: "Оружие", icon: "Crosshair" },
                { id: "agents" as const, label: "Агенты", icon: "Users" },
                { id: "knives" as const, label: "Ножи", icon: "Scissors" },
                { id: "stickers" as const, label: "Наклейки", icon: "Tag" },
                { id: "charms" as const, label: "Брелоки", icon: "KeyRound" },
              ].map(tab => (
                <button key={tab.id} onClick={() => setCollectionTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded font-oswald text-sm tracking-wide uppercase transition-all"
                  style={collectionTab === tab.id
                    ? { background: "rgba(0,245,255,0.12)", border: "1px solid var(--neon-cyan)", color: "var(--neon-cyan)" }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}>
                  <Icon name={tab.icon} size={13} />
                  {tab.label}
                </button>
              ))}
            </div>

            {collectionTab === "weapons" && (
              <div>
                <div className="mb-4 card-dark rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-oswald text-sm tracking-wide uppercase text-white">Прогресс коллекции</span>
                    <span className="font-rajdhani font-bold" style={{ color: "var(--neon-cyan)" }}>5 / 30</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="xp-bar h-full rounded-full" style={{ width: "17%" }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { cat: "Пистолеты", count: 6, owned: 1, color: "#4d9fff" },
                    { cat: "Пистолеты-пулемёты", count: 5, owned: 0, color: "#b44fff" },
                    { cat: "Дробовики", count: 4, owned: 1, color: "#ff6b35" },
                    { cat: "Штурмовые винтовки", count: 6, owned: 2, color: "#00f5ff" },
                    { cat: "Снайперские", count: 4, owned: 1, color: "#ffd700" },
                    { cat: "Пулемёты", count: 3, owned: 0, color: "#39ff14" },
                    { cat: "Гранаты", count: 2, owned: 0, color: "#aaaaaa" },
                  ].map(cat => (
                    <div key={cat.cat} className="card-dark rounded-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-rajdhani font-bold text-sm text-white">{cat.cat}</div>
                        <span className="font-rajdhani font-bold text-sm" style={{ color: cat.color }}>{cat.owned}/{cat.count}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div className="h-full rounded-full" style={{ width: `${(cat.owned / cat.count) * 100}%`, background: cat.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {collectionTab === "agents" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Призрак", rarity: "epic", owned: true },
                  { name: "Командир Х", rarity: "rare", owned: true },
                  { name: "Тень", rarity: "legendary", owned: false },
                  { name: "Кибер-Страж", rarity: "epic", owned: false },
                  { name: "Агент Буря", rarity: "rare", owned: false },
                  { name: "Феникс", rarity: "legendary", owned: false },
                  { name: "Шторм", rarity: "common", owned: true },
                  { name: "Охотник", rarity: "rare", owned: false },
                ].map(agent => (
                  <div key={agent.name} className="card-dark rounded-xl p-4 text-center"
                    style={{ opacity: agent.owned ? 1 : 0.35 }}>
                    <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                      style={{ background: `${rarityColor[agent.rarity]}12`, border: `2px solid ${rarityColor[agent.rarity]}35` }}>
                      <Icon name="User" size={28} style={{ color: rarityColor[agent.rarity] }} />
                    </div>
                    <div className="font-rajdhani font-bold text-sm text-white">{agent.name}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: rarityColor[agent.rarity] }}>{rarityLabel[agent.rarity]}</div>
                    {!agent.owned && <div className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>Не получен</div>}
                  </div>
                ))}
              </div>
            )}

            {collectionTab === "knives" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {KNIVES.map(knife => (
                  <div key={knife.id} className="card-dark rounded-xl p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `${knife.color}12`, border: `2px solid ${knife.color}30` }}>
                        <Icon name={knife.icon} size={24} style={{ color: knife.color }} />
                      </div>
                      <div className="font-oswald font-bold text-lg" style={{ color: knife.color }}>{knife.name}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {knife.skins.map((skin, si) => (
                        <div key={skin} className="flex items-center gap-2 p-2.5 rounded-lg"
                          style={{ background: si === 0 ? `${knife.color}10` : "rgba(255,255,255,0.03)", border: `1px solid ${si === 0 ? knife.color + "30" : "rgba(255,255,255,0.06)"}` }}>
                          <Icon name={knife.icon} size={16} style={{ color: si === 0 ? knife.color : "rgba(255,255,255,0.3)" }} />
                          <span className="text-xs font-rajdhani font-bold" style={{ color: si === 0 ? knife.color : "rgba(255,255,255,0.4)" }}>
                            {skin}
                          </span>
                          {si === 0 && <Icon name="Check" size={12} style={{ color: knife.color, marginLeft: "auto" }} />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {collectionTab === "stickers" && (
              <div>
                <div className="card-dark rounded-xl p-4 mb-5 flex items-start gap-3">
                  <Icon name="Info" size={16} style={{ color: "var(--neon-cyan)", flexShrink: 0, marginTop: "2px" }} />
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Наклейки наносятся на оружие (до 3 на ствол). Имеют эффекты износа: царапины, потёртости. Более 100 вариантов.
                  </p>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {Array.from({ length: 10 }, (_, i) => ({
                    name: ["Феникс", "Череп", "Волк", "Дракон", "Орёл", "Пламя", "Лёд", "Гром", "Тень", "Туман"][i],
                    rarity: (["common","rare","epic","rare","common","legendary","rare","epic","common","rare"] as const)[i],
                    owned: i < 2,
                  })).map(s => (
                    <div key={s.name} className="card-dark rounded-xl p-3 text-center"
                      style={{ opacity: s.owned ? 1 : 0.35 }}>
                      <div className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center"
                        style={{ background: `${rarityColor[s.rarity]}10`, border: `1px solid ${rarityColor[s.rarity]}25` }}>
                        <Icon name="Tag" size={22} style={{ color: rarityColor[s.rarity] }} />
                      </div>
                      <div className="text-xs font-rajdhani font-bold text-white">{s.name}</div>
                      <div className="text-[9px] mt-0.5" style={{ color: rarityColor[s.rarity] }}>{rarityLabel[s.rarity]}</div>
                    </div>
                  ))}
                  <div className="card-dark rounded-xl p-3 flex items-center justify-center cursor-pointer"
                    style={{ border: "1px dashed rgba(255,255,255,0.1)", opacity: 0.5 }}>
                    <div className="text-center">
                      <div className="font-oswald text-2xl font-bold" style={{ color: "rgba(255,255,255,0.2)" }}>+90</div>
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>ещё</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {collectionTab === "charms" && (
              <div>
                <div className="card-dark rounded-xl p-4 mb-5 flex items-start gap-3">
                  <Icon name="Info" size={16} style={{ color: "var(--neon-cyan)", flexShrink: 0, marginTop: "2px" }} />
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Брелоки отображаются на оружии, анимируются при движении. Более 50 вариантов. Редкость: от обычной до ультраредкой.
                  </p>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {[
                    { name: "Дракон", rarity: "epic", owned: true },
                    { name: "Кибер-Кот", rarity: "rare", owned: true },
                    { name: "Skull Key", rarity: "common", owned: true },
                    { name: "Пират", rarity: "common", owned: false },
                    { name: "Лиса", rarity: "rare", owned: false },
                    { name: "Демон", rarity: "legendary", owned: false },
                  ].map(c => (
                    <div key={c.name} className="card-dark rounded-xl p-3 text-center"
                      style={{ opacity: c.owned ? 1 : 0.35 }}>
                      <div className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center"
                        style={{ background: `${rarityColor[c.rarity]}10`, border: `1px solid ${rarityColor[c.rarity]}25` }}>
                        <Icon name="KeyRound" size={22} style={{ color: rarityColor[c.rarity] }} />
                      </div>
                      <div className="text-xs font-rajdhani font-bold text-white">{c.name}</div>
                      <div className="text-[9px] mt-0.5" style={{ color: rarityColor[c.rarity] }}>{rarityLabel[c.rarity]}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== SETTINGS ===== */}
        {section === "settings" && (
          <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
            <div className="mb-6 animate-slide-up">
              <h2 className="section-title text-3xl md:text-4xl text-white mb-1">⚙️ Настройки</h2>
            </div>
            <div className="flex gap-2 mb-6 flex-wrap">
              {[
                { id: "graphics", label: "Графика", icon: "Monitor" },
                { id: "audio", label: "Звук", icon: "Volume2" },
                { id: "controls", label: "Управление", icon: "Gamepad2" },
                { id: "support", label: "Поддержка", icon: "Headphones" },
              ].map(tab => (
                <button key={tab.id} onClick={() => setSettingsTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded font-oswald text-sm tracking-wide uppercase transition-all"
                  style={settingsTab === tab.id
                    ? { background: "rgba(0,245,255,0.12)", border: "1px solid var(--neon-cyan)", color: "var(--neon-cyan)" }
                    : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                  <Icon name={tab.icon} size={14} />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="card-dark rounded-xl p-6">
              {settingsTab === "graphics" && (
                <div className="space-y-6">
                  {[
                    { label: "Качество графики", options: ["Низкое","Среднее","Высокое","Ультра"], current: graphics.quality, onChange: (v: string) => setGraphics(g => ({...g, quality: v})) },
                    { label: "Ограничение FPS", options: ["30","60","120","Без лимита"], current: graphics.fps, onChange: (v: string) => setGraphics(g => ({...g, fps: v})) },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="font-rajdhani font-bold text-sm mb-2 text-white">{s.label}</div>
                      <div className="flex gap-2 flex-wrap">
                        {s.options.map(opt => (
                          <button key={opt} onClick={() => s.onChange(opt)}
                            className="px-3 py-1.5 rounded text-xs font-oswald tracking-wide transition-all"
                            style={s.current === opt
                              ? { background: "rgba(0,245,255,0.15)", border: "1px solid var(--neon-cyan)", color: "var(--neon-cyan)" }
                              : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {[{ label: "Тени", key: "shadows" as const }, { label: "Размытие движения", key: "blur" as const }].map(t => (
                    <div key={t.label} className="flex items-center justify-between">
                      <span className="font-rajdhani font-bold text-sm text-white">{t.label}</span>
                      <button onClick={() => setGraphics(g => ({...g, [t.key]: !g[t.key]}))}
                        className="relative w-12 h-6 rounded-full transition-all"
                        style={{ background: graphics[t.key] ? "var(--neon-cyan)" : "rgba(255,255,255,0.1)" }}>
                        <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                          style={{ left: graphics[t.key] ? "1.5rem" : "0.25rem" }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {settingsTab === "audio" && (
                <div className="space-y-6">
                  {[
                    { label: "Общая громкость", key: "master" as const },
                    { label: "Музыка", key: "music" as const },
                    { label: "Звуковые эффекты", key: "effects" as const },
                    { label: "Голосовой чат", key: "voice" as const },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between mb-1.5">
                        <span className="font-rajdhani font-bold text-sm text-white">{s.label}</span>
                        <span className="font-rajdhani text-sm" style={{ color: "var(--neon-cyan)" }}>{audio[s.key]}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={audio[s.key]}
                        onChange={e => setAudio(a => ({...a, [s.key]: +e.target.value}))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(90deg, var(--neon-cyan) ${audio[s.key]}%, rgba(255,255,255,0.1) ${audio[s.key]}%)` }} />
                    </div>
                  ))}
                  <div className="card-dark rounded-xl p-4" style={{ borderColor: "rgba(57,255,20,0.2)" }}>
                    <div className="font-oswald text-sm text-white mb-1 tracking-wide uppercase">Звуковые системы</div>
                    <div className="space-y-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <div>• Уникальные звуки для каждого типа оружия</div>
                      <div>• Голосовые реплики ботов и агентов на русском</div>
                      <div>• Динамическая музыка: боевая / меню / финальный аккорд</div>
                    </div>
                  </div>
                </div>
              )}
              {settingsTab === "controls" && (
                <div>
                  {[
                    { action: "Вперёд", key: "W" }, { action: "Назад", key: "S" },
                    { action: "Влево", key: "A" }, { action: "Вправо", key: "D" },
                    { action: "Прицел", key: "ПКМ" }, { action: "Стрелять", key: "ЛКМ" },
                    { action: "Перезарядка", key: "R" }, { action: "Присесть", key: "C" },
                    { action: "Нож", key: "3" }, { action: "Граната", key: "G" },
                  ].map(bind => (
                    <div key={bind.action} className="flex items-center justify-between py-2.5"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="font-rajdhani text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{bind.action}</span>
                      <kbd className="px-3 py-1 rounded text-xs font-oswald font-bold"
                        style={{ background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.2)", color: "var(--neon-cyan)" }}>
                        {bind.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              )}
              {settingsTab === "support" && (
                <div className="space-y-4">
                  {/* Creator card */}
                  <div className="rounded-xl p-4 flex items-center gap-4"
                    style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.08), rgba(180,79,255,0.08))", border: "1px solid rgba(0,245,255,0.2)" }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #00f5ff, #b44fff)", boxShadow: "0 0 15px rgba(0,245,255,0.3)" }}>
                      <Icon name="Code2" size={22} style={{ color: "#07070f" }} />
                    </div>
                    <div>
                      <div className="text-[10px] font-oswald tracking-widest uppercase mb-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Создатель игры</div>
                      <div className="font-oswald text-lg font-bold tracking-wider"
                        style={{ color: "var(--neon-cyan)", textShadow: "0 0 10px rgba(0,245,255,0.3)" }}>
                        ALEKSANDR LOZOVOI
                      </div>
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Shadow War © 2025 · Все права защищены</div>
                    </div>
                  </div>

                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Обратитесь к нашей команде поддержки по любым вопросам</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { icon: "MessageCircle", label: "Онлайн-чат", desc: "Ответ за 5 минут" },
                      { icon: "Mail", label: "Email поддержка", desc: "support@shadowwar.gg" },
                      { icon: "Bug", label: "Сообщить о баге", desc: "Помоги улучшить игру" },
                      { icon: "FileText", label: "Документы", desc: "Правила и политика" },
                    ].map(item => (
                      <button key={item.label} className="card-dark rounded-xl p-4 text-left flex items-start gap-3">
                        <Icon name={item.icon} size={20} style={{ color: "var(--neon-cyan)", flexShrink: 0, marginTop: "2px" }} />
                        <div>
                          <div className="font-rajdhani font-bold text-sm text-white">{item.label}</div>
                          <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{item.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== MATCH ===== */}
        {section === "match" && (
          <div className="relative w-full" style={{ minHeight: "calc(100vh - 4rem)" }}>
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden">
              <img src={MATCH_HUD_IMAGE} alt="Match" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "rgba(7,7,15,0.6)" }} />
            </div>

            {/* ── HUD TOP ── */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2"
              style={{ background: "rgba(7,7,15,0.7)", borderBottom: "1px solid rgba(0,245,255,0.1)" }}>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-lg text-center"
                  style={{ background: "rgba(0,245,255,0.12)", border: "1px solid rgba(0,245,255,0.25)" }}>
                  <div className="font-oswald text-xl font-black" style={{ color: "var(--neon-cyan)" }}>{matchScore.me}</div>
                  <div className="text-[8px] font-oswald tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>ВЫ</div>
                </div>
                <span className="font-oswald text-sm font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>VS</span>
                <div className="px-3 py-1.5 rounded-lg text-center"
                  style={{ background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.25)" }}>
                  <div className="font-oswald text-xl font-black" style={{ color: "#ff6b35" }}>{matchScore.bots}</div>
                  <div className="text-[8px] font-oswald tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>БОТЫ</div>
                </div>
              </div>

              <div className="text-center">
                <div className="font-oswald text-lg font-bold text-white">
                  {String(Math.floor(matchTime / 60)).padStart(2,"0")}:{String(matchTime % 60).padStart(2,"0")}
                </div>
                <div className="text-[9px] font-oswald tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {MAPS.find(m => m.id === selectedMap)?.name || "Арена"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-lg text-center"
                  style={{ background: "rgba(180,79,255,0.12)", border: "1px solid rgba(180,79,255,0.25)" }}>
                  <div className="font-oswald text-xl font-black" style={{ color: "#b44fff" }}>{matchKills}</div>
                  <div className="text-[8px] font-oswald tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>УБИЙСТВ</div>
                </div>
                <button onClick={() => navigate("play")}
                  className="p-2 rounded-lg" style={{ background: "rgba(255,0,0,0.12)", border: "1px solid rgba(255,0,0,0.25)", color: "#ff4444" }}>
                  <Icon name="LogOut" size={14} />
                </button>
              </div>
            </div>

            {/* ── TABS ── */}
            <div className="absolute top-14 left-0 right-0 z-20 flex justify-center gap-2 px-4">
              {[
                { id: "game" as const, label: "🎮 Бой" },
                { id: "bots" as const, label: "🤖 Боты" },
                { id: "skins" as const, label: "✨ Скины" },
              ].map(t => (
                <button key={t.id} onClick={() => setMatchTab(t.id)}
                  className="px-4 py-1.5 rounded-full font-oswald text-xs tracking-wide uppercase transition-all"
                  style={matchTab === t.id
                    ? { background: "rgba(0,245,255,0.2)", border: "1px solid var(--neon-cyan)", color: "var(--neon-cyan)" }
                    : { background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── TAB: GAME ── */}
            {matchTab === "game" && (<>
              {/* Kill feed */}
              <div className="absolute top-28 right-3 z-10 space-y-1 max-w-[200px]">
                {matchLog.slice(-6).map(log => (
                  <div key={log.id} className="text-[11px] font-rajdhani font-bold px-2 py-1 rounded"
                    style={{ background: "rgba(0,0,0,0.7)", color: log.color, border: `1px solid ${log.color}25` }}>
                    {log.text}
                  </div>
                ))}
              </div>

              {/* Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="relative w-8 h-8">
                  <div className="absolute top-0 left-1/2 w-0.5 h-3 -translate-x-1/2" style={{ background: "rgba(0,245,255,0.85)" }} />
                  <div className="absolute bottom-0 left-1/2 w-0.5 h-3 -translate-x-1/2" style={{ background: "rgba(0,245,255,0.85)" }} />
                  <div className="absolute left-0 top-1/2 h-0.5 w-3 -translate-y-1/2" style={{ background: "rgba(0,245,255,0.85)" }} />
                  <div className="absolute right-0 top-1/2 h-0.5 w-3 -translate-y-1/2" style={{ background: "rgba(0,245,255,0.85)" }} />
                  <div className="absolute inset-0 m-auto w-1 h-1 rounded-full" style={{ background: "rgba(0,245,255,1)" }} />
                </div>
              </div>

              {/* HUD BOTTOM */}
              <div className="absolute bottom-4 left-0 right-0 z-20 px-3">
                {/* Health + armor */}
                <div className="flex items-end justify-between mb-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Icon name="Heart" size={13} style={{ color: "#ff4444" }} />
                      <div className="w-28 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${matchHealth}%`, background: matchHealth > 50 ? "#39ff14" : matchHealth > 25 ? "#ffd700" : "#ff4444" }} />
                      </div>
                      <span className="font-oswald text-sm font-bold text-white">{matchHealth}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Shield" size={13} style={{ color: "#4d9fff" }} />
                      <div className="w-28 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-full rounded-full" style={{ width: "65%", background: "#4d9fff" }} />
                      </div>
                      <span className="font-oswald text-sm font-bold text-white">65</span>
                    </div>
                  </div>

                  {/* Minimap — interactive */}
                  <div className="w-32 h-32 rounded-lg overflow-hidden relative"
                    style={{ border: "1px solid rgba(0,245,255,0.25)", background: "rgba(0,0,0,0.75)" }}>
                    {/* Grid */}
                    <div className="absolute inset-0 grid-bg opacity-30" />
                    <div className="text-[8px] font-oswald tracking-widest absolute top-1 left-1"
                      style={{ color: "rgba(0,245,255,0.4)" }}>КАРТА</div>
                    {/* Player */}
                    <div className="absolute w-2.5 h-2.5 rounded-full z-10 transition-all duration-300"
                      style={{ background: "var(--neon-cyan)", boxShadow: "0 0 6px var(--neon-cyan)",
                        left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: "translate(-50%,-50%)" }} />
                    {/* Bots */}
                    {bots.filter(b => b.hp > 0).map(b => (
                      <div key={b.id} className="absolute w-2 h-2 rounded-full transition-all duration-500"
                        style={{ background: b.color, boxShadow: `0 0 4px ${b.color}`,
                          left: `${b.x}%`, top: `${b.y}%`, transform: "translate(-50%,-50%)" }} />
                    ))}
                    {/* WASD controls ON minimap */}
                    <div className="absolute bottom-1 right-1 flex flex-col items-center gap-0.5">
                      <button onClick={() => movePlayer("N")}
                        className="w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center"
                        style={{ background: playerDir==="N" ? "rgba(0,245,255,0.4)" : "rgba(0,0,0,0.6)", border: "1px solid rgba(0,245,255,0.2)", color: "var(--neon-cyan)" }}>W</button>
                      <div className="flex gap-0.5">
                        <button onClick={() => movePlayer("W")}
                          className="w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center"
                          style={{ background: playerDir==="W" ? "rgba(0,245,255,0.4)" : "rgba(0,0,0,0.6)", border: "1px solid rgba(0,245,255,0.2)", color: "var(--neon-cyan)" }}>A</button>
                        <button onClick={() => movePlayer("S")}
                          className="w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center"
                          style={{ background: playerDir==="S" ? "rgba(0,245,255,0.4)" : "rgba(0,0,0,0.6)", border: "1px solid rgba(0,245,255,0.2)", color: "var(--neon-cyan)" }}>S</button>
                        <button onClick={() => movePlayer("E")}
                          className="w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center"
                          style={{ background: playerDir==="E" ? "rgba(0,245,255,0.4)" : "rgba(0,0,0,0.6)", border: "1px solid rgba(0,245,255,0.2)", color: "var(--neon-cyan)" }}>D</button>
                      </div>
                    </div>
                  </div>

                  {/* Weapon skin */}
                  <div className="text-right">
                    <div className="h-10 w-24 rounded overflow-hidden mb-1 ml-auto"
                      style={{ border: `1px solid ${rarityColor[weaponSkins[selectedWeaponSkin].rarity]}30` }}>
                      <img src={weaponSkins[selectedWeaponSkin].img} alt="weapon" className="w-full h-full object-cover" />
                    </div>
                    <div className="font-oswald text-xl font-black text-white">
                      {matchAmmo.current}
                      <span className="text-xs font-normal ml-1" style={{ color: "rgba(255,255,255,0.35)" }}>/ {matchAmmo.reserve}</span>
                    </div>
                    <div className="text-[9px] font-oswald tracking-widest" style={{ color: rarityColor[weaponSkins[selectedWeaponSkin].rarity] }}>
                      {weaponSkins[selectedWeaponSkin].name}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 justify-center flex-wrap">
                  <button
                    className="px-5 py-2.5 rounded-xl font-oswald tracking-widest uppercase text-sm font-bold transition-all active:scale-95"
                    style={{ background: "rgba(0,245,255,0.18)", border: "1px solid rgba(0,245,255,0.4)", color: "var(--neon-cyan)", boxShadow: "0 0 12px rgba(0,245,255,0.15)" }}
                    onClick={() => {
                      if (matchAmmo.current === 0) {
                        setMatchLog(l => [...l, { text: "Нет патронов! Перезарядись", color: "#ffd700", id: Date.now() }]);
                        return;
                      }
                      const botLevel = BOT_LEVELS.find(bl => bl.id === selectedBot);
                      const myAcc = 0.65;
                      const killed = Math.random() < myAcc;
                      const id = Date.now();
                      if (killed) {
                        const target = bots.find(b => b.hp > 0);
                        if (target) {
                          const dmgToBots = Math.floor(Math.random() * 35 + 20);
                          const newHp = target.hp - dmgToBots;
                          setBots(bs => bs.map(b => b.id === target.id ? { ...b, hp: Math.max(0, newHp), state: "chase" } : b));
                          if (newHp <= 0) {
                            setMatchScore(s => ({ ...s, me: s.me + 1 }));
                            setMatchKills(k => k + 1);
                            setMatchLog(l => [...l, { text: `☠ ${target.name} убит! +1 фраг`, color: "#00f5ff", id }]);
                          } else {
                            setMatchLog(l => [...l, { text: `Попал в ${target.name} −${dmgToBots} HP`, color: "#00f5ff", id }]);
                          }
                        }
                      } else {
                        setMatchLog(l => [...l, { text: "Промах!", color: "rgba(255,255,255,0.4)", id }]);
                      }
                      setMatchAmmo(a => ({ ...a, current: Math.max(0, a.current - 1) }));
                      setMatchTime(t => t + Math.floor(Math.random() * 3 + 1));
                      // Bot AI response
                      setTimeout(() => botAct(), 600);
                    }}>
                    🔫 Стрелять
                  </button>
                  <button
                    className="px-4 py-2.5 rounded-xl font-oswald tracking-widest uppercase text-sm transition-all active:scale-95"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.55)" }}
                    onClick={() => {
                      setMatchAmmo(a => ({ current: 30, reserve: Math.max(0, a.reserve - 30) }));
                      setMatchLog(l => [...l, { text: "Перезарядка...", color: "#ffd700", id: Date.now() }]);
                    }}>
                    🔄 Reload
                  </button>
                  <button
                    className="px-4 py-2.5 rounded-xl font-oswald tracking-widest uppercase text-sm transition-all active:scale-95"
                    style={{ background: "rgba(57,255,20,0.1)", border: "1px solid rgba(57,255,20,0.22)", color: "#39ff14" }}
                    onClick={() => {
                      const heal = Math.floor(Math.random() * 20 + 15);
                      setMatchHealth(h => Math.min(100, h + heal));
                      setMatchLog(l => [...l, { text: `💊 +${heal} HP`, color: "#39ff14", id: Date.now() }]);
                    }}>
                    💊 Аптечка
                  </button>
                  <button
                    className="px-4 py-2.5 rounded-xl font-oswald tracking-widest uppercase text-sm transition-all active:scale-95"
                    style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.22)", color: "#ffd700" }}
                    onClick={() => {
                      setMatchLog(l => [...l, { text: "💣 Граната брошена!", color: "#ffd700", id: Date.now() }]);
                      const dmgAll = Math.floor(Math.random() * 30 + 15);
                      setBots(bs => bs.map(b => b.hp > 0 ? { ...b, hp: Math.max(0, b.hp - dmgAll) } : b));
                      setMatchTime(t => t + 3);
                    }}>
                    💣 Граната
                  </button>
                </div>

                {!matchAlive && (
                  <div className="text-center mt-3 animate-slide-up">
                    <div className="font-oswald text-lg font-bold mb-2" style={{ color: "#ff4444" }}>Вы убиты! Ждите возрождения...</div>
                    <button
                      className="btn-solid-cyan px-8 py-2.5 rounded-xl font-bold"
                      onClick={() => { setMatchHealth(100); setMatchAlive(true); setMatchLog(l => [...l, { text: "🔄 Возрождение!", color: "#00f5ff", id: Date.now() }]); }}>
                      Возродиться
                    </button>
                  </div>
                )}
              </div>
            </>)}

            {/* ── TAB: BOTS ── */}
            {matchTab === "bots" && (
              <div className="absolute top-28 left-0 right-0 bottom-0 z-20 overflow-y-auto px-4 py-3">
                <div className="font-oswald text-lg font-bold text-white mb-3 tracking-wide uppercase">Состояние ботов</div>
                <div className="space-y-3">
                  {bots.map(bot => {
                    const isDead = bot.hp <= 0;
                    const stateLabel: Record<string,string> = { patrol: "🚶 Патруль", chase: "⚡ Преследование", idle: "💤 Ожидание" };
                    const distToPlayer = Math.round(Math.sqrt((bot.x - playerPos.x)**2 + (bot.y - playerPos.y)**2));
                    return (
                      <div key={bot.id} className="card-dark rounded-xl p-4"
                        style={{ opacity: isDead ? 0.4 : 1, borderColor: isDead ? "rgba(255,0,0,0.2)" : `${bot.color}25` }}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                            style={{ border: `2px solid ${bot.color}40` }}>
                            <img src={bot.skin} alt={bot.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-oswald font-bold text-sm" style={{ color: bot.color }}>{bot.name}</span>
                              {isDead
                                ? <span className="text-[9px] px-1.5 py-0.5 rounded font-oswald" style={{ background: "rgba(255,0,0,0.15)", color: "#ff4444", border: "1px solid rgba(255,0,0,0.3)" }}>УБИТ</span>
                                : <span className="text-[9px] px-1.5 py-0.5 rounded font-oswald" style={{ background: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.5)" }}>{stateLabel[bot.state]}</span>
                              }
                            </div>
                            <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                              Позиция: {Math.round(bot.x)},{Math.round(bot.y)} · Дистанция: {distToPlayer}м
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-oswald font-bold text-sm" style={{ color: bot.hp > 50 ? "#39ff14" : bot.hp > 25 ? "#ffd700" : "#ff4444" }}>
                              {bot.hp} HP
                            </div>
                          </div>
                        </div>
                        {/* HP bar */}
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${bot.hp}%`, background: bot.hp > 50 ? "#39ff14" : bot.hp > 25 ? "#ffd700" : "#ff4444" }} />
                        </div>
                        {/* Bot tactic info */}
                        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                          {[
                            { label: "Маршрут", val: bot.state === "chase" ? "К игроку" : "Патруль" },
                            { label: "Оружие", val: distToPlayer > 40 ? "Снайпер" : distToPlayer > 20 ? "Автомат" : "Пистолет" },
                            { label: "Тактика", val: bot.hp < 30 ? "Укрытие" : bot.state === "chase" ? "Атака" : "Обход" },
                          ].map(info => (
                            <div key={info.label} className="rounded p-1.5" style={{ background: "rgba(255,255,255,0.04)" }}>
                              <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{info.label}</div>
                              <div className="text-[11px] font-rajdhani font-bold text-white">{info.val}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 card-dark rounded-xl p-4">
                  <div className="font-oswald text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Алгоритм ботов</div>
                  <div className="space-y-1 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                    <div>🗺 Патрулирование: динамические маршруты с обходом препятствий (A*)</div>
                    <div>👁 Обнаружение: радиус {BOT_LEVELS.find(b => b.id === selectedBot)?.stats.accuracy ?? 50}% → переход в режим преследования</div>
                    <div>🎯 Стрельба: точность {BOT_LEVELS.find(b => b.id === selectedBot)?.stats.accuracy ?? 50}%, коррекция прицела после промаха</div>
                    <div>🛡 Укрытие: отступление при HP &lt; 30%, поиск укрытий для перезарядки</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: SKINS ── */}
            {matchTab === "skins" && (
              <div className="absolute top-28 left-0 right-0 bottom-0 z-20 overflow-y-auto px-4 py-3">
                <div className="font-oswald text-lg font-bold text-white mb-1 tracking-wide uppercase">Скины в матче</div>
                <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Выберите скин — он применится к оружию в бою</p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {weaponSkins.map((skin, i) => (
                    <div key={skin.name}
                      className="card-dark rounded-xl overflow-hidden cursor-pointer transition-all"
                      style={{ borderColor: selectedWeaponSkin === i ? rarityColor[skin.rarity] : `${rarityColor[skin.rarity]}20`,
                        boxShadow: selectedWeaponSkin === i ? `0 0 15px ${rarityColor[skin.rarity]}30` : "none" }}
                      onClick={() => {
                        setSelectedWeaponSkin(i);
                        setMatchLog(l => [...l, { text: `Скин «${skin.name}» применён`, color: rarityColor[skin.rarity], id: Date.now() }]);
                      }}>
                      <div className="h-24 relative overflow-hidden">
                        <img src={skin.img} alt={skin.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,7,15,0.8) 0%, transparent 60%)" }} />
                        {selectedWeaponSkin === i && (
                          <div className="absolute top-2 right-2">
                            <Icon name="CheckCircle2" size={18} style={{ color: rarityColor[skin.rarity] }} />
                          </div>
                        )}
                      </div>
                      <div className="p-2.5">
                        <div className="font-rajdhani font-bold text-sm text-white">{skin.name}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: rarityColor[skin.rarity] }}>{rarityLabel[skin.rarity]}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bots skins */}
                <div className="font-oswald text-sm tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Скины ботов</div>
                <div className="space-y-2">
                  {bots.map(bot => (
                    <div key={bot.id} className="card-dark rounded-xl p-3 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ border: `1px solid ${bot.color}30` }}>
                        <img src={bot.skin} alt={bot.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-rajdhani font-bold text-sm" style={{ color: bot.color }}>{bot.name}</div>
                        <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                          Случайный скин · загружен при старте матча
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="text-[9px] px-2 py-1 rounded font-oswald tracking-wide"
                          style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          Авто
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 card-dark rounded-xl p-4">
                  <div className="font-oswald text-xs tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Система скинов</div>
                  <div className="space-y-1 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                    <div>📦 Скины загружаются из кэша при старте матча</div>
                    <div>🎨 Текстуры применяются к 3D-моделям оружия и агентов</div>
                    <div>⚡ Анимации (стрельба, перезарядка) сохраняются со скином</div>
                    <div>🔄 При недоступности скина — базовый облик</div>
                    <div>📱 На слабых устройствах — пониженное качество текстур</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}