"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/features/products/ProductCard";
import { mockProducts } from "@/data/mock-data";

export default function WishlistPage() {
    const wishlistItems = mockProducts.slice(0, 4);

    return (
        <div className="max-w-[1440px] mx-auto px-4 lg:px-0">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
                <div>
                    <h1 className="text-2xl font-semibold text-charcoal" style={{ fontFamily: "var(--font-heading)" }}>
                        My Wishlist
                    </h1>
                    <p className="text-sm text-muted mt-1">{wishlistItems.length} items saved</p>
                </div>
                <div className="hidden sm:inline-block p-[2px] border border-charcoal rounded-[2px]">
                    <Button variant="outline" size="sm" className="h-9 px-6 uppercase tracking-[0.15em] text-[10px] font-bold border-charcoal">
                        Move All to Cart
                    </Button>
                </div>
            </div>

            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {wishlistItems.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            showAddToCart={true}
                            showRemove={true}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-border p-12 text-center max-w-2xl mx-auto mt-12">
                    <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mx-auto mb-4 text-emerald">
                        <Heart size={28} className="fill-emerald/20 stroke-emerald" />
                    </div>
                    <h3 className="text-xl font-semibold text-charcoal mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                        Your wishlist is empty
                    </h3>
                    <p className="text-sm text-muted mb-8">
                        Save your favorite pure silver designs to view them later.
                    </p>
                    <Button variant="primary" asChild>
                        <Link href="/products">Discover New Arrivals</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
