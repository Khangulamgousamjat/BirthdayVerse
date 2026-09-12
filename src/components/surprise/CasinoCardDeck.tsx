import React, { useState, useRef, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, Sparkles, Layers } from "lucide-react";

interface CasinoCardDeckProps {
  photos: string[];
  name: string;
  accentColor?: string;
  onAllCardsViewed?: () => void;
}

export const CasinoCardDeck: React.FC<CasinoCardDeckProps> = ({
  photos,
  name,
  accentColor = "#7659E4",
  onAllCardsViewed,
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isAnimatingRef = useRef(false);

  // When all cards are viewed
  useEffect(() => {
    if (activeCardIndex >= photos.length && photos.length > 0) {
      onAllCardsViewed?.();
    }
  }, [activeCardIndex, photos.length, onAllCardsViewed]);

  const discardCard = (direction: "left" | "right") => {
    if (isAnimatingRef.current || activeCardIndex >= photos.length) return;
    isAnimatingRef.current = true;
    setExitDirection(direction);

    // After exit animation finishes, advance to next card
    setTimeout(() => {
      setActiveCardIndex((prev) => prev + 1);
      setExitDirection(null);
      setDragOffset({ x: 0, y: 0 });
      isAnimatingRef.current = false;
    }, 280);
  };

  // Direct Touch Handlers for 100% Reliable Mobile Swiping (Android Chrome, iOS Safari)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimatingRef.current || activeCardIndex >= photos.length) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isAnimatingRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    // If swiping horizontally, prevent native browser scrolling
    if (Math.abs(dx) > Math.abs(dy) && e.cancelable) {
      e.preventDefault();
    }

    setDragOffset({ x: dx, y: dy * 0.3 });
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || isAnimatingRef.current) return;
    const dt = Date.now() - touchStartRef.current.time;
    const dx = dragOffset.x;
    const velocity = Math.abs(dx) / (dt || 1);

    touchStartRef.current = null;
    setIsDragging(false);

    // Threshold: either distance > 65px or quick flick velocity > 0.45
    if (Math.abs(dx) > 65 || velocity > 0.45) {
      discardCard(dx > 0 ? "right" : "left");
    } else {
      // Spring back to center
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Mouse Drag Handlers for Desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAnimatingRef.current || activeCardIndex >= photos.length) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startTime = Date.now();
    setIsDragging(true);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setDragOffset({ x: dx, y: dy * 0.3 });
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      setIsDragging(false);

      const dx = upEvent.clientX - startX;
      const dt = Date.now() - startTime;
      const velocity = Math.abs(dx) / (dt || 1);

      if (Math.abs(dx) > 75 || velocity > 0.45) {
        discardCard(dx > 0 ? "right" : "left");
      } else {
        setDragOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const resetDeck = () => {
    setActiveCardIndex(0);
    setDragOffset({ x: 0, y: 0 });
    setExitDirection(null);
  };

  // Dynamic casino-style rotation based on drag distance
  const currentRotation = dragOffset.x * 0.08;

  // Slice visible cards for the casino 3-card stack
  const isFinished = activeCardIndex >= photos.length;
  const card0 = !isFinished ? photos[activeCardIndex] : null;
  const card1 = activeCardIndex + 1 < photos.length ? photos[activeCardIndex + 1] : null;
  const card2 = activeCardIndex + 2 < photos.length ? photos[activeCardIndex + 2] : null;

  return (
    <div className="w-full flex flex-col items-center select-none">
      
      {/* Header Info */}
      <div className="text-center space-y-1 mb-4">
        {!isFinished && photos.length > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span>Memories</span>
            <span className="ml-1 font-mono font-bold" style={{ color: accentColor }}>
              {activeCardIndex + 1} of {photos.length}
            </span>
          </div>
        )}
        {!isFinished && (
          <p className="text-[11px] text-[#A89EC0] font-medium">
            Swipe card left or right &bull; reveals next photo
          </p>
        )}
      </div>

      {/* 3-Card Casino Playing Stack Container */}
      <div 
        className="relative mx-auto flex items-center justify-center"
        style={{
          width: 300,
          height: 380,
          perspective: 1000,
        }}
      >
        {isFinished ? (
          /* Deck Exhausted / Finished Card */
          <m.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-full h-full rounded-[28px] bg-gradient-to-b from-[#201830] to-[#120D1D] border-2 p-6 flex flex-col items-center justify-between text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
            style={{ borderColor: `${accentColor}50` }}
          >
            {/* Playing Card Top Corner Pip */}
            <div className="w-full flex items-center justify-between text-xs font-serif font-bold" style={{ color: accentColor }}>
              <span>★ A</span>
              <span>♠</span>
            </div>

            <div className="space-y-3 my-auto">
              <div 
                className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-serif font-bold text-white shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, #E0A842)`,
                  boxShadow: `0 10px 30px ${accentColor}50`,
                }}
              >
                {name.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-serif font-bold text-white">
                  All Memories Revealed!
                </h3>
                <p className="text-xs text-[#ACA2BE] max-w-[210px] mx-auto leading-relaxed">
                  You&apos;ve flipped through all the cherished photos of {name}.
                </p>
              </div>

              <button
                onClick={resetDeck}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                  boxShadow: `0 8px 20px ${accentColor}40`,
                }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Shuffle &amp; Deal Again
              </button>
            </div>
          </m.div>
        ) : (
          <>
            {/* ── CARD 2 (Back Card in 3-Card Stack) ── */}
            {card2 && (
              <div
                className="absolute inset-0 rounded-[28px] overflow-hidden transition-all duration-300 pointer-events-none"
                style={{
                  zIndex: 10,
                  transform: "scale(0.87) translateY(26px) rotate(4deg)",
                  opacity: 0.72,
                  filter: "brightness(0.78)",
                }}
              >
                <div
                  className="w-full h-full p-2.5 rounded-[28px] bg-gradient-to-b from-[#261E38] via-[#1A1428] to-[#120D1D] border shadow-2xl"
                  style={{ borderColor: `${accentColor}35` }}
                >
                  <div className="w-full h-full rounded-[20px] overflow-hidden bg-black/40">
                    <img
                      src={card2}
                      alt="Upcoming memory"
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── CARD 1 (Middle Card in 3-Card Stack) ── */}
            {card1 && (
              <div
                className="absolute inset-0 rounded-[28px] overflow-hidden transition-all duration-300 pointer-events-none"
                style={{
                  zIndex: 20,
                  transform: isDragging 
                    ? "scale(0.95) translateY(8px) rotate(-2deg)" 
                    : "scale(0.93) translateY(13px) rotate(-3.5deg)",
                  opacity: 0.90,
                  filter: "brightness(0.90)",
                }}
              >
                <div
                  className="w-full h-full p-2.5 rounded-[28px] bg-gradient-to-b from-[#2B2142] via-[#1E1730] to-[#140E20] border shadow-2xl"
                  style={{ borderColor: `${accentColor}50` }}
                >
                  <div className="w-full h-full rounded-[20px] overflow-hidden bg-black/40">
                    <img
                      src={card1}
                      alt="Next memory"
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── CARD 0 (Front / Active Card) ── */}
            {card0 && (
              <div
                key={`front-card-${activeCardIndex}`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                style={{
                  zIndex: 30,
                  touchAction: "none",
                  cursor: isDragging ? "grabbing" : "grab",
                  transform: exitDirection === "right"
                    ? "translateX(550px) translateY(-30px) rotate(35deg)"
                    : exitDirection === "left"
                    ? "translateX(-550px) translateY(-30px) rotate(-35deg)"
                    : `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${currentRotation}deg)`,
                  opacity: exitDirection ? 0 : 1,
                  transition: exitDirection 
                    ? "transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.28s linear" 
                    : isDragging 
                    ? "none" 
                    : "transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
                className="absolute inset-0 rounded-[28px] overflow-hidden shadow-[0_22px_45px_rgba(0,0,0,0.65)]"
              >
                {/* Authentic Playing Card Frame */}
                <div
                  className="w-full h-full p-2.5 rounded-[28px] bg-gradient-to-b from-[#30254A] via-[#201834] to-[#161025] border-2 flex flex-col justify-between relative"
                  style={{ borderColor: `${accentColor}70` }}
                >
                  
                  {/* Playing Card Top Corner Pip & Crown */}
                  <div className="flex items-center justify-between px-2 pt-1 pb-1 z-10">
                    <div className="flex items-center gap-1 font-serif font-bold text-xs" style={{ color: accentColor }}>
                      <span>★</span>
                      <span>#{activeCardIndex + 1}</span>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white">
                      {activeCardIndex + 1} / {photos.length}
                    </div>
                  </div>

                  {/* High Quality Photo Canvas */}
                  <div className="w-full flex-1 my-1 rounded-[20px] overflow-hidden relative shadow-inner bg-black/40">
                    <img
                      src={card0}
                      alt={`${name} memory ${activeCardIndex + 1}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />

                    {/* Subtle Card Gloss/Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />

                    {/* Swipe direction stamp indicator during drag */}
                    {Math.abs(dragOffset.x) > 35 && (
                      <div 
                        className={`absolute top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider backdrop-blur-md shadow-lg transition-all ${
                          dragOffset.x > 0 
                            ? "right-4 bg-emerald-500/80 text-white border border-emerald-300/50" 
                            : "left-4 bg-purple-600/80 text-white border border-purple-300/50"
                        }`}
                      >
                        {dragOffset.x > 0 ? "DISCARD 👉" : "👈 DISCARD"}
                      </div>
                    )}
                  </div>

                  {/* Interactive Swipe Pill on First Card */}
                  {activeCardIndex === 0 && !isDragging && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/25 text-[10px] font-semibold text-white whitespace-nowrap shadow-lg animate-pulse z-20">
                      👈 Swipe card to flip 👉
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Tactile Deck Controls (Failsafe & Touch-Friendly Arrows) */}
      {!isFinished && photos.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-5">
          <button
            onClick={() => discardCard("left")}
            disabled={isAnimatingRef.current}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all shadow-md cursor-pointer disabled:opacity-40"
            title="Swipe left"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Discard</span>
          </button>

          <span className="text-[11px] text-[#A89EC0] font-mono font-semibold">
            {activeCardIndex + 1} of {photos.length}
          </span>

          <button
            onClick={() => discardCard("right")}
            disabled={isAnimatingRef.current}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all shadow-md cursor-pointer disabled:opacity-40"
            title="Swipe right"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
