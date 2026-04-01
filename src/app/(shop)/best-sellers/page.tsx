"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Flame, TrendingUp } from "lucide-react";
import ProductCard from "@/components/features/products/ProductCard";
import { useShopProductStore } from "@/store/useShopProductStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@clerk/nextjs";

export default function BestSellersPage() {
    const { products, isLoading, fetchProducts } = useShopProductStore();
    const { addItem: addCartItem } = useCartStore();
    const { getToken } = useAuth();

    useEffect(() => {
        fetchProducts({ isFeatured: true, limit: 12, status: "PUBLISHED" });
    }, [fetchProducts]);

    const handleAddToCart = (product: typeof products[0]) => {
        const firstVariant = product.variants?.[0];
        if (!firstVariant) return;

        addCartItem(
            {
                productVariantId: firstVariant.id,
                productName: product.name,
                variantLabel: firstVariant.label,
                sku: firstVariant.sku,
                imageUrl: product.images.find((i) => i.isPrimary)?.s3Url ?? product.images[0]?.s3Url ?? "",
                unitPrice: product.salePrice
                    ? Number(product.salePrice)
                    : firstVariant.priceOverride
                        ? Number(firstVariant.priceOverride)
                        : Number(product.basePrice),
                stockQty: firstVariant.stockQty,
                productSlug: product.slug,
            },
            1,
            getToken,
        );
    };

    const SkeletonGrid = () => (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-md mb-3" />
                    <div className="bg-gray-200 h-4 rounded mb-2 w-3/4" />
                    <div className="bg-gray-200 h-4 rounded w-1/2" />
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-[#f5f5f3] min-h-screen">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">

                {/* Hero */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Flame size={22} className="text-orange-500" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-500">Most Loved Pieces</span>
                    </div>
                    <h1 className="text-[38px] sm:text-[50px] font-bold text-charcoal leading-tight mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                        Best Sellers
                    </h1>
                    <p className="text-muted text-sm max-w-md mx-auto">
                        Our most cherished designs — handpicked by thousands of customers across India.
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="flex items-center justify-center gap-8 mb-10">
                    {[{ label: "Happy Customers", value: "12,000+" }, { label: "5-Star Reviews", value: "4.8 ★" }, { label: "Designs", value: "500+" }].map(({ label, value }) => (
                        <div key={label} className="text-center">
                            <p className="text-[22px] font-bold text-charcoal">{value}</p>
                            <p className="text-[11px] text-muted uppercase tracking-widest">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Products */}
                {isLoading ? <SkeletonGrid /> : products.length === 0 ? (
                    <div className="text-center py-16">
                        <TrendingUp size={40} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-muted text-sm">No best-seller products found. Check back soon!</p>
                        <Link href="/products" className="mt-4 inline-block text-sm text-[#107c6f] underline">Browse all products</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        {products.map((p) => (
                            <ProductCard key={p.id} product={{
                                id: p.id, name: p.name, slug: p.slug, sku: p.sku,
                                description: p.description ?? "", shortDescription: p.metalType,
                                basePrice: Number(p.basePrice), salePrice: p.salePrice ? Number(p.salePrice) : undefined,
                                category: p.category as any, status: p.status as "PUBLISHED",
                                categoryId: p.categoryId,
                                images: p.images.map((img) => ({ id: img.id, url: img.s3Url, alt: img.altText ?? p.name, isPrimary: img.isPrimary, sortOrder: img.sortOrder })),
                                material: p.metalType, purity: "92.5%", isFeatured: p.isFeatured,
                                rating: Number(p.averageRating), reviewCount: p.reviewCount,
                                stock: p.stock, tags: p.tags, createdAt: p.createdAt, updatedAt: p.updatedAt,
                            }}
                                onAddToCart={() => handleAddToCart(p)}
                            />
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="text-center mt-12">
                    <Link href="/products" className="inline-flex items-center gap-2 text-[13px] font-semibold text-charcoal border-b-2 border-charcoal pb-0.5 hover:opacity-70 transition-opacity">
                        Explore Full Collection →
                    </Link>
                </div>
            </div>
        </div>
    );
}
