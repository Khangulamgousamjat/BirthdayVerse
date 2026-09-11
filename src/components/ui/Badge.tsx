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
      "bg-gradient-to-r from-[#7659E4] to-[#9278F2] text-white shadow-2xs font-semibold",
    secondary:
      "bg-[#EFEAFB] dark:bg-[#261F36] text-[#7659E4] dark:text-[#C7BAFA] border border-[#DDD4F5] dark:border-[#382E50]",
    success:
      "bg-[#E8F5EE] dark:bg-[#1A2E24] text-[#2E7D52] dark:text-[#7ED4A6] border border-[#BDE3CC] dark:border-[#2A4D3B]",
    warning:
      "bg-[#FEF5E7] dark:bg-[#2E2413] text-[#9E6E1E] dark:text-[#E6C075] border border-[#F5DCAB] dark:border-[#4D3A1F]",
    danger:
      "bg-[#FBECEE] dark:bg-[#2F161B] text-[#B83244] dark:text-[#ECA5AF] border border-[#F4BAC2] dark:border-[#52252D]",
    purple:
      "bg-[#EFEAFB] dark:bg-[#261F36] text-[#7659E4] dark:text-[#C7BAFA] border border-[#DDD4F5] dark:border-[#382E50]",
    outline:
      "bg-transparent text-[#736886] dark:text-[#ACA2BE] border border-[#E8DFFA] dark:border-[#282038]",
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
