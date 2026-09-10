import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "purple" | "outline";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "secondary",
  size = "sm",
  children,
  ...props
}) => {
  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#9D6BFF] to-[#F47FB5] text-white shadow-2xs font-bold",
    secondary:
      "bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] border border-[#EDE7F6] dark:border-[#251B35]",
    success:
      "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    warning:
      "bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    danger:
      "bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800",
    purple:
      "bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800",
    outline:
      "bg-transparent text-[#746B80] dark:text-[#B8AEC5] border border-[#EDE7F6] dark:border-[#251B35]",
  };

  const sizeStyles = {
    sm: "text-[10px] px-2.5 py-0.5 rounded-full font-semibold tracking-wide",
    md: "text-xs px-3 py-1 rounded-full font-semibold tracking-wide",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
