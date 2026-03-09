"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { cn, formatPrice, getDiscountPercentage } from "@/lib/utils";
import { Product } from "@/types/product.types";

interface ProductCardProps {
    product: Product;
    showAddToCart?: boolean;
    showRemove?: boolean;
    onRemove?: () => void;
    className?: string;
}

export default function ProductCard({
    product,
    showAddToCart = true,
    showRemove = false,
    onRemove,
    className,
}: ProductCardProps) {
    const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
    const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
    const discountPercent = hasDiscount
        ? getDiscountPercentage(product.basePrice, product.salePrice!)
        : 0;

    return (
        <div className={cn("group relative flex flex-col", className)}>
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-[#f0f0f0] mb-3 rounded-sm">
                <Link href={`/products/${product.id}`} className="block w-full h-full">
                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center text-white/30 text-xs">
                        {primaryImage?.alt || product.name}
                    </div>
                </Link>

                {/* Discount Badge — top-left, red-orange pill */}
                {hasDiscount && (
                    <div className="absolute top-2.5 left-2.5 bg-[#e84c4c] text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm leading-tight z-10">
                        {discountPercent}% OFF
                    </div>
                )}

                {/* Wishlist / Remove Button — top-right, always visible */}
                {showRemove ? (
                    <button
                        onClick={onRemove}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-charcoal hover:bg-white transition-all shadow-sm z-10 text-base font-medium"
                        aria-label="Remove"
                    >
                        ×
                    </button>
                ) : (
                    <button
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-400 hover:text-[#e84c4c] transition-all shadow-sm z-10"
                        aria-label="Add to wishlist"
                    >
                        <Heart size={15} strokeWidth={1.5} />
                    </button>
                )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col flex-1">
                {/* Rating */}
                {product.rating && (
                    <div className="flex items-center gap-1 mb-1">
                        <span className="text-yellow-400 text-xs leading-none">★</span>
                        <span className="text-[11px] text-muted leading-none">
                            {product.rating} ({product.reviewCount})
                        </span>
                    </div>
                )}

                {/* Name */}
                <Link href={`/products/${product.id}`}>
                    <h3 className="text-[13px] font-medium text-charcoal line-clamp-1 hover:text-emerald transition-colors mb-1.5 leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
                        {product.name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-[15px] font-semibold text-charcoal leading-none">
                        {formatPrice(product.salePrice || product.basePrice)}
                    </span>
                    {hasDiscount && (
                        <span className="text-[12px] text-muted line-through leading-none">
                            {formatPrice(product.basePrice)}
                        </span>
                    )}
                </div>

                {/* Add to Cart */}
                {showAddToCart && (
                    <button className="mt-auto w-full flex items-center justify-center gap-2 bg-charcoal hover:bg-charcoal/90 text-white text-[11px] font-semibold tracking-widest uppercase py-2.5 rounded-sm transition-colors duration-200">
                        <ShoppingCart size={13} strokeWidth={1.8} />
                        Add to Cart
                    </button>
                )}
            </div>
        </div>
    );
}
