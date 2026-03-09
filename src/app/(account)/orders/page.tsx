"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Truck, ChevronDown, RotateCcw } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
    DELIVERED: {
        label: "Delivered",
        icon: <CheckCircle2 size={13} strokeWidth={2} />,
        cls: "bg-[#f0f9f7] text-[#107c6f] border border-[#107c6f]/20",
    },
    SHIPPED: {
        label: "Shipped",
        icon: <Truck size={13} strokeWidth={2} />,
        cls: "bg-[#f0f9f7] text-[#107c6f] border border-[#107c6f]/20",
    },
    PROCESSING: {
        label: "Processing",
        icon: <RotateCcw size={13} strokeWidth={2} />,
        cls: "bg-amber-50 text-amber-600 border border-amber-200",
    },
    PENDING: {
        label: "Pending",
        icon: <RotateCcw size={13} strokeWidth={2} />,
        cls: "bg-amber-50 text-amber-600 border border-amber-200",
    },
    CANCELLED: {
        label: "Cancelled",
        icon: null,
        cls: "bg-red-50 text-red-500 border border-red-200",
    },
};

// Augmented mock orders with extra display fields
const ORDERS = [
    {
        id: "ord-1",
        orderNumber: "SLV-10294",
        date: "12 Oct, 2023",
        total: 14250,
        status: "DELIVERED",
        itemSummary: "Celestial Silver Set & 2 more items",
        deliveryNote: "Delivered on 15 Oct, 2023",
        images: ["", ""],
        extraCount: 1,
    },
    {
        id: "ord-2",
        orderNumber: "SLV-10182",
        date: "05 Sep, 2023",
        total: 8900,
        status: "SHIPPED",
        itemSummary: "Artisanal Silver Cuff",
        deliveryNote: "Expected arrival: 09 Sep, 2023",
        images: [""],
        extraCount: 0,
    },
    {
        id: "ord-3",
        orderNumber: "SLV-09841",
        date: "21 Aug, 2023",
        total: 22400,
        status: "DELIVERED",
        itemSummary: "Pearl Drop Duo & Silver Choker",
        deliveryNote: "Delivered on 24 Aug, 2023",
        images: ["", ""],
        extraCount: 0,
    },
];

export default function OrdersPage() {
    const [filter, setFilter] = useState("Last 6 Months");
    const [showFilter, setShowFilter] = useState(false);

    const filters = ["Last 6 Months", "Last Year", "All Orders"];

    return (
        <div className="w-full">
            {/* ======== HEADER ======== */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                <div>
                    <h1
                        className="text-[36px] sm:text-[44px] font-bold text-charcoal leading-tight"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Order History
                    </h1>
                    <p className="text-[13px] text-muted mt-1 max-w-[420px] leading-relaxed">
                        Track and manage your premium silver jewelry purchases and view detailed receipts.
                    </p>
                </div>

                {/* Filter Dropdown */}
                <div className="relative shrink-0 self-start sm:self-auto">
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center gap-2 h-9 px-4 border border-[#d8d8d2] rounded-lg text-[13px] font-medium text-charcoal bg-white hover:border-charcoal/40 transition-colors"
                    >
                        {filter}
                        <ChevronDown size={14} strokeWidth={2} className={`transition-transform ${showFilter ? "rotate-180" : ""}`} />
                    </button>
                    {showFilter && (
                        <div className="absolute right-0 top-11 bg-white border border-[#e8e8e4] rounded-lg shadow-lg z-10 min-w-[160px] py-1">
                            {filters.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => { setFilter(f); setShowFilter(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-gray-50 transition-colors ${filter === f ? "font-semibold text-charcoal" : "text-muted"}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ======== ORDER CARDS ======== */}
            <div className="space-y-4 mb-10">
                {ORDERS.map((order) => {
                    const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                    const isDelivered = order.status === "DELIVERED";
                    const isShipped = order.status === "SHIPPED";

                    return (
                        <div key={order.id} className="bg-white border border-[#e8e8e4] rounded-xl overflow-hidden">
                            {/* Top row: meta + status */}
                            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#f0f0ec]">
                                <div className="flex flex-wrap gap-6 sm:gap-10">
                                    <div>
                                        <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Order ID</p>
                                        <p className="text-[13px] font-bold text-charcoal">#{order.orderNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Date</p>
                                        <p className="text-[13px] font-semibold text-charcoal">{order.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Total</p>
                                        <p className="text-[13px] font-bold text-[#107c6f]">₹{order.total.toLocaleString("en-IN")}.00</p>
                                    </div>
                                </div>
                                {/* Status Badge */}
                                <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full ${status.cls}`}>
                                    {status.icon}
                                    {status.label}
                                </span>
                            </div>

                            {/* Bottom row: product + actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 gap-4">
                                {/* Product info */}
                                <div className="flex items-center gap-3">
                                    {/* Image stack */}
                                    <div className="flex -space-x-3 shrink-0">
                                        {order.images.map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-[52px] h-[52px] rounded-lg bg-[#1a1a1a] border-2 border-white flex items-center justify-center text-[9px] text-white/20 shrink-0"
                                                style={{ zIndex: order.images.length - i }}
                                            />
                                        ))}
                                        {order.extraCount > 0 && (
                                            <div className="w-[52px] h-[52px] rounded-lg bg-[#3a3a3a] border-2 border-white flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                                                +{order.extraCount}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-charcoal leading-snug">{order.itemSummary}</p>
                                        <p className="text-[11px] text-muted mt-0.5">{order.deliveryNote}</p>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {isShipped && (
                                        <Link
                                            href="/track"
                                            className="px-4 h-9 border border-[#d8d8d2] hover:border-charcoal/40 rounded-lg text-[12px] font-semibold text-charcoal flex items-center transition-colors"
                                        >
                                            Track Order
                                        </Link>
                                    )}
                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="px-4 h-9 border border-[#d8d8d2] hover:border-charcoal/40 rounded-lg text-[12px] font-semibold text-charcoal flex items-center transition-colors"
                                    >
                                        View Details
                                    </Link>
                                    {isDelivered && (
                                        <button className="px-5 h-9 bg-charcoal hover:bg-charcoal/90 text-white text-[12px] font-semibold rounded-lg flex items-center transition-colors">
                                            Reorder
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ======== LOAD MORE ======== */}
            <div className="flex justify-center">
                <button className="flex items-center gap-2 h-11 px-8 border border-[#d8d8d2] rounded-full text-[13px] font-semibold text-charcoal bg-white hover:border-charcoal/40 transition-colors shadow-sm">
                    Load More Orders
                    <ChevronDown size={15} strokeWidth={2} />
                </button>
            </div>
        </div>
    );
}
