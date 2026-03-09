"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Truck, Shield, RotateCcw, Star, ChevronRight, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import ProductCard from "@/components/features/products/ProductCard";
import { mockProducts, mockReviews } from "@/data/mock-data";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";

export default function ProductDetailPage() {
    const product = mockProducts[0]; // Use first product as demo
    const relatedProducts = mockProducts.slice(8, 12);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
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
        <div className="max-w-7xl mx-auto py-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs text-muted mb-6">
                <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
                <span>›</span>
                <Link href="/products" className="hover:text-charcoal transition-colors">Silver Jewelry</Link>
                <span>›</span>
                <span className="text-charcoal font-medium">{product.name}</span>
            </nav>

            {/* ======== PRODUCT TOP ======== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
                {/* Image Gallery */}
                <div>
                    {/* Main Image */}
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4 relative">
                        {product.isNewArrival && (
                            <Badge variant="emerald" size="md" className="absolute top-4 left-4 z-10">
                                NEW ARRIVAL
                            </Badge>
                        )}
                        <div className="w-full h-full flex items-center justify-center text-muted">
                            Product Image {selectedImage + 1}
                        </div>
                    </div>
                    {/* Thumbnails */}
                    <div className="flex gap-3">
                        {product.images.map((img, i) => (
                            <button
                                key={img.id}
                                onClick={() => setSelectedImage(i)}
                                className={`w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border-2 transition-colors flex items-center justify-center text-xs text-muted ${selectedImage === i ? "border-charcoal" : "border-transparent"
                                    }`}
                            >
                                Thumb {i + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-3">
                        {product.isBestSeller && (
                            <Badge variant="default" size="md">BEST SELLER</Badge>
                        )}
                        {product.isNewArrival && (
                            <Badge variant="muted" size="md">
                                <Check size={12} className="mr-1" />
                                925 Sterling Silver Certified
                            </Badge>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl lg:text-3xl font-semibold text-charcoal mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                        {product.name}
                    </h1>

                    {/* Rating */}
                    {product.rating && (
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className={i < Math.floor(product.rating!) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-muted">({product.reviewCount} Reviews)</span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-3xl font-bold text-charcoal">
                            {formatPrice(product.salePrice || product.basePrice)}
                        </span>
                        {hasDiscount && (
                            <>
                                <span className="text-lg text-muted line-through">
                                    {formatPrice(product.basePrice)}
                                </span>
                                <Badge variant="outline-emerald" size="md">
                                    ({discountPercent}% OFF)
                                </Badge>
                            </>
                        )}
                    </div>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <div className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm text-charcoal">
                            <Shield size={16} />
                            <span>925 Silver</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm text-charcoal">
                            <span>✦</span>
                            <span>Handcrafted</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm text-charcoal">
                            <Shield size={16} />
                            <span>BIS Hallmarked</span>
                        </div>
                    </div>

                    {/* Pincode Check */}
                    <div className="mb-6">
                        <p className="text-sm font-medium text-charcoal mb-2">Check Delivery</p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter Pincode"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                className="flex-1 h-10 px-4 text-sm rounded-md border border-border text-charcoal placeholder:text-muted-light focus:outline-none focus:border-charcoal"
                            />
                            <Button variant="primary" size="sm">Check</Button>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <div className="flex gap-3 mb-4">
                        <Button variant="primary" size="xl" className="flex-1">
                            <ShoppingCart size={18} />
                            Add to Cart
                        </Button>
                        <Button variant="outline" size="xl" className="px-4">
                            <Heart size={20} />
                        </Button>
                    </div>

                    {/* Trust Badges Inline */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-2">
                        <span className="flex items-center gap-1.5">
                            <Shield size={14} /> 100% Secure Payment
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Check size={14} /> Purity Guarantee
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Truck size={14} /> Free Insured Shipping
                        </span>
                    </div>
                </div>
            </div>

            {/* ======== TABS SECTION ======== */}
            <div className="mb-16">
                <div className="flex gap-8 border-b border-border mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
                                ? "border-charcoal text-charcoal"
                                : "border-transparent text-muted hover:text-charcoal"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
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
                    <div className="bg-cream rounded-xl p-6">
                        <h4 className="text-base font-semibold text-charcoal mb-3">Care Instructions</h4>
                        <ul className="space-y-3 text-sm text-muted">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald mt-0.5">•</span>
                                Store in the provided airtight pouch to prevent oxidation and maintain shine
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald mt-0.5">•</span>
                                Clean with a soft polishing cloth only. Avoid contact with perfumes and water
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ======== REVIEWS ======== */}
            <div className="mb-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl lg:text-2xl font-semibold text-charcoal" style={{ fontFamily: "var(--font-heading)" }}>
                        What Our Customers Say
                    </h2>
                    <Button variant="link" size="sm">
                        Write a Review ✏️
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Rating Summary */}
                    <div className="bg-cream rounded-xl p-6">
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
                        {[5, 4, 3, 2, 1].map((stars) => (
                            <div key={stars} className="flex items-center gap-2 mb-1.5">
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
            <div className="mb-12">
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
