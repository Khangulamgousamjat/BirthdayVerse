import React from "react";
import { 
  Plus, 
  Sparkles, 
  Calendar, 
  Clock, 
  Heart, 
  Eye, 
  ExternalLink, 
  Share2, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Gift
} from "lucide-react";

interface MainDashboardViewProps {
  onCreateClick: () => void;
  onSelectRecipient: (name: string, date: string, rel?: string) => void;
  onViewWishes: () => void;
}

export const MainDashboardView: React.FC<MainDashboardViewProps> = ({
  onCreateClick,
  onSelectRecipient,
  onViewWishes,
}) => {
  const upcomingBirthdays = [
    { name: "Aanya", date: "Sep 20", daysLeft: 10, rel: "Best Friend", avatar: "🌸" },
    { name: "Rahul", date: "Oct 02", daysLeft: 22, rel: "Brother", avatar: "⚡" },
    { name: "Priya", date: "Nov 14", daysLeft: 65, rel: "Partner", avatar: "💖" },
  ];

  const recentVerses = [
    {
      id: "aanya-bday",
      name: "Aanya",
      status: "Draft",
      expiryChip: "Draft",
      chipColor: "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      theme: "Golden Elegance",
      date: "Sep 20",
      views: 0,
      loves: 0,
      bg: "from-[#2D1654] to-[#120824]",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "rahul-live",
      name: "Rahul",
      status: "Live",
      expiryChip: "Expires in 24h",
      chipColor: "bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      theme: "Confetti Fiesta",
      date: "Oct 02",
      views: 42,
      loves: 18,
      bg: "from-[#EA580C] to-[#EC4899]",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "priya-live",
      name: "Priya",
      status: "Live",
      expiryChip: "Kept forever",
      chipColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      theme: "Sweet Romance",
      date: "Nov 14",
      views: 89,
      loves: 54,
      bg: "from-[#BE123C] to-[#FB7185]",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Greeting & Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white via-purple-50/40 to-white dark:from-[#1D162A] dark:via-[#251B35]/40 dark:to-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] text-[11px] font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creator Studio Godmode</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC]">
            Good afternoon, Megha 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#746B80] dark:text-[#B8AEC5] mt-1">
            Create, manage and share your digital birthday experiences.
          </p>
        </div>

        <button
          onClick={onCreateClick}
          className="bv-gradient-btn px-6 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-500/20 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create Birthday Verse</span>
        </button>
      </div>

      {/* Grid: Upcoming Birthdays + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Widget: Upcoming Birthdays (Cols 1-7) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1D162A] rounded-3xl border border-[#EDE7F6] dark:border-[#2A203C] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#7952D6] dark:text-[#9D6BFF]" />
                <h2 className="text-sm font-bold text-[#241B35] dark:text-[#F7F3FC]">
                  Upcoming Birthdays
                </h2>
              </div>
              <span className="text-[10px] text-[#746B80] dark:text-[#B8AEC5] font-semibold">
                Sync with Calendar
              </span>
            </div>

            <div className="space-y-3">
              {upcomingBirthdays.map((bday, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8F6FC] dark:bg-[#171122] border border-[#EDE7F6] dark:border-[#2A203C] hover:border-[#9D6BFF]/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{bday.avatar}</span>
                    <div>
                      <p className="text-xs font-bold text-[#241B35] dark:text-[#F7F3FC]">
                        {bday.name}
                      </p>
                      <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">
                        {bday.rel} · {bday.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-[#7952D6] dark:text-[#9D6BFF] bg-[#EDE7F6] dark:bg-[#251B35] px-2.5 py-1 rounded-full">
                      {bday.daysLeft} days
                    </span>
                    <button
                      onClick={() => onSelectRecipient(bday.name, bday.date, bday.rel)}
                      className="bv-gradient-btn px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Create
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#EDE7F6] dark:border-[#251B35] flex items-center justify-between text-xs text-[#746B80] dark:text-[#B8AEC5]">
            <span>Never miss a moment with automated reminders</span>
            <button onClick={onCreateClick} className="font-bold text-[#7952D6] dark:text-[#9D6BFF] hover:underline cursor-pointer">
              + Add contact
            </button>
          </div>
        </div>

        {/* Right Widget: Platform Privacy & Storage Meter (Cols 8-12) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 72h Ephemeral Lifecycle Box */}
          <div className="bg-white dark:bg-[#1D162A] rounded-3xl border border-[#EDE7F6] dark:border-[#2A203C] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#7952D6] dark:text-[#9D6BFF]" />
                <h2 className="text-sm font-bold text-[#241B35] dark:text-[#F7F3FC]">
                  72-Hour Data Promise
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 text-[10px] font-bold">
                100% Active
              </span>
            </div>

            <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] leading-relaxed">
              Every verse created auto-deletes in 72 hours from all databases and CDN caches for complete peace of mind, unless upgraded to permanent.
            </p>

            {/* Storage Progress */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-semibold text-[#241B35] dark:text-[#F7F3FC]">
                <span>Active Verses</span>
                <span>2 / 5 (Free Plan)</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#9D6BFF] to-[#7952D6] w-2/5 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Quick Stats Pill Deck */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-[#746B80] dark:text-[#B8AEC5]">Total Views</span>
                <Eye className="w-3.5 h-3.5 text-[#9D6BFF]" />
              </div>
              <p className="text-xl font-bold text-[#241B35] dark:text-[#F7F3FC]">131</p>
              <span className="text-[9px] text-emerald-600 font-semibold">+18% this week</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-[#746B80] dark:text-[#B8AEC5]">Love Reactions</span>
                <Heart className="w-3.5 h-3.5 text-[#F47FB5]" />
              </div>
              <p className="text-xl font-bold text-[#241B35] dark:text-[#F7F3FC]">72</p>
              <span className="text-[9px] text-pink-500 font-semibold">From 3 verses</span>
            </div>
          </div>

        </div>

      </div>

      {/* Your Birthday Verses Deck (Board 1 Panel 2) */}
      <div className="bg-white dark:bg-[#1D162A] rounded-3xl border border-[#EDE7F6] dark:border-[#2A203C] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#241B35] dark:text-[#F7F3FC]">
              Your Birthday Verses
            </h2>
            <p className="text-xs text-[#746B80] dark:text-[#B8AEC5]">
              Active, expiring and saved celebrations.
            </p>
          </div>

          <button
            onClick={onViewWishes}
            className="text-xs font-bold text-[#7952D6] dark:text-[#9D6BFF] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Verses Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentVerses.map((verse) => (
            <div
              key={verse.id}
              className="rounded-2xl border border-[#EDE7F6] dark:border-[#2A203C] bg-[#F8F6FC] dark:bg-[#171122] overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Header preview banner */}
              <div className={`h-24 bg-gradient-to-r ${verse.bg} p-3 flex items-start justify-between relative overflow-hidden`}>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${verse.chipColor} z-10`}>
                  {verse.expiryChip}
                </span>

                <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-sm z-10">
                  <img src={verse.photo} alt={verse.name} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#241B35] dark:text-[#F7F3FC]">
                    {verse.name}
                  </h3>
                  <p className="text-[11px] text-[#746B80] dark:text-[#B8AEC5] mt-0.5">
                    {verse.theme} · Birthday {verse.date}
                  </p>

                  {verse.status === "Live" && (
                    <div className="flex items-center gap-3 text-xs text-[#746B80] dark:text-[#B8AEC5] mt-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-[#9D6BFF]" />
                        <span>{verse.views}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-[#F47FB5]" />
                        <span>{verse.loves}</span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-[#EDE7F6] dark:border-[#251B35] flex items-center justify-between">
                  <button
                    onClick={onCreateClick}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#251B35] text-xs font-bold text-[#7952D6] dark:text-[#9D6BFF] border border-[#EDE7F6] dark:border-[#2A203C] hover:opacity-80 cursor-pointer"
                  >
                    Edit
                  </button>

                  <a
                    href={`/surprise/${verse.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-[#241B35] dark:text-[#F7F3FC] hover:text-[#7952D6] cursor-pointer"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
