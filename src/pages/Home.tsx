import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  User, 
  Mail, 
  Image as ImageIcon, 
  Music, 
  Check, 
  Copy, 
  CheckCircle2, 
  Play, 
  Pause, 
  Trash2, 
  Upload, 
  Share2, 
  Crown, 
  Heart, 
  PartyPopper, 
  Gift, 
  Moon, 
  Eye, 
  QrCode, 
  Plus, 
  Calendar as CalendarIcon,
  ExternalLink,
  BookOpen,
  Video,
  Users,
  Clock,
  Volume2,
  Download
} from "lucide-react";
import QRCode from "qrcode";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar, NavView } from "@/components/layout/Sidebar";
import { MainDashboardView } from "@/components/dashboard/MainDashboardView";
import { LivePhonePreview } from "@/components/preview/LivePhonePreview";
import { TemplatesView, TEMPLATES_DATA } from "@/components/templates/TemplatesView";
import { MyWishesView, WishCardData } from "@/components/wishes/MyWishesView";
import { CalendarView } from "@/components/calendar/CalendarView";
import { ExploreView } from "@/components/explore/ExploreView";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { saveSurpriseData } from "@/lib/db";
import { compressImageToDataUrl, optimizePhotoBatch } from "@/lib/imageOptimizer";

// Steps Definition
const STEPS = [
  { number: 1, title: "Experience", subtitle: "Format" },
  { number: 2, title: "Template", subtitle: "Visual style" },
  { number: 3, title: "Recipient", subtitle: "Details & date" },
  { number: 4, title: "Message", subtitle: "AI writing" },
  { number: 5, title: "Memories", subtitle: "Photos" },
  { number: 6, title: "Music", subtitle: "Soundtrack" },
  { number: 7, title: "Theme", subtitle: "Colors" },
  { number: 8, title: "Publish", subtitle: "Share link" },
];

// Experience Types
const EXPERIENCE_TYPES = [
  { id: "verse", title: "Birthday Verse", subtitle: "Full celebration experience", icon: "🎂", badge: "Recommended" },
  { id: "card", title: "Birthday Card", subtitle: "Simple & beautiful digital card", icon: "💌" },
  { id: "story", title: "Birthday Story", subtitle: "Story told through memories", icon: "📖" },
  { id: "book", title: "Memory Book", subtitle: "Photos + captions + timeline", icon: "📸" },
  { id: "video", title: "Birthday Video", subtitle: "Photos + music + animation", icon: "🎥" },
  { id: "group", title: "Group Wishes", subtitle: "Collect wishes from friends", icon: "👥" },
];

// Vibe Options
const VIBES = [
  { id: "elegant", name: "Elegant", icon: <Crown className="w-4 h-4 text-amber-500" /> },
  { id: "fun", name: "Fun", icon: <PartyPopper className="w-4 h-4 text-orange-500" /> },
  { id: "romantic", name: "Romantic", icon: <Heart className="w-4 h-4 text-rose-500" /> },
  { id: "cute", name: "Cute", icon: <Gift className="w-4 h-4 text-pink-500" /> },
  { id: "dreamy", name: "Dreamy", icon: <Moon className="w-4 h-4 text-purple-500" /> },
  { id: "party", name: "Party", icon: <Music className="w-4 h-4 text-indigo-500" /> },
];

// Soundtracks
const SOUNDTRACK_CATEGORIES = ["Popular", "Happy", "Romantic", "Calm", "Energetic", "Party", "Upload"];

const SOUNDTRACKS = [
  { id: "Coldplay - A Sky Full of Stars", file: "/funky groovin.mp3", title: "A Sky Full of Stars", artist: "Coldplay", duration: "4:28", category: "Popular" },
  { id: "/Happy Birthday Song.mp3", file: "/Happy Birthday Song.mp3", title: "Classic Happy Birthday", artist: "Birthdayverse Mix", duration: "2:54", category: "Happy" },
  { id: "/happy birthday slowed.mp3", file: "/happy birthday slowed.mp3", title: "Happy Birthday (Lo-Fi Slowed)", artist: "Chill Midnight Mix", duration: "1:23", category: "Calm" },
  { id: "/pianocafe.mp3", file: "/pianocafe.mp3", title: "Acoustic Piano Cafe", artist: "Acoustic Cafe", duration: "3:10", category: "Calm" },
  { id: "/romantic.mp3", file: "/romantic.mp3", title: "Romantic Strings & Cello", artist: "Sweet Melodies", duration: "3:45", category: "Romantic" },
  { id: "/funky groovin.mp3", file: "/funky groovin.mp3", title: "Funky Groovin Disco", artist: "Groove Party", duration: "2:15", category: "Energetic" },
  { id: "/playhouse.mp3", file: "/playhouse.mp3", title: "Playhouse Celebration", artist: "Playful Pop", duration: "2:30", category: "Happy" },
  { id: "golden_sunset", file: "/pianocafe.mp3", title: "Golden Sunset Chords", artist: "Acoustic Warmth", duration: "3:15", category: "Calm" },
  { id: "dreamy_starlight", file: "/happy birthday slowed.mp3", title: "Dreamy Starlight Lullaby", artist: "Celestial Music Box", duration: "2:40", category: "Romantic" },
  { id: "confetti_pop", file: "/playhouse.mp3", title: "Celebration Confetti Pop", artist: "Festival Beats", duration: "2:50", category: "Happy" },
  { id: "sweet_serenade", file: "/romantic.mp3", title: "Sweet Rose Serenade", artist: "Violin Ensemble", duration: "3:20", category: "Romantic" },
  { id: "neon_dance", file: "/funky groovin.mp3", title: "Neon Midnight Dance", artist: "Club Party Remix", duration: "2:45", category: "Party" },
  { id: "bollywood_dhol", file: "/Happy Birthday Song.mp3", title: "Bollywood Dhol Celebration", artist: "Desi Festive Mix", duration: "3:30", category: "Party" },
  { id: "peaceful_morning", file: "/pianocafe.mp3", title: "Peaceful Morning Light", artist: "Zen Meditation Piano", duration: "3:05", category: "Calm" },
  { id: "joyful_ukulele", file: "/playhouse.mp3", title: "Joyful Ukulele Whistle", artist: "Sunshine Acoustic", duration: "2:25", category: "Energetic" },
  { id: "none", file: "none", title: "No Music (Silent Experience)", artist: "Muted Experience", duration: "—", category: "Calm" },
];

// AI Tone Presets
const AI_TONE_PRESETS = [
  { 
    id: "emotional", 
    name: "Emotional", 
    text: "Today isn't just another day. It's a reminder of all the laughter, memories, and light you bring into our lives. You make ordinary moments feel extraordinary. Here's to another beautiful chapter filled with happiness and dreams fulfilled!" 
  },
  { 
    id: "funny", 
    name: "Funny", 
    text: "Happy Birthday! You're officially one year older, wiser, and closer to getting that senior citizen discount. Don't worry about counting the candles—let's just enjoy the cake! Wishing you endless laughter and fun." 
  },
  { 
    id: "poetic", 
    name: "Poetic", 
    text: "Like the brightest constellation in a quiet night sky, your presence turns every room into warmth. May your days ahead unfold like poetry, rich with grace, wonder, and unforgettable joy." 
  },
  { 
    id: "short", 
    name: "Short & Sweet", 
    text: "Happy Birthday! Wishing you a year ahead filled with peace, love, health, and all the success you deserve. Have the best day ever!" 
  },
  { 
    id: "romantic", 
    name: "Romantic", 
    text: "Every day with you is a gift, but today is the most special of all. Happy Birthday to the one who holds my heart. May this year be as radiant, loving, and magical as you are to me." 
  },
];

export default function Home() {
  const [activeNav, setActiveNav] = useState<NavView>("dashboard");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");

  // Form States
  const [experienceType, setExperienceType] = useState<string>("verse");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("elegant");
  const [name, setName] = useState<string>("Aanya");
  const [nickname, setNickname] = useState<string>("");
  const [relationship, setRelationship] = useState<string>("Best Friend");
  const [birthdayDate, setBirthdayDate] = useState<string>("");
  const [vibe, setVibe] = useState<string>("elegant");
  const [message, setMessage] = useState<string>(AI_TONE_PRESETS[0].text);
  const [finaleText, setFinaleText] = useState<string>("HAPPY BIRTHDAY! 🎂");
  const [signOff, setSignOff] = useState<string>("With all my warmest love • BirthdayVerse");
  
  // Media & Music States
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [extraPhotos, setExtraPhotos] = useState<string[]>([]);
  const [isCompressingPhotos, setIsCompressingPhotos] = useState<boolean>(false);
  const [selectedMusic, setSelectedMusic] = useState<string>("/Happy Birthday Song.mp3");
  const [activeMusicTab, setActiveMusicTab] = useState<string>("Popular");
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [musicFile, setMusicFile] = useState<File | null>(null);

  // Theme & Publish States
  const [themeMode, setThemeMode] = useState<"auto" | "light" | "dark">("dark");
  const [accentColor, setAccentColor] = useState<string>("#7659E4");
  const [retentionMode, setRetentionMode] = useState<"72h" | "forever">("72h");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [shortId, setShortId] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate offline QR code Data URL whenever link changes or modal opens
  useEffect(() => {
    const linkToEncode = generatedLink || `${window.location.origin}/surprise/${shortId || 'demo'}`;
    QRCode.toDataURL(linkToEncode, {
      width: 240,
      margin: 2,
      color: {
        dark: "#1E182A",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [generatedLink, shortId, showQrModal]);

  // Handle soundtrack toggle
  const toggleMusicPreview = (src: string) => {
    if (src === "none") {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlayingMusic(false);
      }
      setSelectedMusic("none");
      return;
    }

    if (selectedMusic === src && isPlayingMusic) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const trackObj = SOUNDTRACKS.find((s) => s.id === src);
      let realSrc = trackObj?.file || src;
      if (src.includes("Coldplay")) realSrc = "/funky groovin.mp3";
      audioRef.current = new Audio(realSrc);
      audioRef.current.play().catch(() => {});
      setIsPlayingMusic(true);
      setSelectedMusic(src);
    }
  };

  // Combined active photos array
  const allPhotos = [profilePhoto, ...extraPhotos].filter(Boolean) as string[];

  // Multi-photo upload handler with client-side compression
  const handleMultiplePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 6 - allPhotos.length;
    if (remainingSlots <= 0) return;

    const filesToLoad = Array.from(files).slice(0, remainingSlots);
    setIsCompressingPhotos(true);
    try {
      const compressedBatch: string[] = [];
      for (const file of filesToLoad) {
        const compressed = await compressImageToDataUrl(file, {
          maxWidth: 960,
          maxHeight: 960,
          quality: 0.72,
          maxDataUrlLength: 110000,
        });
        if (compressed) compressedBatch.push(compressed);
      }

      if (compressedBatch.length > 0) {
        if (!profilePhoto) {
          setProfilePhoto(compressedBatch[0]);
          if (compressedBatch.length > 1) {
            setExtraPhotos((prev) => [...prev, ...compressedBatch.slice(1)]);
          }
        } else {
          setExtraPhotos((prev) => [...prev, ...compressedBatch]);
        }
      }
    } catch (err) {
      console.error("Photo compression error:", err);
    } finally {
      setIsCompressingPhotos(false);
      e.target.value = "";
    }
  };

  // Remove photo at given index
  const removePhoto = (index: number) => {
    if (index === 0) {
      if (extraPhotos.length > 0) {
        setProfilePhoto(extraPhotos[0]);
        setExtraPhotos((prev) => prev.slice(1));
      } else {
        setProfilePhoto(null);
      }
    } else {
      setExtraPhotos((prev) => prev.filter((_, i) => i !== index - 1));
    }
  };

  // Image Upload handler for single photo with client-side compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isPrimary: boolean = true) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressingPhotos(true);
    try {
      if (isPrimary) {
        const compressed = await compressImageToDataUrl(files[0], {
          maxWidth: 960,
          maxHeight: 960,
          quality: 0.72,
          maxDataUrlLength: 110000,
        });
        if (compressed) setProfilePhoto(compressed);
      } else {
        const remainingSlots = 6 - allPhotos.length;
        const filesToLoad = Array.from(files).slice(0, Math.max(0, remainingSlots));
        const compressedBatch: string[] = [];
        for (const file of filesToLoad) {
          const compressed = await compressImageToDataUrl(file, {
            maxWidth: 960,
            maxHeight: 960,
            quality: 0.72,
            maxDataUrlLength: 110000,
          });
          if (compressed) compressedBatch.push(compressed);
        }
        if (compressedBatch.length > 0) {
          setExtraPhotos((prev) => [...prev, ...compressedBatch]);
        }
      }
    } catch (err) {
      console.error("Photo upload error:", err);
    } finally {
      setIsCompressingPhotos(false);
      e.target.value = "";
    }
  };

  // Publish Experience
  const handlePublish = async () => {
    if (!name.trim()) {
      setError("Please enter the recipient's name before publishing.");
      setCurrentStep(3);
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      // Ensure all photos are strictly optimized to fit within ~190KB total budget
      let preparedPhotos: string[] = [];
      if (allPhotos.length > 0) {
        preparedPhotos = await optimizePhotoBatch(allPhotos);
      }

      const payload = {
        body: message,
        finaleText: finaleText,
        signOff: signOff,
        accentColor: accentColor,
        selectedMusic: selectedMusic,
        vibe: vibe,
        theme: selectedTemplate,
        nickname: nickname,
        relationship: relationship,
        birthdayDate: birthdayDate,
        experienceType: experienceType,
        retentionMode: retentionMode,
        keepForever: retentionMode === "forever",
        photos: preparedPhotos,
      };

      const finalMessageString = JSON.stringify(payload);

      const id = await saveSurpriseData({
        name,
        message: finalMessageString,
        musicFile: musicFile,
        photos: preparedPhotos,
      });

      if (id) {
        setShortId(id);
        const link = `${window.location.origin}/surprise/${id}`;
        setGeneratedLink(link);

        // Append to My Wishes in localStorage
        const newWish: WishCardData = {
          id: id,
          name: name,
          relationship: relationship,
          date: birthdayDate ? new Date(birthdayDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Today",
          status: "Published",
          url: `/surprise/${id}`,
          views: 0,
          reactions: 0,
        };

        const existing = localStorage.getItem("birthdayverse_my_wishes");
        const list = existing ? JSON.parse(existing) : [];
        localStorage.setItem("birthdayverse_my_wishes", JSON.stringify([newWish, ...list]));
      }
    } catch (err: any) {
      setError(err.message || "Failed to publish celebration. Please check connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7FD] dark:bg-[#13101C] text-[#211A30] dark:text-[#F9F7FD] transition-colors duration-300 font-sans">
      
      {/* Sticky Brand Top Navbar */}
      <Navbar
        activeTab={activeNav}
        onTabChange={(tab) => {
          setActiveNav(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Main Studio Shell: Persistent Sidebar + Content */}
      <div className="flex-1 flex w-full">
        
        {/* Desktop Sidebar Dock */}
        <Sidebar
          activeView={activeNav}
          onViewChange={(v) => {
            setActiveNav(v);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        {/* Dynamic Route Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          
          {/* TAB 1: MAIN DASHBOARD */}
          {activeNav === "dashboard" && (
            <MainDashboardView
              onCreateClick={() => setActiveNav("create")}
              onSelectRecipient={(recName, recDate, recRel) => {
                setName(recName);
                if (recRel) setRelationship(recRel);
                setActiveNav("create");
                setCurrentStep(3);
              }}
              onViewWishes={() => setActiveNav("wishes")}
              onExploreTemplatesClick={() => setActiveNav("templates")}
              onSelectTemplate={(tmplId) => {
                setSelectedTemplate(tmplId);
                setActiveNav("create");
                setCurrentStep(2);
              }}
            />
          )}

          {/* TAB 2: CREATOR STUDIO (8-STEP BUILDER) */}
          {activeNav === "create" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Studio Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8DFFA] dark:border-[#282038]">
                <div className="text-left space-y-1">
                  <span className="text-xs font-bold text-[#7659E4] dark:text-[#C7BAFA] uppercase tracking-wider">
                    Creator Studio
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#211A30] dark:text-[#F7F5FC]">
                    Craft Birthday Experience
                  </h1>
                </div>

                {/* Mobile Editor/Preview Toggle */}
                <div className="flex lg:hidden items-center bg-[#EFEAFB] dark:bg-[#1E182A] p-1 rounded-2xl border border-[#E8DFFA] dark:border-[#282038] self-start md:self-auto">
                  <button
                    onClick={() => setMobileTab("editor")}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      mobileTab === "editor"
                        ? "bg-white dark:bg-[#261F36] text-[#7659E4] dark:text-[#C7BAFA] shadow-xs"
                        : "text-[#736886] dark:text-[#ACA2BE]"
                    }`}
                  >
                    Editor Form
                  </button>
                  <button
                    onClick={() => setMobileTab("preview")}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      mobileTab === "preview"
                        ? "bg-white dark:bg-[#261F36] text-[#7659E4] dark:text-[#C7BAFA] shadow-xs"
                        : "text-[#736886] dark:text-[#ACA2BE]"
                    }`}
                  >
                    Live Preview ✨
                  </button>
                </div>
              </div>

              {/* Step Navigation Pill Bar */}
              <div className="overflow-x-auto no-scrollbar pb-2">
                <div className="flex items-center gap-2 min-w-max">
                  {STEPS.map((s) => {
                    const isActive = currentStep === s.number;
                    const isCompleted = currentStep > s.number;
                    return (
                      <button
                        key={s.number}
                        onClick={() => setCurrentStep(s.number)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#7659E4] text-white shadow-md shadow-[#7659E4]/25 font-bold"
                            : isCompleted
                            ? "bg-[#EFEAFB] dark:bg-[#261F36] text-[#7659E4] dark:text-[#C7BAFA]"
                            : "bg-white dark:bg-[#1E182A] text-[#736886] dark:text-[#ACA2BE] border border-[#E8DFFA] dark:border-[#282038] hover:text-[#211A30]"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                          isActive ? "bg-white text-[#7659E4]" : isCompleted ? "bg-[#7659E4] text-white" : "bg-[#EFEAFB] dark:bg-[#261F36]"
                        }`}>
                          {isCompleted ? <Check className="w-3 h-3" /> : s.number}
                        </span>
                        <span>{s.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Studio Grid: Editor (Cols 1-7) + Live Preview (Cols 8-12) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Center Editor Column */}
                <div className={`lg:col-span-7 space-y-6 ${mobileTab === "preview" ? "hidden lg:block" : "block"}`}>
                  <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] shadow-xs text-left space-y-6">
                    
                    {/* STEP 1: EXPERIENCE TYPE */}
                    {currentStep === 1 && (
                      <div className="space-y-5">
                        <div>
                          <h2 className="text-xl font-display font-bold text-[#211A30] dark:text-[#F7F5FC]">
                            Choose Celebration Format
                          </h2>
                          <p className="text-xs text-[#736886] dark:text-[#ACA2BE] mt-1">
                            Select the type of digital experience you want to build.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {EXPERIENCE_TYPES.map((type) => {
                            const isSelected = experienceType === type.id;
                            return (
                              <div
                                key={type.id}
                                onClick={() => setExperienceType(type.id)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 relative ${
                                  isSelected
                                    ? "bg-[#EFEAFB]/80 dark:bg-[#261F36] border-[#7659E4] shadow-sm"
                                    : "bg-white dark:bg-[#181323] border-[#E8DFFA] dark:border-[#282038] hover:border-[#8E72F0]/40"
                                }`}
                              >
                                <span className="text-2xl">{type.icon}</span>
                                <div className="space-y-0.5 flex-1 pr-6">
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-xs font-bold text-[#211A30] dark:text-[#F7F5FC]">
                                      {type.title}
                                    </h3>
                                    {type.badge && (
                                      <Badge variant="primary">{type.badge}</Badge>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-[#736886] dark:text-[#ACA2BE]">
                                    {type.subtitle}
                                  </p>
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-[#7659E4] dark:text-[#A28DF8] absolute right-3.5 top-4" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* STEP 2: TEMPLATE SELECTOR */}
                    {currentStep === 2 && (
                      <div className="space-y-5">
                        <div>
                          <h2 className="text-xl font-display font-bold text-[#211A30] dark:text-[#F7F5FC]">
                            Select Visual Theme
                          </h2>
                          <p className="text-xs text-[#736886] dark:text-[#ACA2BE] mt-1">
                            Pick an artistic style for typography and backdrop aesthetics.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {TEMPLATES_DATA.slice(0, 6).map((tmpl) => {
                            const isSelected = selectedTemplate === tmpl.id;
                            return (
                              <div
                                key={tmpl.id}
                                onClick={() => {
                                  setSelectedTemplate(tmpl.id);
                                  // Sync vibe and accent color with the selected template
                                  if (tmpl.id === "romantic") {
                                    setVibe("romantic");
                                    setAccentColor("#C495C8");
                                  } else if (tmpl.id === "fun") {
                                    setVibe("fun");
                                    setAccentColor("#D8A854");
                                  } else if (tmpl.id === "dreamy") {
                                    setVibe("dreamy");
                                    setAccentColor("#7659E4");
                                  } else if (tmpl.id === "party" || tmpl.id === "midnight") {
                                    setVibe("party");
                                    setAccentColor("#8E72F0");
                                  } else if (tmpl.id === "cute" || tmpl.id === "pastel") {
                                    setVibe("cute");
                                    setAccentColor("#D4B2D8");
                                  } else {
                                    setVibe("elegant");
                                    setAccentColor("#7659E4");
                                  }
                                }}
                                className={`rounded-2xl border overflow-hidden transition-all cursor-pointer text-left ${
                                  isSelected
                                    ? "border-[#7659E4] ring-2 ring-[#7659E4]/40 shadow-lg shadow-[#7659E4]/20"
                                    : "border-[#E8DFFA] dark:border-[#282038] hover:border-[#8E72F0]/40"
                                }`}
                              >
                                <div className={`h-20 ${tmpl.previewBg} p-3 flex items-center justify-between text-white`}>
                                  <span className="text-xs font-bold">{tmpl.name}</span>
                                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                                </div>
                                <div className="p-3 bg-white dark:bg-[#181323]">
                                  <p className="text-[11px] text-[#736886] dark:text-[#ACA2BE] line-clamp-1">
                                    {tmpl.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* STEP 3: RECIPIENT */}
                    {currentStep === 3 && (
                      <div className="space-y-5">
                        <div>
                          <h2 className="text-xl font-display font-bold text-[#211A30] dark:text-[#F7F5FC]">
                            Who is this celebration for?
                          </h2>
                          <p className="text-xs text-[#736886] dark:text-[#ACA2BE] mt-1">
                            Personalize the experience with their name, date, and relationship.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Recipient Name *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Aanya"
                            required
                          />
                          <Input
                            label="Nickname (Optional)"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="e.g. Annie"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-[#736886] dark:text-[#ACA2BE]">
                              Relationship
                            </label>
                            <select
                              value={relationship}
                              onChange={(e) => setRelationship(e.target.value)}
                              className="w-full rounded-2xl bg-white dark:bg-[#1E182A] text-[#211A30] dark:text-[#F7F5FC] border border-[#E8DFFA] dark:border-[#282038] px-4 py-2.5 text-sm outline-none focus:border-[#7659E4]"
                            >
                              <option value="Best Friend">Best Friend</option>
                              <option value="Partner">Partner</option>
                              <option value="Sister">Sister</option>
                              <option value="Brother">Brother</option>
                              <option value="Mother">Mother</option>
                              <option value="Father">Father</option>
                              <option value="Colleague">Colleague</option>
                              <option value="Mentor">Mentor</option>
                              <option value="Friend">Friend</option>
                            </select>
                          </div>

                          <Input
                            label="Birthday Date"
                            type="date"
                            value={birthdayDate}
                            onChange={(e) => setBirthdayDate(e.target.value)}
                          />
                        </div>

                        {/* Vibe Selection */}
                        <div className="space-y-2 pt-2">
                          <label className="block text-xs font-semibold text-[#736886] dark:text-[#ACA2BE]">
                            Celebration Vibe
                          </label>
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {VIBES.map((v) => {
                              const isSelected = vibe === v.id;
                              return (
                                <button
                                  key={v.id}
                                  type="button"
                                  onClick={() => setVibe(v.id)}
                                  className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-[#EFEAFB] dark:bg-[#261F36] border-[#7659E4] font-bold"
                                      : "border-[#E8DFFA] dark:border-[#282038] text-[#736886] dark:text-[#ACA2BE]"
                                  }`}
                                >
                                  {v.icon}
                                  <span className="text-[10px]">{v.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: MESSAGE EDITOR (AI TONES) */}
                    {currentStep === 4 && (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-display font-bold text-[#211A30] dark:text-[#F7F5FC]">
                              Personal Message & AI Writer
                            </h2>
                            <p className="text-xs text-[#736886] dark:text-[#ACA2BE] mt-1">
                              Write from the heart or choose an AI tone preset.
                            </p>
                          </div>
                          <Badge variant="purple">AI Assistant</Badge>
                        </div>

                        {/* Tone Selection Pills */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-semibold text-[#736886] dark:text-[#ACA2BE]">
                            AI Tone Presets
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {AI_TONE_PRESETS.map((tone) => (
                              <button
                                key={tone.id}
                                type="button"
                                onClick={() => setMessage(tone.text)}
                                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EFEAFB] dark:bg-[#261F36] text-[#7659E4] dark:text-[#C7BAFA] hover:bg-[#7659E4] hover:text-white transition-all cursor-pointer"
                              >
                                {tone.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        <Textarea
                          label="Your Message Letter"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          maxCharacters={1000}
                          rows={6}
                          helperText="Main heartfelt letter shown inside the luxury parchment card in Scene 3."
                        />

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-[#736886] dark:text-[#ACA2BE]">
                              Letter Sign-off & Closing Signature
                            </label>
                            <span className="text-[10px] text-[#7659E4] dark:text-[#C7BAFA] font-semibold bg-[#EFEAFB] dark:bg-[#261F36] px-2 py-0.5 rounded-full">
                              Card Footer
                            </span>
                          </div>
                          <Input
                            value={signOff}
                            onChange={(e) => setSignOff(e.target.value)}
                            placeholder="With all my warmest love • BirthdayVerse"
                            helperText="Appears at the bottom-right corner of the letter card (e.g. 'With all my warmest love', 'Forever yours, Alex ❤️', or any custom text)."
                          />
                        </div>

                        <Input
                          label="Grand Finale Heading"
                          value={finaleText}
                          onChange={(e) => setFinaleText(e.target.value)}
                          placeholder="HAPPY BIRTHDAY! 🎂"
                          helperText="Big headline displayed at the climax of the celebration during the fireworks."
                        />
                      </div>
                    )}

                    {/* STEP 5: PHOTOS & MEMORIES */}
                    {currentStep === 5 && (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-display font-bold text-[#211A30] dark:text-[#F7F5FC]">
                              Photos & Visual Memories
                            </h2>
                            <p className="text-xs text-[#736886] dark:text-[#ACA2BE] mt-1">
                              Upload multiple cherished memories. Recipient can swipe through them!
                            </p>
                          </div>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EFEAFB] dark:bg-[#261F36] text-[#7659E4] dark:text-[#C7BAFA]">
                            {allPhotos.length} / 6 photos
                          </span>
                        </div>

                        {/* Uploaded Photos Grid */}
                        {allPhotos.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {allPhotos.map((photo, index) => (
                              <div
                                key={index}
                                className="group relative rounded-2xl overflow-hidden aspect-square border-2 border-[#E8DFFA] dark:border-[#282038] bg-black/10 shadow-xs"
                              >
                                <img
                                  src={photo}
                                  alt={`Memory ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute top-2 left-2">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    index === 0
                                      ? "bg-[#7659E4] text-white shadow-xs"
                                      : "bg-black/60 backdrop-blur-md text-white border border-white/20"
                                  }`}>
                                    {index === 0 ? "Cover Photo" : `Memory #${index + 1}`}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removePhoto(index)}
                                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition-all opacity-90 sm:opacity-0 group-hover:opacity-100 shadow-md cursor-pointer"
                                  title="Remove photo"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Photo Uploader Dropzone / Add Button */}
                        {allPhotos.length < 6 && (
                          <div className="p-6 rounded-3xl border-2 border-dashed border-[#E8DFFA] dark:border-[#282038] text-center space-y-3 hover:border-[#7659E4]/50 transition-colors">
                            <div className="w-12 h-12 rounded-2xl bg-[#EFEAFB] dark:bg-[#261F36] text-[#7659E4] dark:text-[#C7BAFA] flex items-center justify-center mx-auto">
                              <Upload className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[#211A30] dark:text-[#F7F5FC]">
                                {allPhotos.length === 0 ? "Upload Photos & Memories" : "Add More Photos"}
                              </p>
                              <p className="text-[11px] text-[#736886] dark:text-[#ACA2BE] mt-0.5">
                                Select one or multiple photos (PNG, JPG up to 5MB each)
                              </p>
                            </div>
                            <label className={`inline-block ${isCompressingPhotos ? "opacity-60 cursor-not-allowed pointer-events-none" : "cursor-pointer"}`}>
                              <span className="px-5 py-2.5 rounded-xl bg-[#7659E4] text-white text-xs font-bold inline-flex items-center gap-1.5 hover:brightness-105 transition-all shadow-md shadow-[#7659E4]/25">
                                {isCompressingPhotos ? (
                                  <>
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    <span>Optimizing Photos...</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Select Photos</span>
                                  </>
                                )}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                disabled={isCompressingPhotos}
                                className="hidden"
                                onChange={handleMultiplePhotosUpload}
                              />
                            </label>
                          </div>
                        )}

                        {allPhotos.length > 1 && (
                          <div className="p-3 rounded-2xl bg-[#EFEAFB] dark:bg-[#261F36] border border-[#E8DFFA] dark:border-[#282038] text-xs text-[#7659E4] dark:text-[#C7BAFA] flex items-center gap-2">
                            <span>✨</span>
                            <span>
                              <strong>Swipeable gallery enabled!</strong> Viewers will be able to swipe through all {allPhotos.length} photos in the celebration.
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* STEP 6: MUSIC SOUNDTRACK */}
                    {currentStep === 6 && (
                      <div className="space-y-5">
                        <div>
                          <h2 className="text-xl font-display font-bold text-[#211A30] dark:text-[#F7F5FC]">
                            Soundtrack & Audio
                          </h2>
                          <p className="text-xs text-[#736886] dark:text-[#ACA2BE] mt-1">
                            Set the mood with curated background melodies.
                          </p>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex flex-wrap gap-1.5 pb-2">
                          {SOUNDTRACK_CATEGORIES.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setActiveMusicTab(cat)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                activeMusicTab === cat
                                  ? "bg-[#7659E4] text-white font-bold shadow-xs"
                                  : "bg-[#EFEAFB] dark:bg-[#261F36] text-[#736886] dark:text-[#ACA2BE]"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        {/* Tracks List */}
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {SOUNDTRACKS.filter(
                            (s) => activeMusicTab === "Popular" || s.category === activeMusicTab || activeMusicTab === "Upload"
                          ).map((track) => {
                            const isSelected = selectedMusic === track.id;
                            return (
                              <div
                                key={track.id}
                                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                  isSelected
                                    ? "bg-[#EFEAFB]/80 dark:bg-[#261F36] border-[#7659E4]"
                                    : "border-[#E8DFFA] dark:border-[#282038] hover:bg-white dark:hover:bg-[#181323]"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => toggleMusicPreview(track.id)}
                                    className="w-8 h-8 rounded-full bg-[#7659E4] text-white flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform"
                                  >
                                    {selectedMusic === track.id && isPlayingMusic ? (
                                      <Pause className="w-3.5 h-3.5" />
                                    ) : (
                                      <Play className="w-3.5 h-3.5 ml-0.5" />
                                    )}
                                  </button>
                                  <div>
                                    <h4 className="text-xs font-bold text-[#211A30] dark:text-[#F7F5FC]">
                                      {track.title}
                                    </h4>
                                    <span className="text-[10px] text-[#736886] dark:text-[#ACA2BE]">
                                      {track.artist} &bull; {track.duration}
                                    </span>
                                  </div>
                                </div>

                                <Button
                                  variant={isSelected ? "primary" : "secondary"}
                                  size="sm"
                                  onClick={() => setSelectedMusic(track.id)}
                                  className="text-[11px] h-7 px-3"
                                >
                                  {isSelected ? "Selected ✓" : "Choose"}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* STEP 7: THEME & STYLING */}
                    {currentStep === 7 && (
                      <div className="space-y-5">
                        <div>
                          <h2 className="text-xl font-display font-bold text-[#211A30] dark:text-[#F7F5FC]">
                            Appearance & Animation
                          </h2>
                          <p className="text-xs text-[#736886] dark:text-[#ACA2BE] mt-1">
                            Customize lighting, accent colors, and party effects.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-[#736886] dark:text-[#ACA2BE]">
                            Display Theme
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {(["dark", "light", "auto"] as const).map((mode) => (
                              <button
                                key={mode}
                                type="button"
                                onClick={() => setThemeMode(mode)}
                                className={`p-3 rounded-2xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                                  themeMode === mode
                                    ? "bg-[#7659E4] text-white shadow-xs font-bold"
                                    : "border-[#E8DFFA] dark:border-[#282038] text-[#736886] dark:text-[#ACA2BE]"
                                }`}
                              >
                                {mode}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-[#736886] dark:text-[#A89EC0]">
                              Accent Color Palettes
                            </label>
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#F1EBFD] dark:bg-[#261F36] text-[#7659E4] dark:text-[#C495C8]">
                              {accentColor.toUpperCase()}
                            </span>
                          </div>

                          {/* Curated Color Swatches */}
                          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                            {[
                              { name: "French Lavender", color: "#7659E4" },
                              { name: "Wisteria Lavender", color: "#A594F9" },
                              { name: "Mauve Mist", color: "#C495C8" },
                              { name: "Lilac Twilight", color: "#8E72F0" },
                              { name: "Warm Gold", color: "#E0A842" },
                              { name: "Blush Rose", color: "#DE7A9E" },
                              { name: "Champagne", color: "#EAC585" },
                              { name: "Soft Sky", color: "#6BA4E8" },
                              { name: "Sage Serenity", color: "#82B89D" },
                              { name: "Velvet Plum", color: "#9B59B6" },
                              { name: "Sunset Mauve", color: "#E28B78" },
                              { name: "Midnight Violet", color: "#54448C" },
                            ].map((c) => (
                              <button
                                key={c.color}
                                type="button"
                                title={c.name}
                                onClick={() => setAccentColor(c.color)}
                                style={{ backgroundColor: c.color }}
                                className={`w-8 h-8 rounded-full transition-transform cursor-pointer hover:scale-110 ${
                                  accentColor.toLowerCase() === c.color.toLowerCase()
                                    ? "scale-110 ring-2 ring-offset-2 ring-[#7659E4] dark:ring-white"
                                    : "opacity-90 hover:opacity-100"
                                }`}
                              />
                            ))}
                          </div>

                          {/* Custom Color Picker & Hex Input */}
                          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F5F1FD] dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038]">
                            <label
                              className="relative flex items-center justify-center w-9 h-9 rounded-full cursor-pointer hover:scale-105 transition-transform shadow-xs border-2 border-dashed border-[#7659E4]"
                              title="Click to open color picker"
                            >
                              <input
                                type="color"
                                value={accentColor.startsWith("#") && accentColor.length === 7 ? accentColor : "#7659E4"}
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              <div
                                className="w-6 h-6 rounded-full shadow-xs"
                                style={{ backgroundColor: accentColor }}
                              />
                            </label>

                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-semibold text-[#211A30] dark:text-[#F9F7FD] block">
                                Custom Color
                              </span>
                              <p className="text-[10px] text-[#736886] dark:text-[#A89EC0] truncate">
                                Click the circle to choose any color
                              </p>
                            </div>

                            <div className="flex items-center gap-1 bg-white dark:bg-[#261F36] px-2.5 py-1.5 rounded-xl border border-[#E8DFFA] dark:border-[#282038]">
                              <span className="text-xs font-mono font-bold text-[#7659E4] dark:text-[#C495C8]">#</span>
                              <input
                                type="text"
                                value={accentColor.replace("#", "")}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^0-9A-Fa-f]/g, "");
                                  if (val.length <= 6) {
                                    setAccentColor(`#${val}`);
                                  }
                                }}
                                placeholder="7659E4"
                                className="w-16 text-xs font-mono font-bold uppercase bg-transparent outline-none text-[#211A30] dark:text-[#F9F7FD]"
                                maxLength={6}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 8: PREVIEW & PUBLISH */}
                    {currentStep === 8 && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-display font-bold text-[#211A30] dark:text-[#F9F7FD]">
                            Publish & Privacy
                          </h2>
                          <p className="text-xs text-[#736886] dark:text-[#A89EC0] mt-1">
                            Review checklist and generate your private celebration link.
                          </p>
                        </div>

                        {/* Pre-Publish Checklist */}
                        <div className="p-4 rounded-3xl bg-[#FAF8FE] dark:bg-[#161220] border border-[#E8DFFA] dark:border-[#282038] space-y-2 text-xs">
                          <div className="flex items-center justify-between font-semibold">
                            <span>Recipient Name:</span>
                            <span className="text-[#7659E4] dark:text-[#C495C8] font-bold">{name || "Not set"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Vibe & Format:</span>
                            <span className="capitalize">{vibe} &bull; {experienceType}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Soundtrack:</span>
                            <span>{selectedMusic === "none" ? "Muted" : "Active"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Photos:</span>
                            <span>{allPhotos.length > 0 ? `${allPhotos.length} Photo${allPhotos.length > 1 ? "s" : ""} Attached (Swipeable Gallery)` : "Monogram Keepsake"}</span>
                          </div>
                        </div>

                        {/* 72-Hour Ephemeral Retention Toggle */}
                        <div className="p-4 rounded-3xl bg-[#F8F4FD] dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-[#7659E4] dark:text-[#C495C8]" />
                              <span className="text-xs font-bold text-[#7659E4] dark:text-[#C495C8]">
                                72-Hour Privacy Promise
                              </span>
                            </div>
                            <Badge variant={retentionMode === "forever" ? "purple" : "secondary"}>
                              {retentionMode === "forever" ? "Kept Forever ⭐" : "Auto-deletes in 72h"}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-[#736886] dark:text-[#A89EC0] leading-relaxed">
                            By default, all uploaded photos and message content automatically purge after 72 hours for privacy.
                          </p>
                          <div className="flex items-center gap-4 pt-1">
                            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                              <input
                                type="radio"
                                name="retention"
                                checked={retentionMode === "72h"}
                                onChange={() => setRetentionMode("72h")}
                                className="accent-[#7659E4]"
                              />
                              <span>72h Ephemeral (Standard)</span>
                            </label>
                            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                              <input
                                type="radio"
                                name="retention"
                                checked={retentionMode === "forever"}
                                onChange={() => setRetentionMode("forever")}
                                className="accent-[#7659E4]"
                              />
                              <span>Keep Forever ⭐</span>
                            </label>
                          </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs">
                            {error}
                          </div>
                        )}

                        {/* Generated Share Link Card */}
                        {generatedLink ? (
                          <div className="p-5 rounded-3xl bg-[#F5F1FD] dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] space-y-4">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              <h3 className="text-sm font-bold text-[#211A30] dark:text-[#F9F7FD]">
                                Celebration Link Ready!
                              </h3>
                            </div>

                            <div className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-[#161220] border border-[#E8DFFA] dark:border-[#282038]">
                              <input
                                type="text"
                                readOnly
                                value={generatedLink}
                                className="flex-1 bg-transparent px-2 text-xs font-mono select-all truncate outline-none"
                              />
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={copyLink}
                                leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              >
                                {copied ? "Copied!" : "Copy"}
                              </Button>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  const text = encodeURIComponent(`🎉 A special birthday surprise for you! Open here: ${generatedLink}`);
                                  window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
                                }}
                              >
                                WhatsApp
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setShowQrModal(true)}
                                leftIcon={<QrCode className="w-3.5 h-3.5" />}
                              >
                                QR Code
                              </Button>
                              <a
                                href={generatedLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1 text-xs font-semibold px-4 py-2 rounded-2xl bg-[#7659E4] text-white hover:bg-[#6849D6] transition-all"
                              >
                                <span>Open</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="primary"
                            size="lg"
                            onClick={handlePublish}
                            isLoading={isGenerating}
                            className="w-full shadow-md shadow-[#7659E4]/20"
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                          >
                            Create Birthday Experience ✨
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Step Navigation Controls */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#E8DFFA] dark:border-[#282038]">
                      {currentStep > 1 ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                        >
                          Previous
                        </Button>
                      ) : (
                        <div />
                      )}

                      {currentStep < 8 && (
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => setCurrentStep((s) => Math.min(8, s + 1))}
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          Continue
                        </Button>
                      )}
                    </div>

                  </div>
                </div>

                {/* Right Column: Live Phone Mockup Preview */}
                <div className={`lg:col-span-5 ${mobileTab === "editor" ? "hidden lg:block" : "block"}`}>
                  <div className="sticky top-24">
                    <LivePhonePreview
                      name={name}
                      message={message}
                      finaleText={finaleText}
                      signOff={signOff}
                      accentColor={accentColor}
                      vibe={vibe}
                      theme={selectedTemplate}
                      profilePhoto={profilePhoto}
                      photos={extraPhotos}
                      selectedMusic={selectedMusic}
                      isPlayingMusic={isPlayingMusic}
                      onToggleMusic={() => toggleMusicPreview(selectedMusic)}
                    />
                  </div>
                </div>

              </div>

              {/* DOWN SIDE MIDDLE FOOTER: Created by Gous Khan */}
              <div className="w-full pt-10 pb-6 mt-8 border-t border-[#E8DFFA] dark:border-[#282038] flex flex-col items-center justify-center gap-2.5">
                <div className="relative p-[1.5px] rounded-full bg-gradient-to-r from-[#7659E4] via-[#C495C8] to-[#E0A842] shadow-[0_4px_20px_rgba(118,89,228,0.22)] hover:shadow-[0_6px_28px_rgba(118,89,228,0.32)] transition-all duration-500 group select-none">
                  <div className="relative flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#161220]/95 backdrop-blur-xl overflow-hidden">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C495C8] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-[#C495C8] to-[#7659E4]"></span>
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide">
                      <span className="text-[#C5BED3] font-medium">Crafted with ❤️ by</span>
                      <span className="font-black text-sm bg-gradient-to-r from-[#A28DF8] via-[#C495C8] to-[#E0A842] bg-clip-text text-transparent drop-shadow-xs tracking-wider uppercase">
                        GOUS KHAN
                      </span>
                    </div>
                    <Sparkles className="w-4 h-4 text-[#E0A842] animate-spin" style={{ animationDuration: "5s" }} />
                  </div>
                </div>
                <span className="text-[11px] text-[#736886] dark:text-[#8E849E] tracking-wider uppercase font-medium">
                  BirthdayVerse • Make Every Celebration Unforgettable
                </span>
              </div>

            </div>
          )}

          {/* TAB 3: TEMPLATES GALLERY */}
          {activeNav === "templates" && (
            <TemplatesView
              onSelectTemplate={(template) => {
                setSelectedTemplate(template.id);
                setActiveNav("create");
                setCurrentStep(2);
              }}
            />
          )}

          {/* TAB 4: MY WISHES */}
          {activeNav === "wishes" && (
            <MyWishesView
              onCreateNew={() => setActiveNav("create")}
            />
          )}

          {/* TAB 5: CALENDAR */}
          {activeNav === "calendar" && (
            <CalendarView
              onCreateForContact={(contactName, contactDate, contactRel) => {
                setName(contactName);
                if (contactRel) setRelationship(contactRel);
                setActiveNav("create");
                setCurrentStep(3);
              }}
            />
          )}

          {/* TAB 6: EXPLORE */}
          {activeNav === "explore" && (
            <ExploreView
              onCreateClick={() => setActiveNav("create")}
              onExploreTemplatesClick={() => setActiveNav("templates")}
            />
          )}

          {/* TAB 7: SETTINGS */}
          {activeNav === "settings" && (
            <div className="max-w-2xl mx-auto space-y-6 text-left animate-in fade-in duration-300">
              <div>
                <h1 className="text-2xl font-display font-bold text-[#211A30] dark:text-[#F9F7FD]">
                  Workspace Settings
                </h1>
                <p className="text-xs text-[#736886] dark:text-[#A89EC0] mt-1">
                  Manage your creator preferences and privacy configurations.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] space-y-4">
                <h3 className="text-sm font-bold text-[#211A30] dark:text-[#F9F7FD]">
                  72-Hour Data Purge Guarantee
                </h3>
                <p className="text-xs text-[#736886] dark:text-[#A89EC0] leading-relaxed">
                  BirthdayVerse is committed to personal privacy. Every digital celebration link self-destructs after 72 hours unless you explicitly choose to keep it forever.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#211A30] dark:text-[#F9F7FD]">
                    Administrative Access
                  </h3>
                  <p className="text-xs text-[#736886] dark:text-[#A89EC0]">
                    Access the private platform control center
                  </p>
                </div>
                <a
                  href="/admin"
                  className="px-4 py-2 rounded-2xl bg-[#7659E4] text-white text-xs font-bold hover:bg-[#6849D6] transition-all shadow-xs"
                >
                  Admin Console
                </a>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* QR Code Modal */}
      <Modal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        title="Scan Celebration QR Code"
        description="Point your phone camera to open this birthday experience."
        maxWidth="sm"
      >
        <div className="flex flex-col items-center py-4 space-y-4">
          {qrDataUrl ? (
            <div className="p-3 bg-white rounded-3xl shadow-xl border-2 border-[#E8DFFA] dark:border-[#282038]">
              <img
                src={qrDataUrl}
                alt="Celebration QR Code"
                className="w-48 h-48 rounded-xl object-contain"
              />
            </div>
          ) : (
            <div className="w-48 h-48 rounded-3xl border-2 border-dashed border-[#7659E4] flex flex-col items-center justify-center p-4 text-center">
              <QrCode className="w-8 h-8 text-[#7659E4] animate-pulse" />
              <span className="text-xs text-[#736886] mt-2">Generating QR Code...</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            {qrDataUrl && (
              <a
                href={qrDataUrl}
                download={`birthdayverse-qr-${(name || 'celebration').toLowerCase().replace(/\s+/g, '-')}.png`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#7659E4] text-white text-xs font-semibold hover:bg-[#6849D6] transition-all shadow-md shadow-[#7659E4]/20 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save QR Image</span>
              </a>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={copyLink}
              leftIcon={<Copy className="w-3.5 h-3.5" />}
            >
              {copied ? "Link Copied!" : "Copy URL"}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
