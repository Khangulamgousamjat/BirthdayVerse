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
      "inline-flex items-center justify-center font-medium tracking-tight rounded-2xl transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9D6BFF] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-[#7952D6] via-[#8B5CF6] to-[#9D6BFF] text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 hover:brightness-105 active:scale-[0.98]",
      secondary:
        "bg-white dark:bg-[#1D162A] text-[#241B35] dark:text-[#F7F3FC] border border-[#EDE7F6] dark:border-[#251B35] hover:bg-[#EDE7F6]/50 dark:hover:bg-[#251B35] active:scale-[0.98] shadow-xs",
      outline:
        "border border-[#9D6BFF]/40 text-[#7952D6] dark:text-[#9D6BFF] hover:bg-[#EDE7F6]/50 dark:hover:bg-[#251B35]/50 active:scale-[0.98]",
      ghost:
        "text-[#746B80] dark:text-[#B8AEC5] hover:text-[#241B35] dark:hover:text-white hover:bg-[#EDE7F6]/50 dark:hover:bg-[#251B35]/50 active:scale-[0.98]",
      gold:
        "bg-gradient-to-r from-[#D97706] via-[#E7B85C] to-[#F59E0B] text-white font-semibold shadow-md shadow-amber-500/20 hover:brightness-105 active:scale-[0.98]",
      danger:
        "bg-rose-500 text-white hover:bg-rose-600 active:scale-[0.98] shadow-sm shadow-rose-500/20",
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
