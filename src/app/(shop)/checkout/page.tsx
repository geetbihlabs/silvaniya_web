"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Shield,
    Award,
    RotateCcw,
    ChevronRight,
    Loader2,
    CreditCard,
    Truck,
    AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { loadRazorpayScript, openRazorpayModal } from "@/lib/razorpay";
import { toast } from "react-hot-toast";

// ─── Constants ────────────────────────────────────────────────────────────────

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
];



// ─── Types ────────────────────────────────────────────────────────────────────

type CheckoutPaymentMethod = "ONLINE" | "CASH_ON_DELIVERY";

// ─── Sub-components ───────────────────────────────────────────────────────────

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    required?: boolean;
}

function InputField({ label, required, ...props }: InputFieldProps) {
    return (
        <div>
            <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                required={required}
                className="w-full h-11 px-4 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors"
                {...props}
            />
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotals, clearCart, coupon } = useCartStore();
    const {
        placeOrder,
        initiateRazorpayPayment,
        verifyRazorpayPayment,
        isPlacing,
        isInitiatingPayment,
    } = useOrderStore();
    const { getToken } = useAuth();

    const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>("ONLINE");
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        state: "Maharashtra",
        pincode: "",
    });

    const { subtotal, total, discountAmount } = getTotals("standard");

    // COD is available only when EVERY cart item has allowPartialPayment = true (admin-controlled)
    const codEligible = items.length > 0 && items.every((item) => item.allowPartialPayment === true);
    // Booking amount = highest admin-set minBookingAmount across all cart items
    const codBookingAmount = codEligible
        ? Math.max(...items.map((item) => item.minBookingAmount ?? 0))
        : 0;
    const codRemainingAmount = total - codBookingAmount;

    // Auto-reset to ONLINE if cart changes and COD is no longer eligible
    useEffect(() => {
        if (!codEligible && paymentMethod === "CASH_ON_DELIVERY") {
            setPaymentMethod("ONLINE");
        }
    }, [codEligible, paymentMethod]);

    const handleField =
        (key: keyof typeof form) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
                setForm((prev) => ({ ...prev, [key]: e.target.value }));

    /** Core checkout submit — handles both ONLINE and COD flows */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        setIsProcessingPayment(true);

        // ── Step 1: Create DB order (status: PENDING_PAYMENT) ──────────────
        const dbPaymentMethod =
            paymentMethod === "ONLINE" ? "RAZORPAY" : "CASH_ON_DELIVERY";

        const order = await placeOrder(
            items,
            { ...form, country: "India" },
            "standard",          // only standard shipping
            dbPaymentMethod,
            coupon?.code,
            getToken,
        );

        if (!order) {
            setIsProcessingPayment(false);
            return;
        }

        // ── Step 2: Load Razorpay SDK ──────────────────────────────────────
        const loaded = await loadRazorpayScript();
        if (!loaded) {
            toast.error(
                "Payment gateway unavailable. Please check your connection and try again.",
                { duration: 5000 },
            );
            setIsProcessingPayment(false);
            return;
        }

        // ── Step 3: Create Razorpay order on backend ───────────────────────
        const rzpData = await initiateRazorpayPayment(order.id, getToken);
        if (!rzpData) {
            setIsProcessingPayment(false);
            return;
        }

        // For COD, we charge only the admin-set booking amount through the modal
        const modalAmountPaisa =
            paymentMethod === "CASH_ON_DELIVERY"
                ? Math.round(codBookingAmount * 100)   // admin-defined amount in paisa
                : rzpData.amount;

        // ── Step 4: Open Razorpay modal ────────────────────────────────────
        openRazorpayModal({
            key: rzpData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            amount: modalAmountPaisa,
            currency: rzpData.currency,
            name: "Silvaniya Jewellery",
            description:
                paymentMethod === "CASH_ON_DELIVERY"
                    ? `Booking Amount — ${order.orderNumber}`
                    : `Order — ${order.orderNumber}`,
            order_id: rzpData.razorpayOrderId,
            prefill: {
                name: form.fullName,
                contact: form.phone,
            },
            theme: { color: "#1a1a1a" },

            // ── Step 5: Verify on success ──────────────────────────────────
            handler: async (response) => {
                const verified = await verifyRazorpayPayment(
                    {
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature,
                        orderId: order.id,
                    },
                    getToken,
                );

                if (verified) {
                    await clearCart(getToken);
                    router.push(`/order-confirmed?orderId=${order.id}`);
                }
                setIsProcessingPayment(false);
            },

            modal: {
                ondismiss: () => {
                    toast(
                        "Payment cancelled. Your order is saved — you can complete payment from the Orders page.",
                        { icon: "ℹ️", duration: 6000 },
                    );
                    setIsProcessingPayment(false);
                },
            },
        });
    };

    const isSubmitting = isPlacing || isInitiatingPayment || isProcessingPayment;

    return (
        <div className="bg-[#f5f5f3] min-h-screen">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-10">

                {/* ── Step Indicator ─────────────────────────────────────── */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    {[
                        { n: 1, label: "Shipping", active: true },
                        { n: 2, label: "Payment", active: true },
                        { n: 3, label: "Review", active: false },
                    ].map((step, i, arr) => (
                        <React.Fragment key={step.n}>
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold ${
                                        step.active
                                            ? "bg-charcoal text-white"
                                            : "border-2 border-[#d0d0cc] text-[#aaa]"
                                    }`}
                                >
                                    {step.n}
                                </div>
                                <span
                                    className={`text-[13px] font-semibold ${
                                        step.active ? "text-charcoal" : "text-muted"
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                            {i < arr.length - 1 && (
                                <div className="w-16 h-px bg-[#d0d0cc]" />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 lg:gap-7 items-start">

                        {/* ── Left Column ───────────────────────────────────────── */}
                        <div className="space-y-5">

                            {/* Shipping Address */}
                            <section className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-6">
                                <h2
                                    className="text-[22px] font-bold text-charcoal mb-5"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                >
                                    Shipping Address
                                </h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="sm:col-span-2">
                                            <InputField
                                                label="Full Name"
                                                required
                                                value={form.fullName}
                                                onChange={handleField("fullName")}
                                                type="text"
                                                placeholder="Jane Doe"
                                            />
                                        </div>
                                        <InputField
                                            label="Phone"
                                            required
                                            value={form.phone}
                                            onChange={handleField("phone")}
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                        />
                                        <InputField
                                            label="Pincode"
                                            required
                                            value={form.pincode}
                                            onChange={handleField("pincode")}
                                            maxLength={6}
                                            type="text"
                                            placeholder="400001"
                                        />
                                    </div>
                                    <InputField
                                        label="Address Line 1"
                                        required
                                        value={form.line1}
                                        onChange={handleField("line1")}
                                        type="text"
                                        placeholder="Apt, Suite, Building, Street"
                                    />
                                    <InputField
                                        label="Address Line 2"
                                        value={form.line2}
                                        onChange={handleField("line2")}
                                        type="text"
                                        placeholder="Landmark (optional)"
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField
                                            label="City"
                                            required
                                            value={form.city}
                                            onChange={handleField("city")}
                                            type="text"
                                            placeholder="Mumbai"
                                        />
                                        <div>
                                            <label className="block text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1.5">
                                                State <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    required
                                                    value={form.state}
                                                    onChange={handleField("state")}
                                                    className="w-full h-11 px-4 pr-10 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white focus:outline-none focus:border-charcoal transition-colors appearance-none"
                                                >
                                                    {INDIAN_STATES.map((s) => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                <ChevronRight
                                                    size={14}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted rotate-90 pointer-events-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Shipping Method — Standard only, always free */}
                            <section className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-6">
                                <h2
                                    className="text-[22px] font-bold text-charcoal mb-5"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                >
                                    Shipping Method
                                </h2>
                                <div className="flex items-center justify-between px-5 py-4 rounded-xl border-2 border-charcoal bg-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full border-2 border-charcoal flex items-center justify-center shrink-0">
                                            <div className="w-2.5 h-2.5 rounded-full bg-charcoal" />
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-semibold text-charcoal">Standard Shipping</p>
                                            <p className="text-[12px] text-muted">3–5 Business Days</p>
                                        </div>
                                    </div>
                                    <span className="text-[14px] font-bold text-[#107c6f]">FREE</span>
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-6">
                                <h2
                                    className="text-[22px] font-bold text-charcoal mb-5"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                >
                                    Payment Method
                                </h2>

                                <div className="space-y-3">
                                    {/* Online Payment */}
                                    <label
                                        className={`flex items-start gap-4 px-5 py-4 rounded-xl border-2 cursor-pointer transition-colors ${
                                            paymentMethod === "ONLINE"
                                                ? "border-charcoal bg-white"
                                                : "border-[#e0e0db] hover:border-charcoal/40"
                                        }`}
                                    >
                                        <div
                                            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                                paymentMethod === "ONLINE"
                                                    ? "border-charcoal"
                                                    : "border-[#ccc]"
                                            }`}
                                        >
                                            {paymentMethod === "ONLINE" && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-charcoal" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <CreditCard size={15} className="text-charcoal shrink-0" />
                                                <p className="text-[14px] font-semibold text-charcoal">
                                                    Pay Online (Razorpay)
                                                </p>
                                            </div>
                                            <p className="text-[12px] text-muted mt-0.5">
                                                UPI · Credit / Debit Card · Net Banking · Wallets
                                            </p>
                                            {paymentMethod === "ONLINE" && (
                                                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#107c6f] font-medium">
                                                    <Shield size={11} className="shrink-0" />
                                                    Full amount{" "}
                                                    <span className="font-bold">{formatPrice(total)}</span>{" "}
                                                    secured via Razorpay
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="radio"
                                            name="payment"
                                            className="sr-only"
                                            checked={paymentMethod === "ONLINE"}
                                            onChange={() => setPaymentMethod("ONLINE")}
                                        />
                                    </label>

                                    {/* Cash on Delivery — only shown when ALL items allow partial payment */}
                                    {codEligible && (
                                        <label
                                            className={`flex items-start gap-4 px-5 py-4 rounded-xl border-2 cursor-pointer transition-colors ${
                                                paymentMethod === "CASH_ON_DELIVERY"
                                                    ? "border-charcoal bg-white"
                                                    : "border-[#e0e0db] hover:border-charcoal/40"
                                            }`}
                                        >
                                            <div
                                                className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                                    paymentMethod === "CASH_ON_DELIVERY"
                                                        ? "border-charcoal"
                                                        : "border-[#ccc]"
                                                }`}
                                            >
                                                {paymentMethod === "CASH_ON_DELIVERY" && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-charcoal" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <Truck size={15} className="text-charcoal shrink-0" />
                                                    <p className="text-[14px] font-semibold text-charcoal">
                                                        Cash on Delivery
                                                    </p>
                                                </div>
                                                <p className="text-[12px] text-muted mt-0.5">
                                                    Pay remaining balance at the time of delivery
                                                </p>
                                                {paymentMethod === "CASH_ON_DELIVERY" && (
                                                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                                        <div className="flex items-start gap-2">
                                                            <AlertCircle
                                                                size={13}
                                                                className="text-amber-600 shrink-0 mt-0.5"
                                                            />
                                                            <div>
                                                                <p className="text-[12px] font-semibold text-amber-800">
                                                                    Booking Amount Required
                                                                </p>
                                                                <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                                                                    A non-refundable booking amount of{" "}
                                                                    <span className="font-bold">
                                                                        {formatPrice(codBookingAmount)}
                                                                    </span>{" "}
                                                                    must be paid online now to confirm your COD
                                                                    order. The remaining{" "}
                                                                    <span className="font-bold">
                                                                        {formatPrice(codRemainingAmount)}
                                                                    </span>{" "}
                                                                    is paid on delivery.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="radio"
                                                name="payment"
                                                className="sr-only"
                                                checked={paymentMethod === "CASH_ON_DELIVERY"}
                                                onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                                            />
                                        </label>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* ── Right Column — Order Summary ──────────────────────── */}
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
                                    {items.map((item) => (
                                        <div
                                            key={item.productVariantId}
                                            className="flex gap-3 items-start"
                                        >
                                            <div className="w-[60px] h-[60px] rounded-md bg-[#1a1a1a] shrink-0 overflow-hidden">
                                                {item.imageUrl ? (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.productName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">
                                                        Img
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13px] font-semibold text-charcoal leading-snug">
                                                    {item.productName}
                                                </p>
                                                <p className="text-[11px] text-muted mt-0.5">
                                                    {item.variantLabel}
                                                </p>
                                                <p className="text-[11px] text-muted">
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <span className="text-[13px] font-semibold text-charcoal shrink-0">
                                                {formatPrice(item.unitPrice * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-[#e8e8e4] mb-4" />

                                {/* Price Breakdown */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-muted">Subtotal</span>
                                        <span className="text-charcoal font-medium">
                                            ₹{subtotal.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-[13px]">
                                            <span className="text-emerald font-medium">
                                                Discount ({coupon?.code})
                                            </span>
                                            <span className="text-emerald font-semibold">
                                                − ₹{discountAmount.toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-muted">Shipping</span>
                                        <span
                                            className={
                                                shippingCharge === 0
                                                    ? "font-semibold text-[#107c6f]"
                                                    : "font-medium text-charcoal"
                                            }
                                        >
                                            {shippingCharge === 0
                                                ? "FREE"
                                                : `₹${shippingCharge}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[13px]">
                                        <span className="text-muted">GST</span>
                                        <span className="text-[#107c6f] font-medium text-[11px]">Included in price</span>
                                    </div>
                                </div>

                                {/* Grand Total */}
                                <div className="flex justify-between items-center mb-2 border-t border-[#e8e8e4] pt-3">
                                    <span className="text-[15px] font-bold text-charcoal">
                                        Grand Total
                                    </span>
                                    <span className="text-[15px] font-bold text-charcoal">
                                        ₹{total.toLocaleString("en-IN")}
                                    </span>
                                </div>

                                {/* COD Payment Split */}
                                {paymentMethod === "CASH_ON_DELIVERY" && (
                                    <div className="mb-4 p-3 bg-[#f5f5f3] rounded-lg border border-[#e8e8e4] space-y-1.5">
                                        <div className="flex justify-between text-[12px]">
                                            <span className="text-muted">Pay now (booking)</span>
                                            <span className="font-bold text-charcoal">
                                                {formatPrice(codBookingAmount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-[12px]">
                                            <span className="text-muted">Pay on delivery</span>
                                            <span className="font-medium text-charcoal">
                                                {formatPrice(codRemainingAmount)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* CTA Button */}
                                <button
                                    id="checkout-submit-btn"
                                    type="submit"
                                    disabled={isSubmitting || items.length === 0}
                                    className="w-full h-[52px] flex items-center justify-center gap-2 bg-charcoal hover:bg-charcoal/90 text-white text-[12px] font-bold tracking-widest uppercase rounded-md transition-colors duration-200 disabled:opacity-60"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            PROCESSING...
                                        </>
                                    ) : paymentMethod === "ONLINE" ? (
                                        <>
                                            <Shield size={14} strokeWidth={2} />
                                            PAY {formatPrice(total)}
                                        </>
                                    ) : (
                                        <>
                                            <Truck size={14} strokeWidth={2} />
                                            BOOK WITH {formatPrice(codBookingAmount)}
                                        </>
                                    )}
                                </button>

                                {/* Trust Badges */}
                                <div className="flex items-center justify-around border-t border-[#e8e8e4] pt-4 mt-4">
                                    {[
                                        { Icon: Shield, label: "100% Secure\nPayment" },
                                        { Icon: Award, label: "925 Purity\nGuaranteed" },
                                        { Icon: RotateCcw, label: "Easy 30-Day\nReturns" },
                                    ].map(({ Icon, label }) => (
                                        <div
                                            key={label}
                                            className="flex flex-col items-center gap-2 text-center"
                                        >
                                            <Icon
                                                size={20}
                                                strokeWidth={1.5}
                                                className="text-muted"
                                            />
                                            <p className="text-[9px] font-bold text-muted uppercase tracking-widest leading-tight">
                                                {label}
                                            </p>
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
