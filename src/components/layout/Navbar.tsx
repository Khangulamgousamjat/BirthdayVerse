import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Gift, 
  ChevronDown,
  Layers,
  Heart,
  PlusCircle,
  Compass,
  LayoutDashboard,
  Calendar,
  ShieldCheck,
  Sparkles,
  Settings
} from "lucide-react";
import { NavView } from "./Sidebar";

interface NavbarProps {
  activeTab: NavView;
  onTabChange: (tab: NavView) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks: { id: NavView; label: string; icon: React.ReactNode; isAccent?: boolean }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: "create", label: "Create", icon: <PlusCircle className="w-3.5 h-3.5" />, isAccent: true },
    { id: "templates", label: "Templates", icon: <Layers className="w-3.5 h-3.5" /> },
    { id: "wishes", label: "My Wishes", icon: <Heart className="w-3.5 h-3.5" /> },
    { id: "calendar", label: "Calendar", icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: "explore", label: "Explore", icon: <Compass className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#F9F7FD]/85 dark:bg-[#13101C]/85 border-b border-[#E8DFFA] dark:border-[#282038] transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onTabChange("dashboard")}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#7659E4] to-[#967EF2] p-0.5 shadow-sm shadow-[#7659E4]/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-[#1E182A] rounded-[14px] flex items-center justify-center">
              <Gift className="w-4 h-4 text-[#7659E4] dark:text-[#A28DF8] group-hover:rotate-12 transition-transform" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[#211A30] dark:text-[#F7F5FC] font-sans">
              Birthday<span className="text-[#7659E4] dark:text-[#A28DF8]">Verse</span>
            </span>
            <span className="text-[10px] font-medium text-[#736886] dark:text-[#ACA2BE] tracking-wide -mt-1 hidden sm:block">
              Digital Birthday Studio
            </span>
          </div>
        </div>

        {/* Public Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#EFEAFB]/60 dark:bg-[#181323] p-1.5 rounded-full border border-[#E8DFFA] dark:border-[#282038]">
          {navLinks.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white dark:bg-[#261F36] text-[#7659E4] dark:text-[#C7BAFA] shadow-xs"
                    : item.isAccent
                    ? "text-[#7659E4] dark:text-[#C7BAFA] hover:text-[#6344D4] hover:bg-white/50 dark:hover:bg-[#261F36]/50"
                    : "text-[#736886] dark:text-[#ACA2BE] hover:text-[#211A30] dark:hover:text-white"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2.5">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] text-[#736886] dark:text-[#ACA2BE] hover:text-[#211A30] dark:hover:text-white transition-all shadow-2xs cursor-pointer"
            aria-label="Toggle theme"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-[#E2BC72]" />
            ) : (
              <Moon className="w-4 h-4 text-[#7659E4]" />
            )}
          </button>

          {/* User Profile / Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] hover:bg-[#EFEAFB]/50 dark:hover:bg-[#261F36] transition-all cursor-pointer shadow-2xs"
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#7659E4] to-[#A28DF8] flex items-center justify-center text-white text-xs font-bold shadow-2xs">
                BV
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#736886] dark:text-[#ACA2BE] hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-3xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="px-3.5 py-2.5 border-b border-[#E8DFFA] dark:border-[#282038]">
                  <p className="text-xs font-bold text-[#211A30] dark:text-[#F7F5FC]">
                    BirthdayVerse Studio
                  </p>
                  <p className="text-[10px] text-[#736886] dark:text-[#ACA2BE]">
                    Creator Edition &bull; Free Plan
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => onTabChange("wishes")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#736886] dark:text-[#ACA2BE] hover:bg-[#EFEAFB]/50 dark:hover:bg-[#261F36] hover:text-[#211A30] dark:hover:text-white transition-colors text-left cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#C495C8]" />
                    <span>My Saved Verses</span>
                  </button>

                  <button
                    onClick={() => onTabChange("calendar")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#736886] dark:text-[#ACA2BE] hover:bg-[#EFEAFB]/50 dark:hover:bg-[#261F36] hover:text-[#211A30] dark:hover:text-white transition-colors text-left cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#8E72F0]" />
                    <span>Birthday Calendar</span>
                  </button>

                  <Link
                    to="/admin"
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#736886] dark:text-[#ACA2BE] hover:bg-[#EFEAFB]/50 dark:hover:bg-[#261F36] hover:text-[#211A30] dark:hover:text-white transition-colors text-left"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#7ED4A6]" />
                    <span>Admin Control Center</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-2xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] text-[#736886] dark:text-[#ACA2BE] hover:text-[#211A30] dark:hover:text-white transition-all cursor-pointer"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-white dark:bg-[#181323] border-b border-[#E8DFFA] dark:border-[#282038] p-4 space-y-2 animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#EFEAFB] dark:bg-[#261F36] text-[#7659E4] dark:text-[#C7BAFA]"
                    : "text-[#736886] dark:text-[#ACA2BE] hover:bg-[#EFEAFB]/50 dark:hover:bg-[#261F36]"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
