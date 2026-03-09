"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, Heart, ShoppingBag, User } from "lucide-react";

const NAV_LINKS = [
    { label: "Jewellery", href: "/products" },
    { label: "Mangalsutras", href: "/products?category=mangalsutras" },
    { label: "New Arrivals", href: "/products?filter=new-arrivals" },
    { label: "Best Sellers", href: "/products?filter=bestsellers" },
];

function NavLinks() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isActive = (href: string) => {
        const [path, query] = href.split("?");
        if (pathname !== path) return false;

        if (query) {
            const urlSearchParams = new URLSearchParams(query);
            for (const [key, value] of urlSearchParams.entries()) {
                if (searchParams.get(key) !== value) return false;
            }
            return true;
        }

        if (searchParams.has("category") || searchParams.has("filter")) {
            return false;
        }

        return true;
    };

    return (
        <nav className="hidden lg:flex items-center justify-center gap-10">
            {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                    <Link
                        key={link.label}
                        href={link.href}
                        className={`font-body text-[12px] font-medium tracking-[0.1em] uppercase whitespace-nowrap transition-colors duration-300 no-underline ${active ? "text-emerald font-semibold" : "text-charcoal hover:text-emerald"
                            }`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}

export default function Navbar() {
    const [searchFocused, setSearchFocused] = useState(false);

    return (
        <header className="w-full bg-white h-[72px] border-b border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto h-full grid grid-cols-[auto_1fr_auto] items-center gap-6">

                {/* ── Left: Logo ── */}
                <Link href="/" className="shrink-0 no-underline">
                    <div className="relative w-[220px] h-[80px] overflow-hidden ml-[-12px]">
                        <Image
                            src="/logo.png"
                            alt="Silvaniya – The Art of Eternal Shine"
                            fill
                            priority
                            className="object-contain object-left"
                        />
                    </div>
                </Link>

                {/* ── Center: Nav Links ── */}
                <Suspense fallback={<nav className="hidden lg:flex items-center justify-center gap-10"></nav>}>
                    <NavLinks />
                </Suspense>

                {/* ── Right: Search + Icons ── */}
                <div className="flex items-center gap-4 shrink-0">

                    {/* Search bar */}
                    <div className="hidden md:flex relative items-center">
                        <Search
                            size={14}
                            className="absolute left-3 text-muted-light pointer-events-none"
                        />
                        <input
                            type="text"
                            placeholder="Search for silver designs..."
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className={`w-[220px] h-9 pl-[34px] pr-[14px] text-[12px] font-body text-charcoal bg-white rounded-[24px] outline-none transition-colors duration-300 ${searchFocused ? "border border-emerald" : "border border-border"
                                }`}
                        />
                    </div>

                    {/* Wishlist */}
                    <Link
                        href="/wishlist"
                        aria-label="Wishlist"
                        className="flex items-center text-charcoal transition-colors duration-300 hover:text-emerald"
                    >
                        <Heart size={20} strokeWidth={1.6} />
                    </Link>

                    {/* Cart */}
                    <Link
                        href="/cart"
                        aria-label="Cart"
                        className="relative flex items-center text-charcoal transition-colors duration-300 hover:text-emerald"
                    >
                        <ShoppingBag size={20} strokeWidth={1.6} />
                        <span className="absolute -top-[6px] -right-[8px] bg-emerald text-white text-[9px] font-bold font-body w-4 h-4 rounded-full flex items-center justify-center">
                            2
                        </span>
                    </Link>

                    {/* User */}
                    <Link
                        href="/profile"
                        aria-label="Account"
                        className="flex items-center text-charcoal transition-colors duration-300 hover:text-emerald"
                    >
                        <User size={20} strokeWidth={1.6} />
                    </Link>
                </div>

            </div>
        </header>
    );
}
