"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CheckCircle2, Truck, ChevronDown, RotateCcw, XCircle, Loader2 } from "lucide-react";
import { useOrderStore, PlacedOrder } from "@/store/useOrderStore";
import { useAuth } from "@clerk/nextjs";

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
    OUT_FOR_DELIVERY: {
        label: "Out For Delivery",
        icon: <Truck size={13} strokeWidth={2} />,
        cls: "bg-[#f0f9f7] text-[#107c6f] border border-[#107c6f]/20",
    },
    PROCESSING: {
        label: "Processing",
        icon: <RotateCcw size={13} strokeWidth={2} />,
        cls: "bg-amber-50 text-amber-600 border border-amber-200",
    },
    PAYMENT_CONFIRMED: {
        label: "Confirmed",
        icon: <RotateCcw size={13} strokeWidth={2} />,
        cls: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    },
    PENDING_PAYMENT: {
        label: "Pending",
        icon: <RotateCcw size={13} strokeWidth={2} />,
        cls: "bg-amber-50 text-amber-600 border border-amber-200",
    },
    CANCELLED: {
        label: "Cancelled",
        icon: <XCircle size={13} strokeWidth={2} />,
        cls: "bg-red-50 text-red-500 border border-red-200",
    },
};

export default function OrdersPage() {
    const { getToken, isSignedIn } = useAuth();
    const { orders, isLoading, fetchMyOrders } = useOrderStore();

    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState("Last 6 Months");
    const [showFilter, setShowFilter] = useState(false);

    const filters = ["Last 6 Months", "Last Year", "All Orders"];

    const getTokenCb = useCallback(() => getToken(), [getToken]);

    useEffect(() => {
        if (isSignedIn) {
            fetchMyOrders(getTokenCb, page);
        }
    }, [isSignedIn, page, fetchMyOrders, getTokenCb]);

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
                {isLoading && orders.length === 0 ? (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="animate-spin text-charcoal/40" size={32} />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-20 text-center bg-white border border-[#e8e8e4] rounded-xl">
                        <p className="text-[15px] font-medium text-charcoal mb-2">No orders found</p>
                        <p className="text-[13px] text-muted">You haven't placed any orders yet.</p>
                        <Link href="/products" className="inline-block mt-4 text-[13px] font-semibold text-charcoal underline underline-offset-4">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    orders.map((order: PlacedOrder) => {
                        const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING_PAYMENT;
                        const isDelivered = order.status === "DELIVERED";
                        const isShipped = ["SHIPPED", "OUT_FOR_DELIVERY"].includes(order.status);

                        const dateNum = new Date(order.createdAt);
                        const displayDate = !isNaN(dateNum.getTime())
                            ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(dateNum)
                            : "N/A";

                        // Extract images from nested relationships
                        const itemImages = order.items.map(item => {
                            const images = item.productVariant?.product?.images ?? [];
                            const primary = images.find(img => img.isPrimary);
                            return primary?.s3Url || images[0]?.s3Url || "";
                        }).filter(Boolean);

                        // First max 2 images for overlay
                        const displayImages = itemImages.slice(0, 2);
                        const extraCount = Math.max(0, order.items.length - 2);

                        // Create summary "Product Name & X more items"
                        const firstItemName = order.items[0]?.productName || "Product";
                        let itemSummary = firstItemName;
                        if (order.items.length > 1) {
                            itemSummary += ` & ${order.items.length - 1} more item${order.items.length - 1 > 1 ? 's' : ''}`;
                        }

                        // Last note from history if available
                        const note = order.statusHistory?.length > 0
                            ? order.statusHistory[order.statusHistory.length - 1].note
                            : "";

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
                                            <p className="text-[13px] font-semibold text-charcoal">{displayDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Total</p>
                                            <p className="text-[13px] font-bold text-[#107c6f]">₹{Number(order.totalAmount).toLocaleString("en-IN")}.00</p>
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
                                            {displayImages.length > 0 ? displayImages.map((img, i) => (
                                                <div
                                                    key={i}
                                                    className="w-[52px] h-[52px] rounded-lg bg-[#1a1a1a] border-2 border-white flex items-center justify-center overflow-hidden shrink-0"
                                                    style={{ zIndex: displayImages.length - i }}
                                                >
                                                    <img src={img} alt="Product" className="w-full h-full object-cover" />
                                                </div>
                                            )) : (
                                                <div className="w-[52px] h-[52px] rounded-lg bg-[#1a1a1a] border-2 border-white flex items-center justify-center text-[9px] text-white/50 shrink-0">
                                                    Img
                                                </div>
                                            )}
                                            {extraCount > 0 && (
                                                <div className="w-[52px] h-[52px] rounded-lg bg-[#3a3a3a] border-2 border-white flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                                                    +{extraCount}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-semibold text-charcoal leading-snug">{itemSummary}</p>
                                            {note && <p className="text-[11px] text-muted mt-0.5">{note}</p>}
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
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* ======== LOAD MORE ======== */}
            {orders.length >= 20 && (
                <div className="flex justify-center">
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={isLoading}
                        className="flex items-center gap-2 h-11 px-8 border border-[#d8d8d2] rounded-full text-[13px] font-semibold text-charcoal bg-white hover:border-charcoal/40 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={15} /> : "Load More Orders"}
                        {!isLoading && <ChevronDown size={15} strokeWidth={2} />}
                    </button>
                </div>
            )}
        </div>
    );
}
