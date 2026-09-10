import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, m } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Copy, Gift, Heart, Music, Pause, Play, RotateCcw, Share2, Sparkles, Volume2, VolumeX } from "lucide-react";
import confetti from "canvas-confetti";
import { getSurpriseData, incrementReactions, incrementViewCount } from "@/lib/db";

type ExperienceData = { name: string; message: string; image_path?: string; music_path?: string };
type Parsed = { body: string; finaleText: string; selectedMusic?: string; theme?: string; photos?: string[] };

const themes: Record<string, { bg: string; card: string; accent: string; soft: string; text: string }> = {
  elegant: { bg: "#FBF9FF", card: "#FFFFFF", accent: "#7C55D9", soft: "#EDE7F6", text: "#241B35" },
  dreamy: { bg: "#F7F2FF", card: "#FFFFFF", accent: "#9D6BFF", soft: "#EDE7F6", text: "#241B35" },
  romantic: { bg: "#FFF7FB", card: "#FFFFFF", accent: "#C75B91", soft: "#FCE5F0", text: "#351D2D" },
  midnight: { bg: "#120E1B", card: "#1D162A", accent: "#A77BFF", soft: "#2A203C", text: "#F7F3FC" },
  rosegold: { bg: "#FFF8F7", card: "#FFFFFF", accent: "#B65D67", soft: "#F8E5E2", text: "#351F21" },
  ocean: { bg: "#F4FAFF", card: "#FFFFFF", accent: "#3D74B9", soft: "#E3F0FF", text: "#172536" },
  emerald: { bg: "#F4FBF8", card: "#FFFFFF", accent: "#287C62", soft: "#E0F2EB", text: "#172822" },
};

function parseExperience(data: ExperienceData): Parsed {
  let body = data.message;
  let finaleText = "Happy Birthday!";
  let selectedMusic = data.music_path;
  let theme = "elegant";
  let photos: string[] = [];
  try {
    const parsed = JSON.parse(data.message);
    if (parsed && typeof parsed === "object") {
      body = parsed.body || "";
      finaleText = parsed.finaleText || finaleText;
      selectedMusic = data.music_path || (parsed.selectedMusic !== "none" ? parsed.selectedMusic : undefined);
      theme = parsed.theme || parsed.vibe || theme;
      photos = Array.isArray(parsed.photos) ? parsed.photos.filter(Boolean) : [];
    }
  } catch {
    // Legacy plain text messages remain supported.
  }
  return { body, finaleText, selectedMusic, theme, photos };
}

export default function Surprise() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ExperienceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return navigate("/");
    incrementViewCount(id);
    getSurpriseData(id).then((result) => {
      if (result) setData({ name: result.name, message: result.message, image_path: result.image_path, music_path: result.music_path });
      setLoading(false);
    });
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen grid place-items-center bg-[#F8F6FC] text-[#7952D6]"><Sparkles className="h-7 w-7 animate-pulse" /></div>;
  if (!data) return <div className="min-h-screen grid place-items-center bg-[#F8F6FC] p-6"><div className="max-w-md text-center"><div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-[#EDE7F6] text-[#7952D6]"><Gift /></div><h1 className="text-2xl font-semibold text-[#241B35]">This birthday surprise is no longer available.</h1><button onClick={() => navigate("/")} className="mt-6 rounded-2xl bg-[#7952D6] px-5 py-3 font-semibold text-white">Create your own</button></div></div>;

  return <ExperienceClient data={data} />;
}

function ExperienceClient({ data }: { data: ExperienceData }) {
  const parsed = useMemo(() => parseExperience(data), [data]);
  const theme = themes[parsed.theme] || themes.elegant;
  const [scene, setScene] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const photos = useMemo(() => {
    const all = [data.image_path, ...parsed.photos].filter((x): x is string => Boolean(x));
    return Array.from(new Set(all));
  }, [data.image_path, parsed.photos]);

  useEffect(() => {
    const audio = new Audio(parsed.selectedMusic || "/Happy Birthday Song.mp3");
    audio.loop = true;
    audio.preload = "metadata";
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; audioRef.current = null; };
  }, [parsed.selectedMusic]);

  const celebrate = () => {
    confetti({ particleCount: 90, spread: 90, startVelocity: 35, origin: { x: 0.5, y: 0.62 }, colors: ["#9D6BFF", "#F47FB5", "#E7B85C", "#9AD8C2"] });
  };

  const start = async () => {
    if (audioRef.current && !musicOn) {
      try { await audioRef.current.play(); setMusicOn(true); } catch { /* user can use music control */ }
    }
    setScene(1);
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    if (musicOn) { audioRef.current.pause(); setMusicOn(false); }
    else { try { await audioRef.current.play(); setMusicOn(true); } catch {} }
  };

  const react = async () => {
    if (liked) return;
    setLiked(true);
    celebrate();
    const id = window.location.pathname.split("/").pop();
    if (id) await incrementReactions(id);
  };

  const copyLink = async () => {
    await navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const share = async () => {
    if (navigator.share) await navigator.share({ title: `A Birthday Verse for ${data.name}`, url: window.location.href }).catch(() => undefined);
    else await copyLink();
  };

  const restart = () => { setScene(0); setLiked(false); };

  return (
    <main style={{ background: theme.bg, color: theme.text }} className="min-h-screen overflow-hidden transition-colors duration-500">
      <div className="pointer-events-none fixed inset-0 opacity-70" aria-hidden="true" style={{ background: `radial-gradient(circle at 15% 15%, ${theme.soft} 0, transparent 30%), radial-gradient(circle at 90% 75%, ${theme.soft} 0, transparent 32%)` }} />

      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-2 rounded-full border border-black/5 bg-white/70 px-3 py-2 text-sm font-semibold shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
          <Sparkles className="h-4 w-4" style={{ color: theme.accent }} /> Birthday Verse
        </div>
        <div className="flex gap-2">
          <button onClick={toggleMusic} className="grid h-10 w-10 place-items-center rounded-full border border-black/5 bg-white/75 shadow-sm backdrop-blur-xl hover:scale-105 dark:border-white/10 dark:bg-black/20" aria-label="Toggle music">{musicOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}</button>
          <button onClick={share} className="grid h-10 w-10 place-items-center rounded-full border border-black/5 bg-white/75 shadow-sm backdrop-blur-xl hover:scale-105 dark:border-white/10 dark:bg-black/20" aria-label="Share"><Share2 className="h-4 w-4" /></button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {scene === 0 && <Gate key="gate" name={data.name} theme={theme} onStart={start} />}
        {scene === 1 && <Intro key="intro" name={data.name} theme={theme} onNext={() => setScene(2)} />}
        {scene === 2 && <Letter key="letter" name={data.name} message={parsed.body} theme={theme} onNext={() => setScene(3)} />}
        {scene === 3 && <Memories key="memories" name={data.name} photos={photos} theme={theme} onNext={() => setScene(4)} />}
        {scene === 4 && <Finale key="finale" name={data.name} finale={parsed.finaleText} photos={photos} theme={theme} liked={liked} onReact={react} onRestart={restart} onShare={share} copied={copied} onCopy={copyLink} onCelebrate={celebrate} />}
      </AnimatePresence>
    </main>
  );
}

function Scene({ children, theme, className = "" }: { children: React.ReactNode; theme: typeof themes.elegant; className?: string }) {
  return <m.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.55, ease: "easeOut" }} className={`relative z-10 flex min-h-screen w-full items-center justify-center px-5 py-24 ${className}`}>{children}</m.section>;
}

function Gate({ name, theme, onStart }: { name: string; theme: typeof themes.elegant; onStart: () => void }) {
  return <Scene theme={theme}><div className="w-full max-w-lg text-center"><m.div initial={{ scale: .8, rotate: -5 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 120 }} className="mx-auto mb-8 grid h-28 w-28 place-items-center rounded-[32px] shadow-2xl" style={{ background: theme.card, boxShadow: `0 24px 70px ${theme.accent}25` }}><Gift className="h-12 w-12" style={{ color: theme.accent }} /></m.div><p className="mb-3 text-xs font-bold uppercase tracking-[.25em] opacity-60">A little surprise for</p><h1 className="font-serif text-5xl font-medium tracking-tight sm:text-7xl">{name}</h1><p className="mx-auto mt-5 max-w-sm text-base opacity-65">Someone created something special just for you.</p><button onClick={onStart} className="mt-9 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white shadow-lg transition hover:-translate-y-1" style={{ background: theme.accent }}>Open your surprise <ArrowRight className="h-4 w-4" /></button><p className="mt-4 text-xs opacity-45">Tap to begin the experience</p></div></Scene>;
}

function Intro({ name, theme, onNext }: { name: string; theme: typeof themes.elegant; onNext: () => void }) {
  useEffect(() => { const timer = setTimeout(onNext, 3200); return () => clearTimeout(timer); }, [onNext]);
  return <Scene theme={theme}><div className="text-center"><p className="text-sm font-semibold uppercase tracking-[.3em] opacity-55">Today is about</p><m.h1 initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .35, duration: .8 }} className="mt-5 font-serif text-6xl font-medium sm:text-8xl" style={{ color: theme.accent }}>{name}</m.h1><m.div initial={{ width: 0 }} animate={{ width: 110 }} transition={{ delay: 1, duration: .7 }} className="mx-auto mt-7 h-px" style={{ background: theme.accent }} /><p className="mt-7 text-lg opacity-60">A day worth celebrating. A person worth remembering.</p></div></Scene>;
}

function Letter({ name, message, theme, onNext }: { name: string; message: string; theme: typeof themes.elegant; onNext: () => void }) {
  return <Scene theme={theme}><div className="w-full max-w-2xl"><div className="rounded-[32px] border border-black/5 p-7 shadow-[0_25px_90px_rgba(70,45,100,.10)] sm:p-12 dark:border-white/10" style={{ background: theme.card }}><div className="mb-8 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: theme.soft, color: theme.accent }}><Heart className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-[.18em] opacity-45">A letter for</p><p className="font-serif text-xl">{name}</p></div></div><p className="whitespace-pre-wrap font-serif text-2xl leading-relaxed sm:text-3xl">{message || `Happy Birthday, ${name}. May this new chapter bring you beautiful moments, genuine laughter, and everything you have been hoping for.`}</p><div className="mt-10 flex justify-end"><button onClick={onNext} className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white" style={{ background: theme.accent }}>Continue <ArrowRight className="h-4 w-4" /></button></div></div></div></Scene>;
}

function Memories({ name, photos, theme, onNext }: { name: string; photos: string[]; theme: typeof themes.elegant; onNext: () => void }) {
  return <Scene theme={theme}><div className="w-full max-w-5xl"><div className="mb-10 text-center"><p className="text-xs font-bold uppercase tracking-[.25em] opacity-45">Little moments</p><h2 className="mt-3 font-serif text-4xl sm:text-6xl">Memories with {name}</h2></div>{photos.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{photos.slice(0, 6).map((src, index) => <m.div key={`${src}-${index}`} initial={{ opacity: 0, y: 25, rotate: index % 2 ? 2 : -2 }} animate={{ opacity: 1, y: 0, rotate: index % 2 ? 2 : -2 }} transition={{ delay: index * .12 }} className="overflow-hidden rounded-[22px] border border-black/5 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-white/5"><img src={src} alt="Birthday memory" className="aspect-[4/3] w-full rounded-[16px] object-cover" /></m.div>)}</div> : <div className="mx-auto max-w-xl rounded-3xl p-10 text-center" style={{ background: theme.card }}><Sparkles className="mx-auto h-8 w-8" style={{ color: theme.accent }} /><p className="mt-4 opacity-65">A beautiful memory can be a feeling, too. This Verse was made with words just for you.</p></div>}<div className="mt-10 text-center"><button onClick={onNext} className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold text-white" style={{ background: theme.accent }}>One more thing <ArrowRight className="h-4 w-4" /></button></div></div></Scene>;
}

function Finale({ name, finale, photos, theme, liked, onReact, onRestart, onShare, copied, onCopy, onCelebrate }: { name: string; finale: string; photos: string[]; theme: typeof themes.elegant; liked: boolean; onReact: () => void; onRestart: () => void; onShare: () => void; copied: boolean; onCopy: () => void; onCelebrate: () => void }) {
  return <Scene theme={theme}><div className="w-full max-w-4xl text-center"><m.div initial={{ scale: .75, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 110 }}><p className="text-xs font-bold uppercase tracking-[.3em] opacity-45">The moment</p><h1 className="mt-4 font-serif text-5xl sm:text-7xl" style={{ color: theme.accent }}>{finale}</h1><p className="mt-5 text-lg opacity-60">Happy Birthday, {name}.</p></m.div>{photos.length > 0 && <div className="mx-auto mt-10 flex max-w-2xl justify-center -space-x-8 sm:-space-x-10">{photos.slice(0, 3).map((src, i) => <m.img key={`${src}-${i}`} initial={{ opacity: 0, y: 30, rotate: (i - 1) * 6 }} animate={{ opacity: 1, y: 0, rotate: (i - 1) * 6 }} transition={{ delay: .2 + i * .15 }} src={src} alt="Birthday memory" className="h-36 w-28 rounded-2xl border-4 border-white object-cover shadow-xl sm:h-48 sm:w-36" />)}</div>}<div className="mt-12 flex flex-wrap justify-center gap-3"><button onClick={onCelebrate} className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-white" style={{ background: theme.accent }}><Sparkles className="h-4 w-4" /> Celebrate</button><button onClick={onReact} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-5 py-3 font-semibold shadow-sm dark:border-white/10 dark:bg-white/5">{liked ? <Check className="h-4 w-4" /> : <Heart className="h-4 w-4" />} {liked ? "Sent with love" : "Send love"}</button><button onClick={onShare} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-5 py-3 font-semibold shadow-sm dark:border-white/10 dark:bg-white/5"><Share2 className="h-4 w-4" /> Share</button><button onClick={onCopy} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-5 py-3 font-semibold shadow-sm dark:border-white/10 dark:bg-white/5">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy link"}</button><button onClick={onRestart} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-5 py-3 font-semibold shadow-sm dark:border-white/10 dark:bg-white/5"><RotateCcw className="h-4 w-4" /> Replay</button></div><p className="mt-10 text-xs opacity-40">Made with care in Birthday Verse</p></div></Scene>;
}
