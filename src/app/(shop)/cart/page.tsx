"use client";

import React from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, Heart, Shield, Truck, RotateCcw, ArrowRight } from "lucide-react";
import ProductCard from "@/components/features/products/ProductCard";
import { mockCartItems, mockProducts } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
    const cartItems = mockCartItems;
    const relatedProducts = mockProducts.slice(2, 6);

    const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const shipping = 0;
    const tax = Math.round(subtotal * 0.03);
    const total = subtotal + shipping + tax;

    return (
        <div className="bg-[#f5f5f3] min-h-screen">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">

                {/* Header */}
                <div className="mb-6">
                    <h1
                        className="text-[32px] sm:text-[40px] font-bold text-charcoal leading-tight"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Shopping Bag
                    </h1>
                    <p className="text-[13px] text-muted mt-1">
                        Review your exquisite selections ({cartItems.length} Items)
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 lg:gap-7">

                    {/* ======== LEFT: CART ITEMS + TRUST ======== */}
                    <div className="space-y-3">

                        {/* Cart Items */}
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl border border-[#e8e8e4] px-5 py-5"
                            >
                                <div className="flex gap-4 items-start">
                                    {/* Product Image */}
                                    <div className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] rounded-lg overflow-hidden bg-[#1a1a1a] shrink-0 flex items-center justify-center text-[10px] text-white/30">
                                        Img
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="text-[15px] font-semibold text-charcoal leading-snug">
                                                    {item.productName}
                                                </h3>
                                                <p className="text-[10px] text-muted uppercase tracking-wider mt-1">
                                                    SKU: {item.sku} | {item.variantInfo}
                                                </p>
                                            </div>
                                            <span className="text-[15px] font-bold text-charcoal whitespace-nowrap shrink-0">
                                                {formatPrice(item.unitPrice)}
                                            </span>
                                        </div>

                                        {/* Qty + Actions */}
                                        <div className="flex items-center justify-between mt-4">
                                            {/* Qty stepper */}
                                            <div className="flex items-center border border-[#e0e0db] rounded-md overflow-hidden">
                                                <button className="w-8 h-8 flex items-center justify-center text-muted hover:text-charcoal hover:bg-gray-50 transition-colors text-lg leading-none">
                                                    <Minus size={13} />
                                                </button>
                                                <span className="w-10 h-8 flex items-center justify-center text-sm font-medium text-charcoal border-x border-[#e0e0db]">
                                                    {item.quantity}
                                                </span>
                                                <button className="w-8 h-8 flex items-center justify-center text-muted hover:text-charcoal hover:bg-gray-50 transition-colors">
                                                    <Plus size={13} />
                                                </button>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-4">
                                                <button className="flex items-center gap-1.5 text-[11px] text-muted hover:text-red-500 transition-colors uppercase tracking-wider font-medium">
                                                    <Trash2 size={13} strokeWidth={1.8} />
                                                    REMOVE
                                                </button>
                                                <button className="flex items-center gap-1.5 text-[11px] text-muted hover:text-emerald transition-colors uppercase tracking-wider font-medium">
                                                    <Heart size={13} strokeWidth={1.8} />
                                                    WISHLIST
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Trust Badges */}
                        <div className="flex flex-wrap items-center gap-6 sm:gap-10 py-4 px-1">
                            <div className="flex items-center gap-2.5">
                                <Shield size={18} strokeWidth={1.5} className="text-charcoal shrink-0" />
                                <div>
                                    <p className="text-[10px] font-bold text-charcoal uppercase tracking-widest">Secure Payment</p>
                                    <p className="text-[10px] text-muted">SSL Encrypted Checkout</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Truck size={18} strokeWidth={1.5} className="text-charcoal shrink-0" />
                                <div>
                                    <p className="text-[10px] font-bold text-charcoal uppercase tracking-widest">Fast Delivery</p>
                                    <p className="text-[10px] text-muted">Free shipping across India</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <RotateCcw size={18} strokeWidth={1.5} className="text-charcoal shrink-0" />
                                <div>
                                    <p className="text-[10px] font-bold text-charcoal uppercase tracking-widest">Easy Returns</p>
                                    <p className="text-[10px] text-muted">30-day hassle-free policy</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ======== RIGHT: ORDER SUMMARY ======== */}
                    <div>
                        <div className="bg-white rounded-xl border border-[#e8e8e4] p-6 sticky top-24">
                            <h2
                                className="text-[18px] font-bold text-charcoal mb-5"
                                style={{ fontFamily: "var(--font-heading)" }}
                            >
                                Order Summary
                            </h2>

                            {/* Line items */}
                            <div className="space-y-2.5 mb-4">
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="font-medium text-charcoal">₹ {subtotal.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-muted">Shipping</span>
                                    <span className="font-semibold text-[#107c6f]">FREE</span>
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-muted">Estimated Tax</span>
                                    <span className="font-medium text-charcoal">₹ {tax}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t border-[#e8e8e4] pt-3 flex justify-between mb-5">
                                <span className="text-[15px] font-bold text-charcoal">Total</span>
                                <span className="text-[15px] font-bold text-charcoal">₹ {total.toLocaleString("en-IN")}</span>
                            </div>

                            {/* Coupon */}
                            <div className="mb-4">
                                <p className="text-[9px] font-bold text-charcoal uppercase tracking-widest mb-2">Apply Coupon</p>
                                <div className="flex rounded-md overflow-hidden border border-[#e0e0db]">
                                    <input
                                        type="text"
                                        placeholder="Promo code"
                                        className="flex-1 h-10 px-3 text-[13px] text-charcoal placeholder:text-gray-400 focus:outline-none bg-transparent"
                                    />
                                    <button className="bg-charcoal text-white text-[12px] font-semibold px-4 h-10 shrink-0 hover:bg-charcoal/90 transition-colors">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <Link
                                href="/checkout"
                                className="w-full h-[50px] flex items-center justify-center gap-2 bg-charcoal hover:bg-charcoal/90 text-white text-[13px] font-semibold rounded-md transition-colors duration-200"
                            >
                                Proceed to Checkout
                                <ArrowRight size={16} strokeWidth={2} />
                            </Link>

                            <p className="text-[10px] text-muted text-center mt-3 leading-relaxed px-2">
                                Prices inclusive of all taxes. By proceeding, you agree to our{" "}
                                <Link href="/terms" className="underline underline-offset-2 hover:text-charcoal">
                                    Terms of Service
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>

                {/* ======== YOU MAY ALSO LIKE ======== */}
                <div className="mt-14 mb-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2
                            className="text-[22px] sm:text-[26px] font-semibold text-charcoal"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            You May Also Like
                        </h2>
                        <Link
                            href="/products"
                            className="text-[13px] text-charcoal font-medium hover:underline underline-offset-4"
                        >
                            View All Collection
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
                        {relatedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
