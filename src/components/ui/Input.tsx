import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-[#746B80] dark:text-[#B8AEC5] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-2xl bg-white dark:bg-[#1D162A] text-[#241B35] dark:text-[#F7F3FC] border border-[#EDE7F6] dark:border-[#251B35] px-4 py-2.5 text-sm transition-all duration-200 placeholder:text-[#746B80]/50 dark:placeholder:text-[#B8AEC5]/50 focus:outline-none focus:border-[#9D6BFF] focus:ring-2 focus:ring-[#9D6BFF]/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs",
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-[#746B80] dark:text-[#B8AEC5] flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-[11px] font-medium text-rose-500">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-[#746B80] dark:text-[#B8AEC5]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
