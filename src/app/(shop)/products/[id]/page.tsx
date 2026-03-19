"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Heart, ShoppingCart, Truck, Shield, Star, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import ProductCard from "@/components/features/products/ProductCard";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { useShopProductStore, ShopProduct } from "@/store/useShopProductStore";
import type { Category } from "@/types/product.types";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@clerk/nextjs";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params?.id as string;

    const { fetchProductBySlug } = useShopProductStore();
    const { addItem: addCartItem } = useCartStore();
    const { getToken } = useAuth();
    const { addItem, removeItem, isInWishlist } = useWishlistStore();

    const [product, setProduct] = useState<ShopProduct | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState("description");
    const [pincode, setPincode] = useState("");
    const [selectedVariantId, setSelectedVariantId] = useState<string>("");
    const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (!slug) return;
        setIsLoading(true);
        fetchProductBySlug(slug).then((p) => {
            setProduct(p);
            if (p?.variants?.[0]) setSelectedVariantId(p.variants[0].id);
            setIsLoading(false);
        });
    }, [slug, fetchProductBySlug]);

    // Fetch related products using the hook — handles deduplication & exclusion
    const { products: relatedProducts } = useRelatedProducts(
        product?.categoryId ? [product.categoryId] : [],
        product?.id ? [product.id] : [],
    );

    const isWishlisted = product ? isInWishlist(product.id) : false;

    const handleAddToCart = () => {
        if (!product) return;
        const variant = product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];
        if (!variant) return;

        addCartItem(
            {
                productVariantId: variant.id,
                productName: product.name,
                variantLabel: variant.label,
                sku: variant.sku,
                imageUrl: product.images.find((i) => i.isPrimary)?.s3Url ?? product.images[0]?.s3Url ?? "",
                unitPrice: variant.priceOverride
                    ? Number(variant.priceOverride)
                    : Number(product.salePrice ?? product.basePrice),
            },
            1,
            getToken,
        );
    };

    const tabs = [
        { id: "description", label: "Description" },
        { id: "materials", label: "Materials & Care" },
        { id: "returns", label: "Returns & Shipping" },
    ];

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 md:px-8 xl:px-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 animate-pulse">
                    <div className="aspect-square rounded-xl bg-gray-200" />
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-3/4" />
                        <div className="h-6 bg-gray-200 rounded w-1/4" />
                        <div className="h-12 bg-gray-200 rounded w-1/2" />
                        <div className="h-12 bg-gray-200 rounded" />
                        <div className="h-12 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto py-20 text-center px-4">
                <p className="text-muted text-lg">Product not found.</p>
                <Link href="/products" className="mt-4 inline-block text-sm text-[#107c6f] underline">Browse all products</Link>
            </div>
        );
    }

    const hasDiscount = product.salePrice && Number(product.salePrice) < Number(product.basePrice);
    const discountPercent = hasDiscount ? getDiscountPercentage(Number(product.basePrice), Number(product.salePrice!)) : 0;
    const displayPrice = Number(product.salePrice ?? product.basePrice);
    const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
    const currentImage = product.images[selectedImage] ?? primaryImage;
    const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePos({ x: `${x}%`, y: `${y}%` });
    };

    return (
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 md:px-8 xl:px-0">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted mb-4 sm:mb-6">
                <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
                <span>›</span>
                <Link href="/products" className="hover:text-charcoal transition-colors">Silver Jewelry</Link>
                <span>›</span>
                <span className="text-charcoal font-medium truncate max-w-[120px] sm:max-w-none">{product.name}</span>
            </nav>

            {/* Product Top */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-10 sm:mb-16">
                {/* Image Gallery */}
                <div className="flex flex-col lg:block gap-4">
                    {/* Main Image */}
                    <div
                        className="group aspect-square rounded-xl overflow-hidden bg-gray-100 sm:mb-4 relative w-full max-w-[500px] mx-auto lg:max-w-none cursor-crosshair"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onMouseMove={handleMouseMove}
                    >
                        {product.isFeatured && (
                            <Badge variant="emerald" size="md" className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">FEATURED</Badge>
                        )}
                        {currentImage?.s3Url ? (
                            <img
                                src={currentImage.s3Url}
                                alt={currentImage.altText ?? product.name}
                                className={`w-full h-full object-cover transition-transform duration-200 ease-out ${isHovering ? 'scale-[2.5]' : 'scale-100'}`}
                                style={isHovering ? { transformOrigin: `${mousePos.x} ${mousePos.y}` } : { transformOrigin: 'center center' }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted">No Image</div>
                        )}
                    </div>
                    {/* Thumbnails */}
                    {product.images.length > 1 && (
                        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 snap-x">
                            {product.images.map((img, i) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(i)}
                                    className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 border-2 transition-colors snap-start ${selectedImage === i ? "border-charcoal" : "border-transparent"}`}
                                >
                                    <img src={img.s3Url} alt={img.altText ?? product.name} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-[28px] sm:text-[34px] font-bold text-charcoal mb-2 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                        {product.name}
                    </h1>

                    {/* Rating */}
                    {product.averageRating > 0 && (
                        <div className="flex items-center gap-2 mb-5">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className={i < Math.floor(Number(product.averageRating)) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"} />
                                ))}
                            </div>
                            <span className="text-[13px] text-muted">({product.reviewCount} Reviews)</span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-2.5 mb-5">
                        <span className="text-[32px] font-bold text-charcoal leading-none">{formatPrice(displayPrice)}</span>
                        {hasDiscount && (
                            <>
                                <span className="text-[17px] text-muted line-through leading-none">{formatPrice(Number(product.basePrice))} —</span>
                                <span className="text-[15px] font-medium text-emerald leading-none">({discountPercent}% OFF)</span>
                            </>
                        )}
                    </div>

                    {/* Variant Selector */}
                    {product.variants.length > 1 && (
                        <div className="mb-5">
                            <p className="text-[13px] font-semibold text-charcoal mb-2">Select Variant</p>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.filter((v) => v.isActive).map((v) => (
                                    <button
                                        key={v.id}
                                        onClick={() => setSelectedVariantId(v.id)}
                                        className={`px-3 py-1.5 text-[12px] rounded-md border transition-colors ${selectedVariantId === v.id ? "bg-charcoal text-white border-charcoal" : "border-[#d1d1cc] text-charcoal hover:border-charcoal"}`}
                                    >{v.label}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Trust Tiles */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="flex flex-col items-center justify-center gap-2 border border-[#e0e0db] rounded-md py-4 px-2 bg-white">
                            <Shield size={22} strokeWidth={1.5} className="text-charcoal" />
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-charcoal text-center leading-tight">925 Silver</span>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2 border border-[#e0e0db] rounded-md py-4 px-2 bg-white">
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

                    {/* Pincode */}
                    <div className="mb-5">
                        <p className="text-[13px] font-semibold text-charcoal mb-2">Check Delivery</p>
                        <div className="flex rounded-lg overflow-hidden border border-[#e0e0db] bg-white">
                            <input type="text" placeholder="Enter Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} maxLength={6} className="flex-1 h-11 px-4 text-[13px] text-charcoal placeholder:text-gray-400 focus:outline-none bg-transparent" />
                            <button className="bg-charcoal text-white text-[13px] font-semibold px-5 h-11 shrink-0 hover:bg-charcoal/90 transition-colors">Check</button>
                        </div>
                    </div>

                    {/* Stock warning */}
                    {selectedVariant && selectedVariant.stockQty <= 5 && selectedVariant.stockQty > 0 && (
                        <p className="text-[12px] text-orange-500 mb-3 font-medium">Only {selectedVariant.stockQty} left in stock!</p>
                    )}

                    {/* Add to Cart + Wishlist */}
                    <div className="flex gap-3 mb-5">
                        <button
                            onClick={handleAddToCart}
                            disabled={!selectedVariant || selectedVariant.stockQty === 0}
                            className="flex-1 h-[52px] flex items-center justify-center gap-2.5 bg-charcoal hover:bg-charcoal/90 text-white text-[13px] font-semibold tracking-widest uppercase rounded-md transition-colors duration-200 disabled:opacity-50"
                        >
                            <ShoppingCart size={17} strokeWidth={1.8} />
                            {selectedVariant?.stockQty === 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (isWishlisted) {
                                    removeItem(product.id, getToken);
                                } else {
                                    addItem({
                                        productId: product.id,
                                        productName: product.name,
                                        slug: product.slug,
                                        category: typeof product.category === 'object' ? product.category?.name : undefined,
                                        imageUrl: primaryImage?.s3Url || null,
                                        price: Number(product.salePrice || product.basePrice),
                                        basePrice: Number(product.basePrice),
                                        salePrice: product.salePrice ? Number(product.salePrice) : null,
                                        addedAt: new Date().toISOString(),
                                        inStock: product.stock > 0,
                                    }, getToken);
                                }
                            }}
                            className="w-[52px] h-[52px] flex items-center justify-center border border-[#e0e0db] rounded-md bg-white text-gray-400 hover:text-[#e84c4c] hover:border-[#e84c4c] transition-colors duration-200 shrink-0"
                            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <Heart size={20} strokeWidth={1.5} className={isWishlisted ? "fill-[#e84c4c] text-[#e84c4c]" : ""} />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted">
                        <span className="flex items-center gap-1.5"><Shield size={13} className="text-muted shrink-0" strokeWidth={1.5} /> 100% Secure Payment</span>
                        <span className="flex items-center gap-1.5"><Check size={13} className="text-muted shrink-0" strokeWidth={1.5} /> Purity Guaranteed</span>
                        <span className="flex items-center gap-1.5"><Truck size={13} className="text-muted shrink-0" strokeWidth={1.5} /> Free Insured Shipping</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-10 sm:mb-16">
                <div className="flex gap-4 sm:gap-8 border-b border-border mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {tabs.map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap px-1 ${activeTab === tab.id ? "border-charcoal text-charcoal" : "border-transparent text-muted hover:text-charcoal"}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {activeTab === "description" && (
                            <div>
                                <h3 className="text-xl font-semibold text-charcoal mb-4" style={{ fontFamily: "var(--font-heading)" }}>About this piece</h3>
                                <p className="text-muted leading-relaxed">{product.description ?? "Crafted from premium 925 Sterling Silver."}</p>
                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted">
                                    <div><span className="font-medium text-charcoal">SKU:</span> {product.sku}</div>
                                    <div><span className="font-medium text-charcoal">Weight:</span> {product.weightGrams}g</div>
                                    <div><span className="font-medium text-charcoal">Metal:</span> {product.metalType.replace(/_/g, " ")}</div>
                                    {product.bisHallmark && <div className="flex items-center gap-1"><Check size={14} className="text-emerald" /> BIS Hallmarked</div>}
                                </div>
                            </div>
                        )}
                        {activeTab === "materials" && (
                            <div>
                                <h3 className="text-xl font-semibold text-charcoal mb-4" style={{ fontFamily: "var(--font-heading)" }}>Materials & Care</h3>
                                <p className="text-muted leading-relaxed">
                                    Crafted from high-quality <span className="font-semibold text-charcoal">{product.metalType.replace(/_/g, " ")}</span>.
                                    {product.bisHallmark && " This piece is BIS Hallmarked for guaranteed purity."}
                                    {" "}We ensure all our materials are skin-friendly and tarnish-resistant for long-lasting wear.
                                </p>
                            </div>
                        )}
                        {activeTab === "returns" && (
                            <div>
                                <h3 className="text-xl font-semibold text-charcoal mb-4" style={{ fontFamily: "var(--font-heading)" }}>Returns & Shipping</h3>
                                <p className="text-muted leading-relaxed whitespace-pre-wrap">{product.refundPolicy || "Free express shipping on all orders. 30-day hassle-free return policy. Items must be in original condition with tags attached."}</p>
                            </div>
                        )}
                    </div>
                    <div className="bg-cream rounded-xl p-5">
                        <h4 className="text-base font-semibold text-charcoal mb-3">Care Instructions</h4>
                        {product?.careInstructions && product.careInstructions.length > 0 ? (
                            <ul className="space-y-3 text-sm text-muted">
                                {product.careInstructions.map((instruction, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-emerald mt-0.5">•</span>
                                        <span>{instruction}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted">No specific care instructions available for this product.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews Placeholder */}
            <div className="mb-10 sm:mb-16">
                <h2 className="text-xl lg:text-2xl font-semibold text-charcoal mb-6" style={{ fontFamily: "var(--font-heading)" }}>What Our Customers Say</h2>
                <div className="border border-[#e8e8e3] rounded-xl p-8 text-center text-muted">
                    <Star size={32} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Reviews coming soon. Be the first to review this product!</p>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mb-8 sm:mb-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
                        <h2 className="text-xl lg:text-2xl font-semibold text-charcoal" style={{ fontFamily: "var(--font-heading)" }}>You May Also Like</h2>
                        <Link href="/products" className="text-sm text-emerald font-medium hover:underline underline-offset-4">View All</Link>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {relatedProducts.map((p) => (
                            <ProductCard
                                key={p.id}
                                onAddToCart={() => {
                                    const variant = p.variants?.[0];
                                    if (variant) {
                                        addCartItem({
                                            productVariantId: variant.id,
                                            productName: p.name,
                                            variantLabel: variant.label,
                                            sku: variant.sku,
                                            imageUrl: p.images.find(i => i.isPrimary)?.s3Url || p.images[0]?.s3Url || "",
                                            unitPrice: Number(p.salePrice ?? p.basePrice),
                                        }, 1, getToken);
                                    }
                                }}
                                product={{
                                    id: p.id, name: p.name, slug: p.slug, sku: p.sku,
                                    description: p.description ?? "", shortDescription: p.metalType,
                                    basePrice: Number(p.basePrice), salePrice: p.salePrice ? Number(p.salePrice) : undefined,
                                    category: p.category as any, status: p.status as "PUBLISHED",
                                    categoryId: p.categoryId,
                                    images: p.images.map((img) => ({ id: img.id, url: img.s3Url, alt: img.altText ?? p.name, isPrimary: img.isPrimary, sortOrder: img.sortOrder })),
                                    material: p.metalType, purity: "92.5%", rating: Number(p.averageRating),
                                    reviewCount: p.reviewCount, stock: p.stock, tags: p.tags,
                                    createdAt: p.createdAt, updatedAt: p.updatedAt,
                                }} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
