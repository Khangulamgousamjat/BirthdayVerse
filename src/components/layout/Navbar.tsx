import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  Menu, 
  X, 
  Gift, 
  ChevronDown,
  ExternalLink,
  Layers,
  Heart,
  PlusCircle,
  Compass
} from "lucide-react";

export type NavTab = "create" | "templates" | "wishes" | "explore";

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  searchQuery = "",
  onSearchChange,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#F8F6FC]/85 dark:bg-[#100C18]/85 border-b border-[#EDE7F6] dark:border-[#251B35] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onTabChange("create")}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7952D6] via-[#9D6BFF] to-[#F47FB5] p-0.5 shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white dark:bg-[#1D162A] rounded-[14px] flex items-center justify-center">
              <Gift className="w-5 h-5 text-[#9D6BFF] group-hover:rotate-12 transition-transform" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F47FB5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#9D6BFF]"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight bv-gradient-text font-ui">
                Birthdayverse
              </span>
            </div>
            <span className="text-[10px] font-medium text-[#746B80] dark:text-[#B8AEC5] tracking-wide -mt-0.5 hidden sm:block">
              Make Every Birthday Magical ✨
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#EDE7F6]/60 dark:bg-[#171122] p-1.5 rounded-full border border-[#EDE7F6] dark:border-[#251B35]">
          <button
            onClick={() => onTabChange("create")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "create"
                ? "bg-white dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] shadow-sm shadow-purple-500/10"
                : "text-[#746B80] dark:text-[#B8AEC5] hover:text-[#241B35] dark:hover:text-white"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create a Wish</span>
          </button>

          <button
            onClick={() => onTabChange("templates")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "templates"
                ? "bg-white dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] shadow-sm shadow-purple-500/10"
                : "text-[#746B80] dark:text-[#B8AEC5] hover:text-[#241B35] dark:hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => onTabChange("wishes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "wishes"
                ? "bg-white dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] shadow-sm shadow-purple-500/10"
                : "text-[#746B80] dark:text-[#B8AEC5] hover:text-[#241B35] dark:hover:text-white"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>My Wishes</span>
          </button>

          <button
            onClick={() => onTabChange("explore")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === "explore"
                ? "bg-white dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] shadow-sm shadow-purple-500/10"
                : "text-[#746B80] dark:text-[#B8AEC5] hover:text-[#241B35] dark:hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore</span>
          </button>
        </nav>

        {/* Right Section: Search, Theme Toggle, Notification & User Avatar */}
        <div className="flex items-center gap-3">
          
          {/* Search Bar */}
          <div className="relative hidden lg:block w-48 xl:w-56">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#746B80] dark:text-[#B8AEC5]" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-full bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] text-[#241B35] dark:text-[#F7F3FC] placeholder-[#746B80] dark:placeholder-[#B8AEC5]/60 focus:outline-none focus:ring-2 focus:ring-[#9D6BFF]/40 transition-all shadow-sm"
            />
          </div>

          {/* Light / Dark Mode Toggle Switch */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative w-14 h-7 rounded-full bg-[#EDE7F6] dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] p-0.5 flex items-center transition-colors duration-300 cursor-pointer"
          >
            <div
              className={`w-6 h-6 rounded-full bg-[#7952D6] dark:bg-[#9D6BFF] flex items-center justify-center text-white shadow-md transform transition-transform duration-300 ${
                theme === "dark" ? "translate-x-7" : "translate-x-0"
              }`}
            >
              {theme === "dark" ? (
                <Moon className="w-3.5 h-3.5 text-[#100C18]" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-white" />
              )}
            </div>
            <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none text-[#746B80] dark:text-[#B8AEC5]">
              <Sun className="w-3 h-3 opacity-60" />
              <Moon className="w-3 h-3 opacity-60" />
            </div>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="w-9 h-9 rounded-full bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] flex items-center justify-center text-[#241B35] dark:text-[#F7F3FC] hover:bg-[#EDE7F6]/50 dark:hover:bg-[#251B35] transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F47FB5]"></span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] shadow-xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-[#EDE7F6] dark:border-[#251B35]">
                  <span className="text-xs font-bold text-[#241B35] dark:text-[#F7F3FC]">Notifications</span>
                  <span className="text-[10px] text-[#9D6BFF] font-semibold cursor-pointer">Mark all read</span>
                </div>
                <div className="py-2 space-y-2">
                  <div className="p-2 rounded-xl bg-[#EDE7F6]/40 dark:bg-[#251B35]/50 flex gap-2.5 items-start">
                    <span className="text-base">✨</span>
                    <div>
                      <p className="text-xs font-medium text-[#241B35] dark:text-[#F7F3FC]">Welcome to Birthdayverse!</p>
                      <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">Create your first personalized digital experience.</p>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl hover:bg-[#EDE7F6]/30 dark:hover:bg-[#251B35]/30 flex gap-2.5 items-start transition-colors">
                    <span className="text-base">🎉</span>
                    <div>
                      <p className="text-xs font-medium text-[#241B35] dark:text-[#F7F3FC]">New templates released</p>
                      <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">Check out the Dreamy & Romantic styles.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] hover:bg-[#EDE7F6]/40 dark:hover:bg-[#251B35] transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#9D6BFF] to-[#F47FB5] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                M
              </div>
              <span className="text-xs font-semibold text-[#241B35] dark:text-[#F7F3FC] hidden sm:block">
                Megha
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#746B80] dark:text-[#B8AEC5]" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-[#EDE7F6] dark:border-[#251B35] mb-1">
                  <p className="text-xs font-bold text-[#241B35] dark:text-[#F7F3FC]">Megha Sharma</p>
                  <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5] truncate">megha@birthdayverse.com</p>
                </div>
                <button 
                  onClick={() => { onTabChange("wishes"); setUserDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs text-[#241B35] dark:text-[#F7F3FC] hover:bg-[#EDE7F6]/50 dark:hover:bg-[#251B35] rounded-xl transition-colors cursor-pointer"
                >
                  My Saved Wishes
                </button>
                <button 
                  onClick={() => { onTabChange("templates"); setUserDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs text-[#241B35] dark:text-[#F7F3FC] hover:bg-[#EDE7F6]/50 dark:hover:bg-[#251B35] rounded-xl transition-colors cursor-pointer"
                >
                  Template Gallery
                </button>
                <div className="border-t border-[#EDE7F6] dark:border-[#251B35] my-1"></div>
                <button 
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full text-left px-3 py-2 text-xs text-[#F47FB5] hover:bg-[#F47FB5]/10 rounded-xl transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#241B35] dark:text-[#F7F3FC] hover:bg-[#EDE7F6] dark:hover:bg-[#251B35]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 border-t border-[#EDE7F6] dark:border-[#251B35] bg-[#F8F6FC] dark:bg-[#100C18] space-y-2">
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#746B80] dark:text-[#B8AEC5]" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] text-[#241B35] dark:text-[#F7F3FC]"
            />
          </div>
          <button
            onClick={() => { onTabChange("create"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === "create"
                ? "bg-[#7952D6] text-white"
                : "text-[#241B35] dark:text-[#F7F3FC] hover:bg-[#EDE7F6] dark:hover:bg-[#251B35]"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create a Wish</span>
          </button>
          <button
            onClick={() => { onTabChange("templates"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === "templates"
                ? "bg-[#7952D6] text-white"
                : "text-[#241B35] dark:text-[#F7F3FC] hover:bg-[#EDE7F6] dark:hover:bg-[#251B35]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Templates</span>
          </button>
          <button
            onClick={() => { onTabChange("wishes"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === "wishes"
                ? "bg-[#7952D6] text-white"
                : "text-[#241B35] dark:text-[#F7F3FC] hover:bg-[#EDE7F6] dark:hover:bg-[#251B35]"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>My Wishes</span>
          </button>
          <button
            onClick={() => { onTabChange("explore"); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === "explore"
                ? "bg-[#7952D6] text-white"
                : "text-[#241B35] dark:text-[#F7F3FC] hover:bg-[#EDE7F6] dark:hover:bg-[#251B35]"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Explore</span>
          </button>
        </div>
      )}
    </header>
  );
};
