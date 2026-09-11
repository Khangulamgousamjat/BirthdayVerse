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
  Send
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { TEMPLATES_DATA } from "@/components/templates/TemplatesView";

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

  useEffect(() => {
    try {
      const saved = localStorage.getItem("birthdayverse_my_wishes");
      if (saved) {
        setLocalWishes(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Compute real totals from saved wishes
  const totalCreated = localWishes.length;
  const totalViews = localWishes.reduce((sum, w) => sum + (w.views || 0), 0);
  const totalReactions = localWishes.reduce((sum, w) => sum + (w.reactions || 0), 0);

  const upcomingBirthdays = [
    { name: "Aanya", date: "Sep 20", daysLeft: 10, rel: "Best Friend", avatar: "🌸" },
    { name: "Rahul", date: "Oct 02", daysLeft: 22, rel: "Brother", avatar: "⚡" },
    { name: "Priya", date: "Nov 14", daysLeft: 65, rel: "Partner", avatar: "💖" },
  ];

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
          value="3"
          icon={<CalendarIcon className="w-4 h-4 text-[#A28DF8]" />}
          description="Next in 10 days"
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
        <section className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold text-[#211A30] dark:text-[#F7F5FC]">
                Upcoming Birthdays
              </h2>
              <p className="text-xs text-[#736886] dark:text-[#ACA2BE]">
                Never miss a friend or family celebration
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] space-y-3">
            {upcomingBirthdays.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#F9F7FD] dark:hover:bg-[#261F36]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#EFEAFB] dark:bg-[#261F36] flex items-center justify-center text-base">
                    {item.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#211A30] dark:text-[#F7F5FC]">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-[#736886] dark:text-[#ACA2BE]">
                      {item.rel} &bull; {item.date}
                    </span>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onSelectRecipient(item.name, item.date, item.rel)}
                  className="text-[11px] h-7 px-3"
                >
                  Wish Now
                </Button>
              </div>
            ))}
          </div>
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

    </div>
  );
};
