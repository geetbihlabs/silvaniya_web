"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { cn, formatPrice, getDiscountPercentage } from "@/lib/utils";
import { Product } from "@/types/product.types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

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
        <div className={cn("group relative", className)}>
            {/* Image Container */}
            <div className="relative aspect-square rounded-[2px] overflow-hidden bg-silver-light mb-3">
                <Link href={`/products/${product.id}`}>
                    <div className="w-full h-full bg-silver-light flex items-center justify-center text-muted text-sm">
                        {primaryImage?.alt || product.name}
                    </div>
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {hasDiscount && (
                        <Badge variant="emerald" className="px-2 py-[2px] text-[10px] font-bold tracking-widest uppercase rounded-[2px]">
                            {discountPercent}% OFF
                        </Badge>
                    )}
                    {product.isNewArrival && (
                        <Badge variant="default" className="px-2 py-[2px] text-[10px] font-bold tracking-widest uppercase rounded-[2px] bg-charcoal text-white">
                            NEW ARRIVAL
                        </Badge>
                    )}
                    {product.isBestSeller && (
                        <Badge variant="default" className="px-2 py-[2px] text-[10px] font-bold tracking-widest uppercase rounded-[2px] bg-charcoal text-white">
                            BEST SELLER
                        </Badge>
                    )}
                    {product.stock <= 5 && product.stock > 0 && (
                        <Badge variant="warning" className="px-2 py-[2px] text-[10px] font-bold tracking-widest uppercase rounded-[2px]">
                            LOW STOCK
                        </Badge>
                    )}
                </div>

                {/* Wishlist / Remove Button */}
                {showRemove ? (
                    <button
                        onClick={onRemove}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-charcoal hover:bg-white hover:text-error transition-all shadow-sm"
                        aria-label="Remove"
                    >
                        ×
                    </button>
                ) : (
                    <button
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-charcoal hover:bg-white hover:text-emerald transition-all shadow-sm opacity-0 group-hover:opacity-100"
                        aria-label="Add to wishlist"
                    >
                        <Heart size={16} />
                    </button>
                )}
            </div>

            {/* Product Info */}
            <div>
                {/* Rating */}
                {product.rating && (
                    <div className="flex items-center gap-1 mb-1">
                        <span className="text-yellow-500 text-xs">★</span>
                        <span className="text-xs text-muted">
                            {product.rating} ({product.reviewCount})
                        </span>
                    </div>
                )}

                {/* Name */}
                <Link href={`/products/${product.id}`}>
                    <h3 className="text-sm font-medium text-charcoal line-clamp-2 hover:text-emerald transition-colors duration-500" style={{ fontFamily: "var(--font-heading)" }}>
                        {product.name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-base font-medium text-charcoal">
                        {formatPrice(product.salePrice || product.basePrice)}
                    </span>
                    {hasDiscount && (
                        <span className="text-sm text-muted line-through">
                            {formatPrice(product.basePrice)}
                        </span>
                    )}
                </div>

                {/* Add to Cart */}
                {showAddToCart && (
                    <Button
                        variant="primary"
                        size="sm"
                        className="mt-3 w-full"
                    >
                        <ShoppingCart size={14} />
                        Add to Cart
                    </Button>
                )}
            </div>
        </div>
    );
}
