import { useState } from "react";
import Icon from "@/components/ui/icon";

type Section = "menu" | "arena" | "inventory" | "cases" | "rating" | "settings" | "faq";

const ARENA_IMAGE = "https://cdn.poehali.dev/projects/dc723a4d-7da4-4eb3-9533-f186e94ee645/files/d8152b98-3553-4f5e-97eb-11f436aa1982.jpg";
const SKINS_IMAGE = "https://cdn.poehali.dev/projects/dc723a4d-7da4-4eb3-9533-f186e94ee645/files/c2892e5f-0128-4f82-82d6-bfe9d3c52aa2.jpg";

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

const ITEMS = [
  { id: 1, name: "AK-Shadow", type: "skin", rarity: "legendary", equipped: true },
  { id: 2, name: "Призрак", type: "agent", rarity: "epic", equipped: true },
  { id: 3, name: "Неон-Найф", type: "skin", rarity: "rare", equipped: false },
  { id: 4, name: "Командир Х", type: "agent", rarity: "rare", equipped: false },
  { id: 5, name: "Дракон", type: "charm", rarity: "epic", equipped: true },
  { id: 6, name: "M4-Киберпанк", type: "skin", rarity: "rare", equipped: false },
  { id: 7, name: "Агент Тень", type: "agent", rarity: "common", equipped: false },
  { id: 8, name: "Skull Key", type: "charm", rarity: "common", equipped: false },
  { id: 9, name: "Снайпер X", type: "skin", rarity: "legendary", equipped: false },
  { id: 10, name: "Кибер-Кот", type: "charm", rarity: "rare", equipped: false },
  { id: 11, name: "USP-Aurora", type: "skin", rarity: "epic", equipped: false },
  { id: 12, name: "Пиратский", type: "charm", rarity: "common", equipped: false },
];

const CASES = [
  { id: 1, name: "Теневой кейс", price: 299, color: "#00f5ff", items: ["AK-Shadow", "Призрак", "Неон-Найф", "Дракон", "Агент Тень"] },
  { id: 2, name: "Пурпурный кейс", price: 499, color: "#b44fff", items: ["Снайпер X", "Кибер-Кот", "USP-Aurora", "Командир Х", "Skull Key"] },
  { id: 3, name: "Огненный кейс", price: 799, color: "#ff6b35", items: ["Легенда", "Феникс", "Огненный меч", "Дракон X", "Командир"] },
];

const CASE_ITEMS_REEL = [
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
  common: "Обычный",
  rare: "Редкий",
  epic: "Эпический",
  legendary: "Легендарный",
};

const typeLabel: Record<string, string> = {
  skin: "Скин",
  agent: "Агент",
  charm: "Брелок",
};

const typeIcon: Record<string, string> = {
  skin: "Crosshair",
  agent: "User",
  charm: "KeyRound",
};

const playerXP = 1340;

export default function Index() {
  const [section, setSection] = useState<Section>("menu");
  const [animating, setAnimating] = useState(false);
  const [inventoryFilter, setInventoryFilter] = useState<string>("all");
  const [openingCase, setOpeningCase] = useState<number | null>(null);
  const [caseResult, setCaseResult] = useState<{ name: string; rarity: string } | null>(null);
  const [caseSpinning, setCaseSpinning] = useState(false);
  const [settingsTab, setSettingsTab] = useState("graphics");
  const [graphics, setGraphics] = useState({ quality: "Высокое", fps: "120", shadows: true, blur: true });
  const [audio, setAudio] = useState({ master: 80, music: 60, effects: 90, voice: 70 });
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const rank = getRank(playerXP);
  const nextRank = getNextRank(playerXP);
  const xpProgress = nextRank ? ((playerXP - rank.min) / (nextRank.min - rank.min)) * 100 : 100;

  const navigate = (s: Section) => {
    if (s === section) return;
    setAnimating(true);
    setTimeout(() => {
      setSection(s);
      setAnimating(false);
    }, 180);
  };

  const openCase = (caseId: number) => {
    setOpeningCase(caseId);
    setCaseResult(null);
    setCaseSpinning(false);
  };

  const spinCase = () => {
    if (caseSpinning) return;
    setCaseSpinning(true);
    setCaseResult(null);
    const winnerIdx = Math.floor(Math.random() * CASE_ITEMS_REEL.length);
    setTimeout(() => {
      setCaseSpinning(false);
      setCaseResult(CASE_ITEMS_REEL[winnerIdx]);
    }, 3200);
  };

  const navItems: { id: Section; label: string; icon: string }[] = [
    { id: "menu", label: "Главная", icon: "Home" },
    { id: "arena", label: "Арена", icon: "Crosshair" },
    { id: "inventory", label: "Инвентарь", icon: "Package" },
    { id: "cases", label: "Кейсы", icon: "Gift" },
    { id: "rating", label: "Рейтинг", icon: "Trophy" },
    { id: "settings", label: "Настройки", icon: "Settings" },
    { id: "faq", label: "Помощь", icon: "HelpCircle" },
  ];

  return (
    <div className="min-h-screen grid-bg" style={{ background: "var(--dark-bg)" }}>

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
        style={{ background: "linear-gradient(180deg, rgba(7,7,15,0.98) 0%, rgba(7,7,15,0.85) 100%)", borderBottom: "1px solid rgba(0,245,255,0.08)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded" style={{ background: "linear-gradient(135deg, #00f5ff, #b44fff)", boxShadow: "0 0 15px rgba(0,245,255,0.5)" }} />
            <div className="absolute inset-0.5 rounded" style={{ background: "var(--dark-bg)" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon name="Swords" size={14} style={{ color: "var(--neon-cyan)" }} />
            </div>
          </div>
          <span className="font-oswald font-bold text-lg tracking-widest" style={{ color: "var(--neon-cyan)", textShadow: "0 0 15px rgba(0,245,255,0.5)" }}>
            SHADOW<span style={{ color: "var(--neon-purple)" }}>WAR</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => navigate(item.id)}
              className={`nav-item ${section === item.id ? "active" : ""}`}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="font-rajdhani font-bold text-sm" style={{ color: rank.color }}>{rank.name}</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{playerXP} XP</div>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center border-2"
            style={{ borderColor: rank.color, background: "rgba(0,0,0,0.5)", boxShadow: `0 0 10px ${rank.color}40` }}>
            <Icon name="User" size={16} style={{ color: rank.color }} />
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around py-2"
        style={{ background: "rgba(7,7,15,0.97)", borderTop: "1px solid rgba(0,245,255,0.1)" }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => navigate(item.id)}
            className="flex flex-col items-center gap-0.5 p-2 rounded transition-all"
            style={section === item.id ? { color: "var(--neon-cyan)" } : { color: "rgba(255,255,255,0.35)" }}>
            <Icon name={item.icon} size={18} />
            <span className="text-[9px] font-oswald tracking-wide uppercase">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main style={{
        paddingTop: "4rem",
        paddingBottom: "5rem",
        opacity: animating ? 0 : 1,
        transform: animating ? "translateY(8px)" : "translateY(0)",
        transition: "opacity 0.18s ease, transform 0.18s ease"
      }}>

        {/* ========== MAIN MENU ========== */}
        {section === "menu" && (
          <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #00f5ff, transparent)", top: "8%", left: "5%", filter: "blur(80px)" }} />
              <div className="absolute w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #b44fff, transparent)", bottom: "10%", right: "5%", filter: "blur(80px)" }} />
              <div className="absolute w-64 h-64 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #ff6b35, transparent)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", filter: "blur(60px)" }} />
            </div>

            <div className="relative z-10 text-center max-w-2xl mx-auto animate-slide-up">
              <div className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-oswald tracking-widest uppercase"
                style={{ background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.2)", color: "var(--neon-cyan)" }}>
                <div className="w-2 h-2 rounded-full animate-pulse-neon" style={{ background: "var(--neon-cyan)" }} />
                Сезон 5 — Активен
              </div>

              <h1 className="font-oswald text-7xl md:text-9xl font-black tracking-widest mb-3 leading-none">
                <span style={{ color: "white", textShadow: "0 0 40px rgba(255,255,255,0.05)" }}>SHADOW</span>
                <br />
                <span style={{ color: "var(--neon-cyan)", textShadow: "0 0 30px rgba(0,245,255,0.6), 0 0 80px rgba(0,245,255,0.2)" }}>WAR</span>
              </h1>

              <p className="font-roboto text-lg mb-10" style={{ color: "rgba(255,255,255,0.45)", animationFillMode: "both" }}>
                Тактический шутер нового поколения
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => navigate("arena")} className="btn-solid-cyan px-10 py-4 rounded text-base font-bold">
                  ⚔️ Начать бой
                </button>
                <button onClick={() => navigate("cases")} className="btn-neon-purple px-10 py-4 rounded text-base">
                  🎁 Открыть кейс
                </button>
                <button onClick={() => navigate("settings")} className="btn-neon-cyan px-10 py-4 rounded text-base">
                  ⚙️ Настройки
                </button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-4">
                {[
                  { label: "Победы", value: "76", icon: "Trophy" },
                  { label: "Убийства", value: "287", icon: "Crosshair" },
                  { label: "Рейтинг", value: "#9", icon: "TrendingUp" },
                ].map(s => (
                  <div key={s.label} className="card-dark rounded-xl p-4">
                    <Icon name={s.icon} size={20} className="mx-auto mb-2" style={{ color: "var(--neon-cyan)", display: "block", margin: "0 auto 8px" }} />
                    <div className="font-oswald text-2xl font-bold" style={{ color: "var(--neon-cyan)" }}>{s.value}</div>
                    <div className="text-xs font-roboto" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 card-dark rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-rajdhani font-bold text-sm" style={{ color: rank.color }}>{rank.name}</span>
                  {nextRank && <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>→ {nextRank.name}</span>}
                  <span className="font-rajdhani text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{playerXP} / {nextRank?.min} XP</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="xp-bar h-full rounded-full" style={{ width: `${xpProgress}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== ARENA ========== */}
        {section === "arena" && (
          <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
            <div className="mb-6 animate-slide-up">
              <h2 className="section-title text-3xl md:text-4xl text-white mb-1">⚔️ Боевая арена</h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Выбери режим и вступай в бой</p>
            </div>

            <div className="relative rounded-xl overflow-hidden mb-6">
              <img src={ARENA_IMAGE} alt="Arena" className="w-full h-52 md:h-64 object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,7,15,0.9) 0%, rgba(7,7,15,0.2) 60%, transparent 100%)" }} />
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#39ff14", boxShadow: "0 0 8px #39ff14" }} />
                  <span className="text-xs font-oswald tracking-widest" style={{ color: "#39ff14" }}>ОНЛАЙН: 1,247 игроков</span>
                </div>
                <div className="font-oswald text-2xl font-bold text-white tracking-wide">Карта: Теневой Город</div>
              </div>
              <div className="absolute top-4 right-4 px-3 py-1 rounded text-xs font-oswald tracking-widest"
                style={{ background: "rgba(255,107,53,0.15)", border: "1px solid #ff6b35", color: "#ff6b35" }}>
                СЕЗОН 5
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { name: "Командный бой", desc: "5 vs 5, классический режим", players: "10/10", time: "~15 мин", color: "var(--neon-cyan)" },
                { name: "Захват флага", desc: "Украй флаг противника", players: "8/10", time: "~20 мин", color: "var(--neon-purple)" },
                { name: "Смертельный матч", desc: "Каждый за себя", players: "12/16", time: "~10 мин", color: "#ff6b35" },
              ].map((mode) => (
                <div key={mode.name} className="card-dark rounded-xl p-5 cursor-pointer"
                  style={{ borderColor: `${mode.color}20` }}>
                  <div className="font-oswald text-lg font-bold mb-1" style={{ color: mode.color }}>{mode.name}</div>
                  <div className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{mode.desc}</div>
                  <div className="flex justify-between text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <span>👥 {mode.players}</span>
                    <span>⏱ {mode.time}</span>
                  </div>
                  <button className="w-full py-2 rounded text-xs font-oswald tracking-widest uppercase"
                    style={{ background: `${mode.color}12`, border: `1px solid ${mode.color}40`, color: mode.color }}>
                    Играть
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "K/D Рейтинг", value: "2.14", icon: "Crosshair", color: "var(--neon-cyan)" },
                { label: "Победы", value: "76", icon: "Trophy", color: "var(--neon-purple)" },
                { label: "Убийства", value: "287", icon: "Zap", color: "#ff6b35" },
                { label: "Точность", value: "47%", icon: "Target", color: "#39ff14" },
              ].map((stat) => (
                <div key={stat.label} className="card-dark rounded-xl p-4 text-center">
                  <Icon name={stat.icon} size={22} style={{ color: stat.color, display: "block", margin: "0 auto 8px" }} />
                  <div className="font-oswald text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== INVENTORY ========== */}
        {section === "inventory" && (
          <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-up">
              <div>
                <h2 className="section-title text-3xl md:text-4xl text-white mb-1">📦 Инвентарь</h2>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{ITEMS.length} предметов</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["all", "skin", "agent", "charm"].map(f => (
                  <button key={f} onClick={() => setInventoryFilter(f)}
                    className="px-4 py-1.5 rounded text-xs font-oswald tracking-widest uppercase transition-all"
                    style={inventoryFilter === f
                      ? { background: "rgba(0,245,255,0.15)", border: "1px solid var(--neon-cyan)", color: "var(--neon-cyan)" }
                      : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
                    {f === "all" ? "Все" : typeLabel[f]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5 rounded-xl overflow-hidden">
              <img src={SKINS_IMAGE} alt="Skins" className="w-full h-32 object-cover" style={{ objectPosition: "center 30%" }} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {ITEMS
                .filter(item => inventoryFilter === "all" || item.type === inventoryFilter)
                .map((item) => (
                <div key={item.id} className={`card-dark rounded-xl p-3 cursor-pointer rarity-${item.rarity}`}
                  style={{ borderColor: item.equipped ? "rgba(0,245,255,0.3)" : "" }}>
                  <div className="aspect-square rounded-lg mb-2 flex items-center justify-center"
                    style={{ background: `rgba(${item.rarity === "legendary" ? "255,215,0" : item.rarity === "epic" ? "180,79,255" : item.rarity === "rare" ? "77,159,255" : "170,170,170"},0.08)` }}>
                    <Icon name={typeIcon[item.type] || "Package"} size={28} />
                  </div>
                  <div className="font-rajdhani font-bold text-xs text-white leading-tight">{item.name}</div>
                  <div className={`text-[10px] mt-1 rarity-${item.rarity}`}>{rarityLabel[item.rarity]}</div>
                  {item.equipped && (
                    <div className="mt-1.5 text-center text-[9px] font-oswald tracking-widest px-1 py-0.5 rounded"
                      style={{ background: "rgba(0,245,255,0.1)", color: "var(--neon-cyan)", border: "1px solid rgba(0,245,255,0.2)" }}>
                      АКТИВЕН
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== CASES ========== */}
        {section === "cases" && (
          <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
            <div className="mb-6 animate-slide-up">
              <h2 className="section-title text-3xl md:text-4xl text-white mb-1">🎁 Кейсы</h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Открой кейс и получи уникальные предметы</p>
            </div>

            {!openingCase ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CASES.map((c) => (
                  <div key={c.id} className="card-dark rounded-xl overflow-hidden cursor-pointer"
                    style={{ borderColor: `${c.color}25` }}
                    onClick={() => openCase(c.id)}>
                    <div className="h-48 flex items-center justify-center relative"
                      style={{ background: `radial-gradient(circle at center, ${c.color}12 0%, transparent 70%)` }}>
                      <div className="animate-float">
                        <div className="w-24 h-24 rounded-xl flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${c.color}15, ${c.color}05)`, border: `2px solid ${c.color}35`, boxShadow: `0 0 30px ${c.color}25` }}>
                          <Icon name="Gift" size={48} style={{ color: c.color }} />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="font-oswald text-lg font-bold mb-2" style={{ color: c.color }}>{c.name}</div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {c.items.slice(0, 3).map(item => (
                          <span key={item} className="text-[10px] px-2 py-0.5 rounded"
                            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            {item}
                          </span>
                        ))}
                        <span className="text-[10px] px-1" style={{ color: "rgba(255,255,255,0.3)" }}>+{c.items.length - 3}</span>
                      </div>
                      <button className="w-full py-2.5 rounded font-oswald tracking-widest uppercase text-sm font-bold"
                        style={{ background: `${c.color}15`, border: `1px solid ${c.color}45`, color: c.color, boxShadow: `0 0 12px ${c.color}15` }}>
                        Открыть за {c.price} ₽
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center max-w-2xl mx-auto">
                <button onClick={() => { setOpeningCase(null); setCaseResult(null); setCaseSpinning(false); }}
                  className="mb-6 flex items-center gap-2 text-sm font-oswald tracking-wide uppercase transition-all"
                  style={{ color: "rgba(255,255,255,0.4)" }}>
                  <Icon name="ChevronLeft" size={16} /> Назад
                </button>

                <div className="font-oswald text-2xl font-bold mb-8" style={{ color: CASES.find(c => c.id === openingCase)?.color }}>
                  {CASES.find(c => c.id === openingCase)?.name}
                </div>

                {/* Reel */}
                <div className="relative overflow-hidden rounded-xl mb-8" style={{ border: "1px solid rgba(0,245,255,0.2)", height: "120px" }}>
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 z-10"
                    style={{ background: "var(--neon-cyan)", boxShadow: "0 0 10px var(--neon-cyan)", transform: "translateX(-50%)" }} />
                  <div className="flex gap-3 p-3 absolute"
                    style={caseSpinning ? {
                      transform: `translateX(-${Math.floor(Math.random() * 8 + 8) * 100}px)`,
                      transition: "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                    } : {}}>
                    {[...CASE_ITEMS_REEL, ...CASE_ITEMS_REEL].map((item, idx) => (
                      <div key={idx} className={`flex-shrink-0 w-24 h-24 rounded-lg flex flex-col items-center justify-center rarity-${item.rarity}`}
                        style={{ background: `rgba(${item.rarity === "legendary" ? "255,215,0" : item.rarity === "epic" ? "180,79,255" : item.rarity === "rare" ? "77,159,255" : "170,170,170"},0.08)`, border: `1px solid currentColor` }}>
                        <Icon name="Crosshair" size={22} />
                        <div className="text-[9px] mt-1 text-center px-1 leading-tight font-rajdhani">{item.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {caseResult ? (
                  <div className="animate-slide-up">
                    <div className={`text-xl font-oswald mb-1 rarity-${caseResult.rarity}`}>
                      Получено: <strong>{caseResult.name}</strong>
                    </div>
                    <div className={`text-sm mb-6 rarity-${caseResult.rarity}`}>{rarityLabel[caseResult.rarity]}</div>
                    <div className="flex gap-3 justify-center">
                      <button onClick={spinCase} className="btn-solid-cyan px-8 py-3 rounded font-bold">Ещё раз</button>
                      <button onClick={() => { setOpeningCase(null); setCaseResult(null); }} className="btn-neon-purple px-8 py-3 rounded">Закрыть</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={spinCase} disabled={caseSpinning}
                    className="btn-solid-cyan px-12 py-4 rounded text-base font-bold"
                    style={{ opacity: caseSpinning ? 0.6 : 1 }}>
                    {caseSpinning ? "Крутится..." : "🎰 Открыть кейс"}
                  </button>
                )}

                <div className="mt-8 card-dark rounded-xl p-4 text-left">
                  <div className="font-oswald text-xs tracking-wider uppercase mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Вероятности</div>
                  {[
                    { rarity: "common", label: "Обычный", prob: "55%" },
                    { rarity: "rare", label: "Редкий", prob: "30%" },
                    { rarity: "epic", label: "Эпический", prob: "12%" },
                    { rarity: "legendary", label: "Легендарный", prob: "3%" },
                  ].map(p => (
                    <div key={p.rarity} className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-rajdhani rarity-${p.rarity}`}>{p.label}</span>
                      <span className="text-sm font-bold font-rajdhani text-white">{p.prob}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========== RATING ========== */}
        {section === "rating" && (
          <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
            <div className="mb-6 animate-slide-up">
              <h2 className="section-title text-3xl md:text-4xl text-white mb-1">🏆 Рейтинг</h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Топ лучших бойцов Shadow War</p>
            </div>

            {/* Podium */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[PLAYERS[1], PLAYERS[0], PLAYERS[2]].map((player, i) => {
                const podiumPos = [2, 1, 3][i];
                const heights = ["h-24", "h-32", "h-20"][i];
                const colors = ["#C0C0C0", "#FFD700", "#CD7F32"][i];
                return (
                  <div key={player.name} className="flex flex-col items-center">
                    <div className="font-rajdhani font-bold text-xs mb-1 text-center truncate w-full" style={{ color: "rgba(255,255,255,0.6)" }}>{player.name}</div>
                    <div className={`w-full ${heights} rounded-t-lg flex flex-col items-center justify-center`}
                      style={{ background: `linear-gradient(180deg, ${colors}18, ${colors}06)`, border: `1px solid ${colors}35` }}>
                      <div className="font-oswald text-3xl font-black" style={{ color: colors }}>{podiumPos}</div>
                      <div className="text-xs font-rajdhani" style={{ color: `${colors}90` }}>{player.xp} XP</div>
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
                    style={{
                      borderColor: isMe ? "rgba(0,245,255,0.3)" : "",
                      background: isMe ? "rgba(0,245,255,0.03)" : ""
                    }}>
                    <div className="font-oswald text-base font-black w-7 text-center"
                      style={{ color: i < 3 ? ["#FFD700","#C0C0C0","#CD7F32"][i] : "rgba(255,255,255,0.25)" }}>
                      {i + 1}
                    </div>
                    <div className="text-xl w-7">{player.country}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-rajdhani font-bold text-sm truncate" style={{ color: isMe ? "var(--neon-cyan)" : "white" }}>{player.name}</span>
                        {isMe && <span className="text-[9px] px-1.5 py-0.5 rounded font-oswald tracking-wider flex-shrink-0" style={{ background: "rgba(0,245,255,0.1)", color: "var(--neon-cyan)", border: "1px solid rgba(0,245,255,0.2)" }}>ВЫ</span>}
                      </div>
                      <div className="text-xs font-rajdhani" style={{ color: r.color }}>{r.name}</div>
                    </div>
                    <div className="hidden sm:flex gap-4 text-center">
                      <div>
                        <div className="font-rajdhani font-bold text-sm" style={{ color: "var(--neon-cyan)" }}>{player.kills}</div>
                        <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>убийств</div>
                      </div>
                      <div>
                        <div className="font-rajdhani font-bold text-sm" style={{ color: "var(--neon-purple)" }}>{player.wins}</div>
                        <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>побед</div>
                      </div>
                    </div>
                    <div className="font-oswald font-bold text-sm" style={{ color: r.color }}>{player.xp}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 card-dark rounded-xl p-4">
              <div className="font-oswald text-xs tracking-wider uppercase mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Система рангов</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {RANKS.map(r => (
                  <div key={r.name} className="flex items-center gap-2 p-2 rounded"
                    style={{ background: `${r.color}08`, border: `1px solid ${r.color}18` }}>
                    <Icon name={r.icon} size={15} style={{ color: r.color }} />
                    <div>
                      <div className="font-rajdhani font-bold text-sm" style={{ color: r.color }}>{r.name}</div>
                      <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{r.min}–{r.max === 99999 ? "∞" : r.max} XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========== SETTINGS ========== */}
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
                    { label: "Качество графики", options: ["Низкое", "Среднее", "Высокое", "Ультра"], current: graphics.quality, onChange: (v: string) => setGraphics(g => ({...g, quality: v})) },
                    { label: "Ограничение FPS", options: ["30", "60", "120", "Без лимита"], current: graphics.fps, onChange: (v: string) => setGraphics(g => ({...g, fps: v})) },
                  ].map(setting => (
                    <div key={setting.label}>
                      <div className="font-rajdhani font-bold text-sm mb-3 text-white">{setting.label}</div>
                      <div className="flex gap-2 flex-wrap">
                        {setting.options.map(opt => (
                          <button key={opt} onClick={() => setting.onChange(opt)}
                            className="px-3 py-1.5 rounded text-xs font-oswald tracking-wide transition-all"
                            style={setting.current === opt
                              ? { background: "rgba(0,245,255,0.15)", border: "1px solid var(--neon-cyan)", color: "var(--neon-cyan)" }
                              : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {[
                    { label: "Тени", key: "shadows" as const },
                    { label: "Размытие движения", key: "blur" as const },
                  ].map(toggle => (
                    <div key={toggle.label} className="flex items-center justify-between">
                      <span className="font-rajdhani font-bold text-sm text-white">{toggle.label}</span>
                      <button onClick={() => setGraphics(g => ({...g, [toggle.key]: !g[toggle.key]}))}
                        className="relative w-12 h-6 rounded-full transition-all"
                        style={{ background: graphics[toggle.key] ? "var(--neon-cyan)" : "rgba(255,255,255,0.1)" }}>
                        <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                          style={{ left: graphics[toggle.key] ? "1.5rem" : "0.25rem" }} />
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
                      <div className="flex justify-between mb-2">
                        <span className="font-rajdhani font-bold text-sm text-white">{s.label}</span>
                        <span className="font-rajdhani text-sm" style={{ color: "var(--neon-cyan)" }}>{audio[s.key]}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={audio[s.key]}
                        onChange={e => setAudio(a => ({...a, [s.key]: +e.target.value}))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(90deg, var(--neon-cyan) ${audio[s.key]}%, rgba(255,255,255,0.1) ${audio[s.key]}%)` }} />
                    </div>
                  ))}
                </div>
              )}

              {settingsTab === "controls" && (
                <div className="space-y-0">
                  {[
                    { action: "Вперёд", key: "W" },
                    { action: "Назад", key: "S" },
                    { action: "Влево", key: "A" },
                    { action: "Вправо", key: "D" },
                    { action: "Прицел", key: "ПКМ" },
                    { action: "Стрелять", key: "ЛКМ" },
                    { action: "Перезарядка", key: "R" },
                    { action: "Присесть", key: "C" },
                  ].map(bind => (
                    <div key={bind.action} className="flex items-center justify-between py-3"
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
                  <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>Обратитесь к нашей команде поддержки по любым вопросам</p>
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

        {/* ========== FAQ ========== */}
        {section === "faq" && (
          <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
            <div className="mb-6 animate-slide-up">
              <h2 className="section-title text-3xl md:text-4xl text-white mb-1">❓ Помощь</h2>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Часто задаваемые вопросы</p>
            </div>

            <div className="space-y-3">
              {[
                { q: "Как повысить свой ранг?", a: "Побеждайте в матчах и набирайте XP. Каждая победа даёт 50–100 XP, каждое убийство — 10 XP. Выполняйте ежедневные задания для дополнительных очков." },
                { q: "Что такое кейсы и как их открыть?", a: "Кейсы содержат случайные предметы: скины оружия, агентов и брелоки. Купите кейс в разделе 'Кейсы', нажмите 'Открыть' и крутите рулетку. Вероятности указаны для каждого кейса." },
                { q: "Можно ли торговать предметами?", a: "Да, торговля между игроками доступна через раздел Инвентарь → Торговля. Предметы редкости 'Обычный' и 'Редкий' можно продать на маркете." },
                { q: "Как работает система рейтинга?", a: "Рейтинг обновляется в конце каждого сезона (каждые 3 месяца). За победы вы получаете рейтинговые очки, за поражения теряете. Топ-100 получает эксклюзивные награды." },
                { q: "Почему меня забанили?", a: "Баны выдаются автоматически при обнаружении читов, токсичного поведения или нарушения правил. Обратитесь в поддержку для апелляции с указанием вашего никнейма." },
                { q: "Как восстановить аккаунт?", a: "Если вы забыли пароль — используйте кнопку 'Восстановить пароль' на странице входа. При потере доступа к email обратитесь в поддержку через чат." },
                { q: "Что происходит в конце сезона?", a: "В конце сезона все игроки получают награды по своему финальному рангу. После сброса рейтинга вы начинаете новый сезон с частично сохранённым рангом." },
              ].map((item, i) => (
                <div key={i} className="card-dark rounded-xl overflow-hidden">
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left">
                    <span className="font-rajdhani font-bold text-sm text-white pr-4">{item.q}</span>
                    <Icon name={faqOpen === i ? "ChevronUp" : "ChevronDown"} size={16}
                      style={{ color: "var(--neon-cyan)", flexShrink: 0 }} />
                  </button>
                  {faqOpen === i && (
                    <div className="px-4 pb-4 animate-slide-up">
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 card-dark rounded-xl p-5 text-center">
              <div className="font-oswald text-lg font-bold text-white mb-1">Не нашли ответ?</div>
              <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Наша команда поддержки готова помочь 24/7</p>
              <button onClick={() => { navigate("settings"); setSettingsTab("support"); }}
                className="btn-solid-cyan px-8 py-3 rounded font-bold">
                Написать в поддержку
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
