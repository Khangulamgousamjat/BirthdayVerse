// Central Visual Style Templates Definition
// Powers the Templates Gallery, Creator Studio, Live Phone Preview, and Surprise Experience

export interface VisualTemplate {
  id: string;
  name: string;
  category: "Elegant" | "Romantic" | "Fun" | "Cute" | "Party" | "Minimal" | "Neon" | "Luxury";
  description: string;
  accent: string;
  badge?: string;
  previewBg: string;
  previewText: string;
  iconName: "crown" | "moon" | "heart" | "party" | "gift" | "music" | "feather" | "zap" | "gem";

  // Full Cinematic Surprise Screen Theming (Surprise.tsx)
  pageBg: string; // Tailwind background gradient classes
  ambientOrb: string; // Radial blur lighting classes
  particleType: "gold-dust" | "starlight" | "petals" | "confetti" | "bubbles" | "disco" | "minimal" | "cyber" | "emerald";
  titleGradient: string; // Text gradient classes for recipient name & headline
  envelopeBorder: string; // Envelope border color
  envelopeGlow: string; // Box shadow for envelope

  // Phone Mockup Preview Theming (LivePhonePreview.tsx)
  phoneBg: string; // Tailwind background for the mobile screen
  phoneText: string; // Main text color
  balloon1: string; // Ambient balloon / orb 1 hex
  balloon2: string; // Ambient balloon / orb 2 hex
  cardOverlayBg: string; // Subtitle card background
}

export const TEMPLATES_DATA: VisualTemplate[] = [
  {
    id: "elegant",
    name: "Golden Elegance",
    category: "Elegant",
    description: "Refined lavender gold aesthetics with classical serif typography and subtle candlelight warmth.",
    accent: "#7659E4",
    badge: "Popular",
    previewBg: "bg-gradient-to-br from-[#261F36] via-[#1E182A] to-[#13101C]",
    previewText: "Elegant & Luxurious",
    iconName: "crown",

    pageBg: "bg-gradient-to-b from-[#13101C] via-[#1A1426] to-[#0E0A15]",
    ambientOrb: "from-[#7659E4]/25 via-[#E0A842]/15 to-transparent",
    particleType: "gold-dust",
    titleGradient: "from-[#FFFBEB] via-[#E0A842] to-[#D97706]",
    envelopeBorder: "border-[#E0A842]/40",
    envelopeGlow: "shadow-[0_15px_45px_rgba(118,89,228,0.2)]",

    phoneBg: "from-[#201830] via-[#1A1328] to-[#120D1D]",
    phoneText: "#F9F7FD",
    balloon1: "#8E72F0",
    balloon2: "#E0A842",
    cardOverlayBg: "bg-white/10 dark:bg-white/10",
  },
  {
    id: "dreamy",
    name: "Dreamy Starlight",
    category: "Party",
    description: "Soft celestial clouds, twinkling stars, and gentle pastel purple ambient gradients.",
    accent: "#8E72F0",
    badge: "Trending",
    previewBg: "bg-gradient-to-br from-[#1E182A] via-[#261F36] to-[#7659E4]",
    previewText: "Clouds & Starlight",
    iconName: "moon",

    pageBg: "bg-gradient-to-b from-[#110B24] via-[#1D123D] to-[#0B0616]",
    ambientOrb: "from-[#8E72F0]/35 via-[#C495C8]/25 to-transparent",
    particleType: "starlight",
    titleGradient: "from-[#F3E8FF] via-[#A28DF8] to-[#8E72F0]",
    envelopeBorder: "border-[#8E72F0]/50",
    envelopeGlow: "shadow-[0_15px_45px_rgba(142,114,240,0.25)]",

    phoneBg: "from-[#1D1438] via-[#251A48] to-[#140D26]",
    phoneText: "#F9F7FD",
    balloon1: "#8E72F0",
    balloon2: "#C495C8",
    cardOverlayBg: "bg-white/10 dark:bg-white/10",
  },
  {
    id: "romantic",
    name: "Sweet Romance",
    category: "Romantic",
    description: "Rose gold petals, soft bokeh lights, and warm heartfelt words of affection.",
    accent: "#F43F5E",
    badge: "Special",
    previewBg: "bg-gradient-to-br from-[#4A1D36] via-[#7B2852] to-[#C495C8]",
    previewText: "Warm & Heartfelt",
    iconName: "heart",

    pageBg: "bg-gradient-to-b from-[#2E0B1F] via-[#3F112B] to-[#180510]",
    ambientOrb: "from-[#F43F5E]/35 via-[#FB7185]/20 to-transparent",
    particleType: "petals",
    titleGradient: "from-[#FFE4E6] via-[#FB7185] to-[#F43F5E]",
    envelopeBorder: "border-[#F43F5E]/50",
    envelopeGlow: "shadow-[0_15px_45px_rgba(244,63,94,0.25)]",

    phoneBg: "from-[#3B1127] via-[#481631] to-[#250818]",
    phoneText: "#FFF1F2",
    balloon1: "#FB7185",
    balloon2: "#FDA4AF",
    cardOverlayBg: "bg-white/10 dark:bg-white/10",
  },
  {
    id: "fun",
    name: "Confetti Fiesta",
    category: "Fun",
    description: "Bursting confetti cascades, lively vibrant colors, and pure joyful celebration energy.",
    accent: "#F59E0B",
    previewBg: "bg-gradient-to-br from-[#92400E] via-[#D97706] to-[#C495C8]",
    previewText: "Joyful & Energetic",
    iconName: "party",

    pageBg: "bg-gradient-to-b from-[#2B1403] via-[#3D1E07] to-[#170901]",
    ambientOrb: "from-[#F59E0B]/35 via-[#EC4899]/20 to-transparent",
    particleType: "confetti",
    titleGradient: "from-[#FEF3C7] via-[#FBBF24] to-[#F59E0B]",
    envelopeBorder: "border-[#F59E0B]/50",
    envelopeGlow: "shadow-[0_15px_45px_rgba(245,158,11,0.25)]",

    phoneBg: "from-[#381B08] via-[#4A240C] to-[#240F04]",
    phoneText: "#FFFBEB",
    balloon1: "#F59E0B",
    balloon2: "#EC4899",
    cardOverlayBg: "bg-white/10 dark:bg-white/10",
  },
  {
    id: "cute",
    name: "Pastel Sweetness",
    category: "Cute",
    description: "Playful balloons, cute gift wraps, and adorable celebration art for smiles.",
    accent: "#C084FC",
    previewBg: "bg-gradient-to-br from-[#C495C8] via-[#A28DF8] to-[#E0A842]",
    previewText: "Sweet & Adorable",
    iconName: "gift",

    pageBg: "bg-gradient-to-b from-[#220F2E] via-[#2F163E] to-[#14081C]",
    ambientOrb: "from-[#C084FC]/35 via-[#F472B6]/20 to-transparent",
    particleType: "bubbles",
    titleGradient: "from-[#FCE7F3] via-[#F472B6] to-[#C084FC]",
    envelopeBorder: "border-[#C084FC]/50",
    envelopeGlow: "shadow-[0_15px_45px_rgba(192,132,252,0.25)]",

    phoneBg: "from-[#2C163C] via-[#381E4C] to-[#1C0D26]",
    phoneText: "#FAF5FF",
    balloon1: "#C084FC",
    balloon2: "#F472B6",
    cardOverlayBg: "bg-white/10 dark:bg-white/10",
  },
  {
    id: "party",
    name: "Midnight Disco",
    category: "Party",
    description: "Deep velvety lavender, moody glow, and high-energy celebration vibes.",
    accent: "#A855F7",
    badge: "Hot",
    previewBg: "bg-gradient-to-br from-[#13101C] via-[#261F36] to-[#54448C]",
    previewText: "Velvet & High Energy",
    iconName: "music",

    pageBg: "bg-gradient-to-b from-[#0F081C] via-[#1B0C33] to-[#090412]",
    ambientOrb: "from-[#A855F7]/40 via-[#3B82F6]/25 to-transparent",
    particleType: "disco",
    titleGradient: "from-[#EDE9FE] via-[#A855F7] to-[#6366F1]",
    envelopeBorder: "border-[#A855F7]/50",
    envelopeGlow: "shadow-[0_15px_45px_rgba(168,85,247,0.3)]",

    phoneBg: "from-[#1A0E30] via-[#261345] to-[#100720]",
    phoneText: "#F5F3FF",
    balloon1: "#A855F7",
    balloon2: "#3B82F6",
    cardOverlayBg: "bg-white/10 dark:bg-white/10",
  },
  {
    id: "minimal",
    name: "Modern Minimalist",
    category: "Minimal",
    description: "Crisp whitespace, timeless typography, and subtle micro-accents for understated elegance.",
    accent: "#94A3B8",
    previewBg: "bg-gradient-to-br from-[#1E182A] via-[#282038] to-[#433858]",
    previewText: "Clean & Modern",
    iconName: "feather",

    pageBg: "bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#090D16]",
    ambientOrb: "from-[#94A3B8]/25 via-[#64748B]/15 to-transparent",
    particleType: "minimal",
    titleGradient: "from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8]",
    envelopeBorder: "border-[#94A3B8]/40",
    envelopeGlow: "shadow-[0_15px_45px_rgba(148,163,184,0.15)]",

    phoneBg: "from-[#192436] via-[#1E2C42] to-[#101824]",
    phoneText: "#F8FAFC",
    balloon1: "#94A3B8",
    balloon2: "#64748B",
    cardOverlayBg: "bg-white/10 dark:bg-white/10",
  },
  // ── BRAND NEW TEMPLATE 1: Cyber Neon ──
  {
    id: "neon",
    name: "Cyber Neon",
    category: "Party",
    description: "Electric cyberpunk synthwave aesthetic with glowing cyan neon, hot magenta lasers, and futuristic glow.",
    accent: "#00F0FF",
    badge: "New ✨",
    previewBg: "bg-gradient-to-br from-[#051329] via-[#0B2545] to-[#00F0FF]",
    previewText: "Cyberpunk & Electric Glow",
    iconName: "zap",

    pageBg: "bg-gradient-to-b from-[#030E1C] via-[#091C36] to-[#02070F]",
    ambientOrb: "from-[#00F0FF]/35 via-[#F72585]/25 to-transparent",
    particleType: "cyber",
    titleGradient: "from-[#E0F7FA] via-[#00F0FF] to-[#F72585]",
    envelopeBorder: "border-[#00F0FF]/60",
    envelopeGlow: "shadow-[0_15px_45px_rgba(0,240,255,0.3)]",

    phoneBg: "from-[#081B34] via-[#0E284C] to-[#051122]",
    phoneText: "#E0F7FA",
    balloon1: "#00F0FF",
    balloon2: "#F72585",
    cardOverlayBg: "bg-black/40 dark:bg-black/40",
  },
  // ── BRAND NEW TEMPLATE 2: Royal Emerald ──
  {
    id: "emerald",
    name: "Royal Emerald",
    category: "Elegant",
    description: "Majestic imperial emerald and champagne gold with regal elegance, classical crests, and velvet depth.",
    accent: "#10B981",
    badge: "Royal 👑",
    previewBg: "bg-gradient-to-br from-[#062419] via-[#0D442F] to-[#10B981]",
    previewText: "Imperial Emerald & Gold",
    iconName: "gem",

    pageBg: "bg-gradient-to-b from-[#041710] via-[#092B1E] to-[#020D09]",
    ambientOrb: "from-[#10B981]/35 via-[#F59E0B]/20 to-transparent",
    particleType: "emerald",
    titleGradient: "from-[#ECFDF5] via-[#34D399] to-[#F59E0B]",
    envelopeBorder: "border-[#10B981]/50",
    envelopeGlow: "shadow-[0_15px_45px_rgba(16,185,129,0.3)]",

    phoneBg: "from-[#0A261C] via-[#103829] to-[#061811]",
    phoneText: "#ECFDF5",
    balloon1: "#10B981",
    balloon2: "#F59E0B",
    cardOverlayBg: "bg-white/10 dark:bg-white/10",
  },
];

// Helper to look up a template by ID or vibe fallback
export function getTemplateById(templateId?: string, vibeFallback?: string): VisualTemplate {
  if (templateId) {
    const found = TEMPLATES_DATA.find((t) => t.id.toLowerCase() === templateId.toLowerCase());
    if (found) return found;
  }
  if (vibeFallback) {
    const foundByVibe = TEMPLATES_DATA.find((t) => 
      t.id.toLowerCase() === vibeFallback.toLowerCase() || 
      t.category.toLowerCase() === vibeFallback.toLowerCase()
    );
    if (foundByVibe) return foundByVibe;
  }
  return TEMPLATES_DATA[0]; // Golden Elegance default
}
