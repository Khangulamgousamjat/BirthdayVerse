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
        "p-6 rounded-3xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#251B35] shadow-xs hover:shadow-md transition-all duration-200 group text-left",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] tracking-wide uppercase">
          {label}
        </span>
        {icon && (
          <div className="p-2.5 rounded-2xl bg-[#EDE7F6]/60 dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] group-hover:scale-105 transition-transform">
            {icon}
          </div>
        )}
      </div>

      <div className="text-2xl sm:text-3xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] tracking-tight mb-1">
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
                : "text-[#746B80] dark:text-[#B8AEC5]"
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
          <span className="text-[11px] text-[#746B80] dark:text-[#B8AEC5]">
            {description}
          </span>
        )}
      </div>
    </div>
  );
};
