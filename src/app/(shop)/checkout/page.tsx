"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Award, RotateCcw, ChevronRight } from "lucide-react";
import { mockCartItems, mockAddresses } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
];

export default function CheckoutPage() {
    const hasAddresses = mockAddresses && mockAddresses.length > 0;
    const [showForm, setShowForm] = useState(!hasAddresses);
    const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

    const cartItems = mockCartItems;
    const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const shippingCost = shippingMethod === "express" ? 250 : 0;
    const tax = Math.round(subtotal * 0.03);
    const total = subtotal + shippingCost + tax;

    return (
        <div className="bg-[#f5f5f3] min-h-screen">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">

                {/* ======== STEP INDICATOR ======== */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    {/* Step 1 - Active */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-charcoal flex items-center justify-center text-white text-[12px] font-bold">
                            1
                        </div>
                        <span className="text-[13px] font-semibold text-charcoal">Shipping</span>
                    </div>
                    {/* Connector */}
                    <div className="w-16 h-px bg-[#d0d0cc]" />
                    {/* Step 2 */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full border-2 border-[#d0d0cc] flex items-center justify-center text-[12px] font-semibold text-[#aaa]">
                            2
                        </div>
                        <span className="text-[13px] text-muted">Payment</span>
                    </div>
                    {/* Connector */}
                    <div className="w-16 h-px bg-[#d0d0cc]" />
                    {/* Step 3 */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full border-2 border-[#d0d0cc] flex items-center justify-center text-[12px] font-semibold text-[#aaa]">
                            3
                        </div>
                        <span className="text-[13px] text-muted">Review</span>
                    </div>
                </div>

                {/* ======== MAIN GRID ======== */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 lg:gap-7 items-start">

                    {/* ======== LEFT COLUMN ======== */}
                    <div className="space-y-5">

                        {/* SHIPPING ADDRESS */}
                        <section className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-6">
                            <h2
                                className="text-[22px] font-bold text-charcoal mb-5"
                                style={{ fontFamily: "var(--font-heading)" }}
                            >
                                Shipping Address
                            </h2>

                            {/* If addresses exist AND form not forced open: show selector */}
                            {hasAddresses && !showForm ? (
                                <div className="space-y-3">
                                    {mockAddresses.map((addr) => (
                                        <label
                                            key={addr.id}
                                            className="flex items-start gap-3 p-4 border border-[#e0e0db] rounded-lg cursor-pointer hover:border-charcoal/40 transition-colors"
                                        >
                                            <input
                                                type="radio"
                                                name="saved-address"
                                                defaultChecked={addr.isDefault}
                                                className="mt-1 accent-charcoal w-4 h-4 shrink-0"
                                            />
                                            <div className="text-[13px] text-charcoal leading-relaxed">
                                                <p className="font-semibold">{addr.fullName}</p>
                                                <p className="text-muted mt-0.5">{addr.addressLine1}, {addr.city}, {addr.state} – {addr.pincode}</p>
                                                <p className="text-muted">{addr.phone}</p>
                                            </div>
                                        </label>
                                    ))}
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="text-[13px] text-[#107c6f] font-medium hover:underline underline-offset-2 mt-1"
                                    >
                                        + Add a new address
                                    </button>
                                </div>
                            ) : (
                                /* ADDRESS FORM */
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">First Name</label>
                                            <input
                                                type="text"
                                                placeholder="Jane"
                                                className="w-full h-11 px-4 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">Last Name</label>
                                            <input
                                                type="text"
                                                placeholder="Doe"
                                                className="w-full h-11 px-4 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">Address Line 1</label>
                                        <input
                                            type="text"
                                            placeholder="Apt, Suite, Building, Street"
                                            className="w-full h-11 px-4 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">City</label>
                                            <input
                                                type="text"
                                                placeholder="Mumbai"
                                                className="w-full h-11 px-4 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">State</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full h-11 px-4 pr-10 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white focus:outline-none focus:border-charcoal transition-colors appearance-none"
                                                    defaultValue="Maharashtra"
                                                >
                                                    {INDIAN_STATES.map((s) => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted rotate-90 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">Pincode</label>
                                            <input
                                                type="text"
                                                placeholder="400001"
                                                maxLength={6}
                                                className="w-full h-11 px-4 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">Phone</label>
                                            <input
                                                type="tel"
                                                placeholder="+91 98765 43210"
                                                className="w-full h-11 px-4 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {hasAddresses && (
                                        <button
                                            onClick={() => setShowForm(false)}
                                            className="text-[13px] text-muted hover:text-charcoal underline underline-offset-2"
                                        >
                                            ← Use saved address
                                        </button>
                                    )}
                                </div>
                            )}
                        </section>

                        {/* SHIPPING METHOD */}
                        <section className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-6">
                            <h2
                                className="text-[22px] font-bold text-charcoal mb-5"
                                style={{ fontFamily: "var(--font-heading)" }}
                            >
                                Shipping Method
                            </h2>

                            <div className="space-y-3">
                                {/* Standard */}
                                <label
                                    className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 cursor-pointer transition-colors ${shippingMethod === "standard"
                                        ? "border-charcoal bg-white"
                                        : "border-[#e0e0db] hover:border-charcoal/40"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${shippingMethod === "standard" ? "border-charcoal" : "border-[#ccc]"}`}>
                                            {shippingMethod === "standard" && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-charcoal" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-semibold text-charcoal">Standard Shipping</p>
                                            <p className="text-[12px] text-muted">3-5 Business Days</p>
                                        </div>
                                    </div>
                                    <span className="text-[14px] font-bold text-charcoal">FREE</span>
                                    <input
                                        type="radio"
                                        name="shipping"
                                        className="sr-only"
                                        checked={shippingMethod === "standard"}
                                        onChange={() => setShippingMethod("standard")}
                                    />
                                </label>

                                {/* Express */}
                                <label
                                    className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 cursor-pointer transition-colors ${shippingMethod === "express"
                                        ? "border-charcoal bg-white"
                                        : "border-[#e0e0db] hover:border-charcoal/40"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${shippingMethod === "express" ? "border-charcoal" : "border-[#ccc]"}`}>
                                            {shippingMethod === "express" && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-charcoal" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-semibold text-charcoal">Express Shipping</p>
                                            <p className="text-[12px] text-muted">Next Business Day</p>
                                        </div>
                                    </div>
                                    <span className="text-[14px] font-bold text-charcoal">₹250</span>
                                    <input
                                        type="radio"
                                        name="shipping"
                                        className="sr-only"
                                        checked={shippingMethod === "express"}
                                        onChange={() => setShippingMethod("express")}
                                    />
                                </label>
                            </div>
                        </section>
                    </div>

                    {/* ======== RIGHT COLUMN: ORDER SUMMARY ======== */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-6 sticky top-24">
                            <h2
                                className="text-[18px] font-bold text-charcoal mb-5"
                                style={{ fontFamily: "var(--font-heading)" }}
                            >
                                Order Summary
                            </h2>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-5">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-3 items-start">
                                        <div className="w-[60px] h-[60px] rounded-md bg-[#1a1a1a] shrink-0 flex items-center justify-center text-[10px] text-white/20 overflow-hidden">
                                            Img
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-semibold text-charcoal leading-snug">{item.productName}</p>
                                            <p className="text-[11px] text-muted mt-0.5">925 Sterling Silver | {item.variantInfo}</p>
                                            <p className="text-[11px] text-muted">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-[13px] font-semibold text-charcoal shrink-0">{formatPrice(item.unitPrice)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-[#e8e8e4] mb-4" />

                            {/* Totals */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="text-charcoal font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-muted">Shipping</span>
                                    <span className={shippingCost === 0 ? "font-semibold text-[#107c6f]" : "font-medium text-charcoal"}>
                                        {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-muted">Estimated Tax (GST 3%)</span>
                                    <span className="text-charcoal font-medium">₹{tax}</span>
                                </div>
                            </div>

                            {/* Grand Total */}
                            <div className="flex justify-between items-center mb-5 border-t border-[#e8e8e4] pt-3">
                                <span className="text-[15px] font-bold text-charcoal">Grand Total</span>
                                <span className="text-[15px] font-bold text-charcoal">₹{total.toLocaleString("en-IN")}</span>
                            </div>

                            {/* Complete Purchase Button */}
                            <Link
                                href="/order-confirmed"
                                className="w-full h-[52px] flex items-center justify-center gap-2 bg-charcoal hover:bg-charcoal/90 text-white text-[12px] font-bold tracking-widest uppercase rounded-md transition-colors duration-200"
                            >
                                COMPLETE PURCHASE
                                <Shield size={14} strokeWidth={2} />
                            </Link>

                            {/* Trust Icons — inside card, no overlap */}
                            <div className="flex items-center justify-around border-t border-[#e8e8e4] pt-4 mt-4">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <Shield size={20} strokeWidth={1.5} className="text-muted" />
                                    <p className="text-[9px] font-bold text-muted uppercase tracking-widest leading-tight">100% Secure<br />Payment</p>
                                </div>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <Award size={20} strokeWidth={1.5} className="text-muted" />
                                    <p className="text-[9px] font-bold text-muted uppercase tracking-widest leading-tight">925 Purity<br />Guaranteed</p>
                                </div>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <RotateCcw size={20} strokeWidth={1.5} className="text-muted" />
                                    <p className="text-[9px] font-bold text-muted uppercase tracking-widest leading-tight">Easy 30-Day<br />Returns</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
