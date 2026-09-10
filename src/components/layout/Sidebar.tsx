import React from "react";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Heart, 
  Layers, 
  Calendar, 
  ShieldCheck, 
  Settings, 
  Compass, 
  Gift, 
  ChevronRight,
  Clock
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
  expiringCount = 1,
}) => {
  const navItems: { id: NavView; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "create", label: "Create New", icon: <PlusCircle className="w-4 h-4 text-[#9D6BFF]" />, badge: "New" },
    { id: "wishes", label: "My Verses", icon: <Heart className="w-4 h-4" />, badge: expiringCount > 0 ? `${expiringCount} exp` : undefined },
    { id: "templates", label: "Templates", icon: <Layers className="w-4 h-4" /> },
    { id: "calendar", label: "Calendar", icon: <Calendar className="w-4 h-4" /> },
    { id: "admin", label: "Admin", icon: <ShieldCheck className="w-4 h-4 text-emerald-500" /> },
    { id: "explore", label: "Explore", icon: <Compass className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 min-h-[calc(100vh-4.5rem)] bg-white dark:bg-[#171122] border-r border-[#EDE7F6] dark:border-[#251B35] p-4 select-none transition-colors duration-300">
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
                    ? "bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] font-bold shadow-2xs"
                    : "text-[#746B80] dark:text-[#B8AEC5] hover:bg-[#EDE7F6]/50 dark:hover:bg-[#251B35]/50 hover:text-[#241B35] dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-[#7952D6] dark:text-[#9D6BFF]" : ""}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.id === "create"
                      ? "bg-gradient-to-r from-[#9D6BFF] to-[#F47FB5] text-white shadow-2xs"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 72h Ephemeral Retention Trust Callout (Board 1 & Part D §34) */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#EDE7F6]/60 to-purple-50 dark:from-[#1D162A] dark:to-[#251B35] border border-purple-200/60 dark:border-purple-900/40">
          <div className="flex items-center gap-2 text-xs font-bold text-[#7952D6] dark:text-[#9D6BFF] mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>72h Ephemeral Link</span>
          </div>
          <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5] leading-relaxed">
            Every verse auto-purges after 72h for pure privacy, unless you choose to keep it forever.
          </p>
        </div>

      </div>

      {/* User Profile Footer */}
      <div className="pt-4 border-t border-[#EDE7F6] dark:border-[#251B35]">
        <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#EDE7F6]/40 dark:hover:bg-[#251B35]/40 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9D6BFF] to-[#F47FB5] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              M
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#241B35] dark:text-[#F7F3FC] leading-none">
                Megha
              </p>
              <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5] mt-0.5">
                Free Plan · Active
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#746B80] dark:text-[#B8AEC5]" />
        </div>
      </div>
    </aside>
  );
};
