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
  ExternalLink
} from "lucide-react";
import { Navbar, NavTab } from "@/components/layout/Navbar";
import { LivePhonePreview } from "@/components/preview/LivePhonePreview";
import { TemplatesView } from "@/components/templates/TemplatesView";
import { MyWishesView, WishCardData } from "@/components/wishes/MyWishesView";
import { ExploreView } from "@/components/explore/ExploreView";
import { saveSurpriseData } from "@/lib/db";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// Steps Definition
const STEPS = [
  { number: 1, title: "Recipient", subtitle: "Who is this for?" },
  { number: 2, title: "Message", subtitle: "Write your wishes" },
  { number: 3, title: "Photos", subtitle: "Add memories" },
  { number: 4, title: "Music", subtitle: "Choose soundtrack" },
  { number: 5, title: "Theme", subtitle: "Pick a style" },
  { number: 6, title: "Customize", subtitle: "Colors & more" },
  { number: 7, title: "Preview", subtitle: "See your creation" },
  { number: 8, title: "Share", subtitle: "Get your link" },
];

const VIBES = [
  { id: "elegant", name: "Elegant", icon: <Crown className="w-4 h-4 text-amber-500" /> },
  { id: "fun", name: "Fun", icon: <PartyPopper className="w-4 h-4 text-orange-500" /> },
  { id: "romantic", name: "Romantic", icon: <Heart className="w-4 h-4 text-rose-500" /> },
  { id: "cute", name: "Cute", icon: <Gift className="w-4 h-4 text-pink-500" /> },
  { id: "dreamy", name: "Dreamy", icon: <Moon className="w-4 h-4 text-purple-500" /> },
  { id: "party", name: "Party", icon: <Music className="w-4 h-4 text-indigo-500" /> },
];

const SOUNDTRACKS = [
  { id: "/Happy Birthday Song.mp3", title: "Classic Happy Birthday", artist: "Birthdayverse", duration: "2:54" },
  { id: "/happy birthday slowed.mp3", title: "Happy Birthday (Lo-Fi Slowed)", artist: "Chill Mix", duration: "1:23" },
  { id: "Coldplay - A Sky Full of Stars", file: "/funky groovin.mp3", title: "A Sky Full of Stars", artist: "Coldplay", duration: "4:28" },
  { id: "/pianocafe.mp3", title: "Acoustic Piano Cafe", artist: "Acoustic Cafe", duration: "3:10" },
  { id: "/romantic.mp3", title: "Romantic Strings", artist: "Sweet Melodies", duration: "3:45" },
  { id: "/funky groovin.mp3", title: "Funky Groovin", artist: "Groove Party", duration: "2:15" },
  { id: "/playhouse.mp3", title: "Playhouse Celebration", artist: "Playful Pop", duration: "2:30" },
  { id: "none", title: "No Music (Silent)", artist: "Muted Experience", duration: "—" },
];

const SUGGESTED_MESSAGES = [
  {
    category: "Heartfelt",
    text: "Happy Birthday! May this upcoming year bring you endless laughter, peace, and dreams turned into reality. Thank you for being such an extraordinary presence in my life.",
  },
  {
    category: "Childhood Memory",
    text: "From silly childhood secrets to celebrating milestones together, every memory with you is pure gold. Wishing you the happiest birthday ever!",
  },
  {
    category: "Playful Banter",
    text: "Happy Birthday! You're not getting older, you're just leveling up in style, wisdom, and overall awesomeness. Here's to more crazy adventures ahead!",
  },
  {
    category: "Short & Sweet",
    text: "May your day be as bright, beautiful, and wonderful as your smile. Happy Birthday!",
  },
];

const POPULAR_TEMPLATES_STRIP = [
  { id: "elegant", name: "Elegant", bg: "from-[#2D1654] to-[#120824]", thumbText: "Golden Luxury" },
  { id: "dreamy", name: "Dreamy", bg: "from-[#4338CA] to-[#C084FC]", thumbText: "Clouds & Stars" },
  { id: "classic", name: "Classic", bg: "from-[#854D0E] to-[#CA8A04]", thumbText: "Timeless Gold" },
  { id: "minimal", name: "Minimal", bg: "from-[#374151] to-[#6B7280]", thumbText: "Modern Clean" },
  { id: "floral", name: "Floral", bg: "from-[#BE123C] to-[#FDA4AF]", thumbText: "Blossom Pink" },
  { id: "party", name: "Party", bg: "from-[#1E1B4B] to-[#701A75]", thumbText: "Neon Disco" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>("create");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
  const [name, setName] = useState("Ananya");
  const [relationship, setRelationship] = useState("Friend");
  const [nickname, setNickname] = useState("");
  const [vibe, setVibe] = useState("elegant");
  const [message, setMessage] = useState("May your day be as special and beautiful as you are! ✨");
  const [finaleText, setFinaleText] = useState("HAPPY BIRTHDAY! 🎂");
  
  // Photos
  const [profilePhoto, setProfilePhoto] = useState<string | null>("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");
  const [extraPhotos, setExtraPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  ]);
  const [imageError, setImageError] = useState("");

  // Music
  const [selectedMusic, setSelectedMusic] = useState("/Happy Birthday Song.mp3");
  const [musicSearch, setMusicSearch] = useState("");
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicError, setMusicError] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Customization
  const [selectedTemplate, setSelectedTemplate] = useState("elegant");
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "auto">("light");
  const [accentColor, setAccentColor] = useState("purple");
  const [backgroundStyle, setBackgroundStyle] = useState("mist");
  const [animationStyle, setAnimationStyle] = useState("magical");

  // Publishing State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [shortId, setShortId] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [reactionsCount, setReactionsCount] = useState<number | null>(null);

  // Synchronize Firestore view / reaction counts
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

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 800;

        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL("image/jpeg", 0.7);
        setProfilePhoto(compressed);
        setImageError("");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle Additional Memory Photo
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

  // Generate & Publish Birthday Experience
  const handlePublish = async () => {
    if (!name.trim()) {
      setCurrentStep(1);
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

        // Also save to user's saved wishes history
        const newWish: WishCardData = {
          id: id,
          name: name,
          relationship: relationship,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          status: "Published",
          url: `/surprise/${id}`,
          views: 0,
          reactions: 0,
        };

        const existingWishes = localStorage.getItem("birthdayverse_my_wishes");
        const list = existingWishes ? JSON.parse(existingWishes) : [];
        localStorage.setItem("birthdayverse_my_wishes", JSON.stringify([newWish, ...list]));
      }
    } catch (err: any) {
      setError(err.message || "Failed to publish birthday surprise. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`🎉 I made a magical birthday surprise for you! Open it here: ${generatedLink}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Birthday Surprise for ${name}! 🎂`,
        text: `Open this magical Birthdayverse experience created for ${name}!`,
        url: generatedLink,
      }).catch(() => {});
    } else {
      copyLink();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6FC] dark:bg-[#100C18] text-[#241B35] dark:text-[#F7F3FC] transition-colors duration-300">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: CREATOR WORKSPACE (Default) */}
        {activeTab === "create" && (
          <div className="flex flex-col gap-8">
            
            {/* Top 2-Column Main Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT RAIL: Steps 1 to 8 + Bottom Decorative Gift (Cols 1-3) */}
              <div className="hidden lg:flex lg:col-span-3 flex-col gap-6 sticky top-24">
                <div className="bg-white dark:bg-[#1D162A] rounded-2xl border border-[#EDE7F6] dark:border-[#2A203C] p-4 shadow-sm">
                  <div className="space-y-1.5">
                    {STEPS.map((step) => {
                      const isActive = currentStep === step.number;
                      const isDone = currentStep > step.number;

                      return (
                        <button
                          key={step.number}
                          onClick={() => setCurrentStep(step.number)}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                            isActive
                              ? "bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] font-bold shadow-2xs"
                              : "hover:bg-[#EDE7F6]/40 dark:hover:bg-[#251B35]/40 text-[#746B80] dark:text-[#B8AEC5]"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isActive
                                ? "bg-[#7952D6] text-white shadow-sm shadow-purple-500/30 scale-105"
                                : isDone
                                ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400"
                                : "bg-gray-100 dark:bg-[#171122] text-gray-500"
                            }`}
                          >
                            {isDone ? <Check className="w-3.5 h-3.5" /> : step.number}
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-bold leading-none truncate">
                              {step.title}
                            </p>
                            <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5] mt-0.5 truncate">
                              {step.subtitle}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Left Decorative Box (from mockup image) */}
                <div className="relative rounded-2xl p-5 bg-gradient-to-br from-[#EDE7F6]/80 via-white/80 to-[#FCE7F3]/80 dark:from-[#1D162A] dark:to-[#251B35] border border-[#EDE7F6] dark:border-[#2A203C] shadow-sm flex flex-col items-center text-center overflow-hidden">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#9D6BFF] to-[#F47FB5] p-1 flex items-center justify-center text-3xl shadow-md shadow-purple-500/20 mb-3 transform hover:rotate-6 transition-transform">
                    🎁
                  </div>
                  <p className="font-serif italic text-sm font-bold text-[#7952D6] dark:text-[#9D6BFF] leading-relaxed">
                    Good People <br />
                    Make Birthdays <br />
                    Brighter 💜
                  </p>
                </div>
              </div>

              {/* CENTER COLUMN: Editor / Form (Cols 4-7) */}
              <div className="lg:col-span-5 bg-white dark:bg-[#1D162A] rounded-3xl border border-[#EDE7F6] dark:border-[#2A203C] p-6 sm:p-8 shadow-sm">
                
                {/* Step Indicator Header */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#7952D6] dark:text-[#9D6BFF]">
                      STEP {currentStep} OF 8
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-28 sm:w-36 bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#9D6BFF] to-[#7952D6] transition-all duration-300"
                        style={{ width: `${(currentStep / 8) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-[#746B80] dark:text-[#B8AEC5]">
                      {Math.round((currentStep / 8) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Dynamic Step Content */}
                {currentStep === 1 && (
                  /* STEP 1: Who are you celebrating? */
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-1">
                        Who are you celebrating?
                      </h2>
                      <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
                        Let's start with the basics.
                      </p>
                    </div>

                    {/* Recipient Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC] flex items-center gap-1">
                        Recipient's name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#746B80] dark:text-[#B8AEC5]" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Ananya"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#2A203C] text-sm font-medium text-[#241B35] dark:text-[#F7F3FC] focus:ring-2 focus:ring-[#9D6BFF]/40 focus:outline-none transition-all"
                        />
                      </div>
                      <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">
                        This will appear on their birthday page.
                      </p>
                    </div>

                    {/* Relationship & Nickname Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">
                          Relationship
                        </label>
                        <select
                          value={relationship}
                          onChange={(e) => setRelationship(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#2A203C] text-xs font-medium text-[#241B35] dark:text-[#F7F3FC] focus:ring-2 focus:ring-[#9D6BFF]/40 focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="Friend">Friend 💜</option>
                          <option value="Best Friend">Best Friend ✨</option>
                          <option value="Partner">Partner / Spouse ❤️</option>
                          <option value="Sister">Sister 🌸</option>
                          <option value="Brother">Brother ⚡</option>
                          <option value="Mother">Mother 💐</option>
                          <option value="Father">Father 🌟</option>
                          <option value="Colleague">Colleague ☕</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">
                          Nickname <span className="text-[#746B80] dark:text-[#B8AEC5] font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <Wand2 className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#746B80] dark:text-[#B8AEC5]" />
                          <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="e.g. Anu"
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#2A203C] text-xs font-medium text-[#241B35] dark:text-[#F7F3FC] focus:ring-2 focus:ring-[#9D6BFF]/40 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Upload Profile Photo */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">
                        Upload a profile photo <span className="text-[#746B80] dark:text-[#B8AEC5] font-normal">(Optional)</span>
                      </label>
                      
                      <div className="flex items-center gap-4">
                        <label className="flex-1 border-2 border-dashed border-[#EDE7F6] dark:border-[#2A203C] hover:border-[#9D6BFF] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#F8F6FC]/50 dark:bg-[#171122]/50">
                          <Upload className="w-5 h-5 text-[#9D6BFF] mb-1" />
                          <p className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">
                            Click to upload <span className="text-[#746B80] dark:text-[#B8AEC5] font-normal">or drag & drop</span>
                          </p>
                          <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">JPG, PNG up to 5MB</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>

                        {/* Avatar preview with speech bubble */}
                        {profilePhoto && (
                          <div className="relative flex items-center gap-3">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#9D6BFF] shadow-sm">
                              <img src={profilePhoto} alt="Recipient" className="w-full h-full object-cover" />
                              <button
                                onClick={() => setProfilePhoto(null)}
                                className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                                title="Remove photo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Cute Speech Bubble from reference mock */}
                            <div className="hidden sm:block text-[10px] font-serif italic text-[#7952D6] dark:text-[#9D6BFF] bg-[#EDE7F6] dark:bg-[#251B35] px-2.5 py-1.5 rounded-xl shadow-xs border border-purple-200 dark:border-purple-900">
                              Add a photo to make <br /> it extra special! 💜
                            </div>
                          </div>
                        )}
                      </div>
                      {imageError && <p className="text-xs text-red-500">{imageError}</p>}
                    </div>

                    {/* Choose a vibe (Cards) */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">
                        Choose a vibe <span className="text-[#746B80] dark:text-[#B8AEC5] font-normal">(Optional)</span>
                      </label>
                      <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5] -mt-1">
                        This helps us suggest the perfect design and music.
                      </p>

                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                        {VIBES.map((v) => {
                          const isSelected = vibe === v.id;
                          return (
                            <button
                              key={v.id}
                              onClick={() => setVibe(v.id)}
                              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? "border-[#9D6BFF] bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] shadow-xs scale-105"
                                  : "border-[#EDE7F6] dark:border-[#2A203C] hover:border-[#9D6BFF]/40 bg-white dark:bg-[#171122] text-[#746B80] dark:text-[#B8AEC5]"
                              }`}
                            >
                              <div className="mb-1">{v.icon}</div>
                              <span className="text-[11px] font-bold">{v.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="pt-4 flex items-center justify-between border-t border-[#EDE7F6] dark:border-[#251B35]">
                      <div></div>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="bv-gradient-btn px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  /* STEP 2: Write your message */
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-1">
                        Write your message
                      </h2>
                      <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
                        Express what makes them so special to you.
                      </p>
                    </div>

                    {/* AI Suggestions Pills */}
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-[#7952D6] dark:text-[#9D6BFF] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Suggested Message Starters</span>
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {SUGGESTED_MESSAGES.map((sug, idx) => (
                          <button
                            key={idx}
                            onClick={() => setMessage(sug.text)}
                            className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] hover:bg-[#9D6BFF] hover:text-white transition-all cursor-pointer"
                          >
                            + {sug.category}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message Area */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">
                          Your Personal Message
                        </label>
                        <span className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">
                          {message.length} / 500 characters
                        </span>
                      </div>
                      <textarea
                        rows={5}
                        maxLength={500}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write something heartfelt, funny, or memorable..."
                        className="w-full p-3.5 rounded-2xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#2A203C] text-sm text-[#241B35] dark:text-[#F7F3FC] focus:ring-2 focus:ring-[#9D6BFF]/40 focus:outline-none transition-all leading-relaxed resize-none"
                      />
                    </div>

                    {/* Finale Climax Greeting */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">
                        Finale Climax Greeting
                      </label>
                      <input
                        type="text"
                        value={finaleText}
                        onChange={(e) => setFinaleText(e.target.value)}
                        placeholder="HAPPY BIRTHDAY! 🎂"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#2A203C] text-xs font-medium text-[#241B35] dark:text-[#F7F3FC] focus:ring-2 focus:ring-[#9D6BFF]/40 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Navigation Buttons */}
                    <div className="pt-4 flex items-center justify-between border-t border-[#EDE7F6] dark:border-[#251B35]">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="px-4 py-2 rounded-full text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] hover:bg-gray-100 dark:hover:bg-[#251B35] cursor-pointer"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="bv-gradient-btn px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  /* STEP 3: Add memories */
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-1">
                        Add memories
                      </h2>
                      <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
                        Upload photos to showcase as floating polaroid cards.
                      </p>
                    </div>

                    {/* Photo Memories Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {/* Primary Photo */}
                      {profilePhoto && (
                        <div className="relative group rounded-2xl overflow-hidden aspect-square border-2 border-[#9D6BFF] shadow-sm">
                          <img src={profilePhoto} alt="Memory 1" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <span className="text-[10px] text-white font-bold bg-purple-600 px-2 py-0.5 rounded-md">Cover</span>
                          </div>
                        </div>
                      )}

                      {/* Extra Photos */}
                      {extraPhotos.map((photo, i) => (
                        <div key={i} className="relative group rounded-2xl overflow-hidden aspect-square border border-[#EDE7F6] dark:border-[#2A203C] shadow-sm">
                          <img src={photo} alt={`Memory ${i + 2}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => setExtraPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {/* Add Photo Button Card */}
                      <label className="border-2 border-dashed border-[#EDE7F6] dark:border-[#2A203C] hover:border-[#9D6BFF] rounded-2xl aspect-square flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors bg-[#F8F6FC]/50 dark:bg-[#171122]/50">
                        <Plus className="w-6 h-6 text-[#9D6BFF] mb-1" />
                        <span className="text-xs font-bold text-[#241B35] dark:text-[#F7F3FC]">Add Photo</span>
                        <span className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">Up to 5 photos</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAddMemoryPhoto}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="pt-4 flex items-center justify-between border-t border-[#EDE7F6] dark:border-[#251B35]">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="px-4 py-2 rounded-full text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] hover:bg-gray-100 dark:hover:bg-[#251B35] cursor-pointer"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => setCurrentStep(4)}
                        className="bv-gradient-btn px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  /* STEP 4: Choose music */
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-1">
                        Choose their soundtrack
                      </h2>
                      <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
                        Select music that sets the emotional tone for their special day.
                      </p>
                    </div>

                    {/* Search Music */}
                    <input
                      type="text"
                      placeholder="Search tracks..."
                      value={musicSearch}
                      onChange={(e) => setMusicSearch(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#2A203C] text-xs text-[#241B35] dark:text-[#F7F3FC] focus:ring-2 focus:ring-[#9D6BFF]/40 focus:outline-none"
                    />

                    {/* Soundtracks List */}
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {SOUNDTRACKS.filter((t) =>
                        t.title.toLowerCase().includes(musicSearch.toLowerCase()) ||
                        t.artist.toLowerCase().includes(musicSearch.toLowerCase())
                      ).map((track) => {
                        const isSelected = selectedMusic === track.id;
                        return (
                          <div
                            key={track.id}
                            onClick={() => {
                              setSelectedMusic(track.id);
                              toggleAudio(track.id);
                            }}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? "border-[#9D6BFF] bg-[#EDE7F6]/60 dark:bg-[#251B35] shadow-xs"
                                : "border-[#EDE7F6] dark:border-[#2A203C] hover:bg-gray-50 dark:hover:bg-[#171122]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMusic(track.id);
                                  toggleAudio(track.id);
                                }}
                                className="w-8 h-8 rounded-full bg-[#7952D6] text-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                              >
                                {isSelected && isPlayingMusic ? (
                                  <Pause className="w-3.5 h-3.5" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 ml-0.5" />
                                )}
                              </button>

                              <div>
                                <p className="text-xs font-bold text-[#241B35] dark:text-[#F7F3FC]">
                                  {track.title}
                                </p>
                                <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">
                                  {track.artist}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[11px] font-mono text-[#746B80] dark:text-[#B8AEC5]">
                                {track.duration}
                              </span>
                              {isSelected && (
                                <span className="px-2 py-0.5 rounded-full bg-[#9D6BFF] text-white text-[10px] font-bold">
                                  ✓ Selected
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="pt-4 flex items-center justify-between border-t border-[#EDE7F6] dark:border-[#251B35]">
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="px-4 py-2 rounded-full text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] hover:bg-gray-100 dark:hover:bg-[#251B35] cursor-pointer"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => setCurrentStep(5)}
                        className="bv-gradient-btn px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  /* STEP 5: Choose a style */
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-1">
                        Choose a style
                      </h2>
                      <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
                        Pick from our curated emotional celebration templates.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "elegant", name: "Golden Elegance", icon: "👑", desc: "Lavender gold luxury" },
                        { id: "romantic", name: "Sweet Romance", icon: "💖", desc: "Rose petal warmth" },
                        { id: "fun", name: "Confetti Fiesta", icon: "🎉", desc: "Vibrant high energy" },
                        { id: "cute", name: "Pastel Sweetness", icon: "🎀", desc: "Playful balloons" },
                        { id: "dreamy", name: "Dreamy Starlight", icon: "🌙", desc: "Pastel celestial" },
                        { id: "party", name: "Midnight Disco", icon: "🕺", desc: "Neon club vibes" },
                      ].map((tmpl) => {
                        const isSelected = selectedTemplate === tmpl.id;
                        return (
                          <div
                            key={tmpl.id}
                            onClick={() => setSelectedTemplate(tmpl.id)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? "border-[#9D6BFF] bg-[#EDE7F6]/80 dark:bg-[#251B35] shadow-xs scale-102"
                                : "border-[#EDE7F6] dark:border-[#2A203C] hover:border-[#9D6BFF]/50 bg-white dark:bg-[#171122]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-2xl">{tmpl.icon}</span>
                              {isSelected && <Check className="w-4 h-4 text-[#7952D6] dark:text-[#9D6BFF]" />}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#241B35] dark:text-[#F7F3FC]">{tmpl.name}</p>
                              <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">{tmpl.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="pt-4 flex items-center justify-between border-t border-[#EDE7F6] dark:border-[#251B35]">
                      <button
                        onClick={() => setCurrentStep(4)}
                        className="px-4 py-2 rounded-full text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] hover:bg-gray-100 dark:hover:bg-[#251B35] cursor-pointer"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => setCurrentStep(6)}
                        className="bv-gradient-btn px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  /* STEP 6: Customize (Colors & Appearance) */
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-1">
                        Customize Appearance
                      </h2>
                      <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
                        Fine-tune theme modes, accents, and visual animation levels.
                      </p>
                    </div>

                    {/* Theme Mode */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">
                        Theme Mode
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["light", "dark", "auto"] as const).map((m) => (
                          <button
                            key={m}
                            onClick={() => setThemeMode(m)}
                            className={`py-2 rounded-xl text-xs font-bold capitalize border cursor-pointer ${
                              themeMode === m
                                ? "bg-[#7952D6] text-white border-transparent shadow-xs"
                                : "border-[#EDE7F6] dark:border-[#2A203C] text-[#746B80] dark:text-[#B8AEC5]"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">
                        Accent Color
                      </label>
                      <div className="flex items-center gap-3">
                        {[
                          { id: "purple", color: "#9D6BFF", name: "Lavender" },
                          { id: "pink", color: "#F47FB5", name: "Pink" },
                          { id: "gold", color: "#E7B85C", name: "Gold" },
                          { id: "mint", color: "#9AD8C2", name: "Mint" },
                        ].map((c) => (
                          <button
                            key={c.id}
                            onClick={() => setAccentColor(c.id)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-transform ${
                              accentColor === c.id ? "ring-2 ring-offset-2 ring-[#9D6BFF] scale-110 shadow-md" : "hover:scale-105"
                            }`}
                            style={{ backgroundColor: c.color }}
                            title={c.name}
                          >
                            {accentColor === c.id && <Check className="w-4 h-4 text-white" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Background Style */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">
                        Background Style
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {["mist", "gradient", "stars", "aurora"].map((bg) => (
                          <button
                            key={bg}
                            onClick={() => setBackgroundStyle(bg)}
                            className={`py-2 rounded-xl text-xs font-bold capitalize border cursor-pointer ${
                              backgroundStyle === bg
                                ? "bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] border-[#9D6BFF]"
                                : "border-[#EDE7F6] dark:border-[#2A203C] text-[#746B80] dark:text-[#B8AEC5]"
                            }`}
                          >
                            {bg}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Animation Style */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC]">
                        Animation Level
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["minimal", "magical", "celebration"].map((anim) => (
                          <button
                            key={anim}
                            onClick={() => setAnimationStyle(anim)}
                            className={`py-2 rounded-xl text-xs font-bold capitalize border cursor-pointer ${
                              animationStyle === anim
                                ? "bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] border-[#9D6BFF]"
                                : "border-[#EDE7F6] dark:border-[#2A203C] text-[#746B80] dark:text-[#B8AEC5]"
                            }`}
                          >
                            {anim}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="pt-4 flex items-center justify-between border-t border-[#EDE7F6] dark:border-[#251B35]">
                      <button
                        onClick={() => setCurrentStep(5)}
                        className="px-4 py-2 rounded-full text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] hover:bg-gray-100 dark:hover:bg-[#251B35] cursor-pointer"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => setCurrentStep(7)}
                        className="bv-gradient-btn px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 7 && (
                  /* STEP 7: Preview before publishing */
                  <div className="space-y-6 text-center">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-1">
                        Preview Full Experience
                      </h2>
                      <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
                        Check how everything looks and sounds in the Live Preview.
                      </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-[#EDE7F6]/50 dark:bg-[#251B35]/50 border border-purple-200 dark:border-purple-900/50 flex flex-col items-center gap-3">
                      <Sparkles className="w-8 h-8 text-[#9D6BFF] animate-bounce" />
                      <p className="text-xs text-[#241B35] dark:text-[#F7F3FC] font-medium max-w-xs">
                        Everything is configured for <span className="font-bold text-[#7952D6] dark:text-[#9D6BFF]">{name}</span>. Click below to publish their digital birthday surprise!
                      </p>
                    </div>

                    {error && (
                      <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium">
                        {error}
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="pt-4 flex items-center justify-between border-t border-[#EDE7F6] dark:border-[#251B35]">
                      <button
                        onClick={() => setCurrentStep(6)}
                        className="px-4 py-2 rounded-full text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] hover:bg-gray-100 dark:hover:bg-[#251B35] cursor-pointer"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={handlePublish}
                        disabled={isGenerating}
                        className="bv-gradient-btn px-8 py-3 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/30"
                      >
                        {isGenerating ? (
                          <>
                            <Sparkles className="w-4 h-4 animate-spin" />
                            <span>Crafting Magic Link...</span>
                          </>
                        ) : (
                          <>
                            <span>Publish Surprise Now</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 8 && (
                  /* STEP 8: Share & Success */
                  <div className="space-y-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div>
                      <h2 className="text-2xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-1">
                        Your birthday surprise is ready!
                      </h2>
                      <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
                        Share this special link with {name} to bring a big smile.
                      </p>
                    </div>

                    {/* Generated Link Card */}
                    <div className="space-y-2 text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7952D6] dark:text-[#9D6BFF] ml-1">
                        Magic Link URL
                      </span>
                      <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#2A203C]">
                        <input
                          type="text"
                          readOnly
                          value={generatedLink || `${window.location.origin}/surprise/ananya-x82k`}
                          className="flex-1 bg-transparent px-2 text-xs font-mono text-[#241B35] dark:text-[#F7F3FC] outline-none select-all truncate"
                        />
                        <button
                          onClick={copyLink}
                          className="bv-gradient-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Share Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <button
                        onClick={handleShareWhatsApp}
                        className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-600 transition-colors cursor-pointer shadow-sm"
                      >
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={handleNativeShare}
                        className="px-4 py-2.5 rounded-xl bg-[#7952D6] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#6841be] transition-colors cursor-pointer shadow-sm"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </button>

                      <button
                        onClick={() => setShowQrModal(!showQrModal)}
                        className="col-span-2 sm:col-span-1 px-4 py-2.5 rounded-xl bg-white dark:bg-[#251B35] border border-[#EDE7F6] dark:border-[#2A203C] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gray-50 dark:hover:bg-[#1D162A] transition-colors cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>QR Code</span>
                      </button>
                    </div>

                    {/* QR Code Modal Display */}
                    {showQrModal && (
                      <div className="p-4 rounded-2xl bg-[#EDE7F6]/50 dark:bg-[#251B35] border border-purple-200 dark:border-purple-900 flex flex-col items-center gap-2">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(generatedLink)}`}
                          alt="QR Code"
                          className="w-32 h-32 rounded-lg bg-white p-2 shadow-xs"
                        />
                        <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">
                          Scan with camera to open instantly on mobile.
                        </p>
                      </div>
                    )}

                    {/* Live Views Counter */}
                    {viewCount !== null && (
                      <div className="text-xs text-[#746B80] dark:text-[#B8AEC5] flex items-center justify-center gap-4 pt-2">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-[#9D6BFF]" />
                          <span>{viewCount} views</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-[#F47FB5] fill-[#F47FB5]" />
                          <span>{reactionsCount || 0} loves</span>
                        </span>
                      </div>
                    )}

                    {/* Create Another or View Experience */}
                    <div className="pt-4 flex items-center justify-between border-t border-[#EDE7F6] dark:border-[#251B35]">
                      <button
                        onClick={() => {
                          setCurrentStep(1);
                          setGeneratedLink("");
                          setShortId("");
                        }}
                        className="px-4 py-2 rounded-full text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] hover:bg-gray-100 dark:hover:bg-[#251B35] cursor-pointer"
                      >
                        Create Another
                      </button>
                      <a
                        href={generatedLink || `/surprise/${shortId || "demo"}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bv-gradient-btn px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>Open Surprise</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN: Live Phone Preview (Cols 8-12) */}
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
                  onChangeTemplateClick={() => setCurrentStep(5)}
                />
              </div>

            </div>

            {/* Bottom Row: Popular Templates Strip & Quote (as in mockup image) */}
            <div className="mt-8 bg-white dark:bg-[#1D162A] rounded-3xl border border-[#EDE7F6] dark:border-[#2A203C] p-6 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Popular Templates Row */}
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#241B35] dark:text-[#F7F3FC]">
                      Popular Templates
                    </span>
                    <button
                      onClick={() => setActiveTab("templates")}
                      className="text-xs font-semibold text-[#7952D6] dark:text-[#9D6BFF] hover:underline cursor-pointer"
                    >
                      View all →
                    </button>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {POPULAR_TEMPLATES_STRIP.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setSelectedTemplate(t.id);
                          setVibe(t.id);
                        }}
                        className={`group relative rounded-xl p-2.5 text-center flex flex-col items-center bg-gradient-to-br ${t.bg} text-white shadow-xs hover:scale-105 transition-all cursor-pointer ${
                          selectedTemplate === t.id ? "ring-2 ring-[#9D6BFF] ring-offset-2 dark:ring-offset-[#1D162A]" : ""
                        }`}
                      >
                        <span className="text-[10px] font-bold tracking-wide truncate w-full">
                          {t.name}
                        </span>
                        <span className="text-[8px] text-white/70 mt-0.5 truncate w-full">
                          {t.thumbText}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inspirational Quote Card (as seen in mock right) */}
                <div className="w-full md:w-72 bg-[#EDE7F6]/50 dark:bg-[#251B35]/50 border border-[#EDE7F6] dark:border-[#2A203C] rounded-2xl p-4 text-center flex flex-col items-center justify-center">
                  <p className="font-serif italic text-xs font-bold text-[#7952D6] dark:text-[#9D6BFF] leading-relaxed">
                    “A small wish can create a big smile.” 💜
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: TEMPLATES LIBRARY */}
        {activeTab === "templates" && (
          <TemplatesView
            selectedTemplateId={selectedTemplate}
            searchQuery={searchQuery}
            onSelectTemplate={(tmplId) => {
              setSelectedTemplate(tmplId);
              setVibe(tmplId);
              setActiveTab("create");
              setCurrentStep(5);
            }}
          />
        )}

        {/* TAB 3: MY WISHES */}
        {activeTab === "wishes" && (
          <MyWishesView
            onCreateNew={() => {
              setActiveTab("create");
              setCurrentStep(1);
            }}
            onEditWish={(wish) => {
              setName(wish.name);
              if (wish.relationship) setRelationship(wish.relationship);
              setActiveTab("create");
              setCurrentStep(1);
            }}
          />
        )}

        {/* TAB 4: EXPLORE / LANDING */}
        {activeTab === "explore" && (
          <ExploreView
            onCreateClick={() => {
              setActiveTab("create");
              setCurrentStep(1);
            }}
            onExploreTemplatesClick={() => setActiveTab("templates")}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#EDE7F6] dark:border-[#251B35] py-6 px-4 text-center text-xs text-[#746B80] dark:text-[#B8AEC5]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold bv-gradient-text">Birthdayverse</span>
            <span>—</span>
            <span>Make Every Birthday Magical ✨</span>
          </div>
          <p>© {new Date().getFullYear()} Birthdayverse. All rights reserved.</p>
        </div>
      </footer>

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
