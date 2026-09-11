import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxCharacters?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, maxCharacters, value, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full space-y-1.5 text-left">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={inputId}
              className="block text-xs font-semibold text-[#736886] dark:text-[#ACA2BE] tracking-wide"
            >
              {label}
            </label>
          )}
          {maxCharacters && (
            <span
              className={cn(
                "text-[10px] font-medium tracking-wide",
                currentLength > maxCharacters
                  ? "text-rose-500 font-bold"
                  : "text-[#736886] dark:text-[#ACA2BE]"
              )}
            >
              {currentLength}/{maxCharacters}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          id={inputId}
          value={value}
          className={cn(
            "w-full rounded-2xl bg-white dark:bg-[#1E182A] text-[#211A30] dark:text-[#F7F5FC] border border-[#E8DFFA] dark:border-[#282038] px-4 py-3 text-sm transition-all duration-200 placeholder:text-[#736886]/50 dark:placeholder:text-[#ACA2BE]/50 focus:outline-none focus:border-[#7659E4] focus:ring-2 focus:ring-[#7659E4]/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs resize-y min-h-[110px]",
            error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-[11px] font-medium text-rose-500">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-[#736886] dark:text-[#ACA2BE]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
