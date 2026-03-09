"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Truck, RotateCcw, Award, CheckCircle2 } from "lucide-react";
import ProductCard from "@/components/features/products/ProductCard";
import { mockProducts } from "@/data/mock-data";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";

export default function BestSellersPage() {
    const product = mockProducts[1]; // Featured best seller
    const relatedProducts = mockProducts.slice(2, 6);
    const [selectedImage, setSelectedImage] = useState(0);

    const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
    const discountPercent = hasDiscount
        ? getDiscountPercentage(product.basePrice, product.salePrice!)
        : 0;

    return (
        <div className="bg-[#f5f5f3] min-h-screen">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">

                {/* ======== PRODUCT SECTION ======== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-14 lg:mb-20">

                    {/* Left: Image Gallery */}
                    <div>
                        {/* Main Image */}
                        <div className="aspect-square rounded-xl overflow-hidden bg-[#1a1a1a] mb-4 w-full">
                            <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">
                                Product Image {selectedImage + 1}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-3">
                            {product.images.map((img, i) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(i)}
                                    className={`w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] shrink-0 rounded-lg overflow-hidden bg-[#2a2a2a] border-2 transition-all flex items-center justify-center text-[10px] text-white/30 ${selectedImage === i
                                            ? "border-charcoal"
                                            : "border-transparent hover:border-gray-300"
                                        }`}
                                >
                                    Thumb {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col justify-start pt-0 lg:pt-2">

                        {/* Badges */}
                        <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                            <span className="bg-charcoal text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
                                Best Seller
                            </span>
                            <span className="flex items-center gap-1.5 text-[12px] text-[#107c6f] font-medium">
                                <CheckCircle2 size={14} strokeWidth={2} className="text-[#107c6f]" />
                                925 Sterling Silver Certified
                            </span>
                        </div>

                        {/* Title */}
                        <h1
                            className="text-[30px] sm:text-[36px] font-bold text-charcoal mb-4 leading-tight"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            {product.name}
                        </h1>

                        {/* Price + Discount */}
                        <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-[#e0e0db]">
                            <span className="text-[30px] font-bold text-charcoal leading-none">
                                {formatPrice(product.salePrice || product.basePrice)}
                            </span>
                            {hasDiscount && (
                                <>
                                    <span className="text-[16px] text-muted line-through leading-none">
                                        {formatPrice(product.basePrice)}
                                    </span>
                                    <span className="text-[14px] font-semibold text-[#107c6f] leading-none">
                                        ({discountPercent}% OFF)
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-[14px] text-muted leading-relaxed mb-6">
                            {product.description ||
                                `The ${product.name} is a testament to timeless elegance. Handcrafted from premium 925 Sterling Silver, it features a minimalist design that complements both casual and formal attire. Each piece is hallmarked for purity and comes with an authenticity certificate.`}
                        </p>

                        {/* Add to Cart + Wishlist */}
                        <div className="flex gap-3 mb-5">
                            <button className="flex-1 h-[52px] flex items-center justify-center gap-2.5 bg-charcoal hover:bg-charcoal/90 text-white text-[13px] font-semibold tracking-widest uppercase rounded-md transition-colors duration-200">
                                <ShoppingCart size={17} strokeWidth={1.8} />
                                Add to Cart
                            </button>
                            <button className="w-[52px] h-[52px] flex items-center justify-center border border-[#d8d8d2] rounded-md bg-white text-gray-400 hover:text-[#e84c4c] hover:border-[#e84c4c] transition-colors duration-200 shrink-0">
                                <Heart size={20} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap items-center gap-5 text-[12px] text-muted">
                            <span className="flex items-center gap-1.5">
                                <Truck size={14} strokeWidth={1.5} className="text-muted shrink-0" />
                                Free Express Shipping
                            </span>
                            <span className="flex items-center gap-1.5">
                                <RotateCcw size={14} strokeWidth={1.5} className="text-muted shrink-0" />
                                30-Day Returns
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Award size={14} strokeWidth={1.5} className="text-muted shrink-0" />
                                1-Year Warranty
                            </span>
                        </div>
                    </div>
                </div>

                {/* ======== YOU MAY ALSO LIKE ======== */}
                <div>
                    <div className="flex items-center justify-between mb-7">
                        <h2
                            className="text-[22px] sm:text-[26px] font-semibold text-charcoal"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            You May Also Like
                        </h2>
                        <Link
                            href="/products"
                            className="text-[13px] text-charcoal font-medium hover:underline underline-offset-4 transition-colors"
                        >
                            View All Collection
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
