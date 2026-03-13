"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { cn, formatPrice, getDiscountPercentage } from "@/lib/utils";
import { Product } from "@/types/product.types";
import { ProductCardImage } from "./ProductCardImage";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuth } from "@clerk/nextjs";

interface ProductCardProps {
    product: Product;
    showAddToCart?: boolean;
    showRemove?: boolean;
    onRemove?: () => void;
    onAddToCart?: () => void;
    className?: string;
}

export default function ProductCard({
    product,
    showAddToCart = true,
    showRemove = false,
    onRemove,
    onAddToCart,
    className,
}: ProductCardProps) {
    const { getToken } = useAuth();
    const { addItem, removeItem, isInWishlist } = useWishlistStore();
    const isWishlisted = isInWishlist(product.id);

    const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
    const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
    const discountPercent = hasDiscount
        ? getDiscountPercentage(product.basePrice, product.salePrice!)
        : 0;

    return (
        <div className={cn("group relative flex flex-col", className)}>
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-[#f0f0f0] mb-3 rounded-sm">
                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <ProductCardImage images={product.images} productName={product.name} />
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
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isWishlisted) {
                                removeItem(product.id, getToken);
                            } else {
                                addItem({
                                    productId: product.id,
                                    productName: product.name,
                                    slug: product.slug,
                                    category: typeof product.category === 'object' ? product.category?.name : undefined,
                                    imageUrl: primaryImage?.url || null,
                                    price: Number(product.salePrice || product.basePrice),
                                    basePrice: Number(product.basePrice),
                                    salePrice: product.salePrice ? Number(product.salePrice) : null,
                                    addedAt: new Date().toISOString(),
                                    inStock: product.stock > 0,
                                }, getToken);
                            }
                        }}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-400 hover:text-[#e84c4c] transition-all shadow-sm z-10"
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart size={15} strokeWidth={1.5} className={isWishlisted ? "fill-[#e84c4c] text-[#e84c4c]" : ""} />
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
                <Link href={`/products/${product.slug}`}>
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
                    <button
                        onClick={onAddToCart}
                        disabled={!onAddToCart}
                        className="mt-auto w-full flex items-center justify-center gap-2 bg-charcoal hover:bg-charcoal/90 text-white text-[11px] font-semibold tracking-widest uppercase py-2.5 rounded-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart size={13} strokeWidth={1.8} />
                        Add to Cart
                    </button>
                )}
            </div>
        </div>
    );
}
