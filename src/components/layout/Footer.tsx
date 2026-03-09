"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";

const SHOP_LINKS = [
    { label: "New Arrivals", href: "/products?filter=new-arrivals" },
    { label: "Bestsellers", href: "/products?filter=bestsellers" },
    { label: "Wedding Special", href: "/products?filter=wedding" },
    { label: "Gifting Guide", href: "/gifting" },
    { label: "999 Silver Coins", href: "/products?category=silver-coins" },
];

const SUPPORT_LINKS = [
    { label: "Track Order", href: "/orders" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Purity Certificate", href: "/purity-cert" },
    { label: "FAQs", href: "/faqs" },
];

export default function Footer() {
    return (
        <footer className="bg-[#1e1b2e] w-full pt-[72px] px-6">

            {/* ── Main grid ── */}
            <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1.4fr] gap-16 max-w-7xl mx-auto pb-16">

                {/* Column 1 — Brand */}
                <div>
                    <Link href="/" className="inline-block mt-[-20px] ml-[-20px] no-underline">
                        <div className="relative w-[260px] h-[100px]">
                            <Image
                                src="/logo-white-transparent.png"
                                alt="Silvaniya – The Art of Eternal Shine"
                                fill
                                className="object-contain object-left"
                            />
                        </div>
                    </Link>
                    <p className="font-body text-[14px] font-normal leading-[1.7] text-white/55 max-w-[340px] mb-8">
                        Empowering the spirit of Indian heritage through fine silver
                        artistry. Every piece is a story of tradition, purity, and grace.
                    </p>
                    <div className="flex gap-3">
                        {[
                            { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                            { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                        ].map(({ Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white transition-colors duration-300 hover:bg-white/20"
                            >
                                <Icon size={18} strokeWidth={1.8} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Column 2 — Shop By */}
                <div>
                    <p className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-white mb-6">
                        SHOP BY
                    </p>
                    <div className="flex flex-col gap-4">
                        {SHOP_LINKS.map((l) => (
                            <Link
                                key={l.label}
                                href={l.href}
                                className="font-body text-[14px] font-normal text-white/55 no-underline transition-colors duration-200 hover:text-white"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Column 3 — Support */}
                <div>
                    <p className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-white mb-6">
                        SUPPORT
                    </p>
                    <div className="flex flex-col gap-4">
                        {SUPPORT_LINKS.map((l) => (
                            <Link
                                key={l.label}
                                href={l.href}
                                className="font-body text-[14px] font-normal text-white/55 no-underline transition-colors duration-200 hover:text-white"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Column 4 — Newsletter */}
                <div>
                    <p className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-white mb-4">
                        NEWSLETTER
                    </p>
                    <p className="font-body text-[14px] font-normal leading-relaxed text-white/55 mb-5">
                        Get early access to festive sales and new collections.
                    </p>
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex border border-white/20 rounded overflow-hidden"
                    >
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="flex-1 py-3 px-4 bg-white/[0.07] border-none outline-none font-body text-[13px] text-white placeholder:text-white/35"
                        />
                        <button
                            type="submit"
                            className="py-3 px-5 bg-emerald border-none text-white font-body text-[12px] font-bold tracking-widest uppercase cursor-pointer whitespace-nowrap transition-colors duration-300 hover:bg-emerald-dark"
                        >
                            JOIN
                        </button>
                    </form>
                </div>

            </div>

            {/* ── Divider ── */}
            <hr className="border-0 border-t border-white/10 w-full m-0" />

            {/* ── Bottom bar ── */}
            <div className="max-w-7xl mx-auto py-6 flex justify-between items-center">
                <p className="font-body text-[11px] font-normal tracking-[0.08em] text-white/35">
                    © 2026 SILVANIYA JEWELLERS PVT LTD. ALL RIGHTS RESERVED.
                </p>
                <div className="flex gap-8">
                    {[
                        { label: "PRIVACY POLICY", href: "/privacy-policy" },
                        { label: "TERMS OF USE", href: "/terms" },
                        { label: "COOKIE SETTINGS", href: "#" },
                    ].map((l) => (
                        <Link
                            key={l.label}
                            href={l.href}
                            className="font-body text-[11px] font-medium tracking-widest uppercase text-white/35 no-underline transition-colors duration-200 hover:text-white/70"
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>
            </div>

        </footer>
    );
}
