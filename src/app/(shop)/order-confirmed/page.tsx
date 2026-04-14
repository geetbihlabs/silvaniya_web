"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Loader2 } from "lucide-react";
import { useOrderStore } from "@/store/useOrderStore";
import { useAuth } from "@clerk/nextjs";
import { formatPrice } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
    PENDING_PAYMENT: "Payment Pending",
    PAYMENT_CONFIRMED: "Payment Confirmed",
    PROCESSING: "Processing",
    QUALITY_CHECK: "Quality Check",
    SHIPPED: "Shipped",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
};

function OrderConfirmedContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const { order, isLoading, fetchOrderById } = useOrderStore();
    const { getToken } = useAuth();

    useEffect(() => {
        if (orderId) {
            fetchOrderById(orderId, getToken);
        }
    }, [orderId, fetchOrderById, getToken]);

    if (!orderId) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center px-4">
                <div className="text-center py-16">
                    <p className="text-muted text-sm">No order ID provided.</p>
                    <Link href="/products" className="mt-4 inline-block text-sm text-[#107c6f] underline">Browse Collection</Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-charcoal" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center px-4">
                <div className="text-center py-16">
                    <Package size={40} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-muted text-sm">Order not found. Please contact support.</p>
                    <Link href="/products" className="mt-4 inline-block text-sm text-[#107c6f] underline">Continue Shopping</Link>
                </div>
            </div>
        );
    }

    const addr = order.shippingAddress;

    return (
        <div className="min-h-screen bg-[#f5f5f3] flex flex-col justify-center py-8">
            <div className="w-full max-w-4xl mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-8">
                    <CheckCircle size={48} className="text-[#107c6f] mx-auto mb-3" strokeWidth={1.5} />
                    <h1 className="text-[28px] sm:text-[32px] font-bold text-charcoal mb-2 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                        Thank You, {addr?.fullName?.split(" ")[0]}!
                    </h1>
                    <p className="text-muted text-sm">Your order has been placed and is being processed.</p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-white border border-[#e8e8e4] rounded-full px-5 py-2">
                        <span className="text-[12px] uppercase tracking-widest text-muted font-medium">Order ID</span>
                        <span className="text-[14px] font-bold text-charcoal">{order.orderNumber}</span>
                    </div>
                </div>

                {/* Two-column grid */}
                <div className="grid md:grid-cols-5 gap-6">

                    {/* ── Left column: Items + Pricing ── */}
                    <div className="md:col-span-3">
                        <div className="bg-white rounded-xl border border-[#e8e8e4] p-5">
                            <h2 className="text-[16px] font-bold text-charcoal mb-4" style={{ fontFamily: "var(--font-heading)" }}>Items Ordered</h2>
                            <div className="space-y-4">
                                {order.items.map((item) => {
                                    const imageUrl =
                                        item.productVariant?.product?.images?.find((i) => i.isPrimary)?.s3Url ??
                                        item.productVariant?.product?.images?.[0]?.s3Url ??
                                        "";
                                    return (
                                        <div key={item.id} className="flex gap-3 items-center">
                                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                                                {imageUrl
                                                    ? <img src={imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                                                    : <Package size={20} className="text-gray-300" />
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[14px] font-semibold text-charcoal">{item.productName}</p>
                                                <p className="text-[11px] text-muted">{item.variantLabel} &middot; Qty {item.quantity}</p>
                                            </div>
                                            <span className="text-[14px] font-semibold text-charcoal shrink-0">{formatPrice(Number(item.totalPrice))}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-[#e8e8e4] mt-4 pt-4 space-y-2">
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="text-charcoal font-medium">{formatPrice(Number(order.subtotal))}</span>
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-muted">Shipping</span>
                                    <span className={Number(order.shippingCharge) === 0 ? "text-[#107c6f] font-semibold" : "text-charcoal font-medium"}>
                                        {Number(order.shippingCharge) === 0 ? "FREE" : formatPrice(Number(order.shippingCharge))}
                                    </span>
                                </div>
                                {Number(order.discountAmount) > 0 && (
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-muted">Discount {order.discountCode ? `(${order.discountCode})` : ""}</span>
                                        <span className="text-[#107c6f] font-medium">&minus; {formatPrice(Number(order.discountAmount))}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-muted">GST</span>
                                    <span className="text-charcoal font-medium">{formatPrice(Number(order.cgst) + Number(order.sgst))}</span>
                                </div>
                            </div>

                            <div className="border-t border-[#e8e8e4] mt-3 pt-3 space-y-2">
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-charcoal font-medium">Grand Total</span>
                                    <span className="text-charcoal font-medium">{formatPrice(Number(order.totalAmount))}</span>
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-muted">Payment Method</span>
                                    <span className="text-charcoal font-medium">{order.paymentMethod === "CASH_ON_DELIVERY" ? "Cash on Delivery" : "Online Payment"}</span>
                                </div>
                                
                                {order.paymentMethod === "CASH_ON_DELIVERY" ? (
                                    <>
                                        <div className="flex justify-between text-[13px]">
                                            <span className="text-emerald font-semibold">Booking Amount (Paid)</span>
                                            <span className="text-emerald font-semibold">{formatPrice(Number(order.upfrontPaymentAmount || 0))}</span>
                                        </div>
                                        <div className="flex justify-between text-[15px] font-bold border-t border-[#e8e8e4] pt-3 mt-2">
                                            <span className="text-charcoal">Pending Balance (To Pay)</span>
                                            <span className="text-charcoal">{formatPrice(Number(order.totalAmount) - Number(order.upfrontPaymentAmount || 0))}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex justify-between text-[15px] font-bold border-t border-[#e8e8e4] pt-3 mt-2">
                                        <span className="text-emerald">Total Paid</span>
                                        <span className="text-emerald">{formatPrice(Number(order.totalAmount))}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Right column: Status, Address, CTAs ── */}
                    <div className="md:col-span-2 space-y-5">

                        {/* Order Status */}
                        <div className="bg-white rounded-xl border border-[#e8e8e4] p-5">
                            <h2 className="text-[15px] font-bold text-charcoal mb-2">Order Status</h2>
                            <span className="inline-block bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold uppercase tracking-widest rounded-full px-3 py-1">
                                {STATUS_LABELS[order.status] ?? order.status}
                            </span>
                        </div>

                        {/* Delivery Address */}
                        {addr && (
                            <div className="bg-white rounded-xl border border-[#e8e8e4] p-5">
                                <h2 className="text-[15px] font-bold text-charcoal mb-2">Delivery To</h2>
                                <p className="text-[13px] text-charcoal font-semibold">{addr.fullName}</p>
                                <p className="text-[13px] text-muted">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                                <p className="text-[13px] text-muted">{addr.city}, {addr.state} - {addr.pincode}</p>
                                <p className="text-[13px] text-muted">{addr.phone}</p>
                            </div>
                        )}

                        {/* CTAs */}
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/products"
                                className="w-full h-11 flex items-center justify-center bg-charcoal text-white text-[12px] font-bold tracking-widest uppercase rounded-lg hover:bg-charcoal/90 transition-colors"
                            >
                                Continue Shopping
                            </Link>
                            <Link
                                href="/track"
                                className="w-full h-11 flex items-center justify-center border border-[#e8e8e4] bg-white text-charcoal text-[12px] font-bold tracking-widest uppercase rounded-lg hover:border-charcoal/30 transition-colors"
                            >
                                Track Order
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default function OrderConfirmedPage() {
    return (
        <React.Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center"><Loader2 size={32} className="animate-spin text-charcoal" /></div>}>
            <OrderConfirmedContent />
        </React.Suspense>
    );
}
