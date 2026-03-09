import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="label-caps block mb-2 text-charcoal"
                    >
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    id={inputId}
                    className={cn(
                        "flex h-11 w-full rounded-[2px] border border-silver bg-cream px-4 py-2 text-sm text-charcoal placeholder:text-muted-light transition-colors duration-500 ease-out font-body",
                        "focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald",
                        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-silver-light",
                        error && "border-error focus:border-error focus:ring-error",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1.5 text-xs text-error">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
