"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Loader2 } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@clerk/nextjs";
import ProductCard from "@/components/features/products/ProductCard";

export default function WishlistPage() {
    const { items, isLoading, fetchWishlist, removeItem, initialized } = useWishlistStore();
    const { addItem: addCartItem } = useCartStore();
    const { getToken, isSignedIn, isLoaded } = useAuth();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchWishlist(getToken);
        }
    }, [isLoaded, isSignedIn, fetchWishlist, getToken]);

    // Handle adding item from wishlist to cart
    const handleMoveToCart = (item: any) => {
        if (item.stock > 0) {
             addCartItem({
                 productVariantId: item.productId, // We are using productId here as a fallback since specific variants aren't in wishlist yet
                 productName: item.productName,
                 variantLabel: "Default",
                 sku: `SKU-${item.productId.substring(0, 6)}`,
                 imageUrl: item.imageUrl || "",
                 unitPrice: item.salePrice || item.basePrice,
             }, 1, getToken);
        }
    };

    if (!initialized || (isLoaded && isSignedIn && isLoading && items.length === 0)) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="animate-spin text-charcoal h-8 w-8" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-charcoal flex items-center gap-3" style={{ fontFamily: "var(--font-heading)" }}>
                    <Heart className="h-8 w-8 text-[#e84c4c] fill-[#e84c4c]" />
                    My Wishlist
                </h1>
                <span className="text-muted text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                    {items.length} {items.length === 1 ? 'Item' : 'Items'}
                </span>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20 bg-cream rounded-2xl border border-[#e0e0db]">
                    <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h2 className="text-2xl font-semibold text-charcoal mb-2" style={{ fontFamily: "var(--font-heading)" }}>Your Wishlist is Empty</h2>
                    <p className="text-muted mb-8 max-w-sm mx-auto">Explore our collection and add some sparkle to your wishlist!</p>
                    <Link 
                        href="/products" 
                        className="inline-flex items-center gap-2 bg-charcoal hover:bg-charcoal/90 text-white font-semibold tracking-wide uppercase px-8 py-3.5 rounded-md transition-all text-sm"
                    >
                        <ShoppingBag size={18} />
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                    {items.map((item) => (
                        <div key={item.productId} className="relative group flex flex-col">
                            <ProductCard 
                                product={{
                                    id: item.productId,
                                    name: item.productName,
                                    slug: item.slug,
                                    sku: `SKU-${item.productId.substring(0, 6)}`,
                                    description: "",
                                    shortDescription: "",
                                    basePrice: item.basePrice,
                                    salePrice: item.salePrice || undefined,
                                    category: item.category as any,
                                    status: "PUBLISHED",
                                    categoryId: "",
                                    images: item.imageUrl ? [{ id: '1', url: item.imageUrl, alt: item.productName, isPrimary: true, sortOrder: 0 }] : [],
                                    material: "Silver",
                                    purity: "92.5%",
                                    rating: 0,
                                    reviewCount: 0,
                                    stock: item.inStock ? 10 : 0,
                                    tags: [],
                                    createdAt: typeof item.addedAt === 'string' ? item.addedAt : item.addedAt.toISOString(),
                                    updatedAt: typeof item.addedAt === 'string' ? item.addedAt : item.addedAt.toISOString(),
                                    variants: [] // Variants handling
                                }}
                                showAddToCart={false}
                                showRemove={true}
                                onRemove={() => removeItem(item.productId, getToken)}
                            />

                            {/* Move to Cart button below the ProductCard container */}
                            <button
                                onClick={() => handleMoveToCart(item)}
                                disabled={!item.inStock}
                                className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-sm text-[11px] font-semibold tracking-widest uppercase transition-colors duration-200 border ${
                                    item.inStock 
                                    ? 'border-charcoal text-charcoal hover:bg-charcoal hover:text-white' 
                                    : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                                }`}
                            >
                                <ShoppingBag size={14} />
                                {item.inStock ? "Move to Cart" : "Out of Stock"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
