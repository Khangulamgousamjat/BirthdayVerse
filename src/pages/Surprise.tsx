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

  // Card-stack swipe state
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

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
      if (parsed.selectedMusic && parsed.selectedMusic !== "custom") {
        customMusic = parsed.selectedMusic;
      } else if (parsed.musicBase64 && !customMusic) {
        customMusic = parsed.musicBase64;
      }
    }
  } catch {
    // Fallback for plain text message
  }

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
      audioRef.current.play();
      setIsPlaying(true);
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
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#0F0C18] via-[#161122] to-[#0D0A14] text-[#F9F7FD] flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden select-none font-sans">
      
      {/* Subtle Atmospheric Ambient Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#7659E4]/12 via-[#E0A842]/08 to-transparent rounded-full filter blur-[140px] pointer-events-none" />

      {/* Floating Starlight Dust Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-[#E0A842] rounded-full animate-ping" />
        <div className="absolute top-3/4 left-4/5 w-1.5 h-1.5 bg-[#8E72F0] rounded-full animate-pulse" />
        <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute top-1/5 right-1/4 w-1 h-1 bg-[#C495C8] rounded-full animate-pulse" />
      </div>

      {/* Persistent Audio Controller */}
      {scene > 0 && customMusic !== "none" && (
        <div className="fixed top-5 right-5 z-50">
          <button
            onClick={toggleMusic}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 dark:bg-[#1E182A]/80 backdrop-blur-md border border-white/15 text-white text-xs font-semibold hover:bg-white/20 transition-all shadow-lg cursor-pointer"
            aria-label="Toggle music"
          >
            {isPlaying ? (
              <>
                <Music className="w-3.5 h-3.5 text-[#E0A842] animate-bounce" />
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
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7659E4] to-[#C495C8] text-white text-xs font-bold shadow-xl flex items-center gap-2 border border-white/25 backdrop-blur-md"
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
                <span className="text-xs font-bold tracking-widest uppercase text-[#E0A842]">
                  A personal celebration awaits
                </span>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                  Something special is waiting for you.
                </h1>
              </div>

              {/* Luxury Sealed Envelope Card */}
              <div 
                onClick={handleOpenGift}
                className="relative mx-auto w-72 sm:w-80 h-48 sm:h-52 rounded-3xl bg-gradient-to-br from-[#1B1428] to-[#261B3B] border border-[#E0A842]/30 shadow-[0_15px_45px_rgba(118,89,228,0.12)] flex flex-col items-center justify-center p-6 cursor-pointer group hover:scale-[1.02] hover:border-[#E0A842]/60 transition-all"
              >
                {/* Gold foil border inner */}
                <div className="absolute inset-2 rounded-2xl border border-[#E0A842]/15 pointer-events-none" />

                {/* Wax Seal Emblem */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E0A842] via-[#C8922C] to-[#8C5E14] p-0.5 shadow-lg shadow-amber-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-full h-full rounded-full bg-[#1B1428] flex items-center justify-center border border-[#E0A842]/40">
                    <Sparkles className="w-7 h-7 text-[#E0A842]" />
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
                variant="gold"
                size="lg"
                onClick={handleOpenGift}
                className="w-full max-w-xs mx-auto shadow-lg"
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
              <span className="text-xs font-bold tracking-widest uppercase text-[#8E72F0]">
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
              
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif italic font-bold tracking-tight bg-gradient-to-r from-[#FFFBEB] via-[#E0A842] to-[#D97706] bg-clip-text text-transparent drop-shadow-[0_10px_30px_rgba(224,168,66,0.25)]">
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
              <div className="p-6 sm:p-10 rounded-3xl bg-[#1E182A]/90 border border-[#E0A842]/25 shadow-2xl backdrop-blur-xl text-left space-y-4">
                <div className="flex items-center justify-between border-b border-[#282038] pb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#E0A842]">
                    Personal Birthday Message
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#E0A842]" />
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
                variant="primary"
                size="md"
                onClick={() => setScene(4)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="mx-auto"
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
                      ? "bg-gradient-to-tr from-[#A83868] via-[#C495C8] to-[#A28DF8] shadow-[0_0_60px_rgba(196,149,200,0.6)] scale-105 animate-pulse"
                      : "bg-gradient-to-tr from-[#A83868] via-[#C495C8] to-[#A28DF8] shadow-[0_0_40px_rgba(196,149,200,0.3)] hover:scale-110"
                  }`}
                  aria-label="Send love"
                >
                  <div className="w-full h-full rounded-full bg-[#1E182A] flex flex-col items-center justify-center gap-1">
                    <Heart
                      className={`w-12 h-12 transition-transform ${
                        hasSentLove
                          ? "text-[#FF6B8A] fill-[#FF6B8A] scale-110"
                          : "text-[#C495C8] fill-[#C495C8] group-hover:scale-110"
                      }`}
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
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#7659E4]/30 to-[#C495C8]/30 border border-[#C495C8]/40 text-sm font-semibold text-white"
                  >
                    ❤️ Love sent to {data.name}!
                  </m.div>
                )}
              </div>

              <div className="pt-4">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setScene(5)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to Memories &rarr;
                </Button>
              </div>
            </m.div>
          )}


          {/* ── SCENE 5: Memory Reveal ── */}
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
                <span className="text-xs font-bold tracking-widest uppercase text-[#E0A842]">
                  Cherished Moments
                </span>
                {photosList.length > 1 && (
                  <p className="text-[11px] text-[#A89EC0]">
                    Swipe the card ✨ {activeCardIndex + 1} / {photosList.length}
                  </p>
                )}
              </div>

              {photosList.length > 0 ? (
                <div className="relative mx-auto" style={{ height: 340, width: "100%", maxWidth: 320 }}>
                  {/* Render card stack — bottom cards first, top card last */}
                  {photosList
                    .slice(activeCardIndex)
                    .map((photo, stackIdx) => {
                      const reverseIdx = photosList.slice(activeCardIndex).length - 1 - stackIdx;
                      const isTopCard = stackIdx === 0;
                      const depth = Math.min(reverseIdx, 3);
                      return isTopCard ? (
                        <m.div
                          key={`card-${activeCardIndex}`}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.4}
                          onDragEnd={(_e, info) => {
                            if (Math.abs(info.offset.x) > 90) {
                              // Dismissed — go to next card
                              setActiveCardIndex((prev) => Math.min(prev + 1, photosList.length - 1));
                            }
                          }}
                          animate={{ scale: 1, rotate: 0, x: 0, opacity: 1 }}
                          exit={{ x: 400, opacity: 0, rotate: 20 }}
                          whileDrag={{ cursor: "grabbing" }}
                          className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl cursor-grab select-none"
                          style={{ zIndex: 20, touchAction: "none" }}
                        >
                          <img
                            src={photo}
                            alt={`${data.name} memory ${activeCardIndex + 1}`}
                            className="w-full h-full object-cover"
                            draggable={false}
                          />
                          {/* Gold frame overlay */}
                          <div className="absolute inset-0 rounded-3xl border-2 border-[#E0A842]/40 pointer-events-none" />
                          {/* Swipe hint overlay on first card */}
                          {photosList.length > 1 && activeCardIndex === 0 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white whitespace-nowrap">
                              👈 Swipe to see more 👉
                            </div>
                          )}
                          {/* Counter */}
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white">
                            {activeCardIndex + 1} / {photosList.length}
                          </div>
                        </m.div>
                      ) : (
                        /* Background stacked cards */
                        <div
                          key={`bg-card-${activeCardIndex + stackIdx}`}
                          className="absolute inset-0 rounded-3xl overflow-hidden"
                          style={{
                            zIndex: 20 - depth,
                            transform: `scale(${1 - depth * 0.04}) translateY(${depth * 12}px)`,
                            opacity: 1 - depth * 0.15,
                            filter: `brightness(${1 - depth * 0.15})`,
                          }}
                        >
                          <img
                            src={photo}
                            alt="memory"
                            className="w-full h-full object-cover"
                            draggable={false}
                          />
                          <div className="absolute inset-0 rounded-3xl border-2 border-[#E0A842]/30 pointer-events-none" />
                        </div>
                      );
                    })}

                  {/* All swiped — show done state */}
                  {activeCardIndex >= photosList.length && (
                    <m.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 rounded-3xl bg-[#1E182A] border border-[#E0A842]/30 flex flex-col items-center justify-center gap-3 p-6 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#7659E4] to-[#E0A842] flex items-center justify-center text-2xl font-serif font-bold text-white shadow-lg">
                        {data.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm text-white font-semibold">All memories seen! 💛</p>
                      <button
                        onClick={() => setActiveCardIndex(0)}
                        className="text-[11px] text-[#E0A842] underline underline-offset-2 cursor-pointer"
                      >
                        View again
                      </button>
                    </m.div>
                  )}
                </div>
              ) : (
                /* No photos — monogram card */
                <div className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl" style={{ height: 320, width: "100%", maxWidth: 320 }}>
                  <div className="w-full h-full bg-gradient-to-br from-[#261F36] to-[#1E182A] flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#7659E4] to-[#E0A842] flex items-center justify-center text-4xl font-serif font-bold text-white shadow-lg">
                      {data.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-xl font-serif italic text-white font-bold">
                      A celebration of {data.name}
                    </h3>
                    <p className="text-xs text-[#A89EC0] max-w-xs leading-relaxed">
                      May every day of this new year bring you happiness, joy, and peace.
                    </p>
                  </div>
                  <div className="absolute inset-0 rounded-3xl border-2 border-[#E0A842]/40 pointer-events-none" />
                </div>
              )}

              <Button
                variant="gold"
                size="md"
                onClick={() => setScene(6)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="mx-auto"
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
                <span className="text-xs font-bold tracking-widest uppercase text-[#E0A842]">
                  Make a Wish
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Happy Birthday, {data.name}!
                </h2>
                <p className="text-xs text-[#A89EC0]">
                  {candlesBlown ? "Wish made! Celebrating..." : "Tap the candles to blow them out ✨"}
                </p>
              </div>

              {/* Handcrafted Cake Visual with Flickering Candles */}
              <div
                onClick={handleBlowCandles}
                className="relative mx-auto w-64 h-56 flex flex-col items-center justify-end cursor-pointer group"
              >
                {/* 3 Candles */}
                <div className="flex items-end justify-center gap-6 mb-1 z-20">
                  {[0, 1, 2].map((candleIndex) => (
                    <div key={candleIndex} className="flex flex-col items-center">
                      {/* Flame */}
                      {!candlesBlown ? (
                        <div className="w-3.5 h-6 rounded-full bg-gradient-to-t from-amber-500 via-yellow-400 to-amber-200 animate-pulse shadow-[0_0_15px_#F59E0B]" />
                      ) : (
                        <div className="w-1.5 h-3 bg-gray-400/50 rounded-full animate-ping" />
                      )}
                      {/* Candle Stick */}
                      <div className="w-2.5 h-10 bg-gradient-to-b from-white to-purple-200 rounded-sm border border-purple-300/40" />
                    </div>
                  ))}
                </div>

                {/* Cake Tier 1 (Top) */}
                <div className="w-36 h-12 bg-gradient-to-r from-[#8E72F0] to-[#7659E4] rounded-t-2xl border-t-2 border-white/40 shadow-md z-10 flex items-center justify-center text-[10px] font-bold text-white/80">
                  &bull; &bull; &bull; &bull;
                </div>

                {/* Cake Tier 2 (Middle) */}
                <div className="w-48 h-14 bg-gradient-to-r from-[#54448C] via-[#7659E4] to-[#54448C] rounded-t-xl border-t border-white/20 shadow-md flex items-center justify-center text-xs font-bold text-white">
                  {data.name}
                </div>

                {/* Cake Plate */}
                <div className="w-60 h-4 bg-gradient-to-r from-[#E0A842] via-[#FDE68A] to-[#C8922C] rounded-full shadow-lg" />
              </div>

              <div className="pt-2">
                <Button
                  variant="gold"
                  size="md"
                  onClick={handleBlowCandles}
                  className="mx-auto"
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
                <span className="text-xs font-bold tracking-widest uppercase text-[#E0A842]">
                  Celebration Keepsake
                </span>
                <h1 className="text-3xl sm:text-5xl font-serif italic font-bold tracking-tight text-white leading-tight">
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
                  variant="primary"
                  size="md"
                  onClick={handleSendLove}
                  leftIcon={<Heart className={`w-4 h-4 text-[#C495C8] ${loveCount > 0 ? "fill-[#C495C8] animate-pulse" : ""}`} />}
                  className="shadow-md shadow-[#7659E4]/20 active:scale-95 transition-all"
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
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-[#7659E4] bg-gradient-to-r from-[#7659E4]/20 via-[#8E72F0]/25 to-[#C495C8]/20 hover:from-[#7659E4]/30 hover:to-[#C495C8]/30 text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-[0_4px_20px_rgba(118,89,228,0.25)] hover:shadow-[0_6px_28px_rgba(118,89,228,0.35)] hover:scale-105 active:scale-95 cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 text-[#E0A842] group-hover:rotate-12 transition-transform" />
                  <span>Create your own Birthday Verse</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#A28DF8] group-hover:translate-x-0.5 transition-transform" />
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
