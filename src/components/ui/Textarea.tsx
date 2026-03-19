"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-[2px] border border-silver bg-cream px-4 py-2 text-sm text-charcoal placeholder:text-muted-light transition-colors duration-500 ease-out font-body",
          "focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-silver-light",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
