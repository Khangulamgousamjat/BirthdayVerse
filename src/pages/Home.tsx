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
  Wand2, 
  Smile, 
  Plus, 
  HelpCircle,
  Calendar,
  ExternalLink,
  BookOpen,
  Video,
  Users,
  Clock,
  ShieldCheck,
  Flame,
  Volume2
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar, NavView } from "@/components/layout/Sidebar";
import { MainDashboardView } from "@/components/dashboard/MainDashboardView";
import { LivePhonePreview } from "@/components/preview/LivePhonePreview";
import { TemplatesView } from "@/components/templates/TemplatesView";
import { MyWishesView, WishCardData } from "@/components/wishes/MyWishesView";
import { CalendarView } from "@/components/calendar/CalendarView";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { ExploreView } from "@/components/explore/ExploreView";
import { saveSurpriseData } from "@/lib/db";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// Step Definition (Board 1 Panel 3)
const STEPS = [
  { number: 1, title: "Experience", subtitle: "Choose format" },
  { number: 2, title: "Template", subtitle: "Pick visual style" },
  { number: 3, title: "Recipient", subtitle: "Who is this for?" },
  { number: 4, title: "Message (AI)", subtitle: "Write your wishes" },
  { number: 5, title: "Photos & Video", subtitle: "Add memories" },
  { number: 6, title: "Music", subtitle: "Choose soundtrack" },
  { number: 7, title: "Theme & Style", subtitle: "Colors & more" },
  { number: 8, title: "Preview & Publish", subtitle: "72h share link" },
];

// Experience Types (Board 1 Panel 3 & Board 2 Panel 2)
const EXPERIENCE_TYPES = [
  { id: "verse", title: "Birthday Verse", subtitle: "Full celebration experience", icon: "🎂", badge: "Recommended" },
  { id: "card", title: "Birthday Card", subtitle: "Simple & beautiful digital card", icon: "💌" },
  { id: "story", title: "Birthday Story", subtitle: "Story told from memories", icon: "📖" },
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

// Curated Music with Mood Categories (Board 1 Panel 6)
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

// AI Message Tone Presets (Board 1 Panel 4)
const AI_TONE_PRESETS = [
  { id: "emotional", name: "Emotional", text: "Today isn't just another day. It's a reminder of all the laughter, memories, and moments you've brought into our lives. You make ordinary days feel special. Here's to another beautiful chapter!" },
  { id: "funny", name: "Funny", text: "Happy Birthday! You're not getting older, you're just leveling up in style, wisdom, and overall brilliance. Here's to more crazy adventures and unforgettable moments ahead!" },
  { id: "poetic", name: "Poetic", text: "Like stars that brighten the midnight sky, you bring warmth and light to everyone around you. May your birthday be as luminous and magical as your spirit." },
  { id: "short", name: "Short & Sweet", text: "Wishing you the happiest birthday filled with love, laughter, and your favorite things. May your day be as special as you are!" },
  { id: "romantic", name: "Romantic", text: "To the one who holds my heart: every day with you is a gift, but today is the most special of all. Happy Birthday my love, here's to forever with you." },
];

export default function Home() {
  const [activeNav, setActiveNav] = useState<NavView>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
  const [experienceType, setExperienceType] = useState("verse");
  const [name, setName] = useState("Aanya");
  const [relationship, setRelationship] = useState("Friend");
  const [birthdayDate, setBirthdayDate] = useState("2026-09-20");
  const [nickname, setNickname] = useState("");
  const [vibe, setVibe] = useState("elegant");
  const [selectedTemplate, setSelectedTemplate] = useState("elegant");

  // Message & AI
  const [message, setMessage] = useState("May your day be filled with love, joy and all the happiness you deserve! ✨");
  const [finaleText, setFinaleText] = useState("HAPPY BIRTHDAY! 🎂");
  const [activeTone, setActiveTone] = useState("emotional");
  const [aiWritingMode, setAiWritingMode] = useState<"ai" | "manual">("ai");

  // Photos
  const [profilePhoto, setProfilePhoto] = useState<string | null>("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");
  const [extraPhotos, setExtraPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  ]);

  // Music
  const [selectedMusic, setSelectedMusic] = useState("Coldplay - A Sky Full of Stars");
  const [musicCategory, setMusicCategory] = useState("Popular");
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 72h Ephemeral Retention State (Part D §34)
  const [retentionMode, setRetentionMode] = useState<"72h" | "forever">("72h");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [shortId, setShortId] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [error, setError] = useState("");
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [reactionsCount, setReactionsCount] = useState<number | null>(null);

  // Synchronize Firestore view count
  useEffect(() => {
    if (!shortId) return;
    const docRef = doc(db, "surprises", shortId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setViewCount(data.view_count || 0);
        setReactionsCount(data.reactions || 0);
      }
    });
    return () => unsubscribe();
  }, [shortId]);

  // Photo handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfilePhoto(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddMemoryPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setExtraPhotos((prev) => [...prev, event.target!.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };

  // Audio Playback
  const toggleAudio = (trackPath?: string) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const track = trackPath || selectedMusic;

    if (track === "none") {
      audio.pause();
      setIsPlayingMusic(false);
      return;
    }

    if (isPlayingMusic) {
      audio.pause();
      setIsPlayingMusic(false);
    } else {
      let src = track;
      if (track === "Coldplay - A Sky Full of Stars") {
        src = "/funky groovin.mp3";
      }
      try {
        if (audio.src !== window.location.origin + src && audio.src !== src) {
          audio.src = src;
          audio.load();
        }
        audio.play().then(() => setIsPlayingMusic(true)).catch(() => setIsPlayingMusic(false));
      } catch {
        setIsPlayingMusic(false);
      }
    }
  };

  // Save & Publish
  const handlePublish = async () => {
    if (!name.trim()) {
      setCurrentStep(3);
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const payload = {
        body: message,
        finaleText: finaleText.trim() || "HAPPY BIRTHDAY! 🎂",
        selectedMusic: selectedMusic,
        vibe: vibe,
        theme: selectedTemplate,
        nickname: nickname,
        relationship: relationship,
        birthdayDate: birthdayDate,
        experienceType: experienceType,
        retentionMode: retentionMode,
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
        setCurrentStep(8);

        // Save to My Wishes list
        const newWish: WishCardData = {
          id: id,
          name: name,
          relationship: relationship,
          date: birthdayDate ? new Date(birthdayDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Sep 20",
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
      setError(err.message || "Failed to publish. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6FC] dark:bg-[#100C18] text-[#241B35] dark:text-[#F7F3FC] transition-colors duration-300">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeNav}
        onTabChange={(tab) => {
          setActiveNav(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Godmode App Shell Layout (Sidebar + Content) */}
      <div className="flex-1 flex w-full">
        
        {/* Persistent Side Panel (Part G §54 & Board 1/2) */}
        <Sidebar
          activeView={activeNav}
          onViewChange={(v) => {
            setActiveNav(v);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          expiringCount={1}
        />

        {/* Dynamic Route Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          
          {/* VIEW 1: MAIN DASHBOARD (Board 1 Panel 2) */}
          {activeNav === "dashboard" && (
            <MainDashboardView
              onCreateClick={() => {
                setActiveNav("create");
                setCurrentStep(1);
              }}
              onSelectRecipient={(recName, date, rel) => {
                setName(recName);
                if (rel) setRelationship(rel);
                setActiveNav("create");
                setCurrentStep(1);
              }}
              onViewWishes={() => setActiveNav("wishes")}
            />
          )}

          {/* VIEW 2: 8-STEP CREATOR STUDIO (Board 1 & 2) */}
          {activeNav === "create" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Two Column Studio Grid (Form on Left, Live Preview on Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Steps Rail & Decorative Gift (Cols 1-3) */}
                <div className="hidden lg:flex lg:col-span-3 flex-col gap-6 sticky top-24">
                  <div className="bg-white dark:bg-[#1D162A] rounded-2xl border border-[#EDE7F6] dark:border-[#2A203C] p-4 shadow-sm">
                    <div className="space-y-1">
                      {STEPS.map((step) => {
                        const isActive = currentStep === step.number;
                        const isDone = currentStep > step.number;
                        return (
                          <button
                            key={step.number}
                            onClick={() => setCurrentStep(step.number)}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                              isActive
                                ? "bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] font-bold shadow-2xs"
                                : "hover:bg-[#EDE7F6]/40 dark:hover:bg-[#251B35]/40 text-[#746B80] dark:text-[#B8AEC5]"
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isActive ? "bg-[#7952D6] text-white shadow-xs" : isDone ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/70" : "bg-gray-100 dark:bg-[#171122] text-gray-500"
                            }`}>
                              {isDone ? <Check className="w-3.5 h-3.5" /> : step.number}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold leading-none truncate">{step.title}</p>
                              <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5] mt-0.5 truncate">{step.subtitle}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Decorative Gift Card */}
                  <div className="rounded-2xl p-4 bg-gradient-to-br from-[#EDE7F6]/70 via-white to-[#FCE7F3]/70 dark:from-[#1D162A] dark:to-[#251B35] border border-[#EDE7F6] dark:border-[#2A203C] text-center">
                    <span className="text-3xl mb-1 block">🎁</span>
                    <p className="font-serif italic text-xs font-bold text-[#7952D6] dark:text-[#9D6BFF]">
                      Good People Make Birthdays Brighter 💜
                    </p>
                  </div>
                </div>

                {/* Center Form Editor (Cols 4-8) */}
                <div className="lg:col-span-5 bg-white dark:bg-[#1D162A] rounded-3xl border border-[#EDE7F6] dark:border-[#2A203C] p-6 sm:p-8 shadow-sm">
                  
                  {/* Step Progress Top Bar */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#7952D6] dark:text-[#9D6BFF]">
                      STEP {currentStep} OF 8: {STEPS[currentStep - 1]?.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#9D6BFF] to-[#7952D6] transition-all duration-300"
                          style={{ width: `${(currentStep / 8) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#746B80] dark:text-[#B8AEC5]">
                        {Math.round((currentStep / 8) * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* STEP 1: CHOOSE EXPERIENCE (Board 1 Panel 3) */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-1">
                          Choose Experience
                        </h2>
                        <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
                          What format would you like to create for them?
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {EXPERIENCE_TYPES.map((exp) => {
                          const isSelected = experienceType === exp.id;
                          return (
                            <button
                              key={exp.id}
                              onClick={() => setExperienceType(exp.id)}
                              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                                isSelected
                                  ? "border-[#9D6BFF] bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] shadow-xs scale-102"
                                  : "border-[#EDE7F6] dark:border-[#2A203C] hover:border-[#9D6BFF]/40 bg-white dark:bg-[#171122] text-[#241B35] dark:text-[#F7F3FC]"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-2xl">{exp.icon}</span>
                                {exp.badge && (
                                  <span className="text-[9px] font-bold bg-[#9D6BFF] text-white px-1.5 py-0.5 rounded-md">
                                    {exp.badge}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="text-xs font-bold leading-tight">{exp.title}</p>
                                <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5] mt-0.5 leading-snug">{exp.subtitle}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-4 flex justify-end border-t border-[#EDE7F6] dark:border-[#251B35]">
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="bv-gradient-btn px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                        >
                          <span>Next</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: TEMPLATE SELECTION */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-1">
                          Select Template
                        </h2>
                        <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
                          Choose the celebration atmosphere.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: "elegant", name: "Golden Elegance", icon: "👑", desc: "Lavender gold luxury" },
                          { id: "dreamy", name: "Dreamy Starlight", icon: "🌙", desc: "Pastel purple skies" },
                          { id: "romantic", name: "Sweet Romance", icon: "💖", desc: "Warm rose petals" },
                          { id: "fun", name: "Confetti Fiesta", icon: "🎉", desc: "Vibrant high energy" },
                          { id: "cute", name: "Pastel Sweetness", icon: "🎀", desc: "Adorable balloons" },
                          { id: "party", name: "Midnight Disco", icon: "🕺", desc: "Neon club vibes" },
                        ].map((t) => (
                          <div
                            key={t.id}
                            onClick={() => { setSelectedTemplate(t.id); setVibe(t.id); }}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                              selectedTemplate === t.id
                                ? "border-[#9D6BFF] bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] shadow-xs"
                                : "border-[#EDE7F6] dark:border-[#2A203C] hover:border-[#9D6BFF]/40 bg-white dark:bg-[#171122]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-2xl">{t.icon}</span>
                              {selectedTemplate === t.id && <Check className="w-4 h-4 text-[#7952D6] dark:text-[#9D6BFF]" />}
                            </div>
                            <p className="text-xs font-bold text-[#241B35] dark:text-[#F7F3FC]">{t.name}</p>
                            <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">{t.desc}</p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-[#EDE7F6] dark:border-[#251B35]">
                        <button onClick={() => setCurrentStep(1)} className="text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] hover:underline cursor-pointer">
                          ← Back
                        </button>
                        <button onClick={() => setCurrentStep(3)} className="bv-gradient-btn px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md">
                          <span>Next</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: RECIPIENT DETAILS (Board 2 Panel 4) */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-1">
                          Who is this for?
                        </h2>
                        <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
                          Tell us about the person you're celebrating.
                        </p>
                      </div>

                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">
                          Recipient Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Aanya"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#2A203C] text-sm text-[#241B35] dark:text-[#F7F3FC] focus:ring-2 focus:ring-[#9D6BFF]/40 focus:outline-none"
                        />
                      </div>

                      {/* Relationship & Birthday Date (Board 2 Panel 4) */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">Relationship</label>
                          <select
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#2A203C] text-xs text-[#241B35] dark:text-[#F7F3FC] focus:outline-none"
                          >
                            <option value="Friend">Friend 💜</option>
                            <option value="Best Friend">Best Friend ✨</option>
                            <option value="Partner">Partner ❤️</option>
                            <option value="Sister">Sister 🌸</option>
                            <option value="Brother">Brother ⚡</option>
                            <option value="Mother">Mother 💐</option>
                            <option value="Father">Father 🌟</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">Birthday Date</label>
                          <input
                            type="date"
                            value={birthdayDate}
                            onChange={(e) => setBirthdayDate(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#2A203C] text-[#241B35] dark:text-[#F7F3FC] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Upload Photo with Tooltip */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">Profile Photo (Optional)</label>
                        <div className="flex items-center gap-4">
                          <label className="flex-1 border-2 border-dashed border-[#EDE7F6] dark:border-[#2A203C] hover:border-[#9D6BFF] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-[#F8F6FC]/50 dark:bg-[#171122]/50">
                            <Upload className="w-5 h-5 text-[#9D6BFF] mb-1" />
                            <span className="text-xs font-semibold">Upload Photo</span>
                            <span className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">JPG, PNG up to 5MB</span>
                            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                          </label>

                          {profilePhoto && (
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#9D6BFF]">
                              <img src={profilePhoto} alt="Recipient" className="w-full h-full object-cover" />
                              <button onClick={() => setProfilePhoto(null)} className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-white cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-[#EDE7F6] dark:border-[#251B35]">
                        <button onClick={() => setCurrentStep(2)} className="text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] hover:underline cursor-pointer">
                          ← Back
                        </button>
                        <button onClick={() => setCurrentStep(4)} className="bv-gradient-btn px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md">
                          <span>Next</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: AI BIRTHDAY WRITER (Board 1 Panel 4) */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-1">
                          Message & AI Writer
                        </h2>
                        <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
                          Write with AI or craft your personal words.
                        </p>
                      </div>

                      {/* AI vs Manual Toggle */}
                      <div className="flex p-1 rounded-xl bg-[#EDE7F6] dark:bg-[#251B35] max-w-xs">
                        <button
                          onClick={() => setAiWritingMode("ai")}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                            aiWritingMode === "ai" ? "bg-white dark:bg-[#1D162A] text-[#7952D6] dark:text-[#9D6BFF] shadow-xs" : "text-[#746B80] dark:text-[#B8AEC5]"
                          }`}
                        >
                          ✨ Write with AI
                        </button>
                        <button
                          onClick={() => setAiWritingMode("manual")}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                            aiWritingMode === "manual" ? "bg-white dark:bg-[#1D162A] text-[#7952D6] dark:text-[#9D6BFF] shadow-xs" : "text-[#746B80] dark:text-[#B8AEC5]"
                          }`}
                        >
                          ✍️ Write Manually
                        </button>
                      </div>

                      {/* AI Tone Pills (Board 1 Panel 4) */}
                      {aiWritingMode === "ai" && (
                        <div className="space-y-2">
                          <span className="text-[11px] font-semibold text-[#746B80] dark:text-[#B8AEC5]">
                            Select AI Tone:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {AI_TONE_PRESETS.map((preset) => (
                              <button
                                key={preset.id}
                                onClick={() => {
                                  setActiveTone(preset.id);
                                  setMessage(preset.text);
                                }}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${
                                  activeTone === preset.id
                                    ? "bg-[#7952D6] text-white shadow-xs"
                                    : "bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] hover:bg-purple-200"
                                }`}
                              >
                                {preset.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Message Textarea */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">Your Birthday Message</label>
                          <span className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">{message.length}/500</span>
                        </div>
                        <textarea
                          rows={5}
                          maxLength={500}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full p-3.5 rounded-2xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#2A203C] text-xs text-[#241B35] dark:text-[#F7F3FC] focus:ring-2 focus:ring-[#9D6BFF]/40 focus:outline-none resize-none leading-relaxed"
                        />
                      </div>

                      {/* Finale Greeting */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">Finale Headline</label>
                        <input
                          type="text"
                          value={finaleText}
                          onChange={(e) => setFinaleText(e.target.value)}
                          placeholder="HAPPY BIRTHDAY! 🎂"
                          className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#2A203C] text-[#241B35] dark:text-[#F7F3FC]"
                        />
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-[#EDE7F6] dark:border-[#251B35]">
                        <button onClick={() => setCurrentStep(3)} className="text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] hover:underline cursor-pointer">
                          ← Back
                        </button>
                        <button onClick={() => setCurrentStep(5)} className="bv-gradient-btn px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md">
                          <span>Next</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: PHOTOS & VIDEOS GALLERY (Board 1 Panel 5) */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-1">
                          Add your memories
                        </h2>
                        <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
                          Upload photos and videos to make it special.
                        </p>
                      </div>

                      {/* Photos Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        {profilePhoto && (
                          <div className="relative rounded-2xl overflow-hidden aspect-square border-2 border-[#9D6BFF] shadow-xs">
                            <img src={profilePhoto} alt="Cover" className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 left-1 bg-purple-600 text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold">Cover</span>
                          </div>
                        )}

                        {extraPhotos.map((p, i) => (
                          <div key={i} className="relative group rounded-2xl overflow-hidden aspect-square border border-[#EDE7F6] dark:border-[#2A203C]">
                            <img src={p} alt={`Memory ${i}`} className="w-full h-full object-cover" />
                            <button
                              onClick={() => setExtraPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}

                        {/* + Add Photos/Videos button card */}
                        <label className="border-2 border-dashed border-[#EDE7F6] dark:border-[#2A203C] hover:border-[#9D6BFF] rounded-2xl aspect-square flex flex-col items-center justify-center p-2 text-center cursor-pointer bg-[#F8F6FC]/50 dark:bg-[#171122]/50">
                          <Plus className="w-5 h-5 text-[#9D6BFF] mb-1" />
                          <span className="text-[11px] font-bold">+ Add Photos</span>
                          <input type="file" accept="image/*" onChange={handleAddMemoryPhoto} className="hidden" />
                        </label>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-[#EDE7F6] dark:border-[#251B35]">
                        <button onClick={() => setCurrentStep(4)} className="text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] hover:underline cursor-pointer">
                          ← Back
                        </button>
                        <button onClick={() => setCurrentStep(6)} className="bv-gradient-btn px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md">
                          <span>Next</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 6: MUSIC SELECTION (Board 1 Panel 6) */}
                  {currentStep === 6 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-1">
                          Choose soundtrack
                        </h2>
                        <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
                          Pick the mood soundtrack or upload your own.
                        </p>
                      </div>

                      {/* Music Categories Tabs (Board 1 Panel 6) */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {SOUNDTRACK_CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setMusicCategory(cat)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                              musicCategory === cat
                                ? "bg-[#7952D6] text-white shadow-2xs"
                                : "bg-[#EDE7F6] dark:bg-[#251B35] text-[#746B80] dark:text-[#B8AEC5]"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Track Items */}
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {SOUNDTRACKS.filter(t => musicCategory === "Popular" || t.category === musicCategory || musicCategory === "Upload").map((track) => {
                          const isSelected = selectedMusic === track.id;
                          return (
                            <div
                              key={track.id}
                              onClick={() => { setSelectedMusic(track.id); toggleAudio(track.id); }}
                              className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                                isSelected ? "border-[#9D6BFF] bg-[#EDE7F6]/60 dark:bg-[#251B35]" : "border-[#EDE7F6] dark:border-[#2A203C] hover:bg-gray-50 dark:hover:bg-[#171122]"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setSelectedMusic(track.id); toggleAudio(track.id); }}
                                  className="w-7 h-7 rounded-full bg-[#7952D6] text-white flex items-center justify-center cursor-pointer"
                                >
                                  {isSelected && isPlayingMusic ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                                </button>
                                <div>
                                  <p className="text-xs font-bold text-[#241B35] dark:text-[#F7F3FC]">{track.title}</p>
                                  <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">{track.artist}</p>
                                </div>
                              </div>
                              <span className="text-xs font-mono text-[#746B80] dark:text-[#B8AEC5]">{track.duration}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-[#EDE7F6] dark:border-[#251B35]">
                        <button onClick={() => setCurrentStep(5)} className="text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] hover:underline cursor-pointer">
                          ← Back
                        </button>
                        <button onClick={() => setCurrentStep(7)} className="bv-gradient-btn px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md">
                          <span>Next</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 7: THEME & CUSTOMIZE */}
                  {currentStep === 7 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-1">
                          Theme & Customization
                        </h2>
                        <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
                          Fine-tune colors, animations, and vibes.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">Vibe Palette</label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {VIBES.map((v) => (
                            <button
                              key={v.id}
                              onClick={() => setVibe(v.id)}
                              className={`p-2 rounded-xl border text-center flex flex-col items-center cursor-pointer ${
                                vibe === v.id ? "border-[#9D6BFF] bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6]" : "border-[#EDE7F6] dark:border-[#2A203C]"
                              }`}
                            >
                              <span className="mb-1">{v.icon}</span>
                              <span className="text-[10px] font-bold">{v.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 flex items-center justify-between border-t border-[#EDE7F6] dark:border-[#251B35]">
                        <button onClick={() => setCurrentStep(6)} className="text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] hover:underline cursor-pointer">
                          ← Back
                        </button>
                        <button onClick={() => setCurrentStep(8)} className="bv-gradient-btn px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md">
                          <span>Next</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 8: PREVIEW & 72H EPHEMERAL PUBLISH (Part D §34) */}
                  {currentStep === 8 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-1">
                          Publish & Share
                        </h2>
                        <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
                          Instant private link with our 72-hour privacy promise.
                        </p>
                      </div>

                      {/* 72h Ephemeral Retention Toggle (Part D §34) */}
                      <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#7952D6] dark:text-[#9D6BFF]" />
                            <span className="text-xs font-bold text-[#7952D6] dark:text-[#9D6BFF]">
                              Retention Policy
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-[#7952D6] text-white text-[10px] font-bold">
                            {retentionMode === "72h" ? "Auto-delete in 72h" : "Kept forever"}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#746B80] dark:text-[#B8AEC5] leading-relaxed">
                          By default, this verse and all uploaded photos will permanently delete in 72 hours for privacy.
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
                            <span>Auto-delete in 72h (Free default)</span>
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

                      {/* Link Ready Card */}
                      {generatedLink ? (
                        <div className="space-y-4 pt-2">
                          <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#2A203C]">
                            <input
                              type="text"
                              readOnly
                              value={generatedLink}
                              className="flex-1 bg-transparent px-2 text-xs font-mono select-all truncate outline-none"
                            />
                            <button
                              onClick={copyLink}
                              className="bv-gradient-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copied ? "Copied" : "Copy"}</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => {
                                const text = encodeURIComponent(`🎉 A special birthday surprise for you! Open here: ${generatedLink}`);
                                window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
                              }}
                              className="py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <span>WhatsApp</span>
                            </button>
                            <button
                              onClick={() => setShowQrModal(!showQrModal)}
                              className="py-2.5 rounded-xl bg-white dark:bg-[#251B35] border border-[#EDE7F6] dark:border-[#2A203C] text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>QR Code</span>
                            </button>
                            <a
                              href={generatedLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-2.5 rounded-xl bg-[#7952D6] text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <span>Open</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>

                          {showQrModal && (
                            <div className="p-4 rounded-2xl bg-white dark:bg-[#1D162A] border border-purple-200 flex flex-col items-center gap-2">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(generatedLink)}`}
                                alt="QR Code"
                                className="w-32 h-32 rounded-lg"
                              />
                              <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">Scan with phone to open</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="pt-2">
                          <button
                            onClick={handlePublish}
                            disabled={isGenerating}
                            className="bv-gradient-btn w-full py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/25"
                          >
                            {isGenerating ? (
                              <>
                                <Sparkles className="w-4 h-4 animate-spin" />
                                <span>Crafting Your Verse...</span>
                              </>
                            ) : (
                              <>
                                <span>Publish Birthday Verse</span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      <div className="pt-4 flex items-center justify-between border-t border-[#EDE7F6] dark:border-[#251B35]">
                        <button onClick={() => setCurrentStep(7)} className="text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] hover:underline cursor-pointer">
                          ← Back
                        </button>
                        {generatedLink && (
                          <button
                            onClick={() => { setCurrentStep(1); setGeneratedLink(""); }}
                            className="text-xs font-bold text-[#7952D6] dark:text-[#9D6BFF] hover:underline cursor-pointer"
                          >
                            Create Another
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                </div>

                {/* Right Live Phone Preview (Cols 9-12) */}
                <div className="lg:col-span-4 flex justify-center sticky top-24">
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
                    onToggleMusic={() => toggleAudio()}
                    onChangeTemplateClick={() => setCurrentStep(2)}
                  />
                </div>

              </div>

            </div>
          )}

          {/* VIEW 3: TEMPLATES GALLERY */}
          {activeNav === "templates" && (
            <TemplatesView
              selectedTemplateId={selectedTemplate}
              searchQuery={searchQuery}
              onSelectTemplate={(tId) => {
                setSelectedTemplate(tId);
                setVibe(tId);
                setActiveNav("create");
                setCurrentStep(3);
              }}
            />
          )}

          {/* VIEW 4: MY VERSES DASHBOARD */}
          {activeNav === "wishes" && (
            <MyWishesView
              onCreateNew={() => {
                setActiveNav("create");
                setCurrentStep(1);
              }}
              onEditWish={(w) => {
                setName(w.name);
                if (w.relationship) setRelationship(w.relationship);
                setActiveNav("create");
                setCurrentStep(3);
              }}
            />
          )}

          {/* VIEW 5: CALENDAR (Part D §36-37) */}
          {activeNav === "calendar" && (
            <CalendarView
              onCreateForContact={(contactName, date, rel) => {
                setName(contactName);
                setRelationship(rel);
                setActiveNav("create");
                setCurrentStep(3);
              }}
            />
          )}

          {/* VIEW 6: ADMIN DASHBOARD (Board 1 Panel 9) */}
          {activeNav === "admin" && (
            <AdminDashboardView />
          )}

          {/* VIEW 7: EXPLORE & LANDING (Part B §3-4) */}
          {activeNav === "explore" && (
            <ExploreView
              onCreateClick={() => {
                setActiveNav("create");
                setCurrentStep(1);
              }}
              onExploreTemplatesClick={() => setActiveNav("templates")}
            />
          )}

          {/* VIEW 8: SETTINGS */}
          {activeNav === "settings" && (
            <div className="p-8 rounded-3xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] max-w-2xl mx-auto space-y-6">
              <h2 className="text-xl font-bold font-display text-[#241B35] dark:text-[#F7F3FC]">Account & Privacy Settings</h2>
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#F8F6FC] dark:bg-[#171122] flex justify-between items-center">
                  <div>
                    <p className="font-bold">72-Hour Default Auto-Purge</p>
                    <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">All links and media are permanently deleted after 72 hours.</p>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[10px]">Active</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8F6FC] dark:bg-[#171122] flex justify-between items-center">
                  <div>
                    <p className="font-bold">Subscription Plan</p>
                    <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">Free Plan (Upgrade to Plus for permanent retention)</p>
                  </div>
                  <button className="bv-gradient-btn px-3 py-1.5 rounded-lg font-bold text-[10px]">Upgrade</button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Hidden Audio Player for Preview */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlayingMusic(false)}
        className="hidden"
        preload="none"
      />

    </div>
  );
}
