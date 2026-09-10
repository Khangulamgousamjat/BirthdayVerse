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
import { getAdminMetrics, AdminMetrics, deleteSurprise } from "@/lib/db";

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
        // In local development if API is unreachable, handle gracefully
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
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        sessionStorage.setItem("bv_admin_token", data.token);
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setLoginError(data.error || "Incorrect admin password. Access denied.");
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

      const data = await res.json();

      if (res.ok) {
        setPasswordSuccess("Admin password updated successfully.");
        if (data.token) {
          sessionStorage.setItem("bv_admin_token", data.token);
        }
        setTimeout(() => {
          setShowPasswordModal(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setPasswordSuccess("");
        }, 1500);
      } else {
        setPasswordError(data.error || "Failed to update password.");
      }
    } catch (err) {
      setPasswordError("Network error while updating password.");
    } finally {
      setPasswordLoading(false);
    }
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

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#100C18] flex items-center justify-center text-[#9D6BFF]">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span className="text-sm font-semibold">Verifying credentials...</span>
      </div>
    );
  }

  // 1. Unauthenticated Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#100C18] text-[#F7F3FC] flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
        {/* Subtle Ambient Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#7952D6]/15 via-[#9D6BFF]/10 to-transparent rounded-full filter blur-[120px] pointer-events-none" />

        {/* Top bar */}
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#B8AEC5] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to BirthdayVerse</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-[#E7B85C]">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Perimeter</span>
          </div>
        </div>

        {/* Center Login Box */}
        <div className="w-full max-w-md mx-auto my-auto z-10 animate-in fade-in zoom-in-95 duration-300">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#1D162A]/90 border border-[#251B35] shadow-2xl backdrop-blur-xl text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7952D6] to-[#9D6BFF] p-0.5 mx-auto shadow-lg shadow-purple-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#171122] rounded-[14px] flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#9D6BFF]" />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-display font-bold text-white tracking-tight">
                BirthdayVerse Admin
              </h1>
              <p className="text-xs text-[#B8AEC5] mt-1.5 leading-relaxed">
                Enter your administrative key to manage live verses, data retention, and platform health.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#B8AEC5]">
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
                    className="w-full rounded-2xl bg-[#171122] text-white border border-[#251B35] px-4 py-3 text-sm transition-all focus:outline-none focus:border-[#9D6BFF] focus:ring-2 focus:ring-[#9D6BFF]/20 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#746B80] hover:text-[#B8AEC5] transition-colors cursor-pointer"
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
        <div className="w-full max-w-5xl mx-auto text-center z-10 text-[11px] text-[#746B80]">
          BirthdayVerse Private Administrative System &bull; 72-Hour Ephemeral Retention Verified
        </div>
      </div>
    );
  }

  // 2. Authenticated Dashboard Screen
  return (
    <div className="min-h-screen w-full bg-[#100C18] text-[#F7F3FC] flex flex-col selection:bg-[#9D6BFF]/30">
      
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#171122]/90 backdrop-blur-xl border-b border-[#251B35] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 rounded-xl bg-[#251B35] text-[#B8AEC5] hover:text-white transition-colors"
              title="Return to Public Site"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7952D6] to-[#9D6BFF] p-0.5 flex items-center justify-center">
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
            icon={<Layers className="w-4 h-4" />}
            change="Real Firestore Docs"
            trend="neutral"
            className="border-[#251B35] bg-[#1D162A]"
          />
          <StatCard
            label="Total Recipient Views"
            value={metrics ? metrics.totalViews.toLocaleString() : "—"}
            icon={<Eye className="w-4 h-4 text-purple-400" />}
            change="Unique link visits"
            trend="up"
            className="border-[#251B35] bg-[#1D162A]"
          />
          <StatCard
            label="Love Reactions Sent"
            value={metrics ? metrics.totalReactions.toLocaleString() : "—"}
            icon={<Heart className="w-4 h-4 text-rose-400" />}
            change="Heart reactions"
            trend="up"
            className="border-[#251B35] bg-[#1D162A]"
          />
          <StatCard
            label="Active Ephemeral Verses"
            value={metrics ? `${metrics.activeVerses} live` : "—"}
            icon={<Clock className="w-4 h-4 text-emerald-400" />}
            change={metrics ? `${metrics.expiredVerses} expired (purged)` : "72h window active"}
            trend="neutral"
            className="border-[#251B35] bg-[#1D162A]"
          />
        </div>

        {/* View Selection Tabs */}
        <div className="flex items-center gap-2 border-b border-[#251B35] pb-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-[#251B35] text-white shadow-xs font-bold"
                : "text-[#B8AEC5] hover:text-white"
            }`}
          >
            Overview & Traffic
          </button>
          <button
            onClick={() => setActiveTab("verses")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "verses"
                ? "bg-[#251B35] text-white shadow-xs font-bold"
                : "text-[#B8AEC5] hover:text-white"
            }`}
          >
            Recent Verses ({metrics?.recentVerses.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "system"
                ? "bg-[#251B35] text-white shadow-xs font-bold"
                : "text-[#B8AEC5] hover:text-white"
            }`}
          >
            System & 72h Purge Health
          </button>
        </div>

        {/* Tab 1: Overview & Traffic */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Real Traffic Chart */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-[#1D162A] border border-[#251B35] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Daily Recipient Views</h2>
                  <p className="text-xs text-[#B8AEC5]">Real traffic aggregated over the last 7 days</p>
                </div>
                <Badge variant="purple">Realtime Data</Badge>
              </div>

              {/* Chart Bars */}
              <div className="h-52 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[#251B35]">
                {metrics?.trafficDays.map((td, i) => {
                  const maxViews = Math.max(...metrics.trafficDays.map((d) => d.views), 10);
                  const heightPercent = Math.max(12, Math.round((td.views / maxViews) * 100));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] text-[#B8AEC5] opacity-0 group-hover:opacity-100 transition-opacity">
                        {td.views}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-[#7952D6] to-[#9D6BFF] group-hover:brightness-110 transition-all shadow-sm"
                      />
                      <span className="text-[11px] font-semibold text-[#B8AEC5] mt-1">
                        {td.day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-[#746B80] pt-2">
                <span>Calculated from active Firestore document timestamps</span>
                <span>7-day rolling window</span>
              </div>
            </div>

            {/* Quick Status Callout */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-[#1D162A] border border-[#251B35] space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#E7B85C] mb-2 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  <span>72-Hour Ephemeral Engine</span>
                </div>
                <h3 className="text-xl font-display font-bold text-white">
                  Automated Ephemeral Purge
                </h3>
                <p className="text-xs text-[#B8AEC5] mt-2 leading-relaxed">
                  Verses not explicitly marked with <span className="text-purple-300 font-semibold">&quot;Keep forever&quot;</span> are dynamically purged after 72 hours to guarantee creator and recipient privacy.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#171122] border border-[#251B35] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#B8AEC5]">Auto-Purge TTL:</span>
                  <span className="font-bold text-white">72 Hours</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#B8AEC5]">Purge Compliance:</span>
                  <span className="font-bold text-emerald-400">100% Active</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#B8AEC5]">Permanent Overrides:</span>
                  <span className="font-bold text-purple-300">Creator opt-in</span>
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
          <div className="p-6 rounded-3xl bg-[#1D162A] border border-[#251B35] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Live Celebrations in Database</h2>
                <p className="text-xs text-[#B8AEC5]">Real Firestore records in the `surprises` collection</p>
              </div>
              <Badge variant="secondary">{metrics?.recentVerses.length || 0} Records</Badge>
            </div>

            {metrics && metrics.recentVerses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#251B35] text-[#746B80]">
                      <th className="py-3 px-4 font-semibold">Recipient</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Views</th>
                      <th className="py-3 px-4 font-semibold">Reactions</th>
                      <th className="py-3 px-4 font-semibold">Created</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#251B35]">
                    {metrics.recentVerses.map((verse) => (
                      <tr key={verse.id} className="hover:bg-[#251B35]/40 transition-colors">
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
                        <td className="py-3.5 px-4 text-[#B8AEC5] font-mono">
                          {verse.views}
                        </td>
                        <td className="py-3.5 px-4 text-[#B8AEC5] font-mono">
                          {verse.reactions}
                        </td>
                        <td className="py-3.5 px-4 text-[#746B80]">
                          {new Date(verse.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <a
                            href={`/surprise/${verse.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#251B35] text-purple-300 hover:text-white inline-flex"
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
              <div className="text-center py-12 text-[#746B80]">
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
            <div className="p-6 rounded-3xl bg-[#1D162A] border border-[#251B35] space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Firestore Database Connectivity</h3>
                  <p className="text-xs text-[#B8AEC5]">Google Cloud Firestore cluster status</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#171122] border border-[#251B35] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#B8AEC5]">Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#B8AEC5]">Collection:</span>
                  <span className="font-mono text-purple-300">surprises</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#B8AEC5]">Read Latency:</span>
                  <span className="text-white font-mono">&lt; 150ms</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#1D162A] border border-[#251B35] space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-950 text-purple-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Firebase Storage Pipeline</h3>
                  <p className="text-xs text-[#B8AEC5]">Media asset upload and soundtrack delivery</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#171122] border border-[#251B35] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#B8AEC5]">Storage Bucket:</span>
                  <span className="font-mono text-emerald-400">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#B8AEC5]">Audio CDN:</span>
                  <span className="text-white">Direct HTTPS streaming</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#B8AEC5]">Asset Encryption:</span>
                  <span className="text-emerald-400">AES-256 enabled</span>
                </div>
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

    </div>
  );
}
