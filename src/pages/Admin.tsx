import { useEffect, useState } from "react";
import { Eye, EyeOff, LockKeyhole, LogOut, Settings2, ShieldCheck, Sparkles } from "lucide-react";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";

const DEFAULT_PASSWORD_HASH = "59eafbae0bb4a62fbfb4933f8800482264da9301a8384284f0205704d075a44a";
const PASSWORD_HASH_KEY = "birthdayverse_admin_password_hash";
const SESSION_KEY = "birthdayverse_admin_session";

async function hashPassword(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getStoredHash() {
  return localStorage.getItem(PASSWORD_HASH_KEY) || DEFAULT_PASSWORD_HASH;
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.title = authenticated ? "Birthday Verse Admin" : "Birthday Verse Admin Login";
    return () => {
      document.title = "Birthday Verse";
    };
  }, [authenticated]);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const hash = await hashPassword(password);
    if (hash !== getStoredHash()) {
      setError("Incorrect password.");
      setPassword("");
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");
    setAuthenticated(true);
    setPassword("");
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
    setShowSettings(false);
  };

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSaved(false);
    if (newPassword.length < 8) {
      setError("Use at least 8 characters for the new password.");
      return;
    }
    localStorage.setItem(PASSWORD_HASH_KEY, await hashPassword(newPassword));
    setNewPassword("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#F8F6FC] text-[#241B35] dark:bg-[#100C18] dark:text-[#F7F3FC] flex items-center justify-center px-5 py-10 relative overflow-hidden">
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-[#9D6BFF]/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-[#F47FB5]/10 blur-3xl" />
        <form onSubmit={login} className="relative w-full max-w-md rounded-[28px] border border-[#E5DFF0] bg-white/90 p-8 shadow-[0_24px_80px_rgba(80,55,130,.12)] backdrop-blur-xl dark:border-[#332744] dark:bg-[#1D162A]/95">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EDE7F6] text-[#7952D6] dark:bg-[#251B35] dark:text-[#A77BFF]"><ShieldCheck className="h-6 w-6" /></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#7952D6] dark:text-[#A77BFF]">Birthday Verse</p>
              <h1 className="text-2xl font-semibold">Admin access</h1>
            </div>
          </div>
          <div className="mb-6 rounded-2xl bg-[#F8F6FC] p-4 text-sm text-[#746B80] dark:bg-[#171122] dark:text-[#B8AEC5]">
            <div className="flex gap-3"><LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-[#9D6BFF]" /><p>Password only. No username is required.</p></div>
          </div>
          <label className="mb-2 block text-sm font-semibold">Admin password</label>
          <div className="relative">
            <input autoFocus value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} className="w-full rounded-2xl border border-[#E5DFF0] bg-white px-4 py-3.5 pr-12 outline-none transition focus:border-[#9D6BFF] focus:ring-4 focus:ring-[#9D6BFF]/10 dark:border-[#332744] dark:bg-[#171122]" placeholder="Enter password" />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-[#746B80] hover:bg-[#EDE7F6] dark:hover:bg-[#251B35]" aria-label="Toggle password visibility">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button>
          </div>
          {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}
          <button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#9D6BFF] to-[#7952D6] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#9D6BFF]/20 transition hover:-translate-y-0.5">Unlock Admin <Sparkles className="h-4 w-4" /></button>
          <p className="mt-5 text-center text-xs text-[#746B80] dark:text-[#B8AEC5]">Private control panel for Birthday Verse.</p>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6FC] text-[#241B35] dark:bg-[#100C18] dark:text-[#F7F3FC] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-[#E5DFF0] bg-white/90 px-5 py-4 shadow-sm backdrop-blur dark:border-[#332744] dark:bg-[#1D162A]/90">
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EDE7F6] text-[#7952D6] dark:bg-[#251B35] dark:text-[#A77BFF]"><ShieldCheck className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#7952D6] dark:text-[#A77BFF]">Birthday Verse</p><h1 className="font-semibold">Admin Control Center</h1></div></div>
          <div className="flex items-center gap-2"><button onClick={() => setShowSettings((v) => !v)} className="inline-flex items-center gap-2 rounded-xl border border-[#E5DFF0] px-3 py-2 text-sm font-semibold hover:bg-[#F8F6FC] dark:border-[#332744] dark:hover:bg-[#251B35]"><Settings2 className="h-4 w-4" /> Security</button><button onClick={logout} className="inline-flex items-center gap-2 rounded-xl bg-[#241B35] px-3 py-2 text-sm font-semibold text-white hover:opacity-90 dark:bg-white dark:text-[#241B35]"><LogOut className="h-4 w-4" /> Logout</button></div>
        </header>
        {showSettings && <section className="mb-6 rounded-3xl border border-[#E5DFF0] bg-white p-5 shadow-sm dark:border-[#332744] dark:bg-[#1D162A]"><h2 className="mb-1 font-semibold">Change admin password</h2><p className="mb-4 text-sm text-[#746B80] dark:text-[#B8AEC5]">The new password is stored in this browser for future admin sessions.</p><form onSubmit={changePassword} className="flex max-w-xl flex-col gap-3 sm:flex-row"><input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" className="flex-1 rounded-2xl border border-[#E5DFF0] bg-white px-4 py-3 outline-none focus:border-[#9D6BFF] dark:border-[#332744] dark:bg-[#171122]" placeholder="New password (8+ characters)" /><button className="rounded-2xl bg-[#9D6BFF] px-5 py-3 font-semibold text-white">Update password</button></form>{error && <p className="mt-3 text-sm text-rose-600">{error}</p>}{saved && <p className="mt-3 text-sm font-semibold text-emerald-600">Password updated.</p>}</section>}
        <AdminDashboardView />
      </div>
    </main>
  );
}
