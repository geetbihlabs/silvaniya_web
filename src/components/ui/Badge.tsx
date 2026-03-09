import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full font-medium transition-colors",
    {
        variants: {
            variant: {
                default: "bg-charcoal text-white",
                emerald: "bg-emerald text-white",
                outline: "border border-charcoal text-charcoal bg-transparent",
                "outline-emerald": "border border-emerald text-emerald bg-transparent",
                success: "bg-green-50 text-green-700 border border-green-200",
                warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
                error: "bg-red-50 text-red-700 border border-red-200",
                info: "bg-blue-50 text-blue-700 border border-blue-200",
                muted: "bg-gray-100 text-gray-600",
                premium: "bg-charcoal text-white",
            },
            size: {
                sm: "px-2 py-0.5 text-xs",
                md: "px-3 py-1 text-xs",
                lg: "px-4 py-1.5 text-sm",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> { }

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(badgeVariants({ variant, size, className }))}
                {...props}
            />
        );
    }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
