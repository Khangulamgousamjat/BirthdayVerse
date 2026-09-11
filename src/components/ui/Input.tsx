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
            className="block text-xs font-semibold text-[#736886] dark:text-[#ACA2BE] tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-[#736886] dark:text-[#ACA2BE] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-2xl bg-white dark:bg-[#1E182A] text-[#211A30] dark:text-[#F7F5FC] border border-[#E8DFFA] dark:border-[#282038] px-4 py-2.5 text-sm transition-all duration-200 placeholder:text-[#736886]/50 dark:placeholder:text-[#ACA2BE]/50 focus:outline-none focus:border-[#7659E4] focus:ring-2 focus:ring-[#7659E4]/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs",
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-[#736886] dark:text-[#ACA2BE] flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-[11px] font-medium text-rose-500">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-[#736886] dark:text-[#ACA2BE]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
