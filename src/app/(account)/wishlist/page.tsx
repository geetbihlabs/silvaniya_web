"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, ShoppingCart, Heart } from "lucide-react";
import { mockProducts } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
    const allProducts = mockProducts;
    const [wishlist, setWishlist] = useState(allProducts.slice(0, 4));
    const trending = allProducts.slice(4, 8);

    const removeFromWishlist = (id: string) => {
        setWishlist((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div className="w-full">
            {/* ======== HEADER ======== */}
            <div className="flex items-center justify-between mb-6">
                <h1
                    className="text-[26px] sm:text-[30px] font-bold text-charcoal"
                    style={{ fontFamily: "var(--font-heading)" }}
                >
                    My Wishlist
                </h1>
                <span className="text-[13px] text-muted">{wishlist.length} items</span>
            </div>

            {/* ======== WISHLIST GRID ======== */}
            {wishlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
                    {wishlist.map((product, idx) => (
                        <div key={product.id} className="group relative flex flex-col">
                            {/* Image container */}
                            <div className="relative rounded-xl overflow-hidden bg-[#1a1a1a] aspect-square mb-3">
                                <div className="w-full h-full flex items-center justify-center text-white/20 text-[11px]">
                                    Img
                                </div>

                                {/* LOW STOCK badge */}
                                {idx === 2 && (
                                    <div className="absolute bottom-2 left-2 bg-charcoal text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                                        LOW STOCK
                                    </div>
                                )}

                                {/* Remove button */}
                                <button
                                    onClick={() => removeFromWishlist(product.id)}
                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-muted hover:text-charcoal transition-colors"
                                    aria-label="Remove from wishlist"
                                >
                                    <X size={13} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Info */}
                            <p className="text-[13px] font-semibold text-charcoal mb-0.5 leading-snug">
                                {product.name}
                            </p>
                            <p className="text-[13px] font-bold text-charcoal mb-3">
                                {formatPrice(product.price)}
                            </p>

                            {/* Add to Cart button */}
                            <button className="w-full flex items-center justify-center gap-2 h-9 bg-charcoal hover:bg-charcoal/90 text-white text-[11px] font-bold uppercase tracking-wider rounded-md transition-colors duration-200">
                                <ShoppingCart size={13} strokeWidth={2} />
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#f5f5f3] flex items-center justify-center mb-4">
                        <Heart size={26} strokeWidth={1.5} className="text-muted" />
                    </div>
                    <h3 className="text-[18px] font-bold text-charcoal mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                        Your wishlist is empty
                    </h3>
                    <p className="text-[13px] text-muted mb-6">Save your favourite silver pieces to view them later.</p>
                    <Link
                        href="/products"
                        className="px-6 h-11 bg-charcoal hover:bg-charcoal/90 text-white text-[13px] font-semibold rounded-lg flex items-center transition-colors"
                    >
                        Discover New Arrivals
                    </Link>
                </div>
            )}

            {/* ======== TRENDING NOW ======== */}
            {trending.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h2
                            className="text-[18px] font-bold text-charcoal"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Trending Now
                        </h2>
                        <Link
                            href="/products"
                            className="text-[13px] font-medium text-[#107c6f] hover:underline flex items-center gap-1"
                        >
                            View All &gt;
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {trending.map((product) => (
                            <Link key={product.id} href={`/products/${product.id}`} className="group block">
                                <div className="relative rounded-xl overflow-hidden bg-[#1a1a1a] aspect-square mb-2">
                                    <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px]">
                                        Img
                                    </div>
                                    {/* Wishlist heart */}
                                    <button
                                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-muted hover:text-red-500 transition-colors"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <Heart size={13} strokeWidth={2} />
                                    </button>
                                </div>
                                <p className="text-[12px] font-semibold text-charcoal leading-snug">{product.name}</p>
                                <p className="text-[12px] text-muted mt-0.5">{formatPrice(product.price)}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
