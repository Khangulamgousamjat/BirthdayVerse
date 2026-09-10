import React from "react";
import { 
  Users, 
  Layers, 
  Eye, 
  UserPlus, 
  ShieldCheck, 
  Activity, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp
} from "lucide-react";

export const AdminDashboardView: React.FC = () => {
  const metrics = [
    { label: "Total Users", value: "12,482", icon: <Users className="w-4 h-4 text-purple-500" />, change: "+12% this month" },
    { label: "Total Verses", value: "8,931", icon: <Layers className="w-4 h-4 text-blue-500" />, change: "+8% this month" },
    { label: "Total Views", value: "248,231", icon: <Eye className="w-4 h-4 text-pink-500" />, change: "+24% this week" },
    { label: "New Users Today", value: "142", icon: <UserPlus className="w-4 h-4 text-emerald-500" />, change: "Active growth" },
  ];

  const recentActivity = [
    { text: "New user registered: priya.sharma@gmail.com", time: "2 mins ago", type: "user" },
    { text: "Verse published for 'Aanya' (Golden Elegance)", time: "5 mins ago", type: "verse" },
    { text: "Cloud Scheduler executed 72h purge (14 verses cleaned)", time: "12 mins ago", type: "purge" },
    { text: "Template previewed: 'Midnight Disco'", time: "18 mins ago", type: "view" },
    { text: "Audio stream optimized: 'Acoustic Piano Cafe'", time: "24 mins ago", type: "sys" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EDE7F6] dark:border-[#251B35]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Admin Cockpit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC]">
            Platform Overview & System Health
          </h1>
          <p className="text-xs sm:text-sm text-[#746B80] dark:text-[#B8AEC5] mt-1">
            Real-time analytics, user metrics, and automated 72-hour purge compliance monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Systems Operational
          </span>
        </div>
      </div>

      {/* Metrics Row (Board 1 Panel 9) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#746B80] dark:text-[#B8AEC5] uppercase tracking-wide">
                {m.label}
              </span>
              <div className="p-2 rounded-xl bg-[#F8F6FC] dark:bg-[#171122]">
                {m.icon}
              </div>
            </div>
            <p className="text-3xl font-bold font-display text-[#241B35] dark:text-[#F7F3FC] mb-1">
              {m.value}
            </p>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{m.change}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Analytics Chart & 72h Purge Health Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Verse Views Line Chart (Cols 1-7) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#241B35] dark:text-[#F7F3FC]">
                Verse Views Traffic
              </h2>
              <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">
                Last 7 days dynamic recipient interactions
              </p>
            </div>
            <span className="text-xs font-bold text-[#7952D6] dark:text-[#9D6BFF] bg-[#EDE7F6] dark:bg-[#251B35] px-3 py-1 rounded-full">
              Last 7 Days
            </span>
          </div>

          {/* SVG Line Graph */}
          <div className="h-56 w-full pt-4 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9D6BFF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#9D6BFF" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#EDE7F6" strokeDasharray="4 4" strokeWidth="1" className="dark:stroke-gray-800" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#EDE7F6" strokeDasharray="4 4" strokeWidth="1" className="dark:stroke-gray-800" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#EDE7F6" strokeDasharray="4 4" strokeWidth="1" className="dark:stroke-gray-800" />

              {/* Area Fill */}
              <path
                d="M 0 160 Q 80 140 160 90 T 320 110 T 500 30 L 500 200 L 0 200 Z"
                fill="url(#chartGradient)"
              />

              {/* Line */}
              <path
                d="M 0 160 Q 80 140 160 90 T 320 110 T 500 30"
                fill="none"
                stroke="#9D6BFF"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Interactive points */}
              <circle cx="0" cy="160" r="4" fill="#7952D6" />
              <circle cx="160" cy="90" r="4" fill="#7952D6" />
              <circle cx="320" cy="110" r="4" fill="#7952D6" />
              <circle cx="500" cy="30" r="5" fill="#F47FB5" />
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[10px] text-[#746B80] dark:text-[#B8AEC5] font-semibold mt-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* 72h Purge Health Panel (Cols 8-12) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h2 className="text-sm font-bold text-[#241B35] dark:text-[#F7F3FC]">
                  72h Purge Health Panel
                </h2>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3" />
                <span>100% Verified</span>
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-[#F8F6FC] dark:bg-[#171122] flex items-center justify-between">
                <span className="text-xs text-[#746B80] dark:text-[#B8AEC5]">Purged in Last 24h</span>
                <span className="text-sm font-bold text-[#241B35] dark:text-[#F7F3FC]">48 Verses</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8F6FC] dark:bg-[#171122] flex items-center justify-between">
                <span className="text-xs text-[#746B80] dark:text-[#B8AEC5]">Orphaned Storage Files</span>
                <span className="text-sm font-bold text-emerald-600">0 (Clean)</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8F6FC] dark:bg-[#171122] flex items-center justify-between">
                <span className="text-xs text-[#746B80] dark:text-[#B8AEC5]">Storage Space Reclaimed</span>
                <span className="text-sm font-bold text-[#7952D6] dark:text-[#9D6BFF]">14.8 GB</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#F8F6FC] dark:bg-[#171122] flex items-center justify-between">
                <span className="text-xs text-[#746B80] dark:text-[#B8AEC5]">Scheduled Next Run</span>
                <span className="text-xs font-mono text-[#746B80] dark:text-[#B8AEC5]">in 8 mins</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5] border-t border-[#EDE7F6] dark:border-[#251B35] pt-3">
            Every file, photo, and voice message is permanently erased at T+72h.
          </p>
        </div>

      </div>

      {/* Recent Activity Live Stream */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#7952D6] dark:text-[#9D6BFF]" />
          <h2 className="text-sm font-bold text-[#241B35] dark:text-[#F7F3FC]">
            Recent Activity Live Stream
          </h2>
        </div>

        <div className="space-y-2">
          {recentActivity.map((act, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F6FC] dark:bg-[#171122] text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#9D6BFF]" />
                <span className="text-[#241B35] dark:text-[#F7F3FC] font-medium">{act.text}</span>
              </div>
              <span className="text-[10px] text-[#746B80] dark:text-[#B8AEC5] font-mono">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
