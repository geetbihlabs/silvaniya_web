"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Globe, Instagram, BookMarked, Loader2 } from "lucide-react";
import { useContactStore } from "@/store/useContactStore";

const SUBJECTS = [
    "General Inquiry",
    "Order Support",
    "Custom Order",
    "Wholesale",
    "Jewellery Care",
    "Return / Refund",
];

const STORES = [
    {
        name: "Mumbai Experience Center",
        address: "Colaba Causeway, Apollo Bandar, Mumbai, Maharashtra 400001",
        hours: "Open Daily: 10:00 AM – 8:00 PM",
    },
    {
        name: "Delhi Boutique",
        address: "DLF Emporio, Vasant Kunj, New Delhi, Delhi 110070",
        hours: "Open Daily: 11:00 AM – 9:00 PM",
    },
];

export default function ContactPage() {
    const { fields, isLoading, isSubmitted, error, setField, submit, reset } =
        useContactStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submit();
    };

    return (
        <div className="bg-[#f2f2ef] min-h-screen pb-10">

            {/* ═══ HERO ═══ */}
            <div className="px-4 sm:px-6 pt-5">
                <div className="relative rounded-[20px] overflow-hidden h-[220px] sm:h-[320px] w-full">
                    <Image
                        src="/contact-hero.png"
                        alt="Connect With Us"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                        <h1
                            className="text-[34px] sm:text-[52px] font-bold text-white mb-3 leading-[1.15]"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Connect With Us
                        </h1>
                        <p className="text-[13px] sm:text-[15px] text-white/80 max-w-[480px] leading-[1.65]">
                            Experience the craftsmanship of Silvaniya. Our artisans and support team
                            <br /> are here to assist you.
                        </p>
                    </div>
                </div>
            </div>

            {/* ═══ MAIN CONTENT ═══ */}
            <div className="max-w-[1080px] mx-auto px-4 sm:px-6 pt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

                {/* ── LEFT: FORM ── */}
                <div>
                    <h2
                        className="text-[24px] sm:text-[26px] font-bold text-[#1a1a1a] mb-2"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Send a Message
                    </h2>
                    <p className="text-[13px] text-[#777] leading-[1.65] mb-7 max-w-[400px]">
                        Have a specific request or need help with a custom order? Fill out the form
                        <br /> below and our concierge team will get back to you within 24 hours.
                    </p>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                            {/* Name + Email */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[12px] text-[#555] mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={fields.name}
                                        onChange={(e) => setField("name", e.target.value)}
                                        required
                                        className="w-full h-[42px] px-3.5 text-[13px] text-[#1a1a1a] rounded-lg border border-[#d8d8d2] bg-white placeholder:text-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors box-border"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[12px] text-[#555] mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        value={fields.email}
                                        onChange={(e) => setField("email", e.target.value)}
                                        required
                                        className="w-full h-[42px] px-3.5 text-[13px] text-[#1a1a1a] rounded-lg border border-[#d8d8d2] bg-white placeholder:text-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors box-border"
                                    />
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-[12px] text-[#555] mb-1.5">Subject</label>
                                <div className="relative">
                                    <select
                                        value={fields.subject}
                                        onChange={(e) => setField("subject", e.target.value)}
                                        className="w-full h-[42px] px-3.5 text-[13px] text-[#1a1a1a] rounded-lg border border-[#d8d8d2] bg-white focus:outline-none focus:border-[#1a1a1a] transition-colors appearance-none cursor-pointer box-border"
                                    >
                                        {SUBJECTS.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <svg
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#999]"
                                        width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-[12px] text-[#555] mb-1.5">Your Message</label>
                                <textarea
                                    rows={6}
                                    placeholder="How can we help you today?"
                                    value={fields.message}
                                    onChange={(e) => setField("message", e.target.value)}
                                    required
                                    className="w-full px-3.5 py-3 text-[13px] text-[#1a1a1a] rounded-lg border border-[#d8d8d2] bg-white placeholder:text-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors resize-none box-border"
                                />
                            </div>

                            {/* Error message */}
                            {error && (
                                <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-[50px] bg-[#1f1b2e] hover:bg-[#2d2845] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={15} className="animate-spin" />
                                        Sending…
                                    </>
                                ) : (
                                    "Send Inquiry"
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="bg-[#f0f9f7] border border-[#107c6f]/20 rounded-xl p-10 text-center">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#107c6f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <p className="text-[16px] font-bold text-[#1a1a1a] mb-1.5">Message Sent!</p>
                            <p className="text-[13px] text-[#777]">Our team will reply within 24 hours.</p>
                            <button
                                onClick={reset}
                                className="mt-4 text-[12px] text-[#107c6f] hover:underline bg-transparent border-none cursor-pointer"
                            >
                                Send another
                            </button>
                        </div>
                    )}
                </div>

                {/* ── RIGHT: STORES + CHANNELS + SOCIAL ── */}
                <div>
                    <h2
                        className="text-[24px] sm:text-[26px] font-bold text-[#1a1a1a] mb-5"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Flagship Stores
                    </h2>

                    <div className="flex flex-col gap-3 mb-9">
                        {STORES.map((store) => (
                            <div
                                key={store.name}
                                className="bg-white border border-[#e4e4e0] rounded-xl px-5 py-4 flex gap-3 items-start"
                            >
                                <MapPin size={16} strokeWidth={1.8} className="text-[#107c6f] shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-[14px] font-bold text-[#1a1a1a] mb-0.5">{store.name}</p>
                                    <p className="text-[12px] text-[#888] leading-relaxed mb-1">{store.address}</p>
                                    <p className="text-[12px] font-semibold text-[#107c6f]">{store.hours}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Support Channels */}
                    <h2
                        className="text-[20px] font-bold text-[#1a1a1a] mb-4"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Support Channels
                    </h2>
                    <div className="grid grid-cols-2 gap-5 mb-8">
                        <div>
                            <p className="text-[11px] text-[#aaa] mb-1 tracking-wide">Phone Support</p>
                            <p className="text-[13px] font-bold text-[#1a1a1a]">+91 1800-SILVA-99</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-[#aaa] mb-1 tracking-wide">Email Support</p>
                            <p className="text-[13px] font-bold text-[#1a1a1a]">concierge@silvaniya.com</p>
                        </div>
                    </div>

                    {/* Follow Our Journey */}
                    <h2
                        className="text-[17px] font-bold text-[#1a1a1a] mb-3"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Follow Our Journey
                    </h2>
                    <div className="flex items-center gap-2.5">
                        {[Globe, Instagram, BookMarked].map((Icon, i) => (
                            <button
                                key={i}
                                className="w-9 h-9 rounded-lg border border-[#d8d8d2] bg-white flex items-center justify-center text-[#777] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
                            >
                                <Icon size={15} strokeWidth={1.5} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
