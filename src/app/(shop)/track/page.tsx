"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Check, Truck, MapPin, Package, MessageSquare,
    HelpCircle, Headphones, ShoppingBag, Loader2
} from "lucide-react";
import { useOrderStore, PlacedOrder } from "@/store/useOrderStore";
import { useAuth } from "@clerk/nextjs";
import { formatPrice } from "@/lib/utils";

const STATUS_STEPS = [
    { key: "PENDING_PAYMENT",   label: "Placed",   icon: Check },
    { key: "PAYMENT_CONFIRMED", label: "Confirmed", icon: Check },
    { key: "PROCESSING",        label: "Packed",   icon: Package },
    { key: "SHIPPED",           label: "Shipped",  icon: Truck },
    { key: "OUT_FOR_DELIVERY",  label: "Out for Delivery", icon: MapPin },
    { key: "DELIVERED",         label: "Delivered", icon: ShoppingBag },
];

function getCurrentStepIndex(status: string): number {
    const idx = STATUS_STEPS.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
}

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState("");
    const [trackedOrder, setTrackedOrder] = useState<PlacedOrder | null>(null);
    const [searched, setSearched] = useState(false);

    const { fetchMyOrders, orders, isLoading } = useOrderStore();
    const { getToken } = useAuth();

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setSearched(true);
        await fetchMyOrders(getToken);
    };

    // After fetch, find by order number
    const found: PlacedOrder | undefined = orders.find(
        (o) => o.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase(),
    );

    const order = trackedOrder ?? (searched ? found ?? null : null);
    const currentStep = order ? getCurrentStepIndex(order.status) : 0;

    return (
        <div className="bg-[#f5f5f3] min-h-screen">
            {/* Hero */}
            <section className="pt-14 pb-10 px-4">
                <div className="max-w-[650px] mx-auto text-center">
                    <h1 className="text-[42px] sm:text-[52px] font-bold text-charcoal mb-3 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                        Track Your Order
                    </h1>
                    <p className="text-[13px] text-muted leading-relaxed mb-8">
                        Enter your order number to get real-time updates on your handcrafted silver treasures.
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleTrack} className="bg-white rounded-2xl border border-[#e8e8e4] px-6 py-7 text-left shadow-sm">
                        <div className="mb-4">
                            <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">Order Number</label>
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                placeholder="SIL-2026-00001"
                                required
                                className="w-full h-11 px-4 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-[50px] bg-charcoal hover:bg-charcoal/90 text-white text-[14px] font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {isLoading ? <><Loader2 size={16} className="animate-spin" /> Tracking...</> : "Track Order"}
                        </button>
                    </form>

                    {/* Not Found */}
                    {searched && !isLoading && !order && (
                        <div className="mt-6 bg-white rounded-xl border border-[#e8e8e4] p-6 text-center">
                            <Package size={32} className="mx-auto mb-3 text-gray-300" />
                            <p className="text-muted text-[13px]">No order found with number <strong>{orderNumber}</strong>.</p>
                            <p className="text-muted text-[12px] mt-1">Please check the order number from your confirmation email.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Track Result */}
            {order && (
                <div className="max-w-[900px] mx-auto px-4 pb-14">

                    {/* Progress Stepper */}
                    <div className="flex items-start justify-between mb-8 select-none">
                        {STATUS_STEPS.map((step, i) => {
                            const done = i < currentStep;
                            const current = i === currentStep;
                            const Icon = step.icon;
                            return (
                                <div key={step.key} className="flex flex-col items-center flex-1">
                                    <div className="flex items-center w-full">
                                        {i > 0 && <div className={`h-[2px] flex-1 ${i <= currentStep ? "bg-[#107c6f]" : "bg-[#d8d8d2]"}`} />}
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${done || current ? "bg-[#107c6f] border-[#107c6f] text-white" : "bg-white border-[#d8d8d2] text-gray-400"}`}>
                                            <Icon size={15} strokeWidth={2} />
                                        </div>
                                        {i < STATUS_STEPS.length - 1 && <div className={`h-[2px] flex-1 ${i < currentStep ? "bg-[#107c6f]" : "bg-[#d8d8d2]"}`} />}
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-widest mt-2 text-center leading-tight ${done || current ? "text-[#107c6f]" : "text-gray-400"}`}>{step.label}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
                        {/* Left */}
                        <div className="space-y-4">
                            {/* Order Card */}
                            <div className="bg-white rounded-xl border border-[#e8e8e4] p-5">
                                <h3 className="text-[15px] font-bold text-charcoal mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                                    Order {order.orderNumber}
                                </h3>
                                <div className="space-y-3">
                                    {order.items.slice(0, 3).map((item) => {
                                        const imgUrl = item.productVariant?.product?.images?.find((i) => i.isPrimary)?.s3Url
                                            ?? item.productVariant?.product?.images?.[0]?.s3Url ?? "";
                                        return (
                                            <div key={item.id} className="flex gap-3 items-center">
                                                <div className="w-14 h-14 rounded-lg bg-[#1a1a1a] shrink-0 overflow-hidden">
                                                    {imgUrl ? <img src={imgUrl} alt={item.productName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">Img</div>}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[13px] font-semibold text-charcoal">{item.productName}</p>
                                                    <p className="text-[11px] text-muted">{item.variantLabel} · Qty {item.quantity}</p>
                                                </div>
                                                <span className="text-[13px] font-semibold text-charcoal">{formatPrice(Number(item.totalPrice))}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 pt-4 border-t border-[#e8e8e4] grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Total</p>
                                        <p className="text-[14px] font-bold text-charcoal">{formatPrice(Number(order.totalAmount))}</p>
                                    </div>
                                    {order.shippingAddress && (
                                        <div>
                                            <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Delivering To</p>
                                            <p className="text-[12px] text-charcoal">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Need Help */}
                            <div className="bg-white rounded-xl border border-[#e8e8e4] px-5 py-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Headphones size={16} strokeWidth={1.5} className="text-[#107c6f]" />
                                    <span className="text-[14px] font-bold text-charcoal">Need Help?</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link href="/support" className="flex items-center gap-1.5 px-4 h-9 border border-[#d8d8d2] rounded-lg text-[12px] font-medium text-charcoal hover:border-charcoal/60 transition-colors">
                                        <MessageSquare size={13} strokeWidth={1.5} /> Contact Support
                                    </Link>
                                    <Link href="/support" className="flex items-center gap-1.5 px-4 h-9 border border-[#d8d8d2] rounded-lg text-[12px] font-medium text-charcoal hover:border-charcoal/60 transition-colors">
                                        <HelpCircle size={13} strokeWidth={1.5} /> FAQ
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right: Status History Timeline */}
                        <div className="bg-white rounded-xl border border-[#e8e8e4] px-5 py-5">
                            <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-5">Tracking History</p>
                            {order.statusHistory.length === 0 ? (
                                <p className="text-muted text-[12px]">No history yet.</p>
                            ) : (
                                <div className="space-y-0">
                                    {order.statusHistory.map((entry, i) => {
                                        const label = STATUS_STEPS.find((s) => s.key === entry.status)?.label ?? entry.status;
                                        const isFirst = i === 0;
                                        return (
                                            <div key={i} className="flex gap-3">
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isFirst ? "bg-[#107c6f] text-white" : "bg-[#e8e8e4] text-gray-400"}`}>
                                                        <Truck size={13} strokeWidth={1.5} />
                                                    </div>
                                                    {i < order.statusHistory.length - 1 && (
                                                        <div className={`w-[2px] flex-1 my-1 min-h-[28px] ${isFirst ? "bg-[#107c6f]/30" : "bg-[#e8e8e4]"}`} />
                                                    )}
                                                </div>
                                                <div className="pb-5 flex-1">
                                                    <p className="text-[13px] font-semibold text-charcoal leading-snug">{label}</p>
                                                    {entry.note && <p className="text-[11px] text-muted mt-0.5">{entry.note}</p>}
                                                    <p className="text-[11px] text-muted mt-0.5">
                                                        {new Date(entry.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
