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
  Volume2
} from "lucide-react";
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
const SOUNDTRACK_CATEGORIES = ["Popular", "Happy", "Romantic", "Calm", "Energetic", "Upload"];

const SOUNDTRACKS = [
  { id: "Coldplay - A Sky Full of Stars", file: "/funky groovin.mp3", title: "A Sky Full of Stars", artist: "Coldplay", duration: "4:28", category: "Popular" },
  { id: "/Happy Birthday Song.mp3", title: "Classic Happy Birthday", artist: "Birthdayverse Mix", duration: "2:54", category: "Happy" },
  { id: "/happy birthday slowed.mp3", title: "Happy Birthday (Lo-Fi Slowed)", artist: "Chill Mix", duration: "1:23", category: "Calm" },
  { id: "/pianocafe.mp3", title: "Acoustic Piano Cafe", artist: "Acoustic Cafe", duration: "3:10", category: "Calm" },
  { id: "/romantic.mp3", title: "Romantic Strings", artist: "Sweet Melodies", duration: "3:45", category: "Romantic" },
  { id: "/funky groovin.mp3", title: "Funky Groovin", artist: "Groove Party", duration: "2:15", category: "Energetic" },
  { id: "/playhouse.mp3", title: "Playhouse Celebration", artist: "Playful Pop", duration: "2:30", category: "Happy" },
  { id: "none", title: "No Music (Silent)", artist: "Muted Experience", duration: "—", category: "Calm" },
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
  
  // Media & Music States
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [extraPhotos, setExtraPhotos] = useState<string[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<string>("/Happy Birthday Song.mp3");
  const [activeMusicTab, setActiveMusicTab] = useState<string>("Popular");
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [musicFile, setMusicFile] = useState<File | null>(null);

  // Theme & Publish States
  const [themeMode, setThemeMode] = useState<"auto" | "light" | "dark">("dark");
  const [accentColor, setAccentColor] = useState<string>("#9D6BFF");
  const [retentionMode, setRetentionMode] = useState<"72h" | "forever">("72h");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [shortId, setShortId] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      let realSrc = src;
      if (src.includes("Coldplay")) realSrc = "/funky groovin.mp3";
      audioRef.current = new Audio(realSrc);
      audioRef.current.play().catch(() => {});
      setIsPlayingMusic(true);
      setSelectedMusic(src);
    }
  };

  // Image Upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isPrimary: boolean = true) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (isPrimary) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePhoto(event.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setExtraPhotos((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
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
      const payload = {
        body: message,
        finaleText: finaleText,
        selectedMusic: selectedMusic,
        vibe: vibe,
        theme: selectedTemplate,
        nickname: nickname,
        relationship: relationship,
        birthdayDate: birthdayDate,
        experienceType: experienceType,
        retentionMode: retentionMode,
        keepForever: retentionMode === "forever",
        photos: extraPhotos,
      };

      const finalMessageString = JSON.stringify(payload);

      const id = await saveSurpriseData({
        name,
        message: finalMessageString,
        imageBase64: profilePhoto || null,
        musicFile: musicFile,
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
    <div className="min-h-screen flex flex-col bg-[#F8F6FC] dark:bg-[#100C18] text-[#241B35] dark:text-[#F7F3FC] transition-colors duration-300 font-sans">
      
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EDE7F6] dark:border-[#251B35]">
                <div className="text-left">
                  <span className="text-xs font-bold text-[#7952D6] dark:text-[#9D6BFF] uppercase tracking-wider">
                    Creator Studio
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC]">
                    Craft Birthday Experience
                  </h1>
                </div>

                {/* Mobile Editor/Preview Toggle */}
                <div className="flex lg:hidden items-center bg-[#EDE7F6] dark:bg-[#1D162A] p-1 rounded-2xl border border-[#EDE7F6] dark:border-[#251B35] self-start">
                  <button
                    onClick={() => setMobileTab("editor")}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      mobileTab === "editor"
                        ? "bg-white dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] shadow-xs"
                        : "text-[#746B80] dark:text-[#B8AEC5]"
                    }`}
                  >
                    Editor Form
                  </button>
                  <button
                    onClick={() => setMobileTab("preview")}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      mobileTab === "preview"
                        ? "bg-white dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] shadow-xs"
                        : "text-[#746B80] dark:text-[#B8AEC5]"
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
                            ? "bg-[#7952D6] text-white shadow-md shadow-purple-500/20 font-bold"
                            : isCompleted
                            ? "bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF]"
                            : "bg-white dark:bg-[#1D162A] text-[#746B80] dark:text-[#B8AEC5] border border-[#EDE7F6] dark:border-[#251B35] hover:text-[#241B35]"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                          isActive ? "bg-white text-[#7952D6]" : isCompleted ? "bg-[#9D6BFF] text-white" : "bg-[#EDE7F6] dark:bg-[#251B35]"
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
                  <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#251B35] shadow-xs text-left space-y-6">
                    
                    {/* STEP 1: EXPERIENCE TYPE */}
                    {currentStep === 1 && (
                      <div className="space-y-5">
                        <div>
                          <h2 className="text-xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC]">
                            Choose Celebration Format
                          </h2>
                          <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] mt-1">
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
                                    ? "bg-[#EDE7F6]/60 dark:bg-[#251B35] border-[#9D6BFF] shadow-sm"
                                    : "bg-white dark:bg-[#171122] border-[#EDE7F6] dark:border-[#251B35] hover:border-[#9D6BFF]/40"
                                }`}
                              >
                                <span className="text-2xl">{type.icon}</span>
                                <div className="space-y-0.5 flex-1 pr-6">
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-xs font-bold text-[#241B35] dark:text-[#F7F3FC]">
                                      {type.title}
                                    </h3>
                                    {type.badge && (
                                      <Badge variant="primary">{type.badge}</Badge>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-[#746B80] dark:text-[#B8AEC5]">
                                    {type.subtitle}
                                  </p>
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-[#9D6BFF] absolute right-3.5 top-4" />
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
                          <h2 className="text-xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC]">
                            Select Visual Theme
                          </h2>
                          <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] mt-1">
                            Pick an artistic style for typography and backdrop aesthetics.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {TEMPLATES_DATA.slice(0, 6).map((tmpl) => {
                            const isSelected = selectedTemplate === tmpl.id;
                            return (
                              <div
                                key={tmpl.id}
                                onClick={() => setSelectedTemplate(tmpl.id)}
                                className={`rounded-2xl border overflow-hidden transition-all cursor-pointer text-left ${
                                  isSelected
                                    ? "border-[#9D6BFF] ring-2 ring-[#9D6BFF]/30 shadow-md"
                                    : "border-[#EDE7F6] dark:border-[#251B35] hover:border-[#9D6BFF]/40"
                                }`}
                              >
                                <div className={`h-20 ${tmpl.previewBg} p-3 flex items-center justify-between text-white`}>
                                  <span className="text-xs font-bold">{tmpl.name}</span>
                                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                                </div>
                                <div className="p-3 bg-white dark:bg-[#171122]">
                                  <p className="text-[11px] text-[#746B80] dark:text-[#B8AEC5] line-clamp-1">
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
                          <h2 className="text-xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC]">
                            Who is this celebration for?
                          </h2>
                          <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] mt-1">
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
                            <label className="block text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5]">
                              Relationship
                            </label>
                            <select
                              value={relationship}
                              onChange={(e) => setRelationship(e.target.value)}
                              className="w-full rounded-2xl bg-white dark:bg-[#1D162A] text-[#241B35] dark:text-[#F7F3FC] border border-[#EDE7F6] dark:border-[#251B35] px-4 py-2.5 text-sm outline-none focus:border-[#9D6BFF]"
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
                          <label className="block text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5]">
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
                                      ? "bg-[#EDE7F6] dark:bg-[#251B35] border-[#9D6BFF] font-bold"
                                      : "border-[#EDE7F6] dark:border-[#251B35] text-[#746B80] dark:text-[#B8AEC5]"
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
                            <h2 className="text-xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC]">
                              Personal Message & AI Writer
                            </h2>
                            <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] mt-1">
                              Write from the heart or choose an AI tone preset.
                            </p>
                          </div>
                          <Badge variant="purple">AI Assistant</Badge>
                        </div>

                        {/* Tone Selection Pills */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-semibold text-[#746B80] dark:text-[#B8AEC5]">
                            AI Tone Presets
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {AI_TONE_PRESETS.map((tone) => (
                              <button
                                key={tone.id}
                                type="button"
                                onClick={() => setMessage(tone.text)}
                                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EDE7F6]/60 dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] hover:bg-[#7952D6] hover:text-white transition-all cursor-pointer"
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
                        />

                        <Input
                          label="Grand Finale Heading"
                          value={finaleText}
                          onChange={(e) => setFinaleText(e.target.value)}
                          placeholder="HAPPY BIRTHDAY! 🎂"
                          helperText="Displayed at the climax of the celebration"
                        />
                      </div>
                    )}

                    {/* STEP 5: PHOTOS & MEMORIES */}
                    {currentStep === 5 && (
                      <div className="space-y-5">
                        <div>
                          <h2 className="text-xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC]">
                            Photos & Visual Memories
                          </h2>
                          <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] mt-1">
                            Add a profile picture or cherish memories in the photo frame.
                          </p>
                        </div>

                        {/* Primary Photo Uploader */}
                        <div className="p-6 rounded-3xl border-2 border-dashed border-[#EDE7F6] dark:border-[#251B35] text-center space-y-3">
                          {profilePhoto ? (
                            <div className="space-y-3">
                              <img
                                src={profilePhoto}
                                alt="Memory preview"
                                className="w-32 h-32 rounded-2xl object-cover mx-auto shadow-md border-2 border-[#9D6BFF]"
                              />
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => setProfilePhoto(null)}
                                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                              >
                                Remove Photo
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="w-12 h-12 rounded-2xl bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] flex items-center justify-center mx-auto">
                                <Upload className="w-6 h-6" />
                              </div>
                              <p className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">
                                Upload Featured Photo
                              </p>
                              <p className="text-[11px] text-[#746B80] dark:text-[#B8AEC5]">
                                PNG, JPG up to 5MB
                              </p>
                              <label className="inline-block cursor-pointer">
                                <span className="px-4 py-2 rounded-xl bg-[#7952D6] text-white text-xs font-bold inline-block hover:brightness-105 transition-all">
                                  Select Photo
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handlePhotoUpload(e, true)}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* STEP 6: MUSIC SOUNDTRACK */}
                    {currentStep === 6 && (
                      <div className="space-y-5">
                        <div>
                          <h2 className="text-xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC]">
                            Soundtrack & Audio
                          </h2>
                          <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] mt-1">
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
                                  ? "bg-[#7952D6] text-white font-bold shadow-xs"
                                  : "bg-[#EDE7F6]/60 dark:bg-[#251B35] text-[#746B80] dark:text-[#B8AEC5]"
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
                                    ? "bg-[#EDE7F6]/60 dark:bg-[#251B35] border-[#9D6BFF]"
                                    : "border-[#EDE7F6] dark:border-[#251B35] hover:bg-white dark:hover:bg-[#171122]"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    onClick={() => toggleMusicPreview(track.id)}
                                    className="w-8 h-8 rounded-full bg-[#7952D6] text-white flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform"
                                  >
                                    {selectedMusic === track.id && isPlayingMusic ? (
                                      <Pause className="w-3.5 h-3.5" />
                                    ) : (
                                      <Play className="w-3.5 h-3.5 ml-0.5" />
                                    )}
                                  </button>
                                  <div>
                                    <h4 className="text-xs font-bold text-[#241B35] dark:text-[#F7F3FC]">
                                      {track.title}
                                    </h4>
                                    <span className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">
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
                          <h2 className="text-xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC]">
                            Appearance & Animation
                          </h2>
                          <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] mt-1">
                            Customize lighting, accent colors, and party effects.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5]">
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
                                    ? "bg-[#7952D6] text-white shadow-xs font-bold"
                                    : "border-[#EDE7F6] dark:border-[#251B35] text-[#746B80] dark:text-[#B8AEC5]"
                                }`}
                              >
                                {mode}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <label className="block text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5]">
                            Accent Color
                          </label>
                          <div className="flex items-center gap-3">
                            {["#9D6BFF", "#F47FB5", "#E7B85C", "#9AD8C2", "#38BDF8"].map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setAccentColor(c)}
                                style={{ backgroundColor: c }}
                                className={`w-9 h-9 rounded-full transition-transform cursor-pointer ${
                                  accentColor === c ? "scale-110 ring-2 ring-offset-2 ring-[#7952D6]" : ""
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 8: PREVIEW & PUBLISH */}
                    {currentStep === 8 && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC]">
                            Publish & Privacy
                          </h2>
                          <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] mt-1">
                            Review checklist and generate your private celebration link.
                          </p>
                        </div>

                        {/* Pre-Publish Checklist */}
                        <div className="p-4 rounded-3xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#251B35] space-y-2 text-xs">
                          <div className="flex items-center justify-between font-semibold">
                            <span>Recipient Name:</span>
                            <span className="text-[#7952D6] dark:text-[#9D6BFF] font-bold">{name || "Not set"}</span>
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
                            <span>{profilePhoto ? "1 Photo Attached" : "Monogram Keepsake"}</span>
                          </div>
                        </div>

                        {/* 72-Hour Ephemeral Retention Toggle */}
                        <div className="p-4 rounded-3xl bg-purple-50 dark:bg-[#251B35]/50 border border-purple-200 dark:border-purple-900/60 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-[#7952D6] dark:text-[#9D6BFF]" />
                              <span className="text-xs font-bold text-[#7952D6] dark:text-[#9D6BFF]">
                                72-Hour Privacy Promise
                              </span>
                            </div>
                            <Badge variant={retentionMode === "forever" ? "purple" : "secondary"}>
                              {retentionMode === "forever" ? "Kept Forever ⭐" : "Auto-deletes in 72h"}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-[#746B80] dark:text-[#B8AEC5] leading-relaxed">
                            By default, all uploaded photos and message content automatically purge after 72 hours for privacy.
                          </p>
                          <div className="flex items-center gap-4 pt-1">
                            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                              <input
                                type="radio"
                                name="retention"
                                checked={retentionMode === "72h"}
                                onChange={() => setRetentionMode("72h")}
                                className="accent-[#7952D6]"
                              />
                              <span>72h Ephemeral (Standard)</span>
                            </label>
                            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                              <input
                                type="radio"
                                name="retention"
                                checked={retentionMode === "forever"}
                                onChange={() => setRetentionMode("forever")}
                                className="accent-[#7952D6]"
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
                          <div className="p-5 rounded-3xl bg-[#EDE7F6]/50 dark:bg-[#251B35] border border-purple-200 dark:border-purple-800 space-y-4">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              <h3 className="text-sm font-bold text-[#241B35] dark:text-[#F7F3FC]">
                                Celebration Link Ready!
                              </h3>
                            </div>

                            <div className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C]">
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
                                className="inline-flex items-center justify-center gap-1 text-xs font-semibold px-4 py-2 rounded-2xl bg-[#7952D6] text-white hover:brightness-105"
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
                            className="w-full shadow-lg shadow-purple-500/20"
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                          >
                            Create Birthday Experience ✨
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Step Navigation Controls */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#EDE7F6] dark:border-[#251B35]">
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
                <h1 className="text-2xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC]">
                  Workspace Settings
                </h1>
                <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] mt-1">
                  Manage your creator preferences and privacy configurations.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#251B35] space-y-4">
                <h3 className="text-sm font-bold text-[#241B35] dark:text-[#F7F3FC]">
                  72-Hour Data Purge Guarantee
                </h3>
                <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] leading-relaxed">
                  BirthdayVerse is committed to personal privacy. Every digital celebration link self-destructs after 72 hours unless you explicitly choose to keep it forever.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#251B35] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#241B35] dark:text-[#F7F3FC]">
                    Administrative Access
                  </h3>
                  <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
                    Access the private platform control center
                  </p>
                </div>
                <a
                  href="/admin"
                  className="px-4 py-2 rounded-2xl bg-[#7952D6] text-white text-xs font-bold hover:brightness-105 transition-all"
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
          {generatedLink && (
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(generatedLink)}`}
              alt="QR Code"
              className="w-44 h-44 rounded-2xl border p-2 bg-white"
            />
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
      </Modal>

    </div>
  );
}
