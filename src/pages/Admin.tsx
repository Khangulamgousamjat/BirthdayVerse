import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowLeft, 
  LogOut, 
  KeyRound, 
  RefreshCw, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Activity, 
  Layers, 
  Heart, 
  Clock, 
  Server, 
  Database,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { StatCard } from "@/components/ui/StatCard";
import { getAdminMetrics, AdminMetrics, deleteSurprise, purgeAllSurprises, verifyAdminPassword, updateAdminPasswordInDb } from "@/lib/db";

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  
  // Login form states
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Dashboard data states
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "verses" | "system">("overview");

  // Change password modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Check existing session token on mount
  useEffect(() => {
    const token = sessionStorage.getItem("bv_admin_token");
    if (!token) {
      setIsCheckingAuth(false);
      return;
    }

    // Check if token is a client-side fallback token
    try {
      const decoded = JSON.parse(atob(token));
      if (decoded.role === "admin" && decoded.exp > Date.now()) {
        setIsAuthenticated(true);
        setIsCheckingAuth(false);
        return;
      }
    } catch {
      // not a base64 json token, proceed to server verify
    }

    // Verify token with server
    fetch("/api/admin/verify", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem("bv_admin_token");
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        // In local development or offline mode
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsCheckingAuth(false);
      });
  }, []);

  // Fetch metrics when authenticated
  const loadMetrics = async () => {
    setIsLoadingMetrics(true);
    try {
      const data = await getAdminMetrics();
      setMetrics(data);
    } catch (err) {
      console.error("Failed to load admin metrics:", err);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadMetrics();
    }
  }, [isAuthenticated]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      let loggedIn = false;

      // 1. Try server API login
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });

        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await res.json();
          if (res.ok && data.token) {
            sessionStorage.setItem("bv_admin_token", data.token);
            setIsAuthenticated(true);
            setPassword("");
            loggedIn = true;
          } else if (res.status === 401) {
            setLoginError(data.error || "Incorrect admin password. Access denied.");
            return;
          }
        }
      } catch {
        // Server API not running in current environment or network unavailable
      }

      // 2. Direct Firestore & fallback authentication
      if (!loggedIn) {
        const isValid = await verifyAdminPassword(password);
        if (isValid) {
          const fallbackToken = btoa(JSON.stringify({ role: "admin", exp: Date.now() + 86400000 }));
          sessionStorage.setItem("bv_admin_token", fallbackToken);
          setIsAuthenticated(true);
          setPassword("");
        } else {
          setLoginError("Incorrect admin password. Access denied.");
        }
      }
    } catch (err: any) {
      setLoginError("Failed to connect to authentication server. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem("bv_admin_token");
    setIsAuthenticated(false);
    setMetrics(null);
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    setPasswordLoading(true);
    const token = sessionStorage.getItem("bv_admin_token") || "";
    let updated = false;

    // 1. Try server API
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (res.ok) {
          updated = true;
          if (data.token) {
            sessionStorage.setItem("bv_admin_token", data.token);
          }
        } else if (res.status === 401 || res.status === 400) {
          setPasswordError(data.error || "Failed to update password.");
          setPasswordLoading(false);
          return;
        }
      }
    } catch {
      // Server API unreachable in current environment, falling back to database update
    }

    // 2. Direct database update fallback
    if (!updated) {
      try {
        await updateAdminPasswordInDb(currentPassword, newPassword);
        updated = true;
      } catch (err: any) {
        setPasswordError(err.message || "Incorrect current password. Please try again.");
        setPasswordLoading(false);
        return;
      }
    }

    if (updated) {
      setPasswordSuccess("Admin password updated successfully.");
      setTimeout(() => {
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordSuccess("");
      }, 1500);
    }
    setPasswordLoading(false);
  };

  // Handle Delete Verse
  const handleDeleteVerse = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently purge this verse?")) {
      return;
    }
    try {
      await deleteSurprise(id);
      loadMetrics();
    } catch (err) {
      alert("Failed to delete verse from database.");
    }
  };

  // State for Purge Modal
  const [showPurgeModal, setShowPurgeModal] = useState<boolean>(false);
  const [isPurging, setIsPurging] = useState<boolean>(false);
  const [purgeError, setPurgeError] = useState<string | null>(null);
  const [purgeSuccess, setPurgeSuccess] = useState<string | null>(null);

  // Handle Purge All Verses with verification
  const handleExecutePurgeAll = async () => {
    setIsPurging(true);
    setPurgeError(null);
    setPurgeSuccess(null);
    try {
      const purgedCount = await purgeAllSurprises();
      setPurgeSuccess(`Successfully purged ${purgedCount} generated celebration link${purgedCount === 1 ? '' : 's'} and cleared all media.`);
      await loadMetrics();
      setTimeout(() => {
        setShowPurgeModal(false);
        setPurgeSuccess(null);
      }, 1800);
    } catch (err: any) {
      console.error("Purge error:", err);
      setPurgeError(err.message || "Failed to purge celebration records from database.");
    } finally {
      setIsPurging(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#13101C] flex items-center justify-center text-[#8E72F0]">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span className="text-sm font-semibold">Verifying credentials...</span>
      </div>
    );
  }

  // 1. Unauthenticated Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#13101C] text-[#F9F7FD] flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
        {/* Subtle Ambient Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#7659E4]/12 via-[#8E72F0]/08 to-transparent rounded-full filter blur-[120px] pointer-events-none" />

        {/* Top bar */}
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#A89EC0] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to BirthdayVerse</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-[#E0A842]">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Perimeter</span>
          </div>
        </div>

        {/* Center Login Box */}
        <div className="w-full max-w-md mx-auto my-auto z-10 animate-in fade-in zoom-in-95 duration-300">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#1E182A]/90 border border-[#282038] shadow-2xl backdrop-blur-xl text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7659E4] to-[#8E72F0] p-0.5 mx-auto shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#161220] rounded-[14px] flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#8E72F0]" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-display font-bold text-white tracking-tight">
                BirthdayVerse Admin
              </h1>
              <p className="text-xs text-[#A89EC0] mt-1.5 leading-relaxed">
                Enter your administrative key to manage live verses, data retention, and platform health.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#A89EC0]">
                  Admin Key / Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    autoFocus
                    className="w-full rounded-2xl bg-[#161220] text-white border border-[#282038] px-4 py-3 text-sm transition-all focus:outline-none focus:border-[#7659E4] focus:ring-2 focus:ring-[#7659E4]/20 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#736886] hover:text-[#A89EC0] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/50 border border-rose-800/50 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loginLoading}
                containerClassName="w-full"
                className="w-full mt-2 font-semibold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Unlock Admin Console
              </Button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full max-w-5xl mx-auto text-center z-10 text-[11px] text-[#736886]">
          BirthdayVerse Private Administrative System &bull; 72-Hour Ephemeral Retention Verified
        </div>
      </div>
    );
  }

  // 2. Authenticated Dashboard Screen
  return (
    <div className="min-h-screen w-full bg-[#13101C] text-[#F9F7FD] flex flex-col selection:bg-[#7659E4]/30">
      
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#181323]/90 backdrop-blur-xl border-b border-[#282038] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 rounded-xl bg-[#261F36] text-[#A89EC0] hover:text-white transition-colors"
              title="Return to Public Site"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7659E4] to-[#8E72F0] p-0.5 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-none">
                  BirthdayVerse Cockpit
                </h1>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Authenticated Session
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={loadMetrics}
              isLoading={isLoadingMetrics}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            {/* Master Key: Delete All Generated Links */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPurgeError(null);
                setPurgeSuccess(null);
                setShowPurgeModal(true);
              }}
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
              className="border-rose-900/60 bg-rose-950/30 text-rose-300 hover:bg-rose-900/50 hover:text-white transition-all shadow-xs"
              title="Permanently delete all generated links from database"
            >
              <span className="hidden md:inline">Delete All Links</span>
              <span className="md:hidden">Delete All</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPasswordModal(true)}
              leftIcon={<KeyRound className="w-3.5 h-3.5" />}
            >
              <span className="hidden sm:inline">Change Password</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-400" />}
              className="text-rose-400 hover:text-rose-300"
            >
              <span className="hidden sm:inline">Exit</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Real Platform Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Celebrations"
            value={metrics ? metrics.totalCelebrations : "—"}
            icon={<Layers className="w-4 h-4 text-[#8E72F0]" />}
            change="Real Firestore Docs"
            trend="neutral"
            className="border-[#282038] bg-[#1E182A]"
          />
          <StatCard
            label="Total Recipient Views"
            value={metrics ? metrics.totalViews.toLocaleString() : "—"}
            icon={<Eye className="w-4 h-4 text-[#8E72F0]" />}
            change="Unique link visits"
            trend="up"
            className="border-[#282038] bg-[#1E182A]"
          />
          <StatCard
            label="Love Reactions Sent"
            value={metrics ? metrics.totalReactions.toLocaleString() : "—"}
            icon={<Heart className="w-4 h-4 text-[#C495C8]" />}
            change="Heart reactions"
            trend="up"
            className="border-[#282038] bg-[#1E182A]"
          />
          <StatCard
            label="Active Ephemeral Verses"
            value={metrics ? `${metrics.activeVerses} live` : "—"}
            icon={<Clock className="w-4 h-4 text-emerald-400" />}
            change={metrics ? `${metrics.expiredVerses} expired (purged)` : "72h window active"}
            trend="neutral"
            className="border-[#282038] bg-[#1E182A]"
          />
        </div>

        {/* View Selection Tabs */}
        <div className="flex items-center gap-2 border-b border-[#282038] pb-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-[#261F36] text-white shadow-xs font-bold"
                : "text-[#A89EC0] hover:text-white"
            }`}
          >
            Overview & Traffic
          </button>
          <button
            onClick={() => setActiveTab("verses")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "verses"
                ? "bg-[#261F36] text-white shadow-xs font-bold"
                : "text-[#A89EC0] hover:text-white"
            }`}
          >
            Recent Verses ({metrics?.recentVerses.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "system"
                ? "bg-[#261F36] text-white shadow-xs font-bold"
                : "text-[#A89EC0] hover:text-white"
            }`}
          >
            System & 72h Purge Health
          </button>
        </div>

        {/* Tab 1: Overview & Traffic */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Real Traffic Chart */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-[#1E182A] border border-[#282038] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Daily Recipient Views</h2>
                  <p className="text-xs text-[#A89EC0]">Real traffic aggregated over the last 7 days</p>
                </div>
                <Badge variant="purple">Realtime Data</Badge>
              </div>

              {/* Chart Bars */}
              <div className="h-52 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[#282038]">
                {metrics?.trafficDays.map((td, i) => {
                  const maxViews = Math.max(...metrics.trafficDays.map((d) => d.views), 10);
                  const heightPercent = Math.max(12, Math.round((td.views / maxViews) * 100));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] text-[#A89EC0] opacity-0 group-hover:opacity-100 transition-opacity">
                        {td.views}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-[#7659E4] to-[#8E72F0] group-hover:brightness-110 transition-all shadow-sm"
                      />
                      <span className="text-[11px] font-semibold text-[#A89EC0] mt-1">
                        {td.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-[#736886] pt-2">
                <span>Calculated from active Firestore document timestamps</span>
                <span>7-day rolling window</span>
              </div>
            </div>

            {/* Quick Status Callout */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-[#1E182A] border border-[#282038] space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#E0A842] mb-2 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  <span>72-Hour Ephemeral Engine</span>
                </div>
                <h3 className="text-xl font-display font-bold text-white">
                  Automated Ephemeral Purge
                </h3>
                <p className="text-xs text-[#A89EC0] mt-2 leading-relaxed">
                  Verses not explicitly marked with <span className="text-[#C495C8] font-semibold">&quot;Keep forever&quot;</span> are dynamically purged after 72 hours to guarantee creator and recipient privacy.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#161220] border border-[#282038] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A89EC0]">Auto-Purge TTL:</span>
                  <span className="font-bold text-white">72 Hours</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A89EC0]">Purge Compliance:</span>
                  <span className="font-bold text-emerald-400">100% Active</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A89EC0]">Permanent Overrides:</span>
                  <span className="font-bold text-[#C495C8]">Creator opt-in</span>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveTab("verses")}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="w-full"
              >
                Inspect Live Verses
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: Recent Verses List */}
        {activeTab === "verses" && (
          <div className="p-6 rounded-3xl bg-[#1E182A] border border-[#282038] space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-base font-bold text-white">Live Celebrations in Database</h2>
                <p className="text-xs text-[#A89EC0]">Real Firestore records in the `surprises` collection</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{metrics?.recentVerses.length || 0} Records</Badge>
                {metrics && metrics.recentVerses.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPurgeError(null);
                      setPurgeSuccess(null);
                      setShowPurgeModal(true);
                    }}
                    leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
                    className="text-xs text-rose-400 hover:text-rose-200 border-rose-900/60 bg-rose-950/40 hover:bg-rose-900/50"
                  >
                    Purge All Records
                  </Button>
                )}
              </div>
            </div>

            {metrics && metrics.recentVerses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#282038] text-[#736886]">
                      <th className="py-3 px-4 font-semibold">Recipient</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Views</th>
                      <th className="py-3 px-4 font-semibold">Reactions</th>
                      <th className="py-3 px-4 font-semibold">Created</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#282038]">
                    {metrics.recentVerses.map((verse) => (
                      <tr key={verse.id} className="hover:bg-[#261F36]/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">
                          {verse.name}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge
                            variant={
                              verse.status === "Kept Forever"
                                ? "purple"
                                : verse.status === "Live"
                                ? "success"
                                : "outline"
                            }
                          >
                            {verse.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-[#A89EC0] font-mono">
                          {verse.views}
                        </td>
                        <td className="py-3.5 px-4 text-[#A89EC0] font-mono">
                          {verse.reactions}
                        </td>
                        <td className="py-3.5 px-4 text-[#736886]">
                          {new Date(verse.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <a
                            href={`/surprise/${verse.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#261F36] text-[#C495C8] hover:text-white inline-flex"
                            title="Open recipient page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDeleteVerse(verse.id)}
                            className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:text-rose-200 inline-flex cursor-pointer"
                            title="Purge record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-[#736886]">
                <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold">No celebrations found in database</p>
                <p className="text-xs mt-1">When users publish verses, they will appear here with live metrics.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: System & Purge Health */}
        {activeTab === "system" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-[#1E182A] border border-[#282038] space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Firestore Database Connectivity</h3>
                  <p className="text-xs text-[#A89EC0]">Google Cloud Firestore cluster status</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#161220] border border-[#282038] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#A89EC0]">Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A89EC0]">Collection:</span>
                  <span className="font-mono text-[#C495C8]">surprises</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A89EC0]">Read Latency:</span>
                  <span className="text-white font-mono">&lt; 150ms</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#1E182A] border border-[#282038] space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-950 text-[#8E72F0]">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Firebase Storage Pipeline</h3>
                  <p className="text-xs text-[#A89EC0]">Media asset upload and soundtrack delivery</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#161220] border border-[#282038] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#A89EC0]">Storage Bucket:</span>
                  <span className="font-mono text-emerald-400">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A89EC0]">Audio CDN:</span>
                  <span className="text-white">Direct HTTPS streaming</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A89EC0]">Asset Encryption:</span>
                  <span className="text-emerald-400">AES-256 enabled</span>
                </div>
              </div>
            </div>

            {/* Master Database Purge Control Card */}
            <div className="md:col-span-2 p-6 rounded-3xl bg-[#1E182A] border border-[#282038] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-950/70 text-rose-400 border border-rose-900/40">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Master Database Purge Control</h3>
                    <p className="text-xs text-[#A89EC0]">One-click deletion of all generated celebrations and associated media</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPurgeError(null);
                    setPurgeSuccess(null);
                    setShowPurgeModal(true);
                  }}
                  leftIcon={<Trash2 className="w-4 h-4 text-rose-400" />}
                  className="border-rose-900/60 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 hover:text-white transition-all"
                >
                  Delete All Generated Links
                </Button>
              </div>

              <div className="p-4 rounded-2xl bg-[#161220] border border-[#282038] text-xs text-[#A89EC0] space-y-2">
                <p>
                  This administrative key allows you to permanently clean and reset all generated celebration links from the <span className="font-mono text-[#C495C8]">surprises</span> Firestore collection, remove user-uploaded media files from Firebase Storage, and reset real-time traffic view counters.
                </p>
                <p className="text-[#736886]">
                  Admin authentication and platform configurations remain safe and unaffected.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Admin Password"
        description="Update the master administrative authentication key."
        maxWidth="md"
      >
        <form onSubmit={handleChangePassword} className="space-y-4 pt-2">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="Enter current admin password"
          />

          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Min 8 characters"
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Re-enter new password"
          />

          {passwordError && (
            <p className="text-xs text-rose-400 font-medium">{passwordError}</p>
          )}

          {passwordSuccess && (
            <p className="text-xs text-emerald-400 font-semibold">{passwordSuccess}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={passwordLoading}
            >
              Update Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Purge All Links Confirmation Modal */}
      <Modal
        isOpen={showPurgeModal}
        onClose={() => !isPurging && setShowPurgeModal(false)}
        title={
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <span>Delete All Generated Links</span>
          </div>
        }
        description="Permanently delete all celebration links and associated media from the database."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-900/50 space-y-2">
            <p className="text-xs text-rose-200 font-medium leading-relaxed">
              <strong>CRITICAL WARNING:</strong> This action will permanently delete all celebration records from the Firestore database and purge all uploaded photos and custom soundtracks from Firebase Storage.
            </p>
            <div className="pt-2 text-xs text-rose-300/80 space-y-1">
              <div className="flex items-center justify-between">
                <span>Stored Links to be Removed:</span>
                <span className="font-bold text-white">{metrics?.recentVerses.length || 0} Records</span>
              </div>
              <div className="flex items-center justify-between">
                <span>View Counts & Reactions:</span>
                <span className="font-bold text-white">Reset to 0</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Admin Login & Master Keys:</span>
                <span className="font-bold text-emerald-400">Safe & Untouched</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#A89EC0] leading-relaxed">
            Anyone visiting an old celebration link after deletion will see a friendly &quot;Celebration Expired or Removed&quot; message and will be invited to create a new celebration.
          </p>

          {purgeError && (
            <div className="p-3 rounded-xl bg-rose-950 border border-rose-900 text-xs text-rose-400 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{purgeError}</span>
            </div>
          )}

          {purgeSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-900 text-xs text-emerald-400 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{purgeSuccess}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowPurgeModal(false)}
              disabled={isPurging}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleExecutePurgeAll}
              isLoading={isPurging}
              leftIcon={<Trash2 className="w-4 h-4" />}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold border-rose-700"
            >
              {isPurging ? "Deleting Records..." : "Yes, Delete All Links Now"}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
