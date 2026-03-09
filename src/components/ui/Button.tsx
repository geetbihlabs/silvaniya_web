import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    {
        variants: {
            variant: {
                primary:
                    "bg-charcoal text-white font-semibold text-[11px] uppercase tracking-[0.15em] hover:bg-charcoal-light active:bg-charcoal-dark focus-visible:ring-charcoal",
                emerald:
                    "bg-emerald text-white font-semibold text-[11px] uppercase tracking-[0.15em] hover:bg-emerald-light active:bg-emerald-dark focus-visible:ring-emerald",
                outline:
                    "border border-charcoal text-charcoal bg-transparent font-semibold text-[11px] uppercase tracking-[0.15em] hover:bg-charcoal hover:text-white focus-visible:ring-charcoal",
                "outline-emerald":
                    "border border-emerald text-emerald bg-transparent font-semibold text-[11px] uppercase tracking-[0.15em] hover:bg-emerald hover:text-white focus-visible:ring-emerald",
                ghost:
                    "text-charcoal font-medium hover:bg-silver-light active:bg-silver focus-visible:ring-charcoal",
                link:
                    "text-emerald underline-offset-4 hover:underline p-0 h-auto font-medium focus-visible:ring-emerald",
                danger:
                    "bg-error text-white font-semibold text-[11px] uppercase tracking-[0.15em] hover:opacity-90 focus-visible:ring-error",
            },
            size: {
                sm: "h-9 px-4 text-[10px] rounded-[2px]",
                md: "h-11 px-6 rounded-[2px]",
                lg: "h-12 px-8 rounded-[2px]",
                xl: "h-14 px-10 rounded-[2px]",
                icon: "h-10 w-10 rounded-[2px]",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
