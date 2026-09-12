import React, { useMemo } from "react";

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
      tier1Base: "linear-gradient(90deg, #022C22 0%, #065F46 25%, #047857 55%, #064E3B 80%, #022C22 100%)",
      tier2Base: "linear-gradient(90deg, #064E3B 0%, #10B981 30%, #34D399 55%, #059669 80%, #047857 100%)",
      topSurface1: "radial-gradient(ellipse at 50% 50%, #059669 0%, #047857 60%, #022C22 100%)",
      topSurface2: "radial-gradient(ellipse at 50% 50%, #34D399 0%, #10B981 60%, #064E3B 100%)",
      glaze: "linear-gradient(180deg, #A7F3D0 0%, #34D399 50%, #059669 100%)",
      frostingTrim: "#F59E0B",
      pipingBeads: "#FDE68A",
      standGradient: "linear-gradient(90deg, #78350F 0%, #D97706 25%, #FDE68A 50%, #F59E0B 75%, #78350F 100%)",
      accentGlow: "rgba(16, 185, 129, 0.45)",
      plaqueBg: "linear-gradient(135deg, #022C22 0%, #064E3B 100%)",
      plaqueBorder: "#F59E0B",
      plaqueText: "#FDE68A",
      candleColors: ["#FDE68A", "#10B981", "#FDE68A"],
      candleRibbon: "rgba(253, 230, 138, 0.5)",
    };
  }

  // 2. Romantic / Sweet Romance / Rose Gold
  if (norm.includes("romantic") || norm.includes("rose") || acc === "#f43f5e" || acc === "#e11d48") {
    return {
      tier1Base: "linear-gradient(90deg, #30030E 0%, #881337 25%, #BE123C 55%, #9F1239 80%, #30030E 100%)",
      tier2Base: "linear-gradient(90deg, #881337 0%, #FB7185 30%, #FDA4AF 55%, #E11D48 80%, #9F1239 100%)",
      topSurface1: "radial-gradient(ellipse at 50% 50%, #BE123C 0%, #881337 60%, #30030E 100%)",
      topSurface2: "radial-gradient(ellipse at 50% 50%, #FDA4AF 0%, #FB7185 60%, #881337 100%)",
      glaze: "linear-gradient(180deg, #FFF1F2 0%, #FB7185 50%, #BE123C 100%)",
      frostingTrim: "#FFF1F2",
      pipingBeads: "#FECDD3",
      standGradient: "linear-gradient(90deg, #4C0519 0%, #FB7185 25%, #FFF1F2 50%, #FDA4AF 75%, #4C0519 100%)",
      accentGlow: "rgba(244, 63, 94, 0.45)",
      plaqueBg: "linear-gradient(135deg, #4C0519 0%, #881337 100%)",
      plaqueBorder: "#FDA4AF",
      plaqueText: "#FFF1F2",
      candleColors: ["#FFF1F2", "#FB7185", "#FFF1F2"],
      candleRibbon: "rgba(255, 241, 242, 0.5)",
    };
  }

  // 3. Cyber Neon / Electric Cyan & Magenta
  if (norm.includes("neon") || norm.includes("cyber") || acc === "#00f0ff") {
    return {
      tier1Base: "linear-gradient(90deg, #020617 0%, #082F49 25%, #0E7490 55%, #0B1E3B 80%, #020617 100%)",
      tier2Base: "linear-gradient(90deg, #083344 0%, #06B6D4 30%, #67E8F9 55%, #0891B2 80%, #0E7490 100%)",
      topSurface1: "radial-gradient(ellipse at 50% 50%, #0E7490 0%, #082F49 60%, #020617 100%)",
      topSurface2: "radial-gradient(ellipse at 50% 50%, #67E8F9 0%, #06B6D4 60%, #083344 100%)",
      glaze: "linear-gradient(180deg, #E0F7FA 0%, #00F0FF 50%, #0891B2 100%)",
      frostingTrim: "#F43F5E",
      pipingBeads: "#00F0FF",
      standGradient: "linear-gradient(90deg, #0F172A 0%, #0284C7 25%, #E0F7FA 50%, #00F0FF 75%, #0F172A 100%)",
      accentGlow: "rgba(0, 240, 255, 0.55)",
      plaqueBg: "linear-gradient(135deg, #020617 0%, #082F49 100%)",
      plaqueBorder: "#00F0FF",
      plaqueText: "#E0F7FA",
      candleColors: ["#00F0FF", "#F43F5E", "#00F0FF"],
      candleRibbon: "rgba(0, 240, 255, 0.55)",
    };
  }

  // 4. Confetti Fiesta / Amber Gold & Orange
  if (norm.includes("fun") || norm.includes("fiesta") || acc === "#f59e0b") {
    return {
      tier1Base: "linear-gradient(90deg, #291002 0%, #78350F 25%, #B45309 55%, #92400E 80%, #291002 100%)",
      tier2Base: "linear-gradient(90deg, #78350F 0%, #F59E0B 30%, #FDE68A 55%, #D97706 80%, #B45309 100%)",
      topSurface1: "radial-gradient(ellipse at 50% 50%, #B45309 0%, #78350F 60%, #291002 100%)",
      topSurface2: "radial-gradient(ellipse at 50% 50%, #FDE68A 0%, #F59E0B 60%, #78350F 100%)",
      glaze: "linear-gradient(180deg, #FEF3C7 0%, #F59E0B 50%, #D97706 100%)",
      frostingTrim: "#FEF3C7",
      pipingBeads: "#FDE68A",
      standGradient: "linear-gradient(90deg, #451A03 0%, #D97706 25%, #FEF3C7 50%, #F59E0B 75%, #451A03 100%)",
      accentGlow: "rgba(245, 158, 11, 0.45)",
      plaqueBg: "linear-gradient(135deg, #451A03 0%, #78350F 100%)",
      plaqueBorder: "#FDE68A",
      plaqueText: "#FFFBEB",
      candleColors: ["#FEF3C7", "#F59E0B", "#FEF3C7"],
      candleRibbon: "rgba(254, 243, 199, 0.5)",
    };
  }

  // 5. Default: Golden Elegance / Royal Lavender & Champagne
  return {
    tier1Base: "linear-gradient(90deg, #150E1D 0%, #2E1B4E 25%, #5B3A9B 55%, #3B2064 80%, #150E1D 100%)",
    tier2Base: "linear-gradient(90deg, #3B2064 0%, #8E72F0 30%, #DDD6FE 55%, #7659E4 80%, #5B3A9B 100%)",
    topSurface1: "radial-gradient(ellipse at 50% 50%, #5B3A9B 0%, #3B2064 60%, #150E1D 100%)",
    topSurface2: "radial-gradient(ellipse at 50% 50%, #DDD6FE 0%, #8E72F0 60%, #3B2064 100%)",
    glaze: "linear-gradient(180deg, #EDE9FE 0%, #8E72F0 50%, #5B3A9B 100%)",
    frostingTrim: "#FDE68A",
    pipingBeads: "#E0A842",
    standGradient: "linear-gradient(90deg, #78350F 0%, #D97706 25%, #FDE68A 50%, #F59E0B 75%, #78350F 100%)",
    accentGlow: "rgba(142, 114, 240, 0.45)",
    plaqueBg: "linear-gradient(135deg, #1A1325 0%, #2A1D3C 100%)",
    plaqueBorder: "#E0A842",
    plaqueText: "#FDE68A",
    candleColors: ["#FDE68A", "#8E72F0", "#FDE68A"],
    candleRibbon: "rgba(253, 230, 138, 0.45)",
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
      className="relative mx-auto flex flex-col items-center justify-end cursor-pointer group select-none py-1"
      style={{ width: 330, height: 280 }}
      title={candlesBlown ? "Wish granted!" : "Tap the candles to blow them out!"}
    >
      {/* ── CSS KEYFRAMES FOR ROCK-SOLID 60FPS CANDLE FLAMES & BILLOWING SMOKE ── */}
      <style>{`
        @keyframes bvFlameDanceCenter {
          0%, 100% { transform: scale(1) rotate(-1deg) translateY(0); filter: drop-shadow(0 0 6px #F59E0B); }
          25% { transform: scale(1.08, 0.94) rotate(2deg) translateY(-1px); filter: drop-shadow(0 0 10px #FBBF24); }
          50% { transform: scale(0.96, 1.05) rotate(-2deg) translateY(1px); filter: drop-shadow(0 0 7px #F59E0B); }
          75% { transform: scale(1.04, 0.98) rotate(1.5deg) translateY(-0.5px); filter: drop-shadow(0 0 9px #FDE047); }
        }
        @keyframes bvFlameDanceLeft {
          0%, 100% { transform: scale(1) rotate(-3deg) translateY(0); filter: drop-shadow(0 0 6px #F59E0B); }
          30% { transform: scale(1.06, 0.95) rotate(1deg) translateY(-1px); filter: drop-shadow(0 0 9px #FBBF24); }
          65% { transform: scale(0.95, 1.04) rotate(-4deg) translateY(0.5px); filter: drop-shadow(0 0 8px #F59E0B); }
        }
        @keyframes bvFlameDanceRight {
          0%, 100% { transform: scale(1) rotate(2deg) translateY(0); filter: drop-shadow(0 0 6px #F59E0B); }
          35% { transform: scale(0.94, 1.06) rotate(-2deg) translateY(0.5px); filter: drop-shadow(0 0 8px #F59E0B); }
          70% { transform: scale(1.07, 0.96) rotate(3deg) translateY(-1px); filter: drop-shadow(0 0 10px #FBBF24); }
        }
        @keyframes bvSmokePuff {
          0% { opacity: 0; transform: translateY(0) scale(0.4); }
          20% { opacity: 0.85; transform: translateY(-15px) scale(1.1); }
          60% { opacity: 0.45; transform: translateY(-45px) scale(2.0) rotate(15deg); }
          100% { opacity: 0; transform: translateY(-80px) scale(2.8) rotate(30deg); }
        }
        @keyframes bvSmokePuffOpposite {
          0% { opacity: 0; transform: translateY(0) scale(0.3); }
          25% { opacity: 0.75; transform: translateY(-18px) scale(1.0) rotate(-10deg); }
          65% { opacity: 0.35; transform: translateY(-50px) scale(1.8) rotate(-25deg); }
          100% { opacity: 0; transform: translateY(-85px) scale(2.6) rotate(-40deg); }
        }
        @keyframes bvEmberCool {
          0% { background-color: #EF4444; box-shadow: 0 0 10px #EF4444; }
          40% { background-color: #DC2626; box-shadow: 0 0 6px #DC2626; }
          80% { background-color: #7F1D1D; box-shadow: 0 0 3px #7F1D1D; }
          100% { background-color: #1F2937; box-shadow: none; }
        }
      `}</style>

      {/* ── AMBIENT CANDLELIGHT WARMTH HALO ── */}
      {!candlesBlown && (
        <div
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-32 rounded-full pointer-events-none z-10"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, rgba(251, 191, 36, 0.4) 0%, ${palette.accentGlow} 45%, transparent 75%)`,
          }}
        />
      )}

      {/* ── 3 ARTISANAL CANDLES WITH VISIBLE REALISTIC FLAMES ── */}
      <div className="flex items-end justify-center gap-7 z-30 relative -mb-2">
        {[0, 1, 2].map((idx) => {
          const isCenter = idx === 1;
          const candleHeight = isCenter ? 44 : 36;
          const candleColor = palette.candleColors[idx] || "#FDE68A";
          const animationName = isCenter
            ? "bvFlameDanceCenter 1.2s infinite ease-in-out"
            : idx === 0
            ? "bvFlameDanceLeft 1.4s infinite ease-in-out"
            : "bvFlameDanceRight 1.3s infinite ease-in-out";

          return (
            <div key={idx} className="flex flex-col items-center relative">
              
              {/* ── FLAME CONTAINER ── */}
              <div className="h-8 w-8 flex items-end justify-center relative">
                {/* 1. FLAME ACTIVE (Visible, bright, dancing from frame 0) */}
                {!candlesBlown ? (
                  <div
                    className="flex flex-col items-center origin-bottom"
                    style={{
                      animation: animationName,
                      pointerEvents: "none",
                    }}
                  >
                    {/* Outer Golden Aura */}
                    <div className="absolute -inset-1 rounded-full bg-amber-400/40 blur-[2px] pointer-events-none" />

                    {/* Teardrop Flame Body with Realistic Gradients */}
                    <div
                      className="w-3.5 h-6 rounded-full relative overflow-hidden"
                      style={{
                        background: "radial-gradient(ellipse at 50% 88%, #2563EB 0%, #EA580C 28%, #F59E0B 55%, #FEF08A 85%, #FFFFFF 100%)",
                        borderRadius: "50% 50% 35% 35% / 60% 60% 40% 40%",
                        boxShadow: "0 0 10px #F59E0B, 0 0 20px rgba(245, 158, 11, 0.8)",
                      }}
                    >
                      {/* Hot White Inner Core */}
                      <div
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-white rounded-full"
                        style={{
                          borderRadius: "50% 50% 35% 35% / 60% 60% 40% 40%",
                          boxShadow: "0 0 4px #FFFFFF",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  /* 2. SMOKE & EMBER ON BLOWOUT (Active when candles blown) */
                  <div className="absolute bottom-0 flex flex-col items-center pointer-events-none">
                    {/* Red-Hot Cooling Ember on Wick Tip */}
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        animation: "bvEmberCool 3s forwards ease-out",
                      }}
                    />

                    {/* Billowing Smoke Plume 1 */}
                    <div
                      className="absolute bottom-1 w-4 h-4 rounded-full bg-gradient-to-t from-gray-200/80 via-gray-300/40 to-transparent blur-[1.5px]"
                      style={{
                        animation: "bvSmokePuff 2.6s forwards ease-out",
                        animationDelay: `${idx * 0.1}s`,
                      }}
                    />

                    {/* Billowing Smoke Plume 2 */}
                    <div
                      className="absolute bottom-1 w-3.5 h-3.5 rounded-full bg-gradient-to-t from-white/70 via-gray-200/30 to-transparent blur-[1.5px]"
                      style={{
                        animation: "bvSmokePuffOpposite 2.8s forwards ease-out",
                        animationDelay: `${0.15 + idx * 0.12}s`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Candle Wick */}
              <div className="w-0.5 h-2 bg-neutral-900 rounded-t-xs -mb-0.5 z-20" />

              {/* Cylindrical Wax Candle Body */}
              <div
                className="w-3 rounded-t-sm rounded-b-xs relative overflow-hidden shadow-md"
                style={{
                  height: candleHeight,
                  background: `linear-gradient(90deg, rgba(255,255,255,0.45) 0%, ${candleColor} 25%, #FFFFFF 50%, ${candleColor} 75%, rgba(0,0,0,0.25) 100%)`,
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.7), 0 2px 4px rgba(0,0,0,0.35)",
                }}
              >
                {/* Spiral decorative ribbons */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-60"
                  style={{
                    background: `repeating-linear-gradient(45deg, transparent, transparent 4px, ${palette.candleRibbon} 4px, ${palette.candleRibbon} 7px)`,
                  }}
                />
                {/* Specular wax shine line */}
                <div className="absolute top-0 left-0.5 w-0.5 h-full bg-white/70 rounded-full" />
              </div>

              {/* Realistic Candle Base Shadow on Cake Fondant */}
              <div className="w-4 h-1 rounded-full bg-black/40 blur-[1px] -mt-0.5 z-10" />
            </div>
          );
        })}
      </div>

      {/* ── TOP CAKE TIER (SOLID 3D PERSPECTIVE, NO GAPS) ── */}
      <div className="relative w-44 z-20 flex flex-col items-center">
        {/* Top Tier Fondant Crown Surface (Ellipse) */}
        <div
          className="w-44 h-7 rounded-[50%] border border-white/30 relative z-20"
          style={{
            background: palette.topSurface2,
            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          {/* Edible Gold Leaf / Pearl Sprinkles on top rim */}
          <div className="absolute inset-x-3 top-1.5 flex justify-around opacity-90 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_3px_#FDE68A]" />
            <span className="w-1 h-1 rounded-full bg-white" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_3px_#F59E0B]" />
            <span className="w-1 h-1 rounded-full bg-white" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-200" />
          </div>
        </div>

        {/* Top Tier Cylinder Body */}
        <div
          className="w-44 h-15 relative overflow-hidden -mt-3.5 z-10 flex flex-col justify-end"
          style={{
            background: palette.tier2Base,
            boxShadow: "inset 4px 0 8px rgba(255,255,255,0.25), inset -6px 0 10px rgba(0,0,0,0.35)",
            borderRadius: "0 0 50% 50% / 0 0 14px 14px",
          }}
        >
          {/* Luscious Fondant Glaze Drips flowing over rim */}
          <div className="absolute top-0 inset-x-0 h-7 pointer-events-none z-10 flex items-start justify-between px-1">
            {[14, 20, 11, 22, 13, 21, 16, 12, 18].map((dripHeight, i) => (
              <div
                key={i}
                className="w-3.5 rounded-b-full shadow-xs"
                style={{
                  height: dripHeight,
                  background: palette.glaze,
                  boxShadow: "0 2px 3px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.6)",
                }}
              />
            ))}
          </div>

          {/* Recipient Monogram Crest on Top Tier */}
          <div
            className="z-10 mb-2 px-3 py-0.5 rounded-full border shadow-md flex items-center gap-1 mx-auto"
            style={{
              background: palette.plaqueBg,
              borderColor: palette.plaqueBorder,
              boxShadow: `0 2px 8px ${palette.accentGlow}`,
            }}
          >
            <span className="text-[10px] font-serif font-bold tracking-wider" style={{ color: palette.plaqueText }}>
              ★ {name} ★
            </span>
          </div>
        </div>

        {/* ── SEAMLESS TIER CONNECTOR (Beaded Frosting pearls that join Tier 1 & Tier 2 solidly) ── */}
        <div className="w-46 h-3 flex items-center justify-around px-1 z-30 -mt-2 relative pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{
                background: `radial-gradient(circle at 35% 35%, #FFFFFF 0%, ${palette.pipingBeads} 65%, #78350F 100%)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── BASE CAKE TIER (SOLID 3D PERSPECTIVE, NO GAPS) ── */}
      <div className="relative w-64 z-10 flex flex-col items-center -mt-2">
        {/* Base Tier Fondant Crown Surface (Ellipse) */}
        <div
          className="w-64 h-8 rounded-[50%] border border-white/20 relative z-10"
          style={{
            background: palette.topSurface1,
            boxShadow: "inset 0 3px 5px rgba(255,255,255,0.35), inset 0 -3px 5px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          {/* Ambient contact shadow cast by top tier onto base tier */}
          <div className="w-46 h-6 rounded-[50%] bg-black/45 blur-[2px] mx-auto mt-1" />
        </div>

        {/* Base Tier Cylinder Body */}
        <div
          className="w-64 h-18 relative overflow-hidden -mt-4 z-0 flex flex-col justify-end"
          style={{
            background: palette.tier1Base,
            boxShadow: "inset 6px 0 12px rgba(255,255,255,0.2), inset -8px 0 14px rgba(0,0,0,0.45)",
            borderRadius: "0 0 50% 50% / 0 0 18px 18px",
          }}
        >
          {/* Subtle vertical fondant sheen */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.15)_0%,transparent_18%,transparent_82%,rgba(0,0,0,0.3)_100%)] pointer-events-none" />

          {/* Decorative Celebration Frosting Swags */}
          <div className="absolute top-2 inset-x-6 flex justify-around opacity-85 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-7 h-3.5 border-b-2 rounded-b-full"
                style={{ borderColor: palette.frostingTrim }}
              />
            ))}
          </div>

          {/* Elegant Center Golden Inscription Plaque */}
          <div
            className="z-10 mb-2 px-5 py-1 rounded-full border shadow-xl flex items-center justify-center mx-auto transition-transform group-hover:scale-105"
            style={{
              background: palette.plaqueBg,
              borderColor: palette.plaqueBorder,
              boxShadow: `0 4px 15px ${palette.accentGlow}`,
            }}
          >
            <span
              className="text-xs font-serif font-bold tracking-widest uppercase drop-shadow-xs"
              style={{ color: palette.plaqueText }}
            >
              Happy Birthday
            </span>
          </div>
        </div>

        {/* ── SEAMLESS BASE-TO-PLATTER CONNECTOR (Beaded Frosting pearls that join Tier 1 & Platter) ── */}
        <div className="w-66 h-3.5 flex items-center justify-around px-1 z-20 -mt-2 relative pointer-events-none">
          {[...Array(22)].map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{
                background: `radial-gradient(circle at 35% 35%, #FFFFFF 0%, ${palette.pipingBeads} 65%, #78350F 100%)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── LUXURY METALLIC CAKE PLATTER (SOLID & COHESIVE) ── */}
      <div className="relative w-80 flex flex-col items-center -mt-2 z-0">
        {/* Platter Bevel Surface */}
        <div
          className="w-80 h-6 rounded-[50%] border-t border-white/50 relative shadow-2xl"
          style={{
            background: palette.standGradient,
            boxShadow: "0 12px 30px rgba(0,0,0,0.65), inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -2px 4px rgba(0,0,0,0.4)",
          }}
        >
          {/* Specular sheen on rim */}
          <div className="absolute top-1 left-1/4 right-1/4 h-1 bg-white/50 rounded-full blur-[0.5px]" />
        </div>

        {/* Platter Pedestal Foot */}
        <div
          className="w-48 h-3 -mt-1 rounded-b-xl shadow-lg border-t border-black/30"
          style={{
            background: palette.standGradient,
            boxShadow: "0 6px 14px rgba(0,0,0,0.6)",
          }}
        />

        {/* Cast Ambient Drop Shadow */}
        <div className="w-84 h-3 -mt-0.5 rounded-full bg-black/60 blur-[3px] pointer-events-none" />
      </div>

      {/* ── INTERACTIVE TAP HINT OVERLAY ── */}
      {!candlesBlown && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1 rounded-full bg-black/75 border border-white/20 text-[10px] font-semibold text-white/95 shadow-lg animate-bounce pointer-events-none">
          ✨ Tap to blow out candles ✨
        </div>
      )}
    </div>
  );
};
