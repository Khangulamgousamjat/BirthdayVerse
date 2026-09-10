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
  Flame, 
  ArrowRight,
  ExternalLink
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
      <div className="min-h-screen bg-[#0E0817] flex flex-col items-center justify-center text-[#E7B85C] space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#E7B85C]/30 border-t-[#E7B85C] animate-spin" />
        <span className="text-xs font-semibold tracking-widest uppercase text-[#B8AEC5]">
          Preparing your birthday celebration...
        </span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0E0817] flex flex-col items-center justify-center text-white px-4 text-center">
        <div className="p-8 rounded-3xl bg-[#1D162A]/80 border border-[#251B35] max-w-md space-y-4">
          <Gift className="w-10 h-10 text-[#9D6BFF] mx-auto opacity-70" />
          <h1 className="text-xl font-display font-bold text-white">
            This celebration link has expired or doesn&apos;t exist.
          </h1>
          <p className="text-xs text-[#B8AEC5] leading-relaxed">
            BirthdayVerse experiences are protected by private 72-hour ephemeral retention.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate("/")}
            className="w-full mt-2"
          >
            Create a New Birthday Verse
          </Button>
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
  const [loveToast, setLoveToast] = useState<boolean>(false);

  // Cake Scene states
  const [candlesBlown, setCandlesBlown] = useState<boolean>(false);

  // Parse custom parameters from creator message
  let bodyText = data.message;
  let finaleText = "HAPPY BIRTHDAY! 🎂";
  let customMusic = "";
  let imageBase64 = data.image_path || "";
  let nickname = "";

  try {
    const parsed = JSON.parse(data.message);
    if (parsed && typeof parsed === "object") {
      bodyText = parsed.body || data.message;
      if (parsed.finaleText) finaleText = parsed.finaleText;
      if (parsed.nickname) nickname = parsed.nickname;
      if (parsed.imageBase64 && !imageBase64) imageBase64 = parsed.imageBase64;
      if (parsed.selectedMusic && parsed.selectedMusic !== "custom") {
        customMusic = parsed.selectedMusic;
      } else if (parsed.musicBase64 && !customMusic) {
        customMusic = parsed.musicBase64;
      }
    }
  } catch {
    // Fallback for plain text message
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
    if (hasSentLove) return;
    setHasSentLove(true);
    incrementReactions(surpriseId);

    // Confetti spark from center
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x: 0.5, y: 0.6 },
      colors: ["#F47FB5", "#E7B85C", "#9D6BFF"],
    });

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
      colors: ["#E7B85C", "#9D6BFF", "#F47FB5", "#9AD8C2"],
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
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#0B0614] via-[#140A22] to-[#0A0512] text-[#F7F3FC] flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden select-none font-sans">
      
      {/* Subtle Atmospheric Ambient Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#7952D6]/15 via-[#E7B85C]/10 to-transparent rounded-full filter blur-[140px] pointer-events-none" />

      {/* Floating Starlight Dust Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-[#E7B85C] rounded-full animate-ping" />
        <div className="absolute top-3/4 left-4/5 w-1.5 h-1.5 bg-[#9D6BFF] rounded-full animate-pulse" />
        <div className="absolute top-2/3 left-1/3 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute top-1/5 right-1/4 w-1 h-1 bg-[#F47FB5] rounded-full animate-pulse" />
      </div>

      {/* Persistent Audio Controller */}
      {scene > 0 && customMusic !== "none" && (
        <div className="fixed top-5 right-5 z-50">
          <button
            onClick={toggleMusic}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 dark:bg-[#1D162A]/80 backdrop-blur-md border border-white/15 text-white text-xs font-semibold hover:bg-white/20 transition-all shadow-lg cursor-pointer"
            aria-label="Toggle music"
          >
            {isPlaying ? (
              <>
                <Music className="w-3.5 h-3.5 text-[#E7B85C] animate-bounce" />
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
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#9D6BFF] to-[#F47FB5] text-white text-xs font-bold shadow-xl flex items-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Your love was sent to {data.name}!</span>
          </m.div>
        )}
      </AnimatePresence>

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
                <span className="text-xs font-bold tracking-widest uppercase text-[#E7B85C]">
                  A personal celebration awaits
                </span>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                  Something special is waiting for you.
                </h1>
              </div>

              {/* Luxury Sealed Envelope Card */}
              <div 
                onClick={handleOpenGift}
                className="relative mx-auto w-72 sm:w-80 h-48 sm:h-52 rounded-3xl bg-gradient-to-br from-[#1C1230] to-[#251540] border border-[#E7B85C]/35 shadow-[0_15px_45px_rgba(157,107,255,0.15)] flex flex-col items-center justify-center p-6 cursor-pointer group hover:scale-[1.02] hover:border-[#E7B85C]/60 transition-all"
              >
                {/* Gold foil border inner */}
                <div className="absolute inset-2 rounded-2xl border border-[#E7B85C]/15 pointer-events-none" />

                {/* Wax Seal Emblem */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E7B85C] via-[#D97706] to-[#92400E] p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-full h-full rounded-full bg-[#1C1230] flex items-center justify-center border border-[#E7B85C]/40">
                    <Sparkles className="w-7 h-7 text-[#E7B85C]" />
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs font-serif italic text-white/90">
                    Crafted with love for {data.name}
                  </p>
                  <span className="text-[10px] text-[#B8AEC5] tracking-widest uppercase mt-1 block">
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
              <span className="text-xs font-bold tracking-widest uppercase text-[#9D6BFF]">
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
              <span className="text-xs font-serif italic tracking-wider text-[#B8AEC5]">
                Celebrating the one and only
              </span>
              
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif italic font-bold tracking-tight bg-gradient-to-r from-[#FFFBEB] via-[#E7B85C] to-[#F59E0B] bg-clip-text text-transparent drop-shadow-[0_10px_30px_rgba(231,184,92,0.3)]">
                {nickname ? `${data.name} (${nickname})` : data.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#B8AEC5] font-light max-w-sm mx-auto">
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
              <div className="p-6 sm:p-10 rounded-3xl bg-[#1D162A]/90 border border-[#E7B85C]/25 shadow-2xl backdrop-blur-xl text-left space-y-4">
                <div className="flex items-center justify-between border-b border-[#251B35] pb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#E7B85C]">
                    Personal Birthday Message
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#E7B85C]" />
                </div>

                <div className="text-base sm:text-lg font-serif leading-relaxed text-[#F7F3FC] whitespace-pre-wrap">
                  {bodyText}
                </div>

                <div className="pt-2 text-right">
                  <span className="text-xs font-serif italic text-[#B8AEC5]">
                    With all my warmest love &bull; BirthdayVerse
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
                <p className="text-xs sm:text-sm text-[#B8AEC5]">
                  Tap the heart to send your reaction back to the creator
                </p>
              </div>

              {/* Beating Jewel Heart */}
              <button
                onClick={handleSendLove}
                className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#BE123C] via-[#F47FB5] to-[#FB7185] p-1 shadow-[0_0_50px_rgba(244,127,181,0.35)] flex items-center justify-center mx-auto hover:scale-110 active:scale-95 transition-all cursor-pointer group"
                aria-label="Send love"
              >
                <div className="w-full h-full rounded-full bg-[#1A0B22] flex items-center justify-center">
                  <Heart className="w-12 h-12 text-[#F47FB5] group-hover:scale-110 transition-transform fill-[#F47FB5]" />
                </div>
              </button>

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
              className="space-y-6 max-w-md px-4"
            >
              <span className="text-xs font-bold tracking-widest uppercase text-[#E7B85C]">
                Cherished Moments
              </span>

              {/* Framed Photo or Monogram Card */}
              <div className="p-3 sm:p-4 rounded-3xl bg-gradient-to-b from-[#E7B85C]/20 to-[#9D6BFF]/10 border border-[#E7B85C]/40 shadow-2xl">
                {imageBase64 ? (
                  <div className="rounded-2xl overflow-hidden aspect-square max-h-80 w-full bg-black">
                    <img
                      src={imageBase64}
                      alt={data.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl aspect-square max-h-80 w-full bg-[#1D162A] flex flex-col items-center justify-center p-8 text-center space-y-3">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#7952D6] to-[#E7B85C] flex items-center justify-center text-3xl font-serif font-bold text-white shadow-lg">
                      {data.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-lg font-serif italic text-white font-bold">
                      A celebration of {data.name}
                    </h3>
                    <p className="text-xs text-[#B8AEC5] max-w-xs">
                      May every day of this new year bring you happiness, joy, and peace.
                    </p>
                  </div>
                )}
              </div>

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
                <span className="text-xs font-bold tracking-widest uppercase text-[#E7B85C]">
                  Make a Wish
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  Happy Birthday, {data.name}!
                </h2>
                <p className="text-xs text-[#B8AEC5]">
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
                <div className="w-36 h-12 bg-gradient-to-r from-[#D946EF] to-[#9D6BFF] rounded-t-2xl border-t-2 border-white/40 shadow-md z-10 flex items-center justify-center text-[10px] font-bold text-white/80">
                  &bull; &bull; &bull; &bull;
                </div>

                {/* Cake Tier 2 (Middle) */}
                <div className="w-48 h-14 bg-gradient-to-r from-[#7952D6] via-[#9D6BFF] to-[#7952D6] rounded-t-xl border-t border-white/20 shadow-md flex items-center justify-center text-xs font-bold text-white">
                  {data.name}
                </div>

                {/* Cake Plate */}
                <div className="w-60 h-4 bg-gradient-to-r from-[#E7B85C] via-[#FDE68A] to-[#D97706] rounded-full shadow-lg" />
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
                <span className="text-xs font-bold tracking-widest uppercase text-[#E7B85C]">
                  Celebration Keepsake
                </span>
                <h1 className="text-3xl sm:text-5xl font-serif italic font-bold tracking-tight text-white leading-tight">
                  {finaleText}
                </h1>
                <p className="text-xs sm:text-sm text-[#B8AEC5] max-w-md mx-auto leading-relaxed">
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
                  leftIcon={<Heart className="w-4 h-4 text-rose-300" />}
                >
                  Send Love ❤️
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

              {/* Discreet CTA to create own verse */}
              <div className="pt-8 border-t border-[#251B35]/60">
                <p className="text-xs text-[#746B80]">
                  Turn birthdays into unforgettable memories.
                </p>
                <a
                  href="/"
                  className="text-xs font-semibold text-[#9D6BFF] hover:underline inline-flex items-center gap-1 mt-1"
                >
                  Create your own Birthday Verse <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </m.div>
          )}

        </AnimatePresence>
      </div>

      {/* Subtle Bottom Watermark */}
      <footer className="w-full max-w-5xl mx-auto py-3 text-center text-[10px] text-[#746B80] z-10">
        BirthdayVerse &bull; The Digital Birthday Experience
      </footer>
    </div>
  );
}
