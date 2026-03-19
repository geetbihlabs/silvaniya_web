"use client";

import React, { useState, Suspense, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Layers, Sparkles, TrendingUp, Compass } from "lucide-react";
import { UserButton, useAuth, SignOutButton } from "@clerk/nextjs";
import CartBadge from "./CartBadge";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCategoryStore } from "@/store/useCategoryStore";

function WishlistBadge() {
    const { items, initialized } = useWishlistStore();
    
    if (!initialized || items.length === 0) return null;
    
    return (
        <span className="absolute -top-1.5 -right-2 bg-[#e84c4c] text-white text-[10px] font-bold h-4 min-w-[16px] flex items-center justify-center rounded-full px-1 z-10">
            {items.length}
        </span>
    );
}

const FALLBACK_CATEGORIES = [
    { label: "Necklaces", href: "/products?category=necklaces" },
    { label: "Earrings", href: "/products?category=earrings" },
    { label: "Rings", href: "/products?category=rings" },
    { label: "Bracelets", href: "/products?category=bracelets" },
    { label: "Mangalsutras", href: "/products?category=mangalsutras" },
    { label: "Pendants", href: "/products?category=pendants" },
];

type NavItem = { label: string; href?: string; isDropdown?: boolean; items?: { label: string; href: string; description?: string; imageUrl?: string | null }[] };

function NavLinks({ isMobile = false }: { isMobile?: boolean }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
    
    const { categories, fetchCategories } = useCategoryStore();

    useEffect(() => {
        if (categories.length === 0) {
            fetchCategories();
        }
    }, [categories.length, fetchCategories]);

    const navLinks: NavItem[] = useMemo(() => {
        const dynamicCategories = categories.length > 0 
            ? categories.filter(c => c.isVisible !== false).map(cat => ({ 
                label: cat.name, 
                href: `/products?category=${cat.slug}`,
                description: cat.description || `Explore our beautiful collection of premium ${cat.name.toLowerCase()} crafted in pure silver.`,
                imageUrl: cat.imageUrl ?? null,
              }))
            : FALLBACK_CATEGORIES.map(cat => ({
                ...cat,
                description: `Explore our beautiful collection of premium ${cat.label.toLowerCase()} crafted in pure silver.`,
                imageUrl: null,
            }));

        return [
            { label: "Jewellery", href: "/products" },
            { label: "Categories", isDropdown: true, items: dynamicCategories },
            { label: "New Arrivals", href: "/products?filter=new-arrivals" },
            { label: "Best Sellers", href: "/best-sellers" },
        ];
    }, [categories]);

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
        <nav className={`${isMobile ? "flex flex-col items-start gap-6 w-full" : "hidden lg:flex items-center justify-center gap-10"}`}>
            {navLinks.map((link) => {
                if (link.isDropdown) {
                    return (
                        <div key={link.label} className={`${isMobile ? "w-full" : "relative group"}`}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMobileDropdownOpen(mobileDropdownOpen === link.label ? null : link.label);
                                }}
                                className={`flex items-center gap-1.5 font-body font-medium uppercase transition-colors duration-300 w-full text-left ${isMobile
                                    ? "text-[16px] tracking-wide"
                                    : "text-[12px] tracking-widest whitespace-nowrap"
                                    } text-charcoal hover:text-emerald lg:group-hover:text-emerald`}
                            >
                                {link.label}
                                <ChevronDown size={isMobile ? 18 : 14} className={`transition-transform duration-300 ${isMobile && mobileDropdownOpen === link.label ? "rotate-180" : ""} lg:group-hover:rotate-180`} />
                            </button>

                            {/* Transparent bridge for desktop hover gap */}
                            {!isMobile && <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-48 h-10 bg-transparent z-40" />}

                            {/* Desktop Mega Menu */}
                            {!isMobile && (
                                <div className="fixed top-[72px] left-0 w-full pt-0 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50 max-h-[calc(100vh-72px)] overflow-y-auto">
                                    <div className="bg-white border-t border-border shadow-2xl pb-12 pt-10 px-4 w-full cursor-auto">
                                        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-10">
                                                {link.items?.map((item) => (
                                                    <Link
                                                        key={item.label}
                                                        href={item.href!}
                                                        className="flex items-start gap-5 p-3 rounded-2xl border border-transparent hover:bg-silver-light/50 transition-all duration-300 group/item"
                                                    >
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border group-hover/item:border-emerald/50 transition-all bg-silver-light/30 flex items-center justify-center">
                                                            {item.imageUrl ? (
                                                                <Image
                                                                    src={item.imageUrl}
                                                                    alt={item.label}
                                                                    width={64}
                                                                    height={64}
                                                                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                                                                />
                                                            ) : (
                                                                <Layers className="w-7 h-7 text-emerald/70" strokeWidth={1.5} />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col gap-1.5 pt-1">
                                                            <span className="text-charcoal font-body font-semibold text-[17px] tracking-wide group-hover/item:text-emerald transition-colors">{item.label}</span>
                                                            <span className="text-muted font-body text-[13px] leading-relaxed line-clamp-2">
                                                                {item.description}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* Bottom promotional cards */}
                                            <div className="mt-14 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <Link href="/products" className="bg-silver-light/20 hover:bg-silver-light/50 border border-border p-6 rounded-2xl transition-all duration-300 group/card overflow-hidden relative block shadow-sm hover:shadow-md">
                                                    <div className="absolute right-0 bottom-0 opacity-[0.03] group-hover/card:scale-110 group-hover/card:-rotate-12 group-hover/card:opacity-[0.05] transition-transform duration-500 text-charcoal">
                                                        <Compass className="w-40 h-40 -mr-10 -mb-10" />
                                                    </div>
                                                    <h3 className="text-charcoal font-heading font-bold text-lg mb-2 relative z-10 flex items-center gap-2">Complete Collection</h3>
                                                    <p className="text-muted font-body text-sm relative z-10 max-w-[85%] leading-relaxed">Browse our complete collection of classic and contemporary 925 silver jewellery designs.</p>
                                                </Link>

                                                <Link href="/reviews" className="bg-silver-light/20 hover:bg-silver-light/50 border border-border p-6 rounded-2xl transition-all duration-300 group/card overflow-hidden relative block shadow-sm hover:shadow-md">
                                                    <div className="absolute right-0 bottom-0 opacity-[0.03] group-hover/card:scale-110 group-hover/card:rotate-12 group-hover/card:opacity-[0.05] transition-transform duration-500 text-charcoal">
                                                        <Sparkles className="w-40 h-40 -mr-10 -mb-10" />
                                                    </div>
                                                    <h3 className="text-charcoal font-heading font-bold text-lg mb-2 relative z-10 flex items-center gap-2">Customer Success</h3>
                                                    <p className="text-muted font-body text-sm relative z-10 max-w-[85%] leading-relaxed">
                                                        Testimonials and stories from our loyal customers.<br/>
                                                        <span className="text-emerald font-semibold text-xl inline-block mt-3 tracking-wide">1000+</span> satisfied clients
                                                    </p>
                                                </Link>

                                                <Link href="/support" className="bg-silver-light/20 hover:bg-silver-light/50 border border-border p-6 rounded-2xl transition-all duration-300 group/card overflow-hidden relative block shadow-sm hover:shadow-md">
                                                   <div className="absolute right-0 bottom-0 opacity-[0.03] group-hover/card:scale-110 group-hover/card:-rotate-12 group-hover/card:opacity-[0.05] transition-transform duration-500 text-charcoal">
                                                        <TrendingUp className="w-40 h-40 -mr-10 -mb-10" />
                                                    </div>
                                                    <h3 className="text-charcoal font-heading font-bold text-lg mb-2 relative z-10 flex items-center gap-2">Styling Support</h3>
                                                    <p className="text-muted font-body text-sm relative z-10 max-w-[85%] leading-relaxed">Get dedicated styling guidance and personalized assistance for any occasion.</p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Mobile Dropdown Accordion */}
                            {isMobile && (
                                <div className={`flex flex-col overflow-hidden transition-all duration-300 pl-4 py-1 border-l-2 border-border/50 ${mobileDropdownOpen === link.label ? "h-auto mt-4 mb-2 opacity-100" : "h-0 opacity-0 overflow-hidden m-0"}`}>
                                    {link.items?.map((item) => (
                                        <Link
                                            key={item.label}
                                            href={item.href!}
                                            className="flex flex-col gap-1.5 py-3 group/mobile border-b border-border/20 last:border-0"
                                        >
                                            <span className="text-[15px] font-body font-bold text-charcoal/90 group-hover/mobile:text-emerald transition-colors flex items-center gap-2">
                                                <Layers className="w-4 h-4 text-emerald/70" /> {item.label}
                                            </span>
                                            <span className="text-[13px] font-body text-muted line-clamp-2 pl-6 leading-relaxed">{item.description}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                }

                const active = isActive(link.href!);
                return (
                    <Link
                        key={link.label}
                        href={link.href!}
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
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isSignedIn } = useAuth();

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
                    <div 
                        className="hidden lg:flex relative items-center cursor-pointer group"
                        onClick={() => router.push('/search')}
                    >
                        <Search
                            size={14}
                            className="absolute left-3 text-muted-light pointer-events-none transition-colors duration-300 group-hover:text-emerald"
                        />
                        <div
                            className="flex items-center w-[220px] h-9 pl-[34px] pr-[14px] text-[12px] font-body text-muted-light bg-white rounded-[24px] outline-none transition-colors duration-300 border border-border group-hover:border-emerald select-none"
                        >
                            Search for silver designs...
                        </div>
                    </div>

                    {/* Search Icon (Mobile/Tablet only) */}
                    <Link href="/search" className="lg:hidden text-charcoal transition-colors duration-300 hover:text-emerald">
                        <Search size={20} strokeWidth={1.6} />
                    </Link>

                    {/* Wishlist */}
                    <Link
                        href="/wishlist"
                        aria-label="Wishlist"
                        className="relative flex items-center text-charcoal transition-colors duration-300 hover:text-emerald"
                    >
                        <Heart size={20} strokeWidth={1.6} />
                        <WishlistBadge />
                    </Link>

                    {/* Cart */}
                    <Link
                        href="/cart"
                        aria-label="Cart"
                        className="relative flex items-center text-charcoal transition-colors duration-300 hover:text-emerald"
                    >
                        <ShoppingBag size={20} strokeWidth={1.6} />
                        <CartBadge />
                    </Link>

                    {/* User */}
                    <div className="hidden sm:flex items-center">
                        {isSignedIn ? (
                            <UserButton 
                                appearance={{ elements: { userButtonAvatarBox: "w-6 h-6" } }} 
                            />
                        ) : (
                            <Link
                                href="/login"
                                aria-label="Account"
                                className="text-charcoal transition-colors duration-300 hover:text-emerald"
                            >
                                <User size={20} strokeWidth={1.6} />
                            </Link>
                        )}
                    </div>
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
                        {isSignedIn ? (
                            <SignOutButton>
                                <button
                                    className="flex items-center gap-4 text-red-600 p-4 font-body text-[15px] font-medium transition-colors hover:bg-red-50 rounded-[8px] w-full text-left"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                    Logout
                                </button>
                            </SignOutButton>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-4 text-charcoal p-4 font-body text-[15px] font-medium transition-colors hover:bg-gray-100 rounded-[8px] w-full text-left"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                                Login
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
}
