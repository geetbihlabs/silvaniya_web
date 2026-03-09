"use client";

import React from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, Heart, Shield, Truck, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/features/products/ProductCard";
import { mockCartItems, mockProducts } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
    const cartItems = mockCartItems;
    const relatedProducts = mockProducts.slice(8, 12);

    const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const shipping = 0; // Free
    const tax = Math.round(subtotal * 0.03);
    const total = subtotal + shipping + tax;

    return (
        <div className="max-w-7xl mx-auto py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-semibold text-charcoal">
                    Shopping Bag
                </h1>
                <p className="text-sm text-muted mt-1">
                    Review your exquisite selections ({cartItems.length} Items)
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ======== CART ITEMS ======== */}
                <div className="lg:col-span-2 space-y-6">
                    {cartItems.map((item) => (
                        <div key={item.id} className="border border-border rounded-xl p-4 sm:p-6">
                            <div className="flex gap-4">
                                {/* Product Image */}
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center text-xs text-muted">
                                    Image
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-base font-medium text-charcoal">{item.productName}</h3>
                                            <p className="text-xs text-muted uppercase tracking-wider mt-0.5">
                                                SKU: {item.sku} | {item.variantInfo}
                                            </p>
                                        </div>
                                        <span className="text-base font-bold text-charcoal whitespace-nowrap">
                                            {formatPrice(item.unitPrice)}
                                        </span>
                                    </div>

                                    {/* Quantity + Actions */}
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center border border-border rounded-md">
                                            <button className="w-8 h-8 flex items-center justify-center text-muted hover:text-charcoal transition-colors">
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 h-8 flex items-center justify-center text-sm font-medium text-charcoal border-x border-border">
                                                {item.quantity}
                                            </span>
                                            <button className="w-8 h-8 flex items-center justify-center text-muted hover:text-charcoal transition-colors">
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <button className="flex items-center gap-1.5 text-xs text-muted hover:text-error transition-colors">
                                                <Trash2 size={14} />
                                                <span className="hidden sm:inline">REMOVE</span>
                                            </button>
                                            <button className="flex items-center gap-1.5 text-xs text-muted hover:text-emerald transition-colors">
                                                <Heart size={14} />
                                                <span className="hidden sm:inline">WISHLIST</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center gap-6 sm:gap-8 py-4">
                        <div className="flex items-center gap-2">
                            <Shield size={18} className="text-charcoal" />
                            <div>
                                <p className="text-xs font-semibold text-charcoal uppercase tracking-wider">Secure Payment</p>
                                <p className="text-[10px] text-muted">SSL Encrypted Checkout</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Truck size={18} className="text-charcoal" />
                            <div>
                                <p className="text-xs font-semibold text-charcoal uppercase tracking-wider">Fast Delivery</p>
                                <p className="text-[10px] text-muted">Free shipping across India</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <RotateCcw size={18} className="text-charcoal" />
                            <div>
                                <p className="text-xs font-semibold text-charcoal uppercase tracking-wider">Easy Returns</p>
                                <p className="text-[10px] text-muted">52-day hassle-free policy</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ======== ORDER SUMMARY ======== */}
                <div className="lg:col-span-1">
                    <div className="border border-border rounded-xl p-6 sticky top-20">
                        <h2 className="text-lg font-semibold text-charcoal mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                            Order Summary
                        </h2>

                        <div className="space-y-3 mb-6">
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
                            <div className="border-t border-border pt-3 flex justify-between">
                                <span className="font-semibold text-charcoal">Total</span>
                                <span className="font-bold text-lg text-charcoal">{formatPrice(total)}</span>
                            </div>
                        </div>

                        {/* Coupon */}
                        <div className="mb-6">
                            <label className="label-uppercase block mb-2 text-charcoal">Apply Coupon</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Promo code"
                                    className="flex-1 h-10 px-3 text-sm rounded-md border border-border text-charcoal placeholder:text-muted-light focus:outline-none focus:border-charcoal"
                                />
                                <Button variant="primary" size="sm">Apply</Button>
                            </div>
                        </div>

                        <Button variant="emerald" size="lg" className="w-full" asChild>
                            <Link href="/checkout">
                                Proceed to Checkout
                                <ArrowRight size={16} />
                            </Link>
                        </Button>

                        <p className="text-[10px] text-muted text-center mt-4 leading-relaxed">
                            Prices inclusive of all taxes. By proceeding, you agree to our{" "}
                            <Link href="/terms" className="underline">Terms of Service</Link>.
                        </p>
                    </div>
                </div>
            </div>

            {/* ======== YOU MAY ALSO LIKE ======== */}
            <div className="mt-16 mb-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl lg:text-2xl font-semibold text-charcoal" style={{ fontFamily: "var(--font-heading)" }}>
                        You May Also Like
                    </h2>
                    <Link href="/products" className="text-sm text-charcoal font-medium hover:underline underline-offset-4">
                        View All Collection
                    </Link>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {relatedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
