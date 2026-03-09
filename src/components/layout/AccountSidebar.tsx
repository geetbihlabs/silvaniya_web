"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, MapPin, Heart, LogOut } from "lucide-react";
import { ACCOUNT_SIDEBAR_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
    User,
    Package,
    MapPin,
    Heart,
};

export default function AccountSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:block w-full lg:w-60 shrink-0">
            {/* Account Header */}
            <div className="mb-6">
                <h2 className="text-2xl lg:text-3xl font-semibold text-charcoal" style={{ fontFamily: "var(--font-heading)" }}>
                    My Account
                </h2>
                <p className="text-sm text-muted mt-1">Welcome back, John</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
                {ACCOUNT_SIDEBAR_LINKS.map((link) => {
                    const Icon = iconMap[link.icon];
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-charcoal text-white"
                                    : "text-charcoal hover:bg-gray-100"
                            )}
                        >
                            {Icon && <Icon size={18} />}
                            {link.label}
                        </Link>
                    );
                })}

                {/* Logout */}
                <div className="pt-4">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-error hover:bg-red-50 transition-all duration-200 w-full">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </nav>
        </aside>
    );
}
