"use client";

import React from "react";
import { Search, Menu } from "lucide-react";
import NotificationBell from "@/components/layout/NotificationBell";

interface AdminTopbarProps {
    onMobileMenuToggle: () => void;
}

export default function AdminTopbar({ onMobileMenuToggle }: AdminTopbarProps) {
    return (
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
            {/* Left - Mobile Menu + Search */}
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMobileMenuToggle}
                    className="lg:hidden p-2 text-charcoal hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Toggle menu"
                >
                    <Menu size={22} />
                </button>

                <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md">
                    <div className="relative w-full">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                            type="text"
                            placeholder="Search orders, products, customers..."
                            className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-border bg-gray-50 text-charcoal placeholder:text-muted focus:outline-none focus:border-charcoal focus:bg-white transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Right - Notifications + Profile */}
            <div className="flex items-center gap-3">
                <NotificationBell />

                <div className="h-8 w-px bg-border" />

                <div className="flex items-center gap-3 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center text-xs font-semibold">
                        SA
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-semibold text-charcoal leading-none">Super Admin</p>
                        <p className="text-[11px] text-muted">admin@silvaniya.com</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

