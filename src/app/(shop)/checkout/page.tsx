"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Award, RotateCcw, ChevronRight, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
];

type ShippingMethod = "standard" | "express";
type PaymentMethodKey = "UPI" | "CREDIT_CARD" | "DEBIT_CARD" | "NET_BANKING" | "CASH_ON_DELIVERY";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotals, clearCart, coupon } = useCartStore();
    const { placeOrder, isPlacing } = useOrderStore();
    const { getToken } = useAuth();

    const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>("UPI");

    const [form, setForm] = useState({
        fullName: "", phone: "", line1: "", line2: "",
        city: "", state: "Maharashtra", pincode: "",
    });

    const { subtotal, cgst, sgst, total, discountAmount } = getTotals(shippingMethod);
    const shippingCharge = shippingMethod === "express" ? 250 : 0;
    const tax = cgst + sgst;

    const handleField = (key: keyof typeof form) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        const order = await placeOrder(
            items,
            { ...form, country: "India" },
            shippingMethod,
            paymentMethod,
            coupon?.code,
            getToken,
        );

        if (order) {
            clearCart(getToken);
            router.push(`/order-confirmed?orderId=${order.id}`);
        }
    };

    return (
        <div className="bg-[#f5f5f3] min-h-screen">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    {[{ n: 1, label: "Shipping", active: true }, { n: 2, label: "Payment", active: true }, { n: 3, label: "Review", active: false }].map((step, i, arr) => (
                        <React.Fragment key={step.n}>
                            <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold ${step.active ? "bg-charcoal text-white" : "border-2 border-[#d0d0cc] text-[#aaa]"}`}>{step.n}</div>
                                <span className={`text-[13px] font-semibold ${step.active ? "text-charcoal" : "text-muted"}`}>{step.label}</span>
                            </div>
                            {i < arr.length - 1 && <div className="w-16 h-px bg-[#d0d0cc]" />}
                        </React.Fragment>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 lg:gap-7 items-start">
                        {/* Left Column */}
                        <div className="space-y-5">
                            {/* Shipping Address */}
                            <section className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-6">
                                <h2 className="text-[22px] font-bold text-charcoal mb-5" style={{ fontFamily: "var(--font-heading)" }}>Shipping Address</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Full Name */}
                                        <div className="sm:col-span-2">
                                            <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">Full Name *</label>
                                            <input required value={form.fullName} onChange={handleField("fullName")} type="text" placeholder="Jane Doe" className="w-full h-11 px-4 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">Phone *</label>
                                            <input required value={form.phone} onChange={handleField("phone")} type="tel" placeholder="+91 98765 43210" className="w-full h-11 px-4 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">Pincode *</label>
                                            <input required value={form.pincode} onChange={handleField("pincode")} maxLength={6} type="text" placeholder="400001" className="w-full h-11 px-4 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">Address Line 1 *</label>
                                        <input required value={form.line1} onChange={handleField("line1")} type="text" placeholder="Apt, Suite, Building, Street" className="w-full h-11 px-4 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">Address Line 2</label>
                                        <input value={form.line2} onChange={handleField("line2")} type="text" placeholder="Landmark (optional)" className="w-full h-11 px-4 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">City *</label>
                                            <input required value={form.city} onChange={handleField("city")} type="text" placeholder="Mumbai" className="w-full h-11 px-4 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">State *</label>
                                            <div className="relative">
                                                <select required value={form.state} onChange={handleField("state")} className="w-full h-11 px-4 pr-10 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white focus:outline-none focus:border-charcoal transition-colors appearance-none">
                                                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted rotate-90 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Shipping Method */}
                            <section className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-6">
                                <h2 className="text-[22px] font-bold text-charcoal mb-5" style={{ fontFamily: "var(--font-heading)" }}>Shipping Method</h2>
                                <div className="space-y-3">
                                    {([{ id: "standard", label: "Standard Shipping", sub: "3-5 Business Days", cost: "FREE" },
                                      { id: "express", label: "Express Shipping", sub: "Next Business Day", cost: "₹250" }] as const).map((opt) => (
                                        <label key={opt.id} className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 cursor-pointer transition-colors ${shippingMethod === opt.id ? "border-charcoal bg-white" : "border-[#e0e0db] hover:border-charcoal/40"}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${shippingMethod === opt.id ? "border-charcoal" : "border-[#ccc]"}`}>
                                                    {shippingMethod === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-charcoal" />}
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-semibold text-charcoal">{opt.label}</p>
                                                    <p className="text-[12px] text-muted">{opt.sub}</p>
                                                </div>
                                            </div>
                                            <span className="text-[14px] font-bold text-charcoal">{opt.cost}</span>
                                            <input type="radio" name="shipping" className="sr-only" checked={shippingMethod === opt.id} onChange={() => setShippingMethod(opt.id)} />
                                        </label>
                                    ))}
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-6">
                                <h2 className="text-[22px] font-bold text-charcoal mb-5" style={{ fontFamily: "var(--font-heading)" }}>Payment Method</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {([
                                        { key: "UPI", label: "UPI" },
                                        { key: "CREDIT_CARD", label: "Credit Card" },
                                        { key: "DEBIT_CARD", label: "Debit Card" },
                                        { key: "NET_BANKING", label: "Net Banking" },
                                        { key: "CASH_ON_DELIVERY", label: "Cash on Delivery" },
                                    ] as const).map((opt) => (
                                        <label key={opt.key} className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-colors text-[13px] font-medium ${paymentMethod === opt.key ? "border-charcoal text-charcoal bg-white" : "border-[#e0e0db] text-muted hover:border-charcoal/40"}`}>
                                            <input type="radio" name="payment" className="sr-only" checked={paymentMethod === opt.key} onChange={() => setPaymentMethod(opt.key)} />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right: Order Summary */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-6 sticky top-24">
                                <h2 className="text-[18px] font-bold text-charcoal mb-5" style={{ fontFamily: "var(--font-heading)" }}>Order Summary</h2>

                                <div className="space-y-4 mb-5">
                                    {items.map((item) => (
                                        <div key={item.productVariantId} className="flex gap-3 items-start">
                                            <div className="w-[60px] h-[60px] rounded-md bg-[#1a1a1a] shrink-0 overflow-hidden">
                                                {item.imageUrl ? <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">Img</div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13px] font-semibold text-charcoal leading-snug">{item.productName}</p>
                                                <p className="text-[11px] text-muted mt-0.5">{item.variantLabel}</p>
                                                <p className="text-[11px] text-muted">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="text-[13px] font-semibold text-charcoal shrink-0">{formatPrice(item.unitPrice * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-[#e8e8e4] mb-4" />

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-muted">Subtotal</span>
                                        <span className="text-charcoal font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-[13px]">
                                            <span className="text-emerald font-medium">Discount ({coupon?.code})</span>
                                            <span className="text-emerald font-semibold">− ₹{discountAmount.toLocaleString("en-IN")}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-muted">Shipping</span>
                                        <span className={shippingCharge === 0 ? "font-semibold text-[#107c6f]" : "font-medium text-charcoal"}>
                                            {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-muted">GST (3%)</span>
                                        <span className="text-charcoal font-medium">₹{tax.toLocaleString("en-IN")}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-5 border-t border-[#e8e8e4] pt-3">
                                    <span className="text-[15px] font-bold text-charcoal">Grand Total</span>
                                    <span className="text-[15px] font-bold text-charcoal">₹{total.toLocaleString("en-IN")}</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isPlacing || items.length === 0}
                                    className="w-full h-[52px] flex items-center justify-center gap-2 bg-charcoal hover:bg-charcoal/90 text-white text-[12px] font-bold tracking-widest uppercase rounded-md transition-colors duration-200 disabled:opacity-60"
                                >
                                    {isPlacing ? <><Loader2 size={16} className="animate-spin" /> PLACING ORDER...</> : <><Shield size={14} strokeWidth={2} /> COMPLETE PURCHASE</>}
                                </button>

                                <div className="flex items-center justify-around border-t border-[#e8e8e4] pt-4 mt-4">
                                    {[{ Icon: Shield, label: "100% Secure\nPayment" }, { Icon: Award, label: "925 Purity\nGuaranteed" }, { Icon: RotateCcw, label: "Easy 30-Day\nReturns" }].map(({ Icon, label }) => (
                                        <div key={label} className="flex flex-col items-center gap-2 text-center">
                                            <Icon size={20} strokeWidth={1.5} className="text-muted" />
                                            <p className="text-[9px] font-bold text-muted uppercase tracking-widest leading-tight">{label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
