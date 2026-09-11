import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "gold" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      containerClassName = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium tracking-tight rounded-2xl transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8E72F0] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-[#7659E4] via-[#8569EC] to-[#967EF2] text-white shadow-md shadow-[#7659E4]/20 hover:shadow-lg hover:shadow-[#7659E4]/30 hover:brightness-105 active:scale-[0.98]",
      secondary:
        "bg-white dark:bg-[#1E182A] text-[#211A30] dark:text-[#F7F5FC] border border-[#E8DFFA] dark:border-[#282038] hover:bg-[#F3EEFA]/80 dark:hover:bg-[#261F36] active:scale-[0.98] shadow-xs",
      outline:
        "border border-[#8E72F0]/35 text-[#7659E4] dark:text-[#A28DF8] hover:bg-[#EFEAFB]/60 dark:hover:bg-[#261F36] active:scale-[0.98]",
      ghost:
        "text-[#736886] dark:text-[#ACA2BE] hover:text-[#211A30] dark:hover:text-[#F7F5FC] hover:bg-[#EFEAFB]/50 dark:hover:bg-[#261F36] active:scale-[0.98]",
      gold:
        "bg-gradient-to-r from-[#C2923A] via-[#D8BE75] to-[#E2BC72] text-white font-semibold shadow-md shadow-amber-500/15 hover:brightness-105 active:scale-[0.98]",
      danger:
        "bg-[#D34B5A] text-white hover:bg-[#C23C4B] active:scale-[0.98] shadow-sm",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 h-8 gap-1.5",
      md: "text-xs sm:text-sm px-5 py-2.5 h-10 gap-2",
      lg: "text-sm sm:text-base px-6 py-3.5 h-12 gap-2.5 rounded-2xl",
      icon: "h-9 w-9 p-0 rounded-xl",
    };

    const isFullWidth = containerClassName.includes("w-full");

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          isFullWidth ? "w-full" : "",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
