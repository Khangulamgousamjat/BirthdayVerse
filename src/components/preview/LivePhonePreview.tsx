import React, { useState } from "react";
import { Play, Pause, Smartphone, Monitor, Sparkles, Heart, Music, ChevronLeft, ChevronRight, Lock } from "lucide-react";

interface LivePhonePreviewProps {
  name: string;
  message?: string;
  finaleText?: string;
  signOff?: string;
  accentColor?: string;
  vibe?: string;
  theme?: string;
  profilePhoto?: string | null;
  photos?: string[];
  selectedMusic?: string;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onChangeTemplateClick?: () => void;
}

export const LivePhonePreview: React.FC<LivePhonePreviewProps> = ({
  name,
  message,
  finaleText,
  signOff,
  accentColor = "#7659E4",
  vibe = "elegant",
  theme = "midnight",
  profilePhoto,
  photos = [],
  selectedMusic = "/Happy Birthday Song.mp3",
  isPlayingMusic,
  onToggleMusic,
  onChangeTemplateClick,
}) => {
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [audioProgress, setAudioProgress] = useState(18);
  const [previewPhotoIndex, setPreviewPhotoIndex] = useState(0);

  const displayName = name.trim() || "Ananya";
  const displayMessage = message?.trim() || "May your day be as special and beautiful as you are! ✨";
  const displaySignOff = signOff?.trim() || "With all my warmest love • BirthdayVerse";

  // Only use user-uploaded photos — no demo samples
  const userPhotos = [profilePhoto, ...photos].filter(Boolean) as string[];
  const activePhotos = userPhotos; // empty means show placeholder

  // Format song title from filename or path
  const songTitle = selectedMusic === "custom" 
    ? "Special Birthday Track" 
    : selectedMusic.includes("Coldplay") 
      ? "A Sky Full of Stars"
      : selectedMusic.replace(/^\//, "").replace(/\.mp3$/, "").replace(/_/g, " ");

  const artistName = selectedMusic.includes("Coldplay") ? "Coldplay" : "Birthdayverse Mix";

  // Vibe styling palettes for preview
  const vibeThemes: Record<string, { bg: string; accent: string; text: string; balloon1: string; balloon2: string }> = {
    elegant: {
      bg: "from-[#F5F1FD] via-[#ECE5FC] to-[#F2ECFE]",
      accent: "#7659E4",
      text: "#211A30",
      balloon1: "#8E72F0",
      balloon2: "#C495C8"
    },
    fun: {
      bg: "from-[#FDF8EC] via-[#F8EDF8] to-[#EDE9FE]",
      accent: "#D97706",
      text: "#211A30",
      balloon1: "#E0A842",
      balloon2: "#C495C8"
    },
    romantic: {
      bg: "from-[#FAF0F5] via-[#F5EBF5] to-[#EDE9FE]",
      accent: "#A83868",
      text: "#3B1225",
      balloon1: "#DE7A9E",
      balloon2: "#A28DF8"
    },
    cute: {
      bg: "from-[#F7F2FD] via-[#EDE7FD] to-[#F5EDF5]",
      accent: "#9333EA",
      text: "#211A30",
      balloon1: "#C495C8",
      balloon2: "#8E72F0"
    },
    dreamy: {
      bg: "from-[#EDE9FE] via-[#E8E2FC] to-[#F3EBFC]",
      accent: "#7659E4",
      text: "#1E182A",
      balloon1: "#8E72F0",
      balloon2: "#A28DF8"
    },
    party: {
      bg: "from-[#1B1428] via-[#261B3B] to-[#341F48]",
      accent: "#C495C8",
      text: "#F9F7FD",
      balloon1: "#8E72F0",
      balloon2: "#E0A842"
    },
    pastel: {
      bg: "from-[#F7F2FD] via-[#EDE9FE] to-[#F5EFFE]",
      accent: "#8E72F0",
      text: "#211A30",
      balloon1: "#C495C8",
      balloon2: "#A28DF8"
    },
    midnight: {
      bg: "from-[#13101C] via-[#1E182A] to-[#261F36]",
      accent: "#A28DF8",
      text: "#F9F7FD",
      balloon1: "#7659E4",
      balloon2: "#C495C8"
    },
  };

  const activeThemeKey = (theme && vibeThemes[theme.toLowerCase()])
    ? theme.toLowerCase()
    : (vibeThemes[vibe.toLowerCase()] ? vibe.toLowerCase() : "elegant");
  const currentVibe = vibeThemes[activeThemeKey];

  // Render Inner Interactive Screen Content
  const renderScreenContent = () => (
    <div className="relative flex-1 flex flex-col justify-between p-4 text-center overflow-y-auto no-scrollbar select-none z-10">
      {/* Ambient Animated Floating Balloons & Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute -top-4 -left-4 w-28 h-36 rounded-full opacity-60 blur-[1px] animate-pulse"
          style={{ backgroundColor: currentVibe.balloon1, filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.15))" }}
        />
        <div 
          className="absolute top-12 -right-6 w-24 h-32 rounded-full opacity-65 blur-[1px] animate-pulse"
          style={{ backgroundColor: currentVibe.balloon2, animationDelay: "1s" }}
        />
        <div 
          className="absolute top-52 -left-5 w-20 h-28 rounded-full opacity-40 blur-[2px]"
          style={{ backgroundColor: currentVibe.balloon1 }}
        />
        <div 
          className="absolute bottom-40 -right-4 w-24 h-32 rounded-full opacity-50 blur-[1px]"
          style={{ backgroundColor: currentVibe.balloon2 }}
        />
      </div>

      {/* Main Interactive Celebration Body */}
      <div className="relative z-10 flex flex-col items-center flex-1">
        {/* Sparkle Header */}
        <div className="flex items-center justify-center gap-1.5 mb-1 text-[#7659E4] dark:text-[#A28DF8]">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} />
          <span className="text-[10px] tracking-widest uppercase font-bold opacity-75">Birthdayverse</span>
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} />
        </div>

        {/* Happy Birthday Heading */}
        <h2 className="text-xl font-display font-bold tracking-tight text-gray-900 leading-tight">
          Happy
        </h2>
        <h1 className="text-2xl font-display font-black tracking-tight text-gray-900 -mt-1 leading-tight">
          Birthday
        </h1>

        {/* Recipient Name in Signature Style */}
        <div className="relative my-1">
          <span className="font-serif italic text-3xl font-bold bg-gradient-to-r from-[#7659E4] via-[#8E72F0] to-[#C495C8] bg-clip-text text-transparent px-2">
            {displayName}
          </span>
          <div className="flex justify-center -mt-1">
            <Heart className="w-3.5 h-3.5 text-[#C495C8] fill-[#C495C8] animate-bounce" />
          </div>
        </div>

        {/* Emotional Subtitle Message Card with Sign-off */}
        <div className="w-full max-w-[260px] mx-auto mt-1 mb-2 bg-white/60 dark:bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/70 dark:border-white/10 shadow-xs text-left">
          <p className="text-[11px] leading-relaxed text-gray-800 dark:text-gray-200 font-medium text-center">
            {displayMessage}
          </p>
          <div className="mt-1.5 pt-1 border-t border-black/10 dark:border-white/10 text-right">
            <span className="text-[9px] font-serif italic text-gray-500 dark:text-gray-400 block truncate">
              {displaySignOff}
            </span>
          </div>
        </div>

        {/* Photo Card Stack Preview */}
        <div className="relative w-full max-w-[270px] my-2 flex flex-col items-center">
          {activePhotos.length > 0 ? (
            <div className="relative h-36 w-full flex items-center justify-center">
              {/* Card stack — up to 3 cards deep */}
              {[2, 1, 0].map((depthIdx) => {
                const photoIdx = previewPhotoIndex % activePhotos.length;
                const idx = (photoIdx + depthIdx) % activePhotos.length;
                if (depthIdx > 0 && activePhotos.length === 1) return null;
                return (
                  <div
                    key={depthIdx}
                    className="polaroid-card absolute"
                    style={{
                      zIndex: 10 + (2 - depthIdx),
                      transform: depthIdx === 0
                        ? "rotate(2deg) translateY(0px) scale(1)"
                        : depthIdx === 1
                        ? "rotate(-4deg) translateY(8px) scale(0.95)"
                        : "rotate(6deg) translateY(16px) scale(0.90)",
                      opacity: depthIdx === 0 ? 1 : depthIdx === 1 ? 0.8 : 0.6,
                      width: 112,
                      top: 0,
                      left: "50%",
                      marginLeft: -56,
                    }}
                    onClick={depthIdx === 0 ? () => setPreviewPhotoIndex((prev) => (prev + 1) % activePhotos.length) : undefined}
                  >
                    <div className="w-full h-24 bg-gray-200 overflow-hidden rounded-[3px] relative">
                      <img
                        src={activePhotos[idx]}
                        alt="Memory"
                        className="w-full h-full object-cover"
                      />
                      {depthIdx === 0 && activePhotos.length > 1 && (
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white">
                          {(previewPhotoIndex % activePhotos.length) + 1}/{activePhotos.length}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* No photos — show placeholder */
            <div className="relative h-32 w-full flex items-center justify-center">
              <div
                className="polaroid-card"
                style={{ width: 112, transform: "rotate(2deg)" }}
              >
                <div className="w-full h-24 bg-gradient-to-br from-[#EFEAFB] to-[#E8DFFA] overflow-hidden rounded-[3px] flex flex-col items-center justify-center gap-1">
                  <span className="text-2xl">🖼️</span>
                  <span className="text-[9px] font-semibold text-[#7659E4] text-center leading-tight px-2">Add photos<br/>to preview</span>
                </div>
              </div>
            </div>
          )}

          {/* Click / Swipe Hint Pill */}
          {activePhotos.length > 1 && (
            <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-[#7659E4] dark:text-[#C495C8] bg-white/70 dark:bg-black/40 px-2.5 py-0.5 rounded-full border border-[#E8DFFA]/50 shadow-2xs">
              <span>👆 Tap to flip cards</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Audio Player Card */}
      <div className="relative z-20 pt-2">
        <div className="bg-white/85 dark:bg-[#1E182A]/90 backdrop-blur-xl rounded-2xl p-2.5 border border-white/80 dark:border-white/10 shadow-lg shadow-black/10 flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleMusic}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7659E4] to-[#8E72F0] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer flex-shrink-0"
              aria-label={isPlayingMusic ? "Pause preview music" : "Play preview music"}
            >
              {isPlayingMusic ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 ml-0.5" />
              )}
            </button>

            <div className="flex-1 min-w-0 text-left">
              <p className="text-[11px] font-bold text-gray-900 dark:text-white truncate">
                {songTitle}
              </p>
              <p className="text-[9px] font-medium text-gray-500 dark:text-gray-400 truncate">
                {artistName}
              </p>
            </div>

            <span className="text-[9px] font-mono text-gray-500 dark:text-gray-400 tabular-nums">
              0:{audioProgress < 10 ? `0${audioProgress}` : audioProgress} / 4:28
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#7659E4] to-[#A28DF8] transition-all duration-300"
              style={{ width: `${(audioProgress / 268) * 100}%` }}
            />
          </div>

          <div className="text-[9px] text-center text-gray-500 dark:text-gray-400 font-medium">
            Made with <span className="text-[#C495C8]">💜</span> by someone who cares
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* Live Preview Header & Device Selector */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#211A30] dark:text-[#F9F7FD]">
            Live Preview
          </span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7659E4] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7659E4]"></span>
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#F1EBFD] dark:bg-[#1E182A] p-1 rounded-xl border border-[#E8DFFA] dark:border-[#282038]">
          <button
            onClick={() => setPreviewDevice("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              previewDevice === "mobile"
                ? "bg-white dark:bg-[#261F36] text-[#7659E4] dark:text-[#C495C8] shadow-xs"
                : "text-[#736886] dark:text-[#A89EC0] hover:text-[#211A30]"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
          <button
            onClick={() => setPreviewDevice("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              previewDevice === "desktop"
                ? "bg-white dark:bg-[#261F36] text-[#7659E4] dark:text-[#C495C8] shadow-xs"
                : "text-[#736886] dark:text-[#A89EC0] hover:text-[#211A30]"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="relative flex items-center justify-center w-full">
        {previewDevice === "mobile" ? (
          /* Mobile Smartphone Mockup Frame */
          <div className="phone-mockup-frame transition-all duration-300">
            {/* Dynamic Island / Notch */}
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#111] mr-3"></div>
              <div className="w-2 h-2 rounded-full bg-[#0a1020]"></div>
            </div>

            {/* Status Bar */}
            <div className="relative z-20 px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold tracking-tight text-gray-800 dark:text-gray-200">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">📶</span>
                <span className="text-[10px]">􀙇</span>
                <div className="w-5 h-2.5 border border-gray-700 dark:border-gray-300 rounded-sm p-0.5 flex items-center">
                  <div className="w-full h-full bg-gray-800 dark:bg-gray-200 rounded-[1px]"></div>
                </div>
              </div>
            </div>

            {/* Mobile Screen Content */}
            <div className={`phone-mockup-screen bg-gradient-to-b ${currentVibe.bg} select-none relative flex flex-col justify-between overflow-y-auto no-scrollbar`}>
              {renderScreenContent()}
            </div>
          </div>
        ) : (
          /* Desktop Browser Window Mockup Frame */
          <div className="w-full max-w-[420px] h-[640px] rounded-3xl p-3 bg-[#161220] shadow-2xl border border-[#E8DFFA] dark:border-[#282038] flex flex-col transition-all duration-300">
            {/* Desktop Browser Chrome Topbar */}
            <div className="flex items-center justify-between px-2 pb-2.5 border-b border-[#E8DFFA]/20 dark:border-[#282038] select-none">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] shadow-xs" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shadow-xs" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] shadow-xs" />
              </div>
              <div className="flex-1 mx-3 px-2.5 py-1 rounded-lg bg-black/30 border border-white/10 text-[10px] text-[#A89EC0] flex items-center justify-center gap-1.5 font-mono truncate">
                <Lock className="w-2.5 h-2.5 text-emerald-400" />
                <span className="truncate">birthdayverse.app/surprise/{displayName.toLowerCase().replace(/\s+/g, '-')}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#736886]">
                <Monitor className="w-3 h-3 text-[#7659E4]" />
              </div>
            </div>

            {/* Desktop Screen Content */}
            <div className={`flex-1 rounded-2xl bg-gradient-to-b ${currentVibe.bg} select-none relative flex flex-col justify-between overflow-y-auto no-scrollbar mt-2 border border-black/10`}>
              {renderScreenContent()}
            </div>
          </div>
        )}
      </div>

      {/* Under-Preview Controls */}
      <div className="w-full max-w-[320px] mt-4 flex items-center justify-between text-xs font-semibold">
        {/* Toggle music in preview */}
        <label className="flex items-center gap-2 text-[#211A30] dark:text-[#F9F7FD] cursor-pointer select-none">
          <div className="relative inline-flex items-center">
            <input 
              type="checkbox" 
              checked={isPlayingMusic} 
              onChange={onToggleMusic}
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7659E4]"></div>
          </div>
          <span className="text-xs font-medium">Play music in preview</span>
        </label>

        {/* Change template shortcut button */}
        <button
          onClick={onChangeTemplateClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] text-[#7659E4] dark:text-[#C495C8] hover:bg-[#F1EBFD]/50 dark:hover:bg-[#261F36] transition-all shadow-2xs cursor-pointer text-xs font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Change template</span>
        </button>
      </div>

    </div>
  );
};
