"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Truck, Shield, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import ProductCard from "@/components/features/products/ProductCard";
import { mockProducts, mockReviews } from "@/data/mock-data";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";

export default function ProductDetailPage() {
    const product = mockProducts[0]; // Use first product as demo
    const relatedProducts = mockProducts.slice(8, 12);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState("description");
    const [pincode, setPincode] = useState("");

    const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
    const discountPercent = hasDiscount
        ? getDiscountPercentage(product.basePrice, product.salePrice!)
        : 0;

    const tabs = [
        { id: "description", label: "Description" },
        { id: "materials", label: "Materials & Care" },
        { id: "returns", label: "Returns & Shipping" },
    ];

    return (
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 md:px-8 xl:px-0">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap pb-1 sm:pb-0">
                <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
                <span>›</span>
                <Link href="/products" className="hover:text-charcoal transition-colors">Silver Jewelry</Link>
                <span>›</span>
                <span className="text-charcoal font-medium truncate max-w-[120px] sm:max-w-none">{product.name}</span>
            </nav>

            {/* ======== PRODUCT TOP ======== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-10 sm:mb-16">
                {/* Image Gallery */}
                <div className="flex flex-col lg:block gap-4 sm:gap-4 lg:gap-0">
                    {/* Main Image */}
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 sm:mb-4 relative w-full max-w-[500px] mx-auto lg:max-w-none">
                        {product.isNewArrival && (
                            <Badge variant="emerald" size="md" className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 scale-90 sm:scale-100 origin-top-left">
                                NEW ARRIVAL
                            </Badge>
                        )}
                        <div className="w-full h-full flex items-center justify-center text-muted">
                            Product Image {selectedImage + 1}
                        </div>
                    </div>
                    {/* Thumbnails */}
                    <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 snap-x justify-start sm:justify-center lg:justify-start">
                        {product.images.map((img, i) => (
                            <button
                                key={img.id}
                                onClick={() => setSelectedImage(i)}
                                className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 border-2 transition-colors flex items-center justify-center text-[10px] sm:text-xs text-muted snap-start ${selectedImage === i ? "border-charcoal" : "border-transparent"
                                    }`}
                            >
                                Thumb {i + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    {/* Title */}
                    <h1 className="text-[28px] sm:text-[34px] font-bold text-charcoal mb-2 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                        {product.name}
                    </h1>

                    {/* Rating */}
                    {product.rating && (
                        <div className="flex items-center gap-2 mb-5">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={i < Math.floor(product.rating!) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}
                                    />
                                ))}
                            </div>
                            <span className="text-[13px] text-muted">({product.reviewCount} Reviews)</span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-2.5 mb-6">
                        <span className="text-[32px] font-bold text-charcoal leading-none">
                            {formatPrice(product.salePrice || product.basePrice)}
                        </span>
                        {hasDiscount && (
                            <>
                                <span className="text-[17px] text-muted line-through leading-none">
                                    {formatPrice(product.basePrice)}&nbsp;—
                                </span>
                                <span className="text-[15px] font-medium text-emerald leading-none">
                                    ({discountPercent}% OFF)
                                </span>
                            </>
                        )}
                    </div>

                    {/* Feature Tiles */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="flex flex-col items-center justify-center gap-2 border border-[#e0e0db] rounded-md py-4 px-2 bg-white">
                            <Shield size={22} strokeWidth={1.5} className="text-charcoal" />
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-charcoal text-center leading-tight">925 Silver</span>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2 border border-[#e0e0db] rounded-md py-4 px-2 bg-white">
                            {/* Hand icon using Lucide Hand */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal">
                                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" /><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                            </svg>
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-charcoal text-center leading-tight">Handcrafted</span>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2 border border-[#e0e0db] rounded-md py-4 px-2 bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal">
                                <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                            </svg>
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-charcoal text-center leading-tight">BIS Hallmarked</span>
                        </div>
                    </div>

                    {/* Pincode Check */}
                    <div className="mb-5">
                        <p className="text-[13px] font-semibold text-charcoal mb-2">Check Delivery</p>
                        <div className="flex rounded-lg overflow-hidden border border-[#e0e0db] bg-white">
                            <input
                                type="text"
                                placeholder="Enter Pincode"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                className="flex-1 h-11 px-4 text-[13px] text-charcoal placeholder:text-gray-400 focus:outline-none bg-transparent"
                            />
                            <button className="bg-charcoal text-white text-[13px] font-semibold px-5 h-11 shrink-0 hover:bg-charcoal/90 transition-colors">
                                Check
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart + Wishlist */}
                    <div className="flex gap-3 mb-5">
                        <button className="flex-1 h-[52px] flex items-center justify-center gap-2.5 bg-charcoal hover:bg-charcoal/90 text-white text-[13px] font-semibold tracking-widest uppercase rounded-md transition-colors duration-200">
                            <ShoppingCart size={17} strokeWidth={1.8} />
                            Add to Cart
                        </button>
                        <button className="w-[52px] h-[52px] flex items-center justify-center border border-[#e0e0db] rounded-md bg-white text-gray-400 hover:text-[#e84c4c] hover:border-[#e84c4c] transition-colors duration-200 shrink-0">
                            <Heart size={20} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Trust Badges Inline */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted">
                        <span className="flex items-center gap-1.5">
                            <Shield size={13} className="text-muted shrink-0" strokeWidth={1.5} />
                            100% Secure Payment
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Check size={13} className="text-muted shrink-0" strokeWidth={1.5} />
                            Purity Guaranteed
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Truck size={13} className="text-muted shrink-0" strokeWidth={1.5} />
                            Free Insured Shipping
                        </span>
                    </div>
                </div>
            </div>

            {/* ======== TABS SECTION ======== */}
            <div className="mb-10 sm:mb-16">
                <div className="flex gap-4 sm:gap-8 border-b border-border mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap px-1 ${activeTab === tab.id
                                ? "border-charcoal text-charcoal"
                                : "border-transparent text-muted hover:text-charcoal"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        {activeTab === "description" && (
                            <div>
                                <h3 className="text-xl font-semibold text-charcoal mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                                    Timeless Craftsmanship
                                </h3>
                                <p className="text-muted leading-relaxed mb-4">
                                    {product.description}
                                </p>
                                <ul className="space-y-2 text-sm text-muted">
                                    <li className="flex items-center gap-2">
                                        <Check size={14} className="text-emerald" />
                                        Intricate floral pendant with fine filigree work
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check size={14} className="text-emerald" />
                                        Adjustable 16-18 inch delicate silver chain
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check size={14} className="text-emerald" />
                                        Nickel-free and skin-friendly hypoallergenic material
                                    </li>
                                </ul>
                            </div>
                        )}
                        {activeTab === "materials" && (
                            <div>
                                <h3 className="text-xl font-semibold text-charcoal mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                                    Materials & Care
                                </h3>
                                <p className="text-muted leading-relaxed">
                                    Made from 925 Sterling Silver with a rhodium finish for extra shine and tarnish resistance.
                                    Store in the provided airtight pouch to prevent oxidation and maintain shine.
                                </p>
                            </div>
                        )}
                        {activeTab === "returns" && (
                            <div>
                                <h3 className="text-xl font-semibold text-charcoal mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                                    Returns & Shipping
                                </h3>
                                <p className="text-muted leading-relaxed">
                                    Free express shipping on all orders. 30-day hassle-free return policy. Items must be in original condition with tags attached.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Care Instructions Card */}
                    <div className="bg-cream rounded-xl p-5 sm:p-6 order-1 lg:order-2">
                        <h4 className="text-base font-semibold text-charcoal mb-3">Care Instructions</h4>
                        <ul className="space-y-3 text-sm text-muted">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald mt-0.5">•</span>
                                <span className="leading-relaxed">Store in the provided airtight pouch to prevent oxidation and maintain shine</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald mt-0.5">•</span>
                                <span className="leading-relaxed">Clean with a soft polishing cloth only. Avoid contact with perfumes and water</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ======== REVIEWS ======== */}
            <div className="mb-10 sm:mb-16">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
                    <h2 className="text-xl lg:text-2xl font-semibold text-charcoal" style={{ fontFamily: "var(--font-heading)" }}>
                        What Our Customers Say
                    </h2>
                    {/* <Button variant="link" size="sm" className="px-0 sm:px-4">
                        Write a Review ✏️
                    </Button> */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
                    {/* Rating Summary */}
                    <div className="bg-cream rounded-xl p-6 lg:h-fit">
                        <div className="text-center mb-4">
                            <span className="text-4xl font-bold text-charcoal">{product.rating}</span>
                            <div className="flex items-center justify-center gap-0.5 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className={i < Math.floor(product.rating!) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
                                ))}
                            </div>
                            <p className="text-xs text-muted mt-2">Based on {product.reviewCount} reviews</p>
                        </div>
                        {/* Rating Bars */}
                        <div className="space-y-1.5">
                            {[5, 4, 3, 2, 1].map((stars) => (
                                <div key={stars} className="flex items-center gap-2">
                                    <span className="text-xs text-muted w-2">{stars}</span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-500 rounded-full"
                                            style={{ width: stars === 5 ? "65%" : stars === 4 ? "25%" : stars === 3 ? "8%" : "2%" }}
                                        />
                                    </div>
                                    <span className="text-xs text-muted w-8">{stars === 5 ? "82%" : stars === 4 ? "12%" : stars === 3 ? "4%" : "1%"}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="lg:col-span-3 space-y-6">
                        {mockReviews.map((review) => (
                            <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <span className="font-medium text-sm text-charcoal">{review.userName}</span>
                                        <div className="flex items-center gap-0.5 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted">
                                        {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </span>
                                </div>
                                <p className="text-sm text-muted leading-relaxed">{review.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ======== YOU MAY ALSO LIKE ======== */}
            <div className="mb-8 sm:mb-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-6 sm:mb-8">
                    <h2 className="text-xl lg:text-2xl font-semibold text-charcoal" style={{ fontFamily: "var(--font-heading)" }}>
                        You May Also Like
                    </h2>
                    <Link href="/products" className="text-sm text-emerald sm:text-charcoal font-medium hover:underline underline-offset-4">
                        View All Collection
                    </Link>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 pb-2">
                    {relatedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
