import React from "react";
import { Shield, Truck, Award } from "lucide-react";
import { TRUST_BADGES } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
    Shield,
    Truck,
    Award,
};

export default function TrustBadges() {
    return (
        <section className="py-10 lg:py-14 border-y border-border">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
                    {TRUST_BADGES.map((badge) => {
                        const Icon = iconMap[badge.icon];
                        return (
                            <div
                                key={badge.title}
                                className="flex flex-col items-center text-center px-4"
                            >
                                {Icon && <Icon size={28} className="text-charcoal mb-3" strokeWidth={1.5} />}
                                <h4 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-1">
                                    {badge.title}
                                </h4>
                                <p className="text-xs text-muted leading-relaxed max-w-xs">
                                    {badge.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
