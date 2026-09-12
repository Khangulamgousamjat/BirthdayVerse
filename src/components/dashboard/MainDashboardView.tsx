import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Clock, 
  Heart, 
  Eye, 
  ArrowRight, 
  Gift, 
  Layers, 
  Share2, 
  Crown,
  ChevronRight,
  Send,
  Trash2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { TEMPLATES_DATA } from "@/components/templates/TemplatesView";
import {
  getStoredBirthdays,
  saveBirthday,
  deleteBirthday,
  onBirthdaysChange,
  UpcomingBirthday
} from "@/lib/birthdays";

interface MainDashboardViewProps {
  onCreateClick: () => void;
  onSelectRecipient: (name: string, date: string, rel?: string) => void;
  onViewWishes: () => void;
  onExploreTemplatesClick: () => void;
  onSelectTemplate?: (templateId: string) => void;
}

export const MainDashboardView: React.FC<MainDashboardViewProps> = ({
  onCreateClick,
  onSelectRecipient,
  onViewWishes,
  onExploreTemplatesClick,
  onSelectTemplate,
}) => {
  const [localWishes, setLocalWishes] = useState<any[]>([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<UpcomingBirthday[]>([]);

  // Add Birthday modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newRel, setNewRel] = useState("Best Friend");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("birthdayverse_my_wishes");
      if (saved) {
        setLocalWishes(JSON.parse(saved));
      }
    } catch {
      // ignore
    }

    // Load stored birthdays (no demo data)
    setUpcomingBirthdays(getStoredBirthdays());

    // Listen for cross-component and local updates
    const unsubscribe = onBirthdaysChange(() => {
      setUpcomingBirthdays(getStoredBirthdays());
    });
    return () => unsubscribe();
  }, []);

  const handleAddBirthday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDate) return;

    const parsedDate = new Date(newDate);
    const monthName = parsedDate.toLocaleDateString("en-US", { month: "long" });
    const day = parsedDate.getDate();
    const formatted = `${monthName.slice(0, 3)} ${day < 10 ? `0${day}` : day}`;

    saveBirthday({
      name: newName.trim(),
      rawDate: newDate,
      date: formatted,
      month: monthName,
      day: day,
      rel: newRel,
      reminder: "3 days before",
    });

    setNewName("");
    setNewDate("");
    setShowAddModal(false);
  };

  const handleDeleteBirthday = (id: string) => {
    deleteBirthday(id);
  };

  // Compute real totals from saved wishes
  const totalCreated = localWishes.length;
  const totalViews = localWishes.reduce((sum, w) => sum + (w.views || 0), 0);
  const totalReactions = localWishes.reduce((sum, w) => sum + (w.reactions || 0), 0);

  const featuredTemplates = TEMPLATES_DATA.slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 animate-in fade-in duration-300 pb-12">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#F9F7FD] to-purple-50/40 dark:from-[#1E182A] dark:via-[#181323] dark:to-[#261F36]/50 border border-[#E8DFFA] dark:border-[#282038] p-6 sm:p-10 shadow-xs text-left">
        {/* Decorative subtle ambient lavender orb */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-[#7659E4]/12 via-[#A28DF8]/06 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFEAFB] dark:bg-[#261F36] text-[#7659E4] dark:text-[#C7BAFA] text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#7659E4] dark:text-[#A28DF8]" />
            <span>Digital Birthday Studio</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[#211A30] dark:text-[#F7F5FC] leading-tight tracking-tight">
            Create something <br className="hidden sm:block" />
            <span className="bv-gradient-text">they&apos;ll remember.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#736886] dark:text-[#ACA2BE] leading-relaxed">
            Turn ordinary birthday wishes into cinematic, music-infused digital experiences with interactive memories, cake celebrations, and private 72-hour magic links.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={onCreateClick}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Birthday Experience
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={onExploreTemplatesClick}
              leftIcon={<Layers className="w-4 h-4" />}
            >
              Explore Templates
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Quick Stats Row */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          label="Celebrations Created"
          value={totalCreated > 0 ? totalCreated : "0"}
          icon={<Gift className="w-4 h-4 text-[#7659E4] dark:text-[#A28DF8]" />}
          description="In your workspace"
        />
        <StatCard
          label="Total Views"
          value={totalViews > 0 ? totalViews.toLocaleString() : "0"}
          icon={<Eye className="w-4 h-4 text-[#8E72F0]" />}
          description="Recipient link opens"
        />
        <StatCard
          label="Love Reactions"
          value={totalReactions > 0 ? totalReactions.toLocaleString() : "0"}
          icon={<Heart className="w-4 h-4 text-[#C495C8]" />}
          description="Hearts received"
        />
        <StatCard
          label="Upcoming Birthdays"
          value={upcomingBirthdays.length > 0 ? upcomingBirthdays.length.toString() : "0"}
          icon={<CalendarIcon className="w-4 h-4 text-[#A28DF8]" />}
          description={upcomingBirthdays.length > 0 ? `Next in ${upcomingBirthdays[0].daysLeft} days` : "No upcoming dates"}
        />
      </section>

      {/* 3. Grid: Recent Creations + Upcoming Birthdays */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left: Recent Creations (Cols 1-8) */}
        <section className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-[#211A30] dark:text-[#F7F5FC]">
                Recent Creations
              </h2>
              <p className="text-xs text-[#736886] dark:text-[#ACA2BE]">
                Your published and saved birthday experiences
              </p>
            </div>
            {localWishes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewWishes}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                View all ({localWishes.length})
              </Button>
            )}
          </div>

          {localWishes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {localWishes.slice(0, 4).map((verse, idx) => (
                <div
                  key={verse.id || idx}
                  className="p-5 rounded-3xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] hover:shadow-md transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-[#211A30] dark:text-[#F7F5FC]">
                      {verse.name}
                    </span>
                    <Badge variant={verse.status === "Published" ? "success" : "warning"}>
                      {verse.status || "Draft"}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#736886] dark:text-[#ACA2BE] line-clamp-2">
                    {verse.relationship ? `${verse.relationship} celebration` : "Personal birthday verse"}
                  </p>

                  <div className="flex items-center justify-between text-xs text-[#736886] dark:text-[#ACA2BE] pt-2 border-t border-[#E8DFFA] dark:border-[#282038]/60">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-[#8E72F0]" /> {verse.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-[#C495C8]" /> {verse.reactions || 0}
                      </span>
                    </div>

                    {verse.url ? (
                      <a
                        href={verse.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#7659E4] dark:text-[#C7BAFA] hover:underline inline-flex items-center gap-1"
                      >
                        Open <ArrowRight className="w-3 h-3" />
                      </a>
                    ) : (
                      <button
                        onClick={onCreateClick}
                        className="text-xs font-semibold text-[#7659E4] dark:text-[#C7BAFA] hover:underline"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EFEAFB] dark:bg-[#261F36] text-[#7659E4] dark:text-[#C7BAFA] flex items-center justify-center mx-auto">
                <Gift className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-sm font-bold text-[#211A30] dark:text-[#F7F5FC]">
                  No celebrations created yet
                </h3>
                <p className="text-xs text-[#736886] dark:text-[#ACA2BE]">
                  Create your first birthday surprise in less than 2 minutes with photos, music, and an interactive cake.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={onCreateClick}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Create Your First Verse
              </Button>
            </div>
          )}
        </section>

        {/* Right: Upcoming Birthdays (Cols 9-12) */}
        <section className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-[#211A30] dark:text-[#F7F5FC]">
                Upcoming Birthdays
              </h2>
              <p className="text-xs text-[#736886] dark:text-[#ACA2BE]">
                Never miss a friend or family celebration
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddModal(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="text-xs h-8 px-3"
            >
              Add
            </Button>
          </div>

          {/* Browser cache explanation notice */}
          <div className="p-3 rounded-2xl bg-[#F5F0FE] dark:bg-[#241A3A] border border-[#E0D2FA] dark:border-[#382856] text-[11px] text-[#6A5A87] dark:text-[#C7BAFA] leading-relaxed flex items-start gap-2">
            <span className="text-xs shrink-0 mt-0.5">ℹ️</span>
            <span>
              <strong>Note:</strong> Birthdays are stored in your local browser storage. Clearing browser cache or history will reset your saved dates.
            </span>
          </div>

          {upcomingBirthdays.length > 0 ? (
            <div className="p-4 rounded-3xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] space-y-2.5 max-h-[420px] overflow-y-auto">
              {upcomingBirthdays.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#F9F7FD] dark:hover:bg-[#261F36]/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 shrink-0 rounded-2xl bg-[#EFEAFB] dark:bg-[#261F36] flex items-center justify-center text-base">
                      {item.avatar}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#211A30] dark:text-[#F7F5FC] truncate">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-[#736886] dark:text-[#ACA2BE] block">
                        {item.rel} &bull; {item.date} {item.daysLeft === 0 ? "(Today! 🎉)" : `&bull; in ${item.daysLeft}d`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onSelectRecipient(item.name, item.date, item.rel)}
                      className="text-[11px] h-7 px-2.5"
                    >
                      Wish Now
                    </Button>
                    <button
                      onClick={() => handleDeleteBirthday(item.id)}
                      className="p-1.5 rounded-lg text-[#736886] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                      title="Remove birthday"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] text-center space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EFEAFB] dark:bg-[#261F36] text-[#7659E4] dark:text-[#C7BAFA] flex items-center justify-center mx-auto">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-[#211A30] dark:text-[#F7F5FC]">
                  No upcoming birthdays added
                </h3>
                <p className="text-[11px] text-[#736886] dark:text-[#ACA2BE] max-w-xs mx-auto">
                  Add friends or loved ones to track their special days and prepare surprises on time.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAddModal(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add First Birthday
              </Button>
            </div>
          )}
        </section>

      </div>

      {/* 4. Featured Templates Showcase */}
      <section className="space-y-4 text-left">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-bold text-[#211A30] dark:text-[#F7F5FC]">
              Featured Visual Styles
            </h2>
            <p className="text-xs text-[#736886] dark:text-[#ACA2BE]">
              Handcrafted templates for memorable celebrations
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExploreTemplatesClick}
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            Browse all templates
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {featuredTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-3xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] overflow-hidden group hover:shadow-lg transition-all"
            >
              {/* Preview Banner */}
              <div className={`h-28 w-full ${template.previewBg} p-4 flex flex-col justify-between relative overflow-hidden`}>
                <div className="flex items-center justify-between z-10">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md">
                    {template.category}
                  </span>
                  {template.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                      {template.badge}
                    </span>
                  )}
                </div>
                <div className="text-white font-display font-bold text-sm tracking-wide z-10">
                  {template.previewText}
                </div>
              </div>

              {/* Info Body */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-[#211A30] dark:text-[#F7F5FC]">
                    {template.name}
                  </h3>
                  <p className="text-xs text-[#736886] dark:text-[#ACA2BE] mt-1 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onSelectTemplate ? onSelectTemplate(template.id) : onCreateClick()}
                  className="w-full"
                >
                  Use Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add Birthday Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Upcoming Birthday"
        description="Add a friend or family member to track their birthday and prepare surprises."
        maxWidth="sm"
      >
        <form onSubmit={handleAddBirthday} className="space-y-4 pt-2">
          <Input
            label="Recipient Name *"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Maya"
            required
            autoFocus
          />

          <Input
            label="Birthday Date *"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            required
          />

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-[#736886] dark:text-[#A89EC0]">
              Relationship
            </label>
            <select
              value={newRel}
              onChange={(e) => setNewRel(e.target.value)}
              className="w-full rounded-2xl bg-white dark:bg-[#1E182A] text-[#211A30] dark:text-[#F9F7FC] border border-[#E8DFFA] dark:border-[#282038] px-4 py-2.5 text-sm outline-none focus:border-[#7659E4]"
            >
              <option value="Best Friend">Best Friend 🌸</option>
              <option value="Partner">Partner 💖</option>
              <option value="Sister">Sister 🎀</option>
              <option value="Brother">Brother ⚡</option>
              <option value="Mother">Mother 💐</option>
              <option value="Father">Father 👑</option>
              <option value="Colleague">Colleague 💼</option>
              <option value="Friend">Friend 🎉</option>
              <option value="Other">Other 🎂</option>
            </select>
          </div>

          <div className="p-3 rounded-2xl bg-[#F5F0FE] dark:bg-[#241A3A] border border-[#E0D2FA] dark:border-[#382856] text-[11px] text-[#6A5A87] dark:text-[#C7BAFA] leading-relaxed">
            💾 <strong>Local Storage:</strong> Stored in this browser. Clearing browser history or cache will clear your saved birthdays.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Save Birthday
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

