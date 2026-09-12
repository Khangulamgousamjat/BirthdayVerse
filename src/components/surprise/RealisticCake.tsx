import React, { useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";

interface RealisticCakeProps {
  name: string;
  accentColor: string;
  templateId?: string;
  candlesBlown: boolean;
  onBlowCandles: () => void;
}

// Generate rich palette variations based on accent color and active template
function getCakePalette(accent: string, templateId?: string) {
  const norm = (templateId || "").toLowerCase();
  const acc = (accent || "").toLowerCase();

  // 1. Royal Emerald / Green Velvet & 24k Gold
  if (norm.includes("emerald") || norm.includes("green") || acc === "#10b981" || acc === "#059669") {
    return {
      tier1Base: "linear-gradient(135deg, #064E3B 0%, #065F46 35%, #047857 70%, #022C22 100%)",
      tier2Base: "linear-gradient(135deg, #047857 0%, #10B981 40%, #059669 80%, #064E3B 100%)",
      topSurface1: "radial-gradient(ellipse at 45% 45%, #059669 0%, #064E3B 70%, #022C22 100%)",
      topSurface2: "radial-gradient(ellipse at 45% 45%, #34D399 0%, #10B981 65%, #047857 100%)",
      glaze: "linear-gradient(180deg, #6EE7B7 0%, #10B981 60%, #047857 100%)",
      frostingTrim: "#F59E0B", // Champagne gold
      pipingBeads: "#FDE68A",
      standGradient: "linear-gradient(180deg, #FDE68A 0%, #D97706 30%, #F59E0B 55%, #B45309 85%, #78350F 100%)",
      standPlate: "#B45309",
      accentGlow: "rgba(16, 185, 129, 0.55)",
      plaqueBg: "linear-gradient(135deg, #022C22 0%, #064E3B 60%, #0F392B 100%)",
      plaqueBorder: "#F59E0B",
      plaqueText: "#FDE68A",
      candleColors: ["#FDE68A", "#10B981", "#FDE68A"],
      ribbonStripe: "rgba(253, 230, 138, 0.45)",
    };
  }

  // 2. Romantic / Sweet Romance / Rose Gold
  if (norm.includes("romantic") || norm.includes("rose") || acc === "#f43f5e" || acc === "#e11d48") {
    return {
      tier1Base: "linear-gradient(135deg, #4C0519 0%, #881337 35%, #9F1239 70%, #30030E 100%)",
      tier2Base: "linear-gradient(135deg, #BE123C 0%, #E11D48 45%, #FB7185 80%, #9F1239 100%)",
      topSurface1: "radial-gradient(ellipse at 45% 45%, #9F1239 0%, #881337 70%, #4C0519 100%)",
      topSurface2: "radial-gradient(ellipse at 45% 45%, #FDA4AF 0%, #FB7185 65%, #E11D48 100%)",
      glaze: "linear-gradient(180deg, #FFE4E6 0%, #FB7185 60%, #BE123C 100%)",
      frostingTrim: "#FFF1F2",
      pipingBeads: "#FECDD3",
      standGradient: "linear-gradient(180deg, #FFF1F2 0%, #FDA4AF 30%, #FB7185 55%, #BE123C 85%, #881337 100%)",
      standPlate: "#881337",
      accentGlow: "rgba(244, 63, 94, 0.55)",
      plaqueBg: "linear-gradient(135deg, #4C0519 0%, #881337 100%)",
      plaqueBorder: "#FDA4AF",
      plaqueText: "#FFF1F2",
      candleColors: ["#FFF1F2", "#FB7185", "#FFF1F2"],
      ribbonStripe: "rgba(255, 241, 242, 0.5)",
    };
  }

  // 3. Cyber Neon / Electric Cyan & Magenta
  if (norm.includes("neon") || norm.includes("cyber") || acc === "#00f0ff") {
    return {
      tier1Base: "linear-gradient(135deg, #020617 0%, #0B1E3B 35%, #082F49 70%, #030712 100%)",
      tier2Base: "linear-gradient(135deg, #0E7490 0%, #06B6D4 40%, #22D3EE 80%, #083344 100%)",
      topSurface1: "radial-gradient(ellipse at 45% 45%, #082F49 0%, #0B1E3B 70%, #020617 100%)",
      topSurface2: "radial-gradient(ellipse at 45% 45%, #67E8F9 0%, #06B6D4 65%, #0E7490 100%)",
      glaze: "linear-gradient(180deg, #E0F7FA 0%, #00F0FF 60%, #0891B2 100%)",
      frostingTrim: "#F43F5E",
      pipingBeads: "#00F0FF",
      standGradient: "linear-gradient(180deg, #E0F7FA 0%, #00F0FF 30%, #0284C7 60%, #0F172A 100%)",
      standPlate: "#083344",
      accentGlow: "rgba(0, 240, 255, 0.65)",
      plaqueBg: "linear-gradient(135deg, #020617 0%, #082F49 100%)",
      plaqueBorder: "#00F0FF",
      plaqueText: "#E0F7FA",
      candleColors: ["#00F0FF", "#F43F5E", "#00F0FF"],
      ribbonStripe: "rgba(0, 240, 255, 0.55)",
    };
  }

  // 4. Confetti Fiesta / Amber Gold & Orange
  if (norm.includes("fun") || norm.includes("fiesta") || acc === "#f59e0b") {
    return {
      tier1Base: "linear-gradient(135deg, #451A03 0%, #78350F 35%, #92400E 70%, #291002 100%)",
      tier2Base: "linear-gradient(135deg, #B45309 0%, #D97706 40%, #F59E0B 80%, #78350F 100%)",
      topSurface1: "radial-gradient(ellipse at 45% 45%, #92400E 0%, #78350F 70%, #451A03 100%)",
      topSurface2: "radial-gradient(ellipse at 45% 45%, #FDE68A 0%, #F59E0B 65%, #D97706 100%)",
      glaze: "linear-gradient(180deg, #FEF3C7 0%, #F59E0B 60%, #D97706 100%)",
      frostingTrim: "#FEF3C7",
      pipingBeads: "#FDE68A",
      standGradient: "linear-gradient(180deg, #FEF3C7 0%, #FDE68A 30%, #F59E0B 60%, #B45309 85%, #78350F 100%)",
      standPlate: "#78350F",
      accentGlow: "rgba(245, 158, 11, 0.55)",
      plaqueBg: "linear-gradient(135deg, #451A03 0%, #78350F 100%)",
      plaqueBorder: "#FDE68A",
      plaqueText: "#FFFBEB",
      candleColors: ["#FEF3C7", "#F59E0B", "#FEF3C7"],
      ribbonStripe: "rgba(254, 243, 199, 0.5)",
    };
  }

  // 5. Midnight Disco / Violet & Electric Purple
  if (norm.includes("party") || norm.includes("disco") || acc === "#a855f7") {
    return {
      tier1Base: "linear-gradient(135deg, #2E1065 0%, #3B0764 35%, #581C87 70%, #1E0741 100%)",
      tier2Base: "linear-gradient(135deg, #6B21A8 0%, #9333EA 40%, #A855F7 80%, #581C87 100%)",
      topSurface1: "radial-gradient(ellipse at 45% 45%, #581C87 0%, #3B0764 70%, #1E0741 100%)",
      topSurface2: "radial-gradient(ellipse at 45% 45%, #E9D5FF 0%, #A855F7 65%, #7E22CE 100%)",
      glaze: "linear-gradient(180deg, #F3E8FF 0%, #A855F7 60%, #7E22CE 100%)",
      frostingTrim: "#38BDF8",
      pipingBeads: "#E9D5FF",
      standGradient: "linear-gradient(180deg, #F3E8FF 0%, #C084FC 30%, #9333EA 60%, #581C87 85%, #2E1065 100%)",
      standPlate: "#3B0764",
      accentGlow: "rgba(168, 85, 247, 0.55)",
      plaqueBg: "linear-gradient(135deg, #1E0741 0%, #3B0764 100%)",
      plaqueBorder: "#C084FC",
      plaqueText: "#F3E8FF",
      candleColors: ["#C084FC", "#38BDF8", "#C084FC"],
      ribbonStripe: "rgba(233, 213, 255, 0.5)",
    };
  }

  // 6. Cute / Pastel Sweetness
  if (norm.includes("cute") || norm.includes("pastel") || acc === "#c084fc") {
    return {
      tier1Base: "linear-gradient(135deg, #3B1238 0%, #581C53 35%, #70246B 70%, #2A0927 100%)",
      tier2Base: "linear-gradient(135deg, #862B81 0%, #B246AD 40%, #C084FC 80%, #70246B 100%)",
      topSurface1: "radial-gradient(ellipse at 45% 45%, #70246B 0%, #581C53 70%, #2A0927 100%)",
      topSurface2: "radial-gradient(ellipse at 45% 45%, #FCE7F3 0%, #F472B6 65%, #B246AD 100%)",
      glaze: "linear-gradient(180deg, #FDF2F8 0%, #F472B6 60%, #C084FC 100%)",
      frostingTrim: "#FDF2F8",
      pipingBeads: "#FBCFE8",
      standGradient: "linear-gradient(180deg, #FDF2F8 0%, #FBCFE8 35%, #F472B6 65%, #9D174D 100%)",
      standPlate: "#831843",
      accentGlow: "rgba(192, 132, 252, 0.55)",
      plaqueBg: "linear-gradient(135deg, #3B1238 0%, #581C53 100%)",
      plaqueBorder: "#FBCFE8",
      plaqueText: "#FDF2F8",
      candleColors: ["#FBCFE8", "#C084FC", "#FBCFE8"],
      ribbonStripe: "rgba(253, 242, 248, 0.5)",
    };
  }

  // 7. Minimal / Modern Minimalist
  if (norm.includes("minimal") || acc === "#94a3b8") {
    return {
      tier1Base: "linear-gradient(135deg, #1E293B 0%, #334155 35%, #475569 70%, #0F172A 100%)",
      tier2Base: "linear-gradient(135deg, #475569 0%, #64748B 40%, #94A3B8 80%, #334155 100%)",
      topSurface1: "radial-gradient(ellipse at 45% 45%, #475569 0%, #334155 70%, #1E293B 100%)",
      topSurface2: "radial-gradient(ellipse at 45% 45%, #F1F5F9 0%, #CBD5E1 65%, #64748B 100%)",
      glaze: "linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 60%, #94A3B8 100%)",
      frostingTrim: "#F8FAFC",
      pipingBeads: "#E2E8F0",
      standGradient: "linear-gradient(180deg, #F8FAFC 0%, #CBD5E1 35%, #64748B 70%, #334155 100%)",
      standPlate: "#334155",
      accentGlow: "rgba(148, 163, 184, 0.45)",
      plaqueBg: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
      plaqueBorder: "#CBD5E1",
      plaqueText: "#F8FAFC",
      candleColors: ["#FFFFFF", "#94A3B8", "#FFFFFF"],
      ribbonStripe: "rgba(255, 255, 255, 0.45)",
    };
  }

  // 8. Default: Golden Elegance / Royal Lavender & Champagne
  return {
    tier1Base: "linear-gradient(135deg, #1E1528 0%, #2E1B4E 35%, #3B2064 70%, #150E1D 100%)",
    tier2Base: "linear-gradient(135deg, #5B3A9B 0%, #7659E4 40%, #8E72F0 80%, #3B2064 100%)",
    topSurface1: "radial-gradient(ellipse at 45% 45%, #3B2064 0%, #2E1B4E 70%, #150E1D 100%)",
    topSurface2: "radial-gradient(ellipse at 45% 45%, #DDD6FE 0%, #8E72F0 65%, #5B3A9B 100%)",
    glaze: "linear-gradient(180deg, #EDE9FE 0%, #8E72F0 60%, #5B3A9B 100%)",
    frostingTrim: "#FDE68A", // Champagne gold
    pipingBeads: "#E0A842",
    standGradient: "linear-gradient(180deg, #FDE68A 0%, #F59E0B 30%, #D97706 60%, #B45309 85%, #78350F 100%)",
    standPlate: "#78350F",
    accentGlow: "rgba(142, 114, 240, 0.55)",
    plaqueBg: "linear-gradient(135deg, #1A1325 0%, #2A1D3C 100%)",
    plaqueBorder: "#E0A842",
    plaqueText: "#FDE68A",
    candleColors: ["#FDE68A", "#8E72F0", "#FDE68A"],
    ribbonStripe: "rgba(253, 230, 138, 0.45)",
  };
}

export const RealisticCake: React.FC<RealisticCakeProps> = ({
  name,
  accentColor,
  templateId,
  candlesBlown,
  onBlowCandles,
}) => {
  const palette = useMemo(
    () => getCakePalette(accentColor, templateId),
    [accentColor, templateId]
  );

  return (
    <div
      onClick={onBlowCandles}
      className="relative mx-auto flex flex-col items-center justify-end cursor-pointer group select-none py-2"
      style={{ width: 330, height: 290 }}
      title={candlesBlown ? "Wish made! Celebrating..." : "Tap the candles to blow them out!"}
    >
      {/* ── AMBIENT CANDLELIGHT WARMTH (Pulsing warm glow cast onto cake) ── */}
      <AnimatePresence>
        {!candlesBlown && (
          <m.div
            initial={{ opacity: 0.6, scale: 0.95 }}
            animate={{
              opacity: [0.65, 0.9, 0.7, 0.95, 0.65],
              scale: [0.97, 1.04, 0.98, 1.03, 0.97],
            }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-56 h-48 rounded-full pointer-events-none z-10 filter blur-2xl"
            style={{
              background: `radial-gradient(ellipse at center, rgba(251, 191, 36, 0.55) 0%, rgba(245, 158, 11, 0.28) 45%, ${palette.accentGlow} 70%, transparent 95%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── 3 ARTISANAL REALISTIC CANDLES ── */}
      <div className="flex items-end justify-center gap-7 mb-0 z-30 relative">
        {[0, 1, 2].map((idx) => {
          const isCenter = idx === 1;
          const height = isCenter ? 46 : 38;
          const candleColor = palette.candleColors[idx] || "#FDE68A";

          return (
            <div key={idx} className="relative flex flex-col items-center">
              {/* ── FLAME & SMOKE EMITTER ── */}
              <div className="h-9 flex items-end justify-center relative w-10">
                <AnimatePresence mode="wait">
                  {!candlesBlown ? (
                    /* ── REALISTIC DANCING FLAME ── */
                    <m.div
                      key="flame"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{
                        scale: [1, 1.08, 0.95, 1.06, 1],
                        rotate: [0, isCenter ? -2.5 : 3, 0, isCenter ? 2.5 : -2, 0],
                        y: [0, -1.8, 0.6, -1.2, 0],
                      }}
                      exit={{
                        scale: [1, 1.4, 0],
                        opacity: 0,
                        y: -8,
                        filter: "blur(4px)",
                        transition: { duration: 0.2 },
                      }}
                      transition={{
                        duration: 1.3 + idx * 0.22,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative flex flex-col items-center"
                    >
                      {/* Outer Golden Aura */}
                      <div className="absolute -inset-2 rounded-full bg-amber-400/35 filter blur-xs pointer-events-none animate-pulse" />

                      {/* Main Teardrop Flame Body */}
                      <div
                        className="w-3.5 h-6 rounded-full relative overflow-hidden"
                        style={{
                          background:
                            "radial-gradient(ellipse at 50% 85%, #3B82F6 0%, #F59E0B 35%, #FDE047 65%, #FFFBEB 92%)",
                          borderRadius: "50% 50% 35% 35% / 60% 60% 40% 40%",
                          boxShadow:
                            "0 0 12px #FBBF24, 0 0 24px rgba(245, 158, 11, 0.65)",
                          filter: "drop-shadow(0 0 4px #F59E0B)",
                        }}
                      >
                        {/* Bright White Core Hotspot */}
                        <div
                          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-3.5 bg-white rounded-full filter blur-[0.5px]"
                          style={{
                            borderRadius: "50% 50% 40% 40% / 65% 65% 35% 35%",
                          }}
                        />
                      </div>
                    </m.div>
                  ) : (
                    /* ── REALISTIC BILLOWING SMOKE ON BLOW OUT ── */
                    <m.div
                      key="smoke-cluster"
                      className="absolute bottom-0 pointer-events-none flex flex-col items-center"
                    >
                      {/* Burning Red-Hot Ember Tip (cooling down to charcoal) */}
                      <m.div
                        initial={{ opacity: 1, scale: 1.4, backgroundColor: "#EF4444" }}
                        animate={{
                          opacity: [1, 0.85, 0.4, 0.1],
                          scale: [1.4, 1.2, 0.9, 0.7],
                          backgroundColor: ["#EF4444", "#DC2626", "#78350F", "#1F2937"],
                        }}
                        transition={{ duration: 2.8, ease: "easeOut" }}
                        className="w-1.5 h-1.5 rounded-full shadow-[0_0_10px_#EF4444] z-20"
                      />

                      {/* Initial Blowout Puff */}
                      <m.div
                        initial={{ opacity: 0.9, scale: 0.5, y: 0 }}
                        animate={{
                          opacity: [0.9, 0.6, 0],
                          scale: [0.5, 2.2, 3.0],
                          y: [0, -18, -35],
                        }}
                        transition={{ duration: 1.4, ease: "easeOut" }}
                        className="absolute w-4 h-4 rounded-full bg-radial from-gray-200/80 via-gray-300/40 to-transparent filter blur-[2px]"
                      />

                      {/* Billowing Smoke Wisp 1 (Drifting left and curling) */}
                      <m.div
                        initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
                        animate={{
                          opacity: [0, 0.8, 0.6, 0.25, 0],
                          y: [0, -32, -68, -105, -145],
                          x: [0, idx % 2 === 0 ? -12 : 10, idx % 2 === 0 ? -24 : 20, idx % 2 === 0 ? -38 : 32],
                          scale: [0.5, 1.4, 2.4, 3.4, 4.2],
                          rotate: [0, idx % 2 === 0 ? -30 : 25, idx % 2 === 0 ? -65 : 55],
                        }}
                        transition={{
                          duration: 3.0,
                          ease: [0.16, 1, 0.3, 1],
                          delay: idx * 0.08,
                        }}
                        className="absolute w-5 h-5 rounded-full bg-radial from-white/70 via-gray-200/40 to-transparent filter blur-[2.5px]"
                      />

                      {/* Billowing Smoke Wisp 2 (Secondary swirling plume) */}
                      <m.div
                        initial={{ opacity: 0, y: 0, x: 0, scale: 0.4 }}
                        animate={{
                          opacity: [0, 0.7, 0.5, 0.15, 0],
                          y: [0, -25, -55, -90, -125],
                          x: [0, idx % 2 === 0 ? 8 : -10, idx % 2 === 0 ? 18 : -22, idx % 2 === 0 ? 28 : -34],
                          scale: [0.4, 1.2, 2.0, 3.0, 3.8],
                          rotate: [0, idx % 2 === 0 ? 25 : -25, idx % 2 === 0 ? 50 : -50],
                        }}
                        transition={{
                          duration: 2.8,
                          ease: [0.16, 1, 0.3, 1],
                          delay: 0.15 + idx * 0.09,
                        }}
                        className="absolute w-4 h-4 rounded-full bg-radial from-gray-100/60 via-gray-300/30 to-transparent filter blur-[2px]"
                      />

                      {/* Billowing Smoke Wisp 3 (Delicate high whispy trail) */}
                      <m.div
                        initial={{ opacity: 0, y: 0, scale: 0.3 }}
                        animate={{
                          opacity: [0, 0.5, 0.35, 0.1, 0],
                          y: [0, -40, -85, -130],
                          x: [0, idx % 2 === 0 ? -4 : 5, idx % 2 === 0 ? 6 : -8],
                          scale: [0.3, 1.3, 2.2, 3.0],
                        }}
                        transition={{
                          duration: 3.2,
                          ease: "easeOut",
                          delay: 0.3 + idx * 0.1,
                        }}
                        className="absolute w-3.5 h-3.5 rounded-full bg-radial from-white/50 via-gray-200/20 to-transparent filter blur-[2.5px]"
                      />
                    </m.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Candle Wick (Black cotton wick) */}
              <div className="w-0.5 h-2 bg-neutral-900 rounded-t-xs -mb-0.5 z-20 shadow-xs" />

              {/* Candle Body (3D cylindrical wax with spiral ribbon & shine) */}
              <div
                className="w-3.5 rounded-t-sm rounded-b-xs relative overflow-hidden shadow-md"
                style={{
                  height: height,
                  background: `linear-gradient(90deg, rgba(255,255,255,0.45) 0%, ${candleColor} 30%, #FFFFFF 55%, ${candleColor} 80%, rgba(0,0,0,0.25) 100%)`,
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.8), 0 3px 6px rgba(0,0,0,0.35)",
                }}
              >
                {/* Spiral decorative ribbons on wax */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-70"
                  style={{
                    background: `repeating-linear-gradient(45deg, transparent, transparent 4px, ${palette.ribbonStripe} 4px, ${palette.ribbonStripe} 7px)`,
                  }}
                />
                {/* Wax highlight shine */}
                <div className="absolute top-0 left-0.5 w-0.5 h-full bg-white/80 rounded-full" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── TOP CAKE TIER (Upper Cylindrical Layer in 3D Perspective) ── */}
      <div className="relative w-48 h-18 z-20 flex flex-col items-center -mt-0.5">
        {/* Top Tier Fondant Crown / Elliptical Surface */}
        <div
          className="absolute -top-3.5 w-48 h-7 rounded-[50%] border border-white/35 z-20"
          style={{
            background: palette.topSurface2,
            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.25)",
          }}
        >
          {/* Edible Gold Leaf & Pearl Sprinkles on top rim */}
          <div className="absolute inset-x-4 top-1.5 flex justify-around opacity-90 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_4px_#FDE68A]" />
            <span className="w-1 h-1 rounded-full bg-white shadow-xs" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_4px_#F59E0B]" />
            <span className="w-1 h-1 rounded-full bg-white shadow-xs" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_4px_#FDE68A]" />
            <span className="w-1 h-1 rounded-full bg-white shadow-xs" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-xs" />
          </div>
        </div>

        {/* Top Tier Cylinder Body (Curved bottom edge for 3D depth) */}
        <div
          className="w-full h-full relative overflow-hidden shadow-lg border-x border-white/20 flex flex-col justify-end"
          style={{
            borderRadius: "0 0 50% 50% / 0 0 14px 14px",
            background: palette.tier2Base,
            boxShadow:
              "inset 5px 0 10px rgba(255,255,255,0.3), inset -7px 0 12px rgba(0,0,0,0.4), 0 8px 18px rgba(0,0,0,0.45)",
          }}
        >
          {/* Luscious Fondant Glaze Drips flowing over top edge */}
          <div className="absolute top-0 inset-x-0 h-8 pointer-events-none z-10 flex items-start justify-between px-1">
            {[16, 22, 13, 26, 15, 24, 18, 14, 20].map((dripHeight, i) => (
              <div
                key={i}
                className="w-4 rounded-b-full shadow-xs"
                style={{
                  height: dripHeight,
                  background: palette.glaze,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.7)",
                }}
              />
            ))}
          </div>

          {/* Recipient Monogram Crest on Top Tier */}
          <div 
            className="z-10 mb-2 px-3.5 py-0.5 rounded-full border shadow-md flex items-center gap-1 backdrop-blur-xs mx-auto"
            style={{ 
              background: palette.plaqueBg, 
              borderColor: palette.plaqueBorder,
              boxShadow: `0 2px 10px ${palette.accentGlow}`,
            }}
          >
            <span className="text-[10px] font-serif font-bold tracking-wider" style={{ color: palette.plaqueText }}>
              ★ {name} ★
            </span>
          </div>

          {/* Pearl Piping along base curve of Top Tier */}
          <div
            className="w-full h-2 flex items-center justify-around px-1 z-20"
            style={{
              background: "rgba(0,0,0,0.2)",
              borderTop: `1px solid ${palette.pipingBeads}70`,
            }}
          >
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full shadow-xs"
                style={{
                  background: `radial-gradient(circle at 35% 35%, #FFFFFF 0%, ${palette.pipingBeads} 70%, #92400E 100%)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── BASE CAKE TIER (Lower Cylindrical Layer in 3D Perspective) ── */}
      <div className="relative w-68 h-22 -mt-1.5 z-10 flex flex-col items-center">
        {/* Base Tier Fondant Crown / Elliptical Surface */}
        <div
          className="absolute -top-3.5 w-68 h-8 rounded-[50%] border border-white/25 z-10"
          style={{
            background: palette.topSurface1,
            boxShadow: "inset 0 3px 5px rgba(255,255,255,0.35), inset 0 -3px 5px rgba(0,0,0,0.45), 0 3px 8px rgba(0,0,0,0.3)",
          }}
        />

        {/* Base Tier Cylinder Body (Curved bottom edge for 3D depth) */}
        <div
          className="w-full h-full relative overflow-hidden shadow-2xl border-x border-white/15 flex flex-col justify-end"
          style={{
            borderRadius: "0 0 50% 50% / 0 0 18px 18px",
            background: palette.tier1Base,
            boxShadow:
              "inset 7px 0 14px rgba(255,255,255,0.22), inset -9px 0 16px rgba(0,0,0,0.5), 0 14px 30px rgba(0,0,0,0.6)",
          }}
        >
          {/* Subtle Vertical Fondant Velvet Ribbing */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.18)_0%,transparent_18%,transparent_82%,rgba(0,0,0,0.35)_100%)] pointer-events-none" />

          {/* Decorative Celebration Frosting Swags */}
          <div className="absolute top-2.5 inset-x-6 flex justify-around opacity-80 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-4 border-b-2 rounded-b-full"
                style={{ borderColor: palette.frostingTrim }}
              />
            ))}
          </div>

          {/* Elegant Center Golden Inscription Plaque */}
          <div
            className="z-10 mb-2.5 px-6 py-1 rounded-full border shadow-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-105"
            style={{
              background: palette.plaqueBg,
              borderColor: palette.plaqueBorder,
              boxShadow: `0 4px 18px ${palette.accentGlow}`,
            }}
          >
            <span
              className="text-xs font-serif font-bold tracking-widest uppercase drop-shadow-xs"
              style={{ color: palette.plaqueText }}
            >
              Happy Birthday
            </span>
          </div>

          {/* Luxury Royal Pearl Bead Border along Base */}
          <div
            className="w-full h-2.5 flex items-center justify-around px-1.5 z-20"
            style={{
              background: "rgba(0,0,0,0.3)",
              borderTop: `1.5px solid ${palette.pipingBeads}85`,
            }}
          >
            {[...Array(22)].map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full shadow-xs"
                style={{
                  background: `radial-gradient(circle at 35% 35%, #FFFFFF 0%, ${palette.pipingBeads} 65%, #78350F 100%)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── LUXURY METALLIC CAKE PEDESTAL PLATTER ── */}
      <div className="relative w-84 flex flex-col items-center -mt-1 z-0">
        {/* Platter Rim Surface */}
        <div
          className="w-84 h-5 rounded-[50%] shadow-2xl border-t border-white/60 relative"
          style={{
            background: palette.standGradient,
            boxShadow:
              "0 18px 40px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.75), inset 0 -2px 4px rgba(0,0,0,0.45)",
          }}
        >
          {/* Specular Platter Sheen */}
          <div className="absolute top-1 left-1/4 right-1/4 h-1 bg-white/60 rounded-full filter blur-[1px]" />
        </div>

        {/* Platter Pedestal Foot */}
        <div
          className="w-52 h-3.5 -mt-1 rounded-b-xl shadow-lg border-t border-black/30"
          style={{
            background: palette.standGradient,
            boxShadow: "0 8px 18px rgba(0,0,0,0.75)",
          }}
        />

        {/* Cast Drop Shadow on Surface */}
        <div className="w-88 h-4 -mt-1 rounded-full bg-black/65 filter blur-md pointer-events-none" />
      </div>

      {/* ── INTERACTIVE TAP HINT OVERLAY ── */}
      {!candlesBlown && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-[10px] font-semibold text-white/90 shadow-lg animate-bounce pointer-events-none">
          ✨ Tap to blow out candles ✨
        </div>
      )}
    </div>
  );
};
