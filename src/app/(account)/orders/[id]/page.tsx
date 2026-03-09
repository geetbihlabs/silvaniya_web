"use client";

import React from "react";
import Link from "next/link";
import {
    Truck, MapPin, Check, Package, ShoppingBag,
    Copy, Download, MessageSquare, RotateCcw
} from "lucide-react";
import { mockOrders } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

const STEPS = [
    { key: "placed", label: "PLACED", Icon: Check },
    { key: "confirmed", label: "CONFIRMED", Icon: Check },
    { key: "packed", label: "PACKED", Icon: Package },
    { key: "shipped", label: "SHIPPED", Icon: Truck },
    { key: "out", label: "OUT FOR DELIVERY", Icon: MapPin },
    { key: "delivered", label: "DELIVERED", Icon: ShoppingBag },
];
const CURRENT_STEP = 3; // 0-indexed: shipped

const TRACKING_HISTORY = [
    {
        id: 1,
        event: "In Transit – Arrived at Regional Sorting Facility",
        location: "Dubai, United Arab Emirates",
        date: "Oct 22, 2023 | 10:45 AM",
        active: true,
    },
    {
        id: 2,
        event: "Processed through International Logistics Hub",
        location: "London, United Kingdom",
        date: "Oct 21, 2023 | 02:30 PM",
        active: false,
    },
    {
        id: 3,
        event: "Order Shipped from Warehouse",
        location: "Edinburgh, Scotland",
        date: "Oct 20, 2023 | 09:15 AM",
        active: false,
    },
];

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const order = mockOrders.find((o) => o.id === params.id) || mockOrders[0];

    return (
        <div className="bg-[#f5f5f3] min-h-screen py-6 lg:py-10">
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* ======== BREADCRUMB ======== */}
                <nav className="flex items-center gap-1.5 text-[11px] font-medium text-muted uppercase tracking-widest mb-4">
                    <Link href="/" className="hover:text-charcoal transition-colors">Account</Link>
                    <span>/</span>
                    <Link href="/orders" className="hover:text-charcoal transition-colors">Orders</Link>
                    <span>/</span>
                    <span className="text-charcoal">#{order.orderNumber}</span>
                </nav>

                {/* ======== ORDER HEADER ======== */}
                <div className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-5 mb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                        <h1
                            className="text-[24px] sm:text-[28px] font-bold text-charcoal mb-1"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Order #{order.orderNumber}
                        </h1>
                        <p className="text-[13px] text-muted">
                            Placed on Oct 20, 2023 &bull; Paid via Credit Card
                        </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                        <span className="flex items-center gap-1.5 bg-[#f0f9f7] text-[#107c6f] border border-[#107c6f]/20 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                            <Truck size={12} strokeWidth={2} />
                            In Transit
                        </span>
                        <span className="text-[12px] text-muted">
                            Est. Delivery: <span className="font-medium text-charcoal">Oct 24, 2023</span>
                        </span>
                    </div>
                </div>

                {/* ======== MAIN GRID ======== */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

                    {/* ======== LEFT COLUMN ======== */}
                    <div className="space-y-5">

                        {/* Shipping Progress */}
                        <div className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-6">
                            <h2 className="text-[15px] font-bold text-charcoal mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                                Shipping Progress
                            </h2>
                            <div className="flex items-start justify-between">
                                {STEPS.map((step, i) => {
                                    const done = i < CURRENT_STEP;
                                    const current = i === CURRENT_STEP;
                                    const { Icon } = step;
                                    return (
                                        <div key={step.key} className="flex flex-col items-center flex-1">
                                            <div className="flex items-center w-full">
                                                {i > 0 && (
                                                    <div className={`h-[2px] flex-1 ${i <= CURRENT_STEP ? "bg-[#107c6f]" : "bg-[#e0e0db]"}`} />
                                                )}
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${done || current ? "bg-[#107c6f] border-[#107c6f] text-white" : "bg-white border-[#d8d8d2] text-gray-400"}`}>
                                                    <Icon size={13} strokeWidth={2.5} />
                                                </div>
                                                {i < STEPS.length - 1 && (
                                                    <div className={`h-[2px] flex-1 ${i < CURRENT_STEP ? "bg-[#107c6f]" : "bg-[#e0e0db]"}`} />
                                                )}
                                            </div>
                                            <span className={`text-[8px] font-bold uppercase tracking-widest mt-2 text-center leading-tight ${done || current ? "text-[#107c6f]" : "text-gray-400"}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-6">
                            <h2 className="text-[15px] font-bold text-charcoal mb-5" style={{ fontFamily: "var(--font-heading)" }}>
                                Order Items
                            </h2>
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-[100px] h-[100px] shrink-0 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-[10px] text-white/20 overflow-hidden">
                                        Img
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h3 className="text-[16px] font-bold text-charcoal leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
                                                {item.productName}
                                            </h3>
                                            <span className="text-[16px] font-bold text-charcoal shrink-0">{formatPrice(item.totalPrice)}</span>
                                        </div>
                                        <p className="text-[12px] text-muted mb-3">
                                            925 Sterling Silver | Collection: Verdant Luxe
                                        </p>
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-4">
                                            <div>
                                                <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Quantity</p>
                                                <p className="text-[13px] font-medium text-charcoal">{item.quantity} Unit</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">SKU</p>
                                                <p className="text-[13px] font-medium text-charcoal">{item.variantInfo || "—"}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href="/track"
                                                className="flex items-center gap-2 px-4 h-9 bg-charcoal hover:bg-charcoal/90 text-white text-[12px] font-semibold rounded-md transition-colors"
                                            >
                                                <Truck size={13} strokeWidth={1.8} />
                                                Track Package
                                            </Link>
                                            <Link
                                                href="/reviews/write"
                                                className="flex items-center gap-2 px-4 h-9 border border-[#d8d8d2] hover:border-charcoal/40 text-charcoal text-[12px] font-semibold rounded-md transition-colors"
                                            >
                                                Write Review
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tracking History */}
                        <div className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-6">
                            <h2 className="text-[15px] font-bold text-charcoal mb-5" style={{ fontFamily: "var(--font-heading)" }}>
                                Tracking History
                            </h2>
                            <div>
                                {TRACKING_HISTORY.map((entry, i) => (
                                    <div key={entry.id} className="flex gap-4">
                                        {/* Dot + line */}
                                        <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${entry.active ? "bg-[#107c6f]" : "bg-[#d8d8d2]"}`} />
                                            {i < TRACKING_HISTORY.length - 1 && (
                                                <div className="w-[2px] flex-1 bg-[#e8e8e4] my-1 min-h-[24px]" />
                                            )}
                                        </div>
                                        {/* Content */}
                                        <div className="pb-5 flex-1">
                                            <p className={`text-[13px] font-semibold leading-snug ${entry.active ? "text-charcoal" : "text-muted"}`}>
                                                {entry.event}
                                            </p>
                                            {entry.location && (
                                                <p className={`text-[12px] mt-0.5 font-medium ${entry.active ? "text-[#107c6f]" : "text-muted"}`}>
                                                    {entry.location}
                                                </p>
                                            )}
                                            <p className="text-[11px] text-muted mt-0.5">{entry.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ======== RIGHT COLUMN ======== */}
                    <div className="space-y-4">

                        {/* Shipping Details */}
                        <div className="bg-white rounded-xl border border-[#e8e8e4] px-5 py-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Truck size={15} strokeWidth={1.8} className="text-charcoal" />
                                <h3 className="text-[14px] font-bold text-charcoal">Shipping Details</h3>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Carrier</p>
                                    <p className="text-[13px] font-semibold text-charcoal">Silvaniya Express</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Tracking Number</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[13px] font-semibold text-charcoal">SHP-09281720</p>
                                        <button className="text-muted hover:text-charcoal transition-colors">
                                            <Copy size={13} strokeWidth={1.8} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white rounded-xl border border-[#e8e8e4] px-5 py-5">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin size={15} strokeWidth={1.8} className="text-charcoal" />
                                <h3 className="text-[14px] font-bold text-charcoal">Delivery Address</h3>
                            </div>
                            <div className="text-[13px] text-muted leading-relaxed">
                                <p className="font-semibold text-charcoal mb-0.5">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.addressLine1}</p>
                                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                <p className="mt-1">{order.shippingAddress.phone}</p>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-charcoal rounded-xl px-5 py-5">
                            <h3 className="text-[14px] font-bold text-white mb-4">Payment Summary</h3>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-white/60">Subtotal</span>
                                    <span className="text-white font-medium">{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-white/60">Shipping</span>
                                    <span className="text-[#4ecca3] font-semibold">Free</span>
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-white/60">Taxes</span>
                                    <span className="text-white font-medium">{formatPrice(order.taxAmount)}</span>
                                </div>
                            </div>
                            <div className="border-t border-white/10 pt-3 flex justify-between mb-4">
                                <span className="text-[15px] font-bold text-white">Total</span>
                                <span className="text-[15px] font-bold text-white">{formatPrice(order.totalAmount)}</span>
                            </div>
                            <div className="bg-white/10 rounded-lg px-4 py-3 flex items-center gap-3">
                                <div className="w-7 h-5 bg-white/20 rounded flex items-center justify-center shrink-0">
                                    <span className="text-[8px] font-bold text-white">VISA</span>
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/50">Paid via</p>
                                    <p className="text-[12px] text-white font-medium">Visa ending in •••• 4242</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-center gap-2 h-11 border border-[#e8e8e4] bg-white hover:border-charcoal/30 rounded-xl text-[13px] font-semibold text-charcoal transition-colors">
                                <Download size={14} strokeWidth={1.8} />
                                Download Invoice
                            </button>
                            <Link
                                href="/support"
                                className="w-full flex items-center justify-center gap-2 h-11 border border-[#e8e8e4] bg-white hover:border-charcoal/30 rounded-xl text-[13px] font-semibold text-charcoal transition-colors"
                            >
                                <MessageSquare size={14} strokeWidth={1.8} />
                                Contact Support
                            </Link>
                            <button className="w-full flex items-center justify-center gap-2 h-11 border border-[#e8e8e4] bg-white hover:border-charcoal/30 rounded-xl text-[13px] font-semibold text-charcoal transition-colors">
                                <RotateCcw size={14} strokeWidth={1.8} />
                                Return Policy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
