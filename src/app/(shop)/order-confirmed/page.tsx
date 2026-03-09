"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Package, Truck, Contact } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { mockOrders } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

export default function OrderConfirmedPage() {
    const order = mockOrders[0];

    return (
        <div className="bg-cream min-h-screen py-10 lg:py-16">
            <div className="max-w-[800px] mx-auto px-4 sm:px-6">

                {/* ======== SUCCESS HEADER ======== */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald/10 text-emerald mb-6">
                        <CheckCircle2 size={40} className="stroke-[1.5]" />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-semibold text-charcoal mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                        Thank you for your order!
                    </h1>
                    <p className="text-muted max-w-lg mx-auto leading-relaxed">
                        Your exquisite silver jewellery is being prepared for dispatch. We have sent an email confirmation with order details to <strong>john.doe@example.com</strong>
                    </p>
                </div>

                {/* ======== ORDER STATUS CARDS ======== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-border shadow-sm flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center flex-shrink-0 text-emerald">
                            <Package size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Order Number</p>
                            <p className="text-lg font-semibold text-charcoal">{order.orderNumber}</p>
                            <Button variant="link" size="sm" className="mt-1">Track Order Status</Button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-border shadow-sm flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center flex-shrink-0 text-emerald">
                            <Truck size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Estimated Delivery</p>
                            <p className="text-lg font-semibold text-charcoal">Oct 15 - Oct 18</p>
                            <p className="text-sm text-muted mt-1">Free Insured Shipping</p>
                        </div>
                    </div>
                </div>

                {/* ======== ORDER SUMMARY ======== */}
                <div className="bg-white rounded-xl border border-border overflow-hidden mb-10 shadow-sm">
                    <div className="bg-gray-50 px-6 py-4 border-b border-border">
                        <h2 className="text-base font-semibold text-charcoal uppercase tracking-wider">Order Details</h2>
                    </div>

                    <div className="p-6">
                        {/* Items */}
                        <div className="space-y-4 mb-6 pb-6 border-b border-border">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-xs text-muted">
                                        Img
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <h4 className="text-sm font-medium text-charcoal">{item.productName}</h4>
                                            <span className="text-sm font-semibold text-charcoal">{formatPrice(item.totalPrice)}</span>
                                        </div>
                                        <p className="text-xs text-muted mt-1">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Address & Payment Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6 pb-6 border-b border-border">
                            <div>
                                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Shipping Address</p>
                                <div className="text-sm text-charcoal leading-relaxed">
                                    <span className="font-medium">{order.shippingAddress.fullName}</span><br />
                                    {order.shippingAddress.addressLine1}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
                                    Phone: {order.shippingAddress.phone}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Payment Method</p>
                                <div className="text-sm text-charcoal">
                                    <span className="font-medium">{order.paymentMethod}</span>
                                    <p className="text-xs text-emerald mt-1 bg-emerald/10 inline-block px-2 py-0.5 rounded">Payment Successful</p>
                                </div>
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Subtotal</span>
                                <span className="font-medium text-charcoal">{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Tax</span>
                                <span className="font-medium text-charcoal">{formatPrice(order.taxAmount)}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-charcoal pt-2">
                                <span>Total Paid</span>
                                <span>{formatPrice(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ======== ACTIONS ======== */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="primary" size="lg" asChild>
                        <Link href="/products">
                            Continue Shopping
                            <ChevronRight size={18} />
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/orders">
                            View Order History
                        </Link>
                    </Button>
                </div>

                {/* Need Help */}
                <div className="mt-12 text-center text-sm text-muted">
                    Need help? <Link href="/contact" className="text-emerald hover:underline font-medium">Contact Customer Support</Link>
                </div>
            </div>
        </div>
    );
}
