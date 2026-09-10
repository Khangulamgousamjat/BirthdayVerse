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
              className="block text-xs font-semibold text-[#746B80] dark:text-[#B8AEC5] tracking-wide"
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
                  : "text-[#746B80] dark:text-[#B8AEC5]"
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
            "w-full rounded-2xl bg-white dark:bg-[#1D162A] text-[#241B35] dark:text-[#F7F3FC] border border-[#EDE7F6] dark:border-[#251B35] px-4 py-3 text-sm transition-all duration-200 placeholder:text-[#746B80]/50 dark:placeholder:text-[#B8AEC5]/50 focus:outline-none focus:border-[#9D6BFF] focus:ring-2 focus:ring-[#9D6BFF]/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs resize-y min-h-[110px]",
            error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-[11px] font-medium text-rose-500">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-[#746B80] dark:text-[#B8AEC5]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
