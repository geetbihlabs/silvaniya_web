"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, CreditCard, Wallet, Truck, Plus, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { mockCartItems, mockAddresses } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";
import { Address } from "@/types/order.types";

export default function CheckoutPage() {
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedAddress, setSelectedAddress] = useState<string>(
        mockAddresses.find((a) => a.isDefault)?.id || mockAddresses[0].id
    );
    const [paymentMethod, setPaymentMethod] = useState("upi");

    const cartItems = mockCartItems;
    const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const shipping = 0; // Free
    const tax = Math.round(subtotal * 0.03);
    const total = subtotal + shipping + tax;

    return (
        <div className="bg-cream min-h-screen pb-12">
            {/* Minimal Header for Checkout */}
            <header className="bg-white border-b border-border py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/">
                        <span className="text-xl font-light tracking-[0.3em] text-charcoal" style={{ fontFamily: "var(--font-heading)" }}>
                            SILVANIYA
                        </span>
                    </Link>
                    <div className="flex items-center gap-4 text-sm font-medium">
                        <span className={step >= 1 ? "text-emerald font-semibold" : "text-charcoal"}>1. Shipping</span>
                        <ChevronRight size={14} className="text-muted" />
                        <span className={step >= 2 ? "text-emerald font-semibold" : "text-muted"}>2. Payment</span>
                        <ChevronRight size={14} className="text-muted" />
                        <span className="text-muted">3. Confirm</span>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto mt-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* ======== MAIN CHECKOUT FLOW ======== */}
                    <div className="flex-1 space-y-8">
                        {/* Delivery Address */}
                        <section className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-charcoal" style={{ fontFamily: "var(--font-heading)" }}>
                                    Delivery Address
                                </h2>
                                {step === 1 && (
                                    <Button variant="outline" size="sm" className="hidden sm:flex">
                                        <Plus size={16} /> Add New Address
                                    </Button>
                                )}
                            </div>

                            {step === 1 ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {mockAddresses.map((address: Address) => (
                                            <label
                                                key={address.id}
                                                className={`block relative border rounded-xl p-4 cursor-pointer transition-all ${selectedAddress === address.id
                                                    ? "border-emerald bg-emerald/5"
                                                    : "border-border hover:border-charcoal/30"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="address"
                                                            checked={selectedAddress === address.id}
                                                            onChange={() => setSelectedAddress(address.id)}
                                                            className="w-4 h-4 border-silver accent-emerald"
                                                        />
                                                        <span className="font-semibold text-charcoal">{address.fullName}</span>
                                                    </div>
                                                    <span className="text-xs bg-gray-100 text-charcoal px-2 py-0.5 rounded-sm uppercase tracking-wider">
                                                        {address.label}
                                                    </span>
                                                </div>
                                                <div className="pl-6 text-sm text-muted leading-relaxed">
                                                    {address.addressLine1}
                                                    {address.addressLine2 && <><br />{address.addressLine2}</>}
                                                    <br />
                                                    {address.city}, {address.state} {address.pincode}
                                                    <br />
                                                    Mobile: {address.phone}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                                        <Button variant="outline" size="sm" className="w-full sm:hidden">
                                            <Plus size={16} /> Add New Address
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                // Collapsed Address View for Step 2
                                <div className="border border-emerald/20 bg-emerald/5 rounded-xl p-4 flex justify-between items-start">
                                    <div className="text-sm text-charcoal leading-relaxed">
                                        <span className="font-semibold block mb-1">
                                            {mockAddresses.find(a => a.id === selectedAddress)?.fullName}
                                        </span>
                                        {mockAddresses.find(a => a.id === selectedAddress)?.addressLine1}, {mockAddresses.find(a => a.id === selectedAddress)?.city} - {mockAddresses.find(a => a.id === selectedAddress)?.pincode}
                                    </div>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-emerald text-sm font-medium hover:underline p-1"
                                    >
                                        Change
                                    </button>
                                </div>
                            )}
                        </section>

                        {/* Payment Method - Only visible on Step 2 */}
                        {step === 2 && (
                            <section className="bg-white rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-xl font-semibold text-charcoal mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                                    Payment Method
                                </h2>

                                <div className="space-y-4">
                                    {/* UPI */}
                                    <label
                                        className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "upi" ? "border-emerald bg-emerald/5" : "border-border"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === "upi"}
                                            onChange={() => setPaymentMethod("upi")}
                                            className="mt-1 w-4 h-4 border-silver accent-emerald"
                                        />
                                        <div className="ml-3 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-charcoal">UPI / QR</span>
                                                <img src="/images/icons/upi-icon.png" alt="UPI" className="h-4 object-contain opacity-70" />
                                            </div>
                                            <p className="text-sm text-muted mt-1">Pay via Google Pay, PhonePe, Paytm or any UPI app</p>

                                            {paymentMethod === "upi" && (
                                                <div className="mt-4 pt-4 border-t border-border/50">
                                                    <p className="text-sm text-muted mb-3">Scan QR code using any UPI app</p>
                                                    <div className="w-32 h-32 bg-gray-100 border border-border rounded-lg flex items-center justify-center text-xs text-muted">
                                                        QR Code
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </label>

                                    {/* Cards */}
                                    <label
                                        className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "card" ? "border-emerald bg-emerald/5" : "border-border"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === "card"}
                                            onChange={() => setPaymentMethod("card")}
                                            className="mt-1 w-4 h-4 border-silver accent-emerald"
                                        />
                                        <div className="ml-3 flex-1">
                                            <div className="flex items-center gap-2">
                                                <CreditCard size={18} className="text-charcoal" />
                                                <span className="font-semibold text-charcoal">Credit / Debit Card</span>
                                            </div>
                                            <p className="text-sm text-muted mt-1">Visa, Mastercard, Amex, RuPay</p>

                                            {paymentMethod === "card" && (
                                                <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
                                                    <Input label="Card Number" placeholder="0000 0000 0000 0000" />
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input label="Expiry (MM/YY)" placeholder="MM/YY" />
                                                        <Input label="CVV" placeholder="123" type="password" />
                                                    </div>
                                                    <Input label="Name on Card" placeholder="John Doe" />
                                                </div>
                                            )}
                                        </div>
                                    </label>

                                    {/* Net Banking */}
                                    <label
                                        className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "netbanking" ? "border-emerald bg-emerald/5" : "border-border"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === "netbanking"}
                                            onChange={() => setPaymentMethod("netbanking")}
                                            className="mt-1 w-4 h-4 border-silver accent-emerald"
                                        />
                                        <div className="ml-3 flex-1">
                                            <div className="flex items-center gap-2">
                                                <Wallet size={18} className="text-charcoal" />
                                                <span className="font-semibold text-charcoal">Net Banking</span>
                                            </div>
                                            <p className="text-sm text-muted mt-1">All major Indian banks supported</p>
                                        </div>
                                    </label>

                                    {/* COD */}
                                    <label
                                        className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "cod" ? "border-emerald bg-emerald/5" : "border-border"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === "cod"}
                                            onChange={() => setPaymentMethod("cod")}
                                            className="mt-1 w-4 h-4 border-silver accent-emerald"
                                        />
                                        <div className="ml-3 flex-1">
                                            <div className="flex items-center gap-2">
                                                <Truck size={18} className="text-charcoal" />
                                                <span className="font-semibold text-charcoal">Cash on Delivery</span>
                                            </div>
                                            <p className="text-sm text-muted mt-1">Additional ₹50 handling charge applies</p>
                                        </div>
                                    </label>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* ======== ORDER SUMMARY SIDEBAR ======== */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-white rounded-xl p-6 shadow-sm sticky top-6">
                            <h2 className="text-lg font-semibold text-charcoal mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                                Order Summary
                            </h2>

                            {/* Items */}
                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 rounded-md bg-gray-100 flex-shrink-0 flex items-center justify-center text-[10px] text-muted relative">
                                            Img
                                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-charcoal text-white flex items-center justify-center text-xs font-medium">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                            <h4 className="text-sm font-medium text-charcoal line-clamp-1">{item.productName}</h4>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-xs text-muted">{item.variantInfo}</span>
                                                <span className="text-sm font-semibold text-charcoal">{formatPrice(item.unitPrice)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 mb-6 border-t border-border pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="font-medium text-charcoal">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Shipping</span>
                                    <span className="font-medium text-emerald">FREE</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Estimated Tax</span>
                                    <span className="font-medium text-charcoal">{formatPrice(tax)}</span>
                                </div>
                                <div className="border-t border-border pt-3 flex justify-between items-center">
                                    <span className="font-semibold text-charcoal">Total Amount</span>
                                    <span className="font-bold text-xl text-charcoal">{formatPrice(total)}</span>
                                </div>
                            </div>

                            {/* Secure Checkout Banner */}
                            <div className="bg-green-50 rounded-lg p-3 flex items-center gap-3 mb-6 border border-green-100">
                                <div className="w-8 h-8 rounded-full bg-emerald/10 flex items-center justify-center flex-shrink-0">
                                    <Shield size={16} className="text-emerald" />
                                </div>
                                <p className="text-xs text-green-800 leading-relaxed font-medium">
                                    We offer 100% secure SSL-encrypted checkout for safe payments.
                                </p>
                            </div>

                            {step === 1 ? (
                                <Button variant="primary" size="xl" className="w-full" onClick={() => setStep(2)}>
                                    Continue to Payment
                                </Button>
                            ) : (
                                <Button variant="primary" size="xl" className="w-full" asChild>
                                    <Link href="/order-confirmed">
                                        Pay {formatPrice(total)}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
