"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";

const NAV_LINKS = [
    { label: "Jewellery", href: "/products" },
    { label: "Mangalsutras", href: "/products?category=mangalsutras" },
    { label: "New Arrivals", href: "/products?filter=new-arrivals" },
    { label: "Best Sellers", href: "/best-sellers" },
];

function NavLinks({ isMobile = false }: { isMobile?: boolean }) {
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
        <nav className={`${isMobile ? "flex flex-col items-start gap-8 w-full" : "hidden lg:flex items-center justify-center gap-10"}`}>
            {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                    <Link
                        key={link.label}
                        href={link.href}
                        className={`font-body font-medium uppercase no-underline transition-colors duration-300 ${isMobile
                            ? "text-[16px] tracking-wide"
                            : "text-[12px] tracking-widest whitespace-nowrap"
                            } ${active ? "text-emerald font-semibold" : "text-charcoal hover:text-emerald"}`}
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="w-full bg-white h-[72px] border-b border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto h-full px-4 md:px-8 grid grid-cols-[auto_1fr_auto] items-center gap-4 lg:gap-6">

                {/* ── Left: Hamburger (Mobile) + Logo ── */}
                <div className="flex items-center gap-4 shrink-0">
                    <button
                        className="lg:hidden p-1 -ml-1 text-charcoal"
                        onClick={() => setIsMenuOpen(true)}
                        aria-label="Open Menu"
                    >
                        <Menu size={24} />
                    </button>
                    <Link href="/" className="shrink-0 no-underline">
                        <div className="relative w-[180px] sm:w-[220px] h-[60px] sm:h-[80px] overflow-hidden ml-[-12px]">
                            <Image
                                src="/logo.png"
                                alt="Silvaniya – The Art of Eternal Shine"
                                fill
                                priority
                                className="object-contain object-left"
                            />
                        </div>
                    </Link>
                </div>

                {/* ── Center: Nav Links ── */}
                <Suspense fallback={<nav className="hidden lg:flex items-center justify-center gap-10"></nav>}>
                    <div className="flex justify-center w-full">
                        <NavLinks />
                    </div>
                </Suspense>

                {/* ── Right: Search + Icons ── */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0 justify-end">

                    {/* Search bar (Desktop only) */}
                    <div className="hidden lg:flex relative items-center">
                        <Search
                            size={14}
                            className="absolute left-3 text-muted-light pointer-events-none"
                        />
                        <input
                            type="text"
                            placeholder="Search for silver designs..."
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className={`w-[220px] h-9 pl-[34px] pr-[14px] text-[12px] font-body text-charcoal bg-white rounded-[24px] outline-none transition-colors duration-300 ${searchFocused ? "border border-emerald" : "border border-border"}`}
                        />
                    </div>

                    {/* Search Icon (Mobile/Tablet only) */}
                    <Link href="/search" className="lg:hidden text-charcoal transition-colors duration-300 hover:text-emerald">
                        <Search size={20} strokeWidth={1.6} />
                    </Link>

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
                        className="hidden sm:flex items-center text-charcoal transition-colors duration-300 hover:text-emerald"
                    >
                        <User size={20} strokeWidth={1.6} />
                    </Link>
                </div>

            </div>

            {/* ── Mobile Side Menu Overlay ── */}
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-100 lg:hidden transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Slide Panel */}
            <div className={`fixed top-0 left-0 h-full w-[85%] sm:w-[350px] bg-[#f4f4f4] z-101 shadow-2xl lg:hidden transition-transform duration-300 ease-out flex flex-col ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>

                {/* Mobile Menu Header with Close */}
                <div className="flex items-center justify-end p-4">
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 text-charcoal hover:bg-silver-light rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Mobile Menu Content (Nav + My Account) */}
                <div className="flex-1 overflow-y-auto px-6 py-8">

                    {/* Main Nav Links */}
                    <div className="mb-10 pb-8 border-b border-border">
                        <Suspense fallback={<div />}>
                            <div onClick={() => setIsMenuOpen(false)}>
                                <NavLinks isMobile />
                            </div>
                        </Suspense>
                    </div>

                    <h2 className="font-heading italic font-bold text-[32px] text-[#111827] mb-1">
                        My Account
                    </h2>
                    <p className="font-body text-muted text-[15px] mb-8">
                        Welcome back, John
                    </p>

                    <div className="flex flex-col gap-4">
                        <Link
                            href="/profile"
                            className="flex items-center gap-4 bg-[#1f2937] text-white p-4 rounded-[8px] font-body text-[15px] font-semibold transition-colors hover:bg-[#111827]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <User size={20} /> My Profile
                        </Link>

                        <Link
                            href="/orders"
                            className="flex items-center gap-4 text-[#111827] p-4 font-body text-[15px] font-medium transition-colors hover:bg-border rounded-[8px]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                            Order History
                        </Link>

                        <Link
                            href="/addresses"
                            className="flex items-center gap-4 text-[#111827] p-4 font-body text-[15px] font-medium transition-colors hover:bg-border rounded-[8px]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            Saved Addresses
                        </Link>

                        <Link
                            href="/wishlist"
                            className="flex items-center gap-4 text-[#111827] p-4 font-body text-[15px] font-medium transition-colors hover:bg-border rounded-[8px]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Heart size={20} /> My Wishlist
                        </Link>

                        <Link
                            href="/track"
                            className="flex items-center gap-4 text-[#111827] p-4 font-body text-[15px] font-medium transition-colors hover:bg-border rounded-[8px]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            Track Order
                        </Link>

                        <Link
                            href="/support"
                            className="flex items-center gap-4 text-[#111827] p-4 font-body text-[15px] font-medium transition-colors hover:bg-border rounded-[8px]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            Support
                        </Link>

                        <Link
                            href="/contact"
                            className="flex items-center gap-4 text-[#111827] p-4 font-body text-[15px] font-medium transition-colors hover:bg-border rounded-[8px]"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            Contact Us
                        </Link>
                    </div>

                    <div className="mt-10">
                        <button
                            className="flex items-center gap-4 text-red-600 p-4 font-body text-[15px] font-medium transition-colors hover:bg-red-50 rounded-[8px] w-full text-left"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            Logout
                        </button>
                    </div>

                </div>
            </div>
        </header>
    );
}
