import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSurpriseData, incrementViewCount, incrementReactions } from "@/lib/db";
import { m, AnimatePresence } from "framer-motion";
import { 
  Music, 
  VolumeX, 
  Sparkles, 
  Heart, 
  Share2, 
  Copy, 
  Check, 
  RotateCcw, 
  Gift, 
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import confetti from "canvas-confetti";
import { CasinoCardDeck } from "@/components/surprise/CasinoCardDeck";
import { RealisticCake } from "@/components/surprise/RealisticCake";
import { getTemplateById, VisualTemplate } from "@/lib/templates";

interface ExperienceData {
  name: string;
  message: string;
  image_path?: string;
  music_path?: string;
}

export default function Surprise() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ExperienceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    // Increment view count in Firestore
    incrementViewCount(id);

    const fetchData = async () => {
      const result = await getSurpriseData(id);
      if (result) {
        setData({ 
          name: result.name, 
          message: result.message,
          image_path: result.image_path,
          music_path: result.music_path
        });
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#13101C] flex flex-col items-center justify-center text-[#E0A842] space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#E0A842]/30 border-t-[#E0A842] animate-spin" />
        <span className="text-xs font-semibold tracking-widest uppercase text-[#A89EC0]">
          Preparing your birthday celebration...
        </span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#13101C] flex flex-col items-center justify-center text-white px-4 text-center">
        <div className="p-8 rounded-3xl bg-[#1E182A]/80 border border-[#282038] max-w-md space-y-5 shadow-2xl">
          <Gift className="w-12 h-12 text-[#7659E4] mx-auto opacity-70" />
          <h1 className="text-xl font-display font-bold text-white">
            This celebration link has expired or doesn&apos;t exist.
          </h1>
          <p className="text-xs text-[#A89EC0] leading-relaxed">
            BirthdayVerse links automatically self-destruct after <span className="text-[#E0A842] font-bold">72 hours</span> to protect privacy.
            The creator can choose &quot;Keep Forever&quot; when publishing to prevent this.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate("/")}
              className="w-full"
            >
              Create a New Birthday Verse
            </Button>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-[#A89EC0] hover:text-white transition-colors cursor-pointer underline underline-offset-2"
            >
              Try reloading the page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <CinematicExperience data={data} surpriseId={id || ""} />;
}

// ── Dynamic Thematic Atmosphere Particles ────────────────────────────────────

function ThematicAtmosphere({ type }: { type: VisualTemplate["particleType"] }) {
  if (type === "petals") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(14)].map((_, i) => (
          <m.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 19 + 7) % 94}%`,
              top: `${(i * 23 + 11) % 90}%`,
              width: `${10 + (i % 4) * 4}px`,
              height: `${14 + (i % 4) * 5}px`,
              background: i % 2 === 0 ? "radial-gradient(ellipse at center, #FB7185 0%, #E11D48 100%)" : "radial-gradient(ellipse at center, #FDA4AF 0%, #F43F5E 100%)",
              borderRadius: "50% 0 50% 50%",
              opacity: 0.25 + (i % 3) * 0.15,
              filter: "blur(0.5px)",
            }}
            animate={{
              y: [0, 25, 0],
              x: [0, (i % 2 === 0 ? 15 : -15), 0],
              rotate: [0, 45, 90, 0],
            }}
            transition={{
              duration: 5 + (i % 4) * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i * 0.4) % 3,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "confetti") {
    const colors = ["#F43F5E", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"];
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(16)].map((_, i) => (
          <m.div
            key={i}
            className="absolute"
            style={{
              left: `${(i * 17 + 5) % 95}%`,
              top: `${(i * 27 + 8) % 88}%`,
              width: `${7 + (i % 3) * 3}px`,
              height: `${7 + (i % 3) * 3}px`,
              backgroundColor: colors[i % colors.length],
              borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "1px",
              opacity: 0.35 + (i % 3) * 0.15,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              scale: [0.9, 1.15, 0.9],
            }}
            transition={{
              duration: 4 + (i % 3) * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i * 0.3) % 2.5,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "cyber") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F0FF08_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
        {[...Array(14)].map((_, i) => (
          <m.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 21 + 9) % 92}%`,
              top: `${(i * 31 + 13) % 85}%`,
              width: `${2 + (i % 3) * 2}px`,
              height: `${2 + (i % 3) * 2}px`,
              backgroundColor: i % 2 === 0 ? "#00F0FF" : "#FF007F",
              boxShadow: i % 2 === 0 ? "0 0 10px #00F0FF, 0 0 20px #00F0FF" : "0 0 10px #FF007F, 0 0 20px #FF007F",
              opacity: 0.6,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.4, 0.8],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i * 0.25) % 2,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "emerald") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(14)].map((_, i) => (
          <m.div
            key={i}
            className="absolute"
            style={{
              left: `${(i * 18 + 8) % 93}%`,
              top: `${(i * 29 + 12) % 87}%`,
              width: `${4 + (i % 3) * 3}px`,
              height: `${4 + (i % 3) * 3}px`,
              backgroundColor: i % 3 === 0 ? "#F59E0B" : "#10B981",
              transform: "rotate(45deg)",
              boxShadow: i % 3 === 0 ? "0 0 12px #F59E0B" : "0 0 12px #10B981",
              opacity: 0.45 + (i % 3) * 0.2,
            }}
            animate={{
              scale: [0.8, 1.3, 0.8],
              opacity: [0.3, 0.85, 0.3],
            }}
            transition={{
              duration: 3 + (i % 3) * 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i * 0.35) % 3,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "disco") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(14)].map((_, i) => (
          <m.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 23 + 11) % 94}%`,
              top: `${(i * 19 + 7) % 89}%`,
              width: `${3 + (i % 4) * 2}px`,
              height: `${3 + (i % 4) * 2}px`,
              backgroundColor: ["#E11D48", "#A855F7", "#3B82F6", "#F59E0B"][i % 4],
              boxShadow: "0 0 15px currentColor",
              opacity: 0.5,
            }}
            animate={{
              scale: [0.6, 1.5, 0.6],
              opacity: [0.2, 0.9, 0.2],
            }}
            transition={{
              duration: 1.8 + (i % 3) * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i * 0.2) % 2,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "bubbles") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(12)].map((_, i) => (
          <m.div
            key={i}
            className="absolute rounded-full border border-pink-300/40 bg-pink-200/10 backdrop-blur-[1px]"
            style={{
              left: `${(i * 19 + 10) % 92}%`,
              top: `${(i * 26 + 15) % 86}%`,
              width: `${14 + (i % 4) * 8}px`,
              height: `${14 + (i % 4) * 8}px`,
              boxShadow: "inset -2px -2px 6px rgba(244,114,182,0.3), 0 0 10px rgba(244,114,182,0.15)",
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, (i % 2 === 0 ? 10 : -10), 0],
            }}
            transition={{
              duration: 5 + (i % 3) * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i * 0.4) % 3,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "minimal") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-neutral-400 rounded-full"
            style={{
              left: `${(i * 27 + 13) % 92}%`,
              top: `${(i * 33 + 17) % 86}%`,
            }}
          />
        ))}
      </div>
    );
  }

  // Default: gold-dust or starlight
  return (
    <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
      <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-[#E0A842] rounded-full animate-ping" />
      <div className="absolute top-3/4 left-4/5 w-1.5 h-1.5 bg-[#8E72F0] rounded-full animate-pulse" />
      <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-white rounded-full animate-ping" />
      <div className="absolute top-1/5 right-1/4 w-1 h-1 bg-[#C495C8] rounded-full animate-pulse" />
      <div className="absolute top-1/2 right-1/6 w-1 h-1 bg-[#FDE68A] rounded-full animate-ping" />
      <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-[#E0A842] rounded-full animate-pulse" />
    </div>
  );
}

// ── Cinematic Experience Engine ──────────────────────────────────────────────

function CinematicExperience({ data, surpriseId }: { data: ExperienceData; surpriseId: string }) {
  const [scene, setScene] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasSentLove, setHasSentLove] = useState<boolean>(false);
  const [loveCount, setLoveCount] = useState<number>(0);
  const [loveToast, setLoveToast] = useState<boolean>(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number; size: number }[]>([]);

  // Cake Scene states
  const [candlesBlown, setCandlesBlown] = useState<boolean>(false);

  // Parse custom parameters from creator message
  let bodyText = data.message;
  let finaleText = "HAPPY BIRTHDAY! 🎂";
  let signOffText = "With all my warmest love • BirthdayVerse";
  let customMusic = "";
  let imageBase64 = data.image_path || "";
  let nickname = "";
  let photosList: string[] = [];
  let accentColor = "#7659E4"; // Default to signature BirthdayVerse Lavender
  let vibe = "elegant";
  let theme = "elegant";
  let templateId = "";

  try {
    const parsed = JSON.parse(data.message);
    if (parsed && typeof parsed === "object") {
      bodyText = parsed.body || data.message;
      if (parsed.finaleText) finaleText = parsed.finaleText;
      if (parsed.signOff) signOffText = parsed.signOff;
      if (parsed.nickname) nickname = parsed.nickname;
      if (parsed.imageBase64 && !imageBase64) imageBase64 = parsed.imageBase64;
      if (Array.isArray(parsed.photos) && parsed.photos.length > 0) {
        photosList = parsed.photos;
      }
      if (parsed.accentColor) accentColor = parsed.accentColor;
      if (parsed.vibe) vibe = parsed.vibe;
      if (parsed.theme) theme = parsed.theme;
      if (parsed.selectedTemplate) templateId = parsed.selectedTemplate;
      if (parsed.templateId) templateId = parsed.templateId;
      if (parsed.selectedMusic && parsed.selectedMusic !== "custom") {
        customMusic = parsed.selectedMusic;
      } else if (parsed.musicBase64 && !customMusic) {
        customMusic = parsed.musicBase64;
      }
    }
  } catch {
    // Fallback for plain text message
  }

  // Resolve Active Visual Style Template
  const activeTemplate = getTemplateById(templateId || theme, vibe);

  // If accentColor was default lavender or omitted, adopt activeTemplate.accent
  const effectiveAccent = accentColor && accentColor.toLowerCase() !== "#7659e4" 
    ? accentColor 
    : activeTemplate.accent;

  // Helper for dynamic primary CTA button styling (strictly matching active template color)
  const dynamicPrimaryButtonStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${effectiveAccent} 0%, ${effectiveAccent}dd 100%)`,
    boxShadow: `0 10px 25px -5px ${effectiveAccent}66, 0 4px 12px ${effectiveAccent}33`,
    border: `1px solid ${effectiveAccent}88`,
  };

  // Ensure primary image and photosList are synced
  if (!imageBase64 && photosList.length > 0) {
    imageBase64 = photosList[0];
  } else if (imageBase64 && !photosList.includes(imageBase64)) {
    photosList = [imageBase64, ...photosList];
  }

  if (data.music_path) {
    customMusic = data.music_path;
  }

  // Audio lifecycle
  useEffect(() => {
    if (customMusic === "none") return;
    const trackSrc = customMusic || "/Happy Birthday Song.mp3";
    audioRef.current = new Audio(trackSrc);
    audioRef.current.loop = true;
    audioRef.current.preload = "auto";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [customMusic]);

  // Audio unlock and progressive volume ramp
  const unlockAudio = () => {
    if (customMusic === "none" || !audioRef.current) return;
    audioRef.current.volume = 0;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      let vol = 0;
      const ramp = setInterval(() => {
        vol += 0.05;
        if (vol >= 0.85) {
          vol = 0.85;
          clearInterval(ramp);
        }
        if (audioRef.current) audioRef.current.volume = vol;
      }, 100);
    }).catch(() => {
      // Autoplay policy restrictions
    });
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current.volume === 0) {
        audioRef.current.volume = 0.85;
      }
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn("Audio play prevented:", err);
        });
    }
  };

  // Scene 0 -> Scene 1 Transition (The Opening)
  const handleOpenGift = () => {
    unlockAudio();
    setScene(1);
  };

  // Auto-advance scenes with timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (scene === 1) {
      // Scene 1: Preface -> Scene 2: Name reveal after 4s
      timer = setTimeout(() => setScene(2), 4000);
    } else if (scene === 2) {
      // Scene 2: Name reveal -> Scene 3: Letter after 4.5s
      timer = setTimeout(() => setScene(3), 4500);
    }
    return () => clearTimeout(timer);
  }, [scene]);

  // Send Love interaction
  const handleSendLove = (e?: React.MouseEvent) => {
    setLoveCount((prev) => prev + 1);
    setHasSentLove(true);
    incrementReactions(surpriseId);

    // Sync with local storage wishes if present
    try {
      const saved = localStorage.getItem("birthdayverse_my_wishes");
      if (saved) {
        const wishes = JSON.parse(saved);
        const updated = wishes.map((w: any) =>
          w.id === surpriseId ? { ...w, reactions: (w.reactions || 0) + 1 } : w
        );
        localStorage.setItem("birthdayverse_my_wishes", JSON.stringify(updated));
      }
    } catch {
      // ignore
    }

    // Confetti spark from center
    try {
      confetti({
        particleCount: 45,
        spread: 80,
        origin: { x: 0.5, y: 0.6 },
        colors: ["#C495C8", "#E0A842", "#7659E4", "#A28DF8"],
        zIndex: 99999,
      });
    } catch {
      // ignore
    }

    // Spawn floating heart particles that rise and fade
    const newHearts = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + Math.random() + i,
      left: Math.max(15, Math.min(85, 50 + (Math.random() - 0.5) * 60)),
      size: Math.floor(Math.random() * 14) + 20,
    }));
    setFloatingHearts((prev) => [...prev.slice(-15), ...newHearts]);

    setLoveToast(true);
    setTimeout(() => setLoveToast(false), 2500);
  };

  // Blow out candles
  const handleBlowCandles = () => {
    if (candlesBlown) return;
    setCandlesBlown(true);

    // Grand celebration confetti burst
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors: ["#E0A842", "#7659E4", "#C495C8", "#8E72F0"],
    });

    // Advance to final screen after 2.5s
    setTimeout(() => {
      setScene(7);
    }, 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `A Birthday Surprise for ${data.name}`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to copy
      }
    }
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReplay = () => {
    setCandlesBlown(false);
    setScene(1);
  };

  return (
    <div className={`relative min-h-screen w-full ${activeTemplate.pageBg} text-[#F9F7FD] flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden select-none font-sans`}>
      
      {/* Thematic Atmospheric Ambient Lighting */}
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-br ${activeTemplate.ambientOrb} rounded-full filter blur-[140px] pointer-events-none`} />

      {/* Dynamic Thematic Atmosphere Particles */}
      <ThematicAtmosphere type={activeTemplate.particleType} />

      {/* Persistent Audio Controller */}
      {scene > 0 && customMusic !== "none" && (
        <div className="fixed top-5 right-5 z-50">
          <button
            onClick={toggleMusic}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 dark:bg-[#1E182A]/80 backdrop-blur-md text-white text-xs font-semibold hover:bg-white/20 transition-all shadow-lg cursor-pointer"
            style={
              isPlaying
                ? {
                    border: `1px solid ${effectiveAccent}80`,
                    boxShadow: `0 0 16px ${effectiveAccent}30`,
                  }
                : { border: "1px solid rgba(255,255,255,0.15)" }
            }
            aria-label="Toggle music"
          >
            {isPlaying ? (
              <>
                <Music className="w-3.5 h-3.5 animate-bounce" style={{ color: effectiveAccent }} />
                <span className="text-[11px] hidden sm:inline">Playing Soundtrack</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 opacity-60" />
                <span className="text-[11px] opacity-60 hidden sm:inline">Music Paused</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Love Toast Notification */}
      <AnimatePresence>
        {loveToast && (
          <m.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-white text-xs font-bold shadow-xl flex items-center gap-2 border border-white/25 backdrop-blur-md"
            style={{
              background: `linear-gradient(135deg, ${effectiveAccent}, #F43F5E)`,
              boxShadow: `0 10px 30px ${effectiveAccent}50`,
            }}
          >
            <Heart className="w-4 h-4 fill-white animate-ping" />
            <span>Your love was sent to {data.name}! ❤️</span>
            {loveCount > 1 && (
              <span className="px-2 py-0.5 rounded-full bg-white/25 text-white text-[10px] font-extrabold">
                {loveCount}x
              </span>
            )}
          </m.div>
        )}
      </AnimatePresence>

      {/* Floating Hearts Animation Layer */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingHearts.map((heart) => (
          <m.div
            key={heart.id}
            initial={{ opacity: 1, y: "75vh", scale: 0.6 }}
            animate={{ opacity: 0, y: "10vh", scale: 1.5 }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ left: `${heart.left}%`, width: heart.size, height: heart.size }}
            className="absolute text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.7)]"
          >
            <Heart className="w-full h-full fill-current" />
          </m.div>
        ))}
      </div>

      {/* Main Experience Container */}
      <div className="flex-1 w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center my-auto z-10 py-6 sm:py-12">
        <AnimatePresence mode="wait">
          
          {/* ── SCENE 0: The Sealed Keepsake Gift ── */}
          {scene === 0 && (
            <m.div
              key="scene-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.6 }}
              className="space-y-8 max-w-md w-full px-4"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: effectiveAccent }}>
                  A personal celebration awaits
                </span>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                  Something special is waiting for you.
                </h1>
              </div>

              {/* Luxury Sealed Envelope Card */}
              <div 
                onClick={handleOpenGift}
                className={`relative mx-auto w-72 sm:w-80 h-48 sm:h-52 rounded-3xl bg-gradient-to-br from-[#1B1428]/90 to-[#261B3B]/90 border ${activeTemplate.envelopeBorder} ${activeTemplate.envelopeGlow} backdrop-blur-md flex flex-col items-center justify-center p-6 cursor-pointer group hover:scale-[1.02] transition-all`}
              >
                {/* Foil border inner */}
                <div className="absolute inset-2 rounded-2xl border border-white/10 pointer-events-none" />

                {/* Wax Seal Emblem */}
                <div 
                  className="w-16 h-16 rounded-full p-0.5 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, ${effectiveAccent}, ${effectiveAccent}cc)`,
                    boxShadow: `0 8px 24px ${effectiveAccent}40`,
                  }}
                >
                  <div className="w-full h-full rounded-full bg-[#1B1428] flex items-center justify-center border border-white/20">
                    <Sparkles className="w-7 h-7" style={{ color: effectiveAccent }} />
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs font-serif italic text-white/90">
                    Crafted with love for {data.name}
                  </p>
                  <span className="text-[10px] text-[#A89EC0] tracking-widest uppercase mt-1 block">
                    Tap to unlock
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleOpenGift}
                className="w-full max-w-xs mx-auto text-white font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all"
                style={dynamicPrimaryButtonStyle}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Open Your Surprise ✨
              </Button>
            </m.div>
          )}

          {/* ── SCENE 1: Soft Cinematic Transition ── */}
          {scene === 1 && (
            <m.div
              key="scene-1"
              initial={{ opacity: 0, filter: "blur(20px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(15px)" }}
              transition={{ duration: 1.5 }}
              onClick={() => setScene(2)}
              className="space-y-4 max-w-lg cursor-pointer px-4"
            >
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: effectiveAccent }}>
                Today is your day
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-light text-white leading-relaxed">
                Some people make the world brighter simply by being in it...
              </h2>
            </m.div>
          )}

          {/* ── SCENE 2: The Name Reveal ── */}
          {scene === 2 && (
            <m.div
              key="scene-2"
              initial={{ opacity: 0, scale: 0.85, filter: "blur(15px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 1.2 }}
              onClick={() => setScene(3)}
              className="space-y-4 max-w-xl cursor-pointer px-4"
            >
              <span className="text-xs font-serif italic tracking-wider text-[#A89EC0]">
                Celebrating the one and only
              </span>
              
              <h1 className={`text-5xl sm:text-7xl md:text-8xl font-serif italic font-bold tracking-tight bg-gradient-to-r ${activeTemplate.titleGradient} bg-clip-text text-transparent drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]`}>
                {nickname ? `${data.name} (${nickname})` : data.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#A89EC0] font-light max-w-sm mx-auto">
                Here is a special message written from the heart.
              </p>
            </m.div>
          )}

          {/* ── SCENE 3: Personal Letter ── */}
          {scene === 3 && (
            <m.div
              key="scene-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-xl px-4 space-y-6"
            >
              {/* Luxury Letter Card */}
              <div 
                className="p-6 sm:p-10 rounded-3xl bg-[#1E182A]/90 shadow-2xl backdrop-blur-xl text-left space-y-4 border transition-all"
                style={{
                  borderColor: `${effectiveAccent}40`,
                  boxShadow: `0 20px 50px -10px rgba(0,0,0,0.5), 0 0 35px ${effectiveAccent}15`,
                }}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span 
                    className="text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: effectiveAccent }}
                  >
                    Personal Birthday Message
                  </span>
                  <Sparkles className="w-3.5 h-3.5" style={{ color: effectiveAccent }} />
                </div>

                <div className="text-base sm:text-lg font-serif leading-relaxed text-[#F9F7FD] whitespace-pre-wrap">
                  {bodyText}
                </div>

                <div className="pt-2 text-right">
                  <span className="text-xs font-serif italic text-[#A89EC0]">
                    {signOffText}
                  </span>
                </div>
              </div>

              <Button
                size="md"
                onClick={() => setScene(4)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="mx-auto text-white font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all"
                style={dynamicPrimaryButtonStyle}
              >
                Continue &rarr;
              </Button>
            </m.div>
          )}

          {/* ── SCENE 4: Interactive Heart Moment ── */}
          {scene === 4 && (
            <m.div
              key="scene-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 max-w-md px-4"
            >
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Some people make ordinary days extraordinary.
                </h2>
                <p className="text-xs sm:text-sm text-[#A89EC0]">
                  {hasSentLove
                    ? "Love sent! Tap again to send more 💕"
                    : "Tap the heart to send your love to the creator"}
                </p>
              </div>

              {/* Beating Jewel Heart */}
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={handleSendLove}
                  className={`w-32 h-32 rounded-full p-1 flex items-center justify-center mx-auto transition-all cursor-pointer group active:scale-90 ${
                    hasSentLove
                      ? "scale-105 animate-pulse"
                      : "hover:scale-110"
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${effectiveAccent}, #F43F5E)`,
                    boxShadow: hasSentLove 
                      ? `0 0 60px ${effectiveAccent}80, 0 0 30px rgba(244,63,94,0.6)` 
                      : `0 0 40px ${effectiveAccent}40`,
                  }}
                  aria-label="Send love"
                >
                  <div className="w-full h-full rounded-full bg-[#1E182A] flex flex-col items-center justify-center gap-1">
                    <Heart
                      className={`w-12 h-12 transition-transform ${
                        hasSentLove
                          ? "scale-110"
                          : "group-hover:scale-110"
                      }`}
                      style={{
                        color: hasSentLove ? "#FF6B8A" : effectiveAccent,
                        fill: hasSentLove ? "#FF6B8A" : effectiveAccent,
                      }}
                    />
                    {hasSentLove && loveCount > 0 && (
                      <span className="text-[11px] font-bold text-[#FF6B8A]">
                        {loveCount}x love! 💕
                      </span>
                    )}
                  </div>
                </button>

                {hasSentLove && (
                  <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-2 rounded-full border text-sm font-semibold text-white backdrop-blur-md"
                    style={{
                      background: `linear-gradient(135deg, ${effectiveAccent}30, #F43F5E30)`,
                      borderColor: `${effectiveAccent}60`,
                    }}
                  >
                    ❤️ Love sent to {data.name}!
                  </m.div>
                )}
              </div>

              <div className="pt-4">
                <Button
                  size="md"
                  onClick={() => setScene(5)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="mx-auto text-white font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all"
                  style={dynamicPrimaryButtonStyle}
                >
                  Continue to Memories &rarr;
                </Button>
              </div>
            </m.div>
          )}


          {/* ── SCENE 5: Memory Reveal (Casino 52-Card Deck Style) ── */}
          {scene === 5 && (
            <m.div
              key="scene-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 max-w-sm px-4 w-full"
            >
              <div className="text-center space-y-1">
                <span 
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: effectiveAccent }}
                >
                  Cherished Moments
                </span>
              </div>

              {photosList.length > 0 ? (
                <CasinoCardDeck
                  photos={photosList}
                  name={data.name}
                  accentColor={effectiveAccent}
                />
              ) : (
                /* No photos — monogram card */
                <div className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl" style={{ height: 320, width: "100%", maxWidth: 320 }}>
                  <div className="w-full h-full bg-gradient-to-br from-[#261F36] to-[#1E182A] flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-serif font-bold text-white shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${effectiveAccent}, ${effectiveAccent}cc)`,
                        boxShadow: `0 10px 25px ${effectiveAccent}40`,
                      }}
                    >
                      {data.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-xl font-serif italic text-white font-bold">
                      A celebration of {data.name}
                    </h3>
                    <p className="text-xs text-[#A89EC0] max-w-xs leading-relaxed">
                      May every day of this new year bring you happiness, joy, and peace.
                    </p>
                  </div>
                  <div className="absolute inset-0 rounded-3xl border-2 border-white/20 pointer-events-none" />
                </div>
              )}

              <Button
                size="md"
                onClick={() => setScene(6)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="mx-auto text-white font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all"
                style={dynamicPrimaryButtonStyle}
              >
                Make a Birthday Wish 🎂
              </Button>
            </m.div>
          )}

          {/* ── SCENE 6: Interactive Birthday Cake ── */}
          {scene === 6 && (
            <m.div
              key="scene-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 max-w-md px-4"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: effectiveAccent }}>
                  Make a Wish
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Happy Birthday, {data.name}!
                </h2>
                <p className="text-xs text-[#A89EC0]">
                  {candlesBlown ? "Wish made! Celebrating..." : "Tap the candles to blow them out ✨"}
                </p>
              </div>

              {/* Realistic 3D Handcrafted Cake with Wax Candles & Smoke Emitter */}
              <RealisticCake
                name={data.name}
                accentColor={effectiveAccent}
                templateId={activeTemplate.id}
                candlesBlown={candlesBlown}
                onBlowCandles={handleBlowCandles}
              />

              <div className="pt-2">
                <Button
                  size="md"
                  onClick={handleBlowCandles}
                  className="mx-auto text-white font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all"
                  style={dynamicPrimaryButtonStyle}
                >
                  {candlesBlown ? "Wish Granted! ✨" : "Blow Out Candles 🎂"}
                </Button>
              </div>
            </m.div>
          )}

          {/* ── SCENE 7: Final Keepsake Screen ── */}
          {scene === 7 && (
            <m.div
              key="scene-7"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 max-w-lg px-4"
            >
              <div className="space-y-3">
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: effectiveAccent }}>
                  Celebration Keepsake
                </span>
                <h1 className={`text-3xl sm:text-5xl font-serif italic font-bold tracking-tight bg-gradient-to-r ${activeTemplate.titleGradient} bg-clip-text text-transparent leading-tight drop-shadow-[0_8px_24px_rgba(0,0,0,0.3)]`}>
                  {finaleText}
                </h1>
                <p className="text-xs sm:text-sm text-[#A89EC0] max-w-md mx-auto leading-relaxed">
                  Here&apos;s to another beautiful chapter filled with unforgettable memories, love, and laughter.
                </p>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleReplay}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  Replay
                </Button>

                <Button
                  size="md"
                  onClick={handleSendLove}
                  leftIcon={<Heart className={`w-4 h-4 text-rose-300 ${loveCount > 0 ? "fill-rose-300 animate-pulse" : ""}`} />}
                  className="text-white font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all"
                  style={dynamicPrimaryButtonStyle}
                >
                  {loveCount > 0 ? `Love Sent! ❤️ (${loveCount})` : "Send Love ❤️"}
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleShare}
                  leftIcon={<Share2 className="w-4 h-4" />}
                >
                  {copied ? "Link Copied!" : "Share"}
                </Button>
              </div>

              {/* Standout Bordered CTA Button */}
              <div className="pt-8 border-t border-[#282038]/60 flex flex-col items-center gap-2.5">
                <p className="text-xs text-[#A89EC0]">
                  Turn birthdays into unforgettable memories.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer group"
                  style={{
                    border: `1px solid ${effectiveAccent}`,
                    background: `linear-gradient(135deg, ${effectiveAccent}35, ${effectiveAccent}15)`,
                    boxShadow: `0 4px 25px ${effectiveAccent}35`,
                  }}
                >
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" style={{ color: effectiveAccent }} />
                  <span>Create your own Birthday Verse</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" style={{ color: effectiveAccent }} />
                </a>
              </div>
            </m.div>
          )}

        </AnimatePresence>
      </div>

      {/* Subtle Bottom Watermark */}
      <footer className="w-full max-w-5xl mx-auto py-3 text-center text-[10px] text-[#736886] z-10">
        BirthdayVerse &bull; The Digital Birthday Experience
      </footer>
    </div>
  );
}
