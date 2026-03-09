"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Check, Truck, MapPin, Package, MessageSquare,
    HelpCircle, Headphones, ShoppingBag
} from "lucide-react";

const STEPS = [
    { key: "placed", label: "PLACED", icon: Check },
    { key: "confirmed", label: "CONFIRMED", icon: Check },
    { key: "packed", label: "PACKED", icon: Package },
    { key: "shipped", label: "SHIPPED", icon: Truck },
    { key: "out", label: "OUT FOR DELIVERY", icon: MapPin },
    { key: "delivered", label: "DELIVERED", icon: ShoppingBag },
];

const CURRENT_STEP = 3; // 0-indexed: 0=placed … 3=shipped

const TRACKING_HISTORY = [
    {
        id: 1,
        event: "Package arrived at local facility",
        location: "San Francisco, CA",
        date: "Oct 22, 11:45 AM",
        active: true,
    },
    {
        id: 2,
        event: "In transit to next hub",
        location: "Dallas-Fort Worth Int'l Airport",
        date: "Oct 21, 09:20 PM",
        active: true,
    },
    {
        id: 3,
        event: "Package scanned at departure",
        location: "Silvaniya Fulfilment Center, TX",
        date: "Oct 20, 04:15 PM",
        active: false,
    },
    {
        id: 4,
        event: "Order Confirmed",
        location: "",
        date: "Oct 20, 10:05 AM",
        active: false,
    },
];

export default function TrackOrderPage() {
    const [tracked, setTracked] = useState(true); // show result by default for demo

    return (
        <div className="bg-[#f5f5f3] min-h-screen">
            {/* ======== HERO ======== */}
            <section className="bg-[#f5f5f3] pt-14 pb-10 px-4">
                <div className="max-w-[650px] mx-auto text-center">
                    <h1
                        className="text-[42px] sm:text-[52px] font-bold text-charcoal mb-3 leading-tight"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Track Your Order
                    </h1>
                    <p className="text-[13px] text-muted leading-relaxed mb-8">
                        Enter your order details below to receive real-time updates on your<br className="hidden sm:block" /> handcrafted silver treasures.
                    </p>

                    {/* Search Form Card */}
                    <div className="bg-white rounded-2xl border border-[#e8e8e4] px-6 py-7 text-left shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">Order ID</label>
                                <input
                                    type="text"
                                    defaultValue="#SILV-882910"
                                    placeholder="#SILV-882910"
                                    className="w-full h-11 px-4 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">Email or Phone</label>
                                <input
                                    type="text"
                                    placeholder="name@email.com"
                                    className="w-full h-11 px-4 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => setTracked(true)}
                            className="w-full h-[50px] bg-charcoal hover:bg-charcoal/90 text-white text-[14px] font-semibold rounded-lg transition-colors duration-200"
                        >
                            Track Order
                        </button>
                    </div>
                </div>
            </section>

            {/* ======== TRACK RESULT ======== */}
            {tracked && (
                <div className="max-w-[900px] mx-auto px-4 pb-14">

                    {/* Progress Stepper */}
                    <div className="flex items-start justify-between mb-8 select-none">
                        {STEPS.map((step, i) => {
                            const done = i < CURRENT_STEP;
                            const current = i === CURRENT_STEP;
                            const Icon = step.icon;
                            return (
                                <div key={step.key} className="flex flex-col items-center flex-1">
                                    <div className="flex items-center w-full">
                                        {/* Connector left */}
                                        {i > 0 && (
                                            <div className={`h-[2px] flex-1 ${i <= CURRENT_STEP ? "bg-[#107c6f]" : "bg-[#d8d8d2]"}`} />
                                        )}
                                        {/* Circle */}
                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${done || current
                                                ? "bg-[#107c6f] border-[#107c6f] text-white"
                                                : "bg-white border-[#d8d8d2] text-gray-400"
                                                }`}
                                        >
                                            <Icon size={15} strokeWidth={2} />
                                        </div>
                                        {/* Connector right */}
                                        {i < STEPS.length - 1 && (
                                            <div className={`h-[2px] flex-1 ${i < CURRENT_STEP ? "bg-[#107c6f]" : "bg-[#d8d8d2]"}`} />
                                        )}
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-widest mt-2 text-center leading-tight ${done || current ? "text-[#107c6f]" : "text-gray-400"}`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Two-column grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">

                        {/* LEFT COLUMN */}
                        <div className="space-y-4">
                            {/* Product Card */}
                            <div className="bg-white rounded-xl border border-[#e8e8e4] p-5">
                                <div className="flex gap-4 items-start">
                                    {/* Image */}
                                    <div className="w-[90px] h-[90px] rounded-lg bg-[#1a1a1a] shrink-0 flex items-center justify-center text-[10px] text-white/20 overflow-hidden">
                                        Img
                                    </div>
                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h3 className="text-[15px] font-bold text-charcoal" style={{ fontFamily: "var(--font-heading)" }}>
                                                Celestial Silver Band
                                            </h3>
                                            <span className="text-[10px] font-bold text-[#107c6f] border border-[#107c6f] rounded px-2 py-0.5 uppercase tracking-wider">
                                                IN TRANSIT
                                            </span>
                                        </div>
                                        <p className="text-[12px] text-muted mb-3">Sterling Silver 925 • Size 7</p>
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                            <div>
                                                <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Order ID</p>
                                                <p className="text-[13px] font-semibold text-charcoal">#SILV-882910</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Tracking ID</p>
                                                <p className="text-[13px] font-semibold text-charcoal">SHP-99281720</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Courier</p>
                                                <p className="text-[13px] font-semibold text-charcoal">Silvaniya Express</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Est. Delivery</p>
                                                <p className="text-[13px] font-semibold text-[#107c6f]">Oct 24, 2023</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Need Help */}
                            <div className="bg-white rounded-xl border border-[#e8e8e4] px-5 py-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Headphones size={16} strokeWidth={1.5} className="text-[#107c6f]" />
                                    <span className="text-[14px] font-bold text-charcoal">Need Help?</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        href="/support"
                                        className="flex items-center gap-1.5 px-4 h-9 border border-[#d8d8d2] rounded-lg text-[12px] font-medium text-charcoal hover:border-charcoal/60 transition-colors"
                                    >
                                        <MessageSquare size={13} strokeWidth={1.5} />
                                        Contact Support
                                    </Link>
                                    <button className="flex items-center gap-1.5 px-4 h-9 border border-[#d8d8d2] rounded-lg text-[12px] font-medium text-charcoal hover:border-charcoal/60 transition-colors">
                                        <MessageSquare size={13} strokeWidth={1.5} />
                                        Live Chat
                                    </button>
                                    <Link
                                        href="/support"
                                        className="flex items-center gap-1.5 px-4 h-9 border border-[#d8d8d2] rounded-lg text-[12px] font-medium text-charcoal hover:border-charcoal/60 transition-colors"
                                    >
                                        <HelpCircle size={13} strokeWidth={1.5} />
                                        FAQ
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Tracking History */}
                        <div className="bg-white rounded-xl border border-[#e8e8e4] px-5 py-5">
                            <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-5">Tracking History</p>
                            <div className="space-y-0">
                                {TRACKING_HISTORY.map((entry, i) => (
                                    <div key={entry.id} className="flex gap-3">
                                        {/* Timeline dot + line */}
                                        <div className="flex flex-col items-center">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${entry.active ? "bg-[#107c6f] text-white" : "bg-[#e8e8e4] text-gray-400"}`}>
                                                <Truck size={13} strokeWidth={1.5} />
                                            </div>
                                            {i < TRACKING_HISTORY.length - 1 && (
                                                <div className={`w-[2px] flex-1 my-1 min-h-[28px] ${entry.active ? "bg-[#107c6f]/30" : "bg-[#e8e8e4]"}`} />
                                            )}
                                        </div>
                                        {/* Content */}
                                        <div className="pb-5 flex-1">
                                            <p className="text-[13px] font-semibold text-charcoal leading-snug">{entry.event}</p>
                                            {entry.location && (
                                                <p className="text-[11px] text-muted mt-0.5">{entry.location}</p>
                                            )}
                                            <p className="text-[11px] text-muted mt-0.5">{entry.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
