import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  change,
  trend = "up",
  description,
  className,
}) => {
  return (
    <div
      className={cn(
        "p-6 rounded-3xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] shadow-xs hover:shadow-md transition-all duration-200 group text-left",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[#736886] dark:text-[#ACA2BE] tracking-wide uppercase">
          {label}
        </span>
        {icon && (
          <div className="p-2.5 rounded-2xl bg-[#EFEAFB] dark:bg-[#261F36] text-[#7659E4] dark:text-[#C7BAFA] border border-[#DDD4F5]/50 dark:border-[#382E50]/60 group-hover:scale-105 transition-transform">
            {icon}
          </div>
        )}
      </div>

      <div className="text-2xl sm:text-3xl font-display font-bold text-[#211A30] dark:text-[#F7F5FC] tracking-tight mb-1">
        {value}
      </div>

      <div className="flex items-center gap-2">
        {change && (
          <span
            className={cn(
              "text-[11px] font-semibold flex items-center gap-1",
              trend === "up"
                ? "text-emerald-600 dark:text-emerald-400"
                : trend === "down"
                ? "text-rose-600 dark:text-rose-400"
                : "text-[#736886] dark:text-[#ACA2BE]"
            )}
          >
            {trend === "up" ? (
              <TrendingUp className="w-3 h-3" />
            ) : trend === "down" ? (
              <TrendingDown className="w-3 h-3" />
            ) : null}
            <span>{change}</span>
          </span>
        )}
        {description && (
          <span className="text-[11px] text-[#736886] dark:text-[#ACA2BE]">
            {description}
          </span>
        )}
      </div>
    </div>
  );
};
