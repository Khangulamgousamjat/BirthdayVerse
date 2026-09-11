import React from "react";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Heart, 
  Layers, 
  Calendar, 
  Settings, 
  Compass, 
  Clock,
  Sparkles
} from "lucide-react";

export type NavView = 
  | "dashboard" 
  | "create" 
  | "wishes" 
  | "templates" 
  | "calendar" 
  | "admin" 
  | "explore" 
  | "settings";

interface SidebarProps {
  activeView: NavView;
  onViewChange: (view: NavView) => void;
  expiringCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onViewChange,
  expiringCount = 0,
}) => {
  const navItems: { id: NavView; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "create", label: "Create New", icon: <PlusCircle className="w-4 h-4 text-[#7659E4] dark:text-[#A28DF8]" />, badge: "New" },
    { id: "templates", label: "Templates", icon: <Layers className="w-4 h-4" /> },
    { id: "wishes", label: "My Wishes", icon: <Heart className="w-4 h-4" />, badge: expiringCount > 0 ? `${expiringCount} exp` : undefined },
    { id: "calendar", label: "Calendar", icon: <Calendar className="w-4 h-4" /> },
    { id: "explore", label: "Explore", icon: <Compass className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 min-h-[calc(100vh-4.5rem)] bg-white dark:bg-[#181323] border-r border-[#E8DFFA] dark:border-[#282038] p-4 select-none transition-colors duration-300">
      <div className="space-y-6">
        
        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#EFEAFB] dark:bg-[#261F36] text-[#7659E4] dark:text-[#C7BAFA] font-bold shadow-2xs"
                    : "text-[#736886] dark:text-[#ACA2BE] hover:bg-[#EFEAFB]/50 dark:hover:bg-[#261F36]/50 hover:text-[#211A30] dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-[#7659E4] dark:text-[#C7BAFA]" : ""}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.id === "create"
                      ? "bg-[#7659E4]/15 dark:bg-[#7659E4]/25 text-[#7659E4] dark:text-[#D8CEF8] border border-[#7659E4]/30"
                      : "bg-[#FEF5E7] text-[#9E6E1E] dark:bg-[#2E2413] dark:text-[#E6C075]"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 72h Ephemeral Retention Trust Callout */}
        <div className="p-4 rounded-3xl bg-[#EFEAFB]/50 dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-[#7659E4] dark:text-[#C7BAFA] mb-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>72h Ephemeral Privacy</span>
          </div>
          <p className="text-[11px] text-[#736886] dark:text-[#ACA2BE] leading-relaxed">
            Every verse automatically self-cleans after 72 hours for privacy, unless marked to keep forever.
          </p>
        </div>

      </div>

      {/* Footer info */}
      <div className="pt-4 border-t border-[#E8DFFA] dark:border-[#282038] text-left">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#211A30] dark:text-[#F7F5FC]">
          <Sparkles className="w-3.5 h-3.5 text-[#7659E4] dark:text-[#A28DF8]" />
          <span>BirthdayVerse Studio</span>
        </div>
        <p className="text-[10px] text-[#736886] dark:text-[#ACA2BE] mt-0.5">
          Turn birthdays into memories ✨
        </p>
      </div>
    </aside>
  );
};
