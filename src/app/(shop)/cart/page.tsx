"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, Heart, Shield, Truck, RotateCcw, ArrowRight, ShoppingBag, Tag, X, Loader2 } from "lucide-react";
import ProductCard from "@/components/features/products/ProductCard";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useRelatedProducts } from "@/hooks/useRelatedProducts";
import { useAuth } from "@clerk/nextjs";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function CartPage() {
    const { getToken, isSignedIn, isLoaded: authLoaded } = useAuth();
    const { items, addItem, removeItem, updateQty, getTotals, mergeAndFetchCart, isLoading, coupon, applyCoupon, removeCoupon } = useCartStore();
    const [couponInput, setCouponInput] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);

    // Merge local guest cart → server, then fetch (preserves items added before login)
    useEffect(() => {
        if (isSignedIn) {
            mergeAndFetchCart(getToken);
        }
    }, [isSignedIn, mergeAndFetchCart, getToken]);

    const { addItem: addWishlistItem, isInWishlist } = useWishlistStore();

    const handleMoveToWishlist = async (item: any) => {
        if (isInWishlist(item.productId)) return; // Already in wishlist
        await addWishlistItem({
            productId: item.productId,
            productVariantId: item.productVariantId,
            productName: item.productName,
            slug: item.productSlug,
            imageUrl: item.imageUrl,
            price: item.unitPrice,
            basePrice: item.basePrice,
            salePrice: item.salePrice,
            addedAt: new Date().toISOString(),
            inStock: item.stockQty > 0
        }, getToken);
        await removeItem(item.productVariantId, getToken);
    };

    const shipping = "standard" as const;
    const { subtotal, shippingCharge, discountAmount, total, count } = getTotals(shipping);

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setCouponLoading(true);
        await applyCoupon(couponInput, getToken);
        setCouponLoading(false);
        setCouponInput("");
    };

    // Collect all unique category IDs from cart items (multi-category support)
    const cartCategoryIds = [...new Set(items.map((i) => i.categoryId).filter(Boolean))] as string[];
    // Collect all product IDs to exclude from recommendations
    const cartProductIds = items.map((i) => i.productId).filter(Boolean) as string[];

    const { products: relatedProducts } = useRelatedProducts(cartCategoryIds, cartProductIds);

    // Show loading state while: auth is resolving OR server fetch is in-flight
    if (!authLoaded || (isSignedIn && isLoading)) {
        return (
            <div className="bg-[#f5f5f3] min-h-screen flex items-center justify-center px-4">
                <div className="flex flex-col items-center gap-3">
                    <ShoppingBag size={40} className="text-gray-300 animate-pulse" />
                    <p className="text-sm text-muted">Loading your cart...</p>
                </div>
            </div>
        );
    }
    if (items.length === 0) {
        return (
            <div className="bg-[#f5f5f3] min-h-screen flex items-center justify-center px-4">
                <div className="text-center py-20">
                    <ShoppingBag size={56} className="mx-auto text-gray-300 mb-4" />
                    <h1 className="text-2xl font-bold text-charcoal mb-2" style={{ fontFamily: "var(--font-heading)" }}>Your bag is empty</h1>
                    <p className="text-muted mb-6 text-sm">Looks like you haven't added any pieces yet.</p>
                    <Link href="/products" className="inline-flex items-center gap-2 bg-charcoal text-white text-[13px] font-semibold px-6 py-3 rounded-md hover:bg-charcoal/90 transition-colors">
                        Browse Collection <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f5f5f3] min-h-screen">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
                <div className="mb-6">
                    <h1 className="text-[32px] sm:text-[40px] font-bold text-charcoal leading-tight" style={{ fontFamily: "var(--font-heading)" }}>Shopping Bag</h1>
                    <p className="text-[13px] text-muted mt-1">Review your exquisite selections ({count} {count === 1 ? "Item" : "Items"})</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 lg:gap-7">
                    {/* Left: Cart Items */}
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={item.productVariantId} className="bg-white rounded-xl border border-[#e8e8e4] px-5 py-5">
                                <div className="flex gap-4 items-start">
                                    {/* Product Image */}
                                    <Link
                                        href={item.productSlug ? `/products/${item.productSlug}` : '#'}
                                        className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] rounded-lg overflow-hidden bg-[#1a1a1a] shrink-0 hover:opacity-90 transition-opacity"
                                    >
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-white/30">Img</div>
                                        )}
                                    </Link>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <Link
                                                    href={item.productSlug ? `/products/${item.productSlug}` : '#'}
                                                    className="text-[15px] font-semibold text-charcoal leading-snug hover:text-emerald transition-colors"
                                                >
                                                    {item.productName}
                                                </Link>
                                                <p className="text-[10px] text-muted uppercase tracking-wider mt-1">SKU: {item.sku} | {item.variantLabel}</p>
                                            </div>
                                            <span className="text-[15px] font-bold text-charcoal whitespace-nowrap shrink-0">{formatPrice(item.unitPrice)}</span>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            {/* Qty stepper */}
                                            <div className="flex items-center border border-[#e0e0db] rounded-md overflow-hidden">
                                                <button onClick={() => updateQty(item.productVariantId, item.quantity - 1, getToken)} className="w-8 h-8 flex items-center justify-center text-muted hover:text-charcoal hover:bg-gray-50 transition-colors">
                                                    <Minus size={13} />
                                                </button>
                                                <span className="w-10 h-8 flex items-center justify-center text-sm font-medium text-charcoal border-x border-[#e0e0db]">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQty(item.productVariantId, item.quantity + 1, getToken)}
                                                    disabled={item.quantity >= item.stockQty}
                                                    className="w-8 h-8 flex items-center justify-center text-muted hover:text-charcoal hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <Plus size={13} />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <button onClick={() => removeItem(item.productVariantId, getToken)} className="flex items-center gap-1.5 text-[11px] text-muted hover:text-red-500 transition-colors uppercase tracking-wider font-medium">
                                                    <Trash2 size={13} strokeWidth={1.8} /> REMOVE
                                                </button>
                                                <button 
                                                    onClick={() => handleMoveToWishlist(item)} 
                                                    disabled={isInWishlist(item.productId || "")}
                                                    className={`flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-medium transition-colors ${isInWishlist(item.productId || "") ? 'text-emerald' : 'text-muted hover:text-emerald'}`}
                                                >
                                                    <Heart size={13} strokeWidth={1.8} className={isInWishlist(item.productId || "") ? "fill-emerald text-emerald" : ""} /> 
                                                    {isInWishlist(item.productId || "") ? "WISHLISTED" : "WISHLIST"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Trust Badges */}
                        <div className="flex flex-wrap items-center gap-6 sm:gap-10 py-4 px-1">
                            {[{ Icon: Shield, title: "Secure Payment", sub: "SSL Encrypted Checkout" }, { Icon: Truck, title: "Fast Delivery", sub: "Free shipping across India" }].map(({ Icon, title, sub }) => (
                                <div key={title} className="flex items-center gap-2.5">
                                    <Icon size={18} strokeWidth={1.5} className="text-charcoal shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-bold text-charcoal uppercase tracking-widest">{title}</p>
                                        <p className="text-[10px] text-muted">{sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div>
                        <div className="bg-white rounded-xl border border-[#e8e8e4] p-6 sticky top-24">
                            <h2 className="text-[18px] font-bold text-charcoal mb-5" style={{ fontFamily: "var(--font-heading)" }}>Order Summary</h2>

                            {/* Coupon Input */}
                            <div className="mb-4">
                                {!isSignedIn ? (
                                    // Guest: prompt to login
                                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                                        <Tag size={15} className="text-amber-500 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] font-semibold text-amber-700 leading-tight">Login to use coupon codes</p>
                                            <p className="text-[11px] text-amber-600/80 mt-0.5">Exclusive discounts available for members.</p>
                                        </div>
                                        <Link
                                            href="/login"
                                            className="shrink-0 text-[11px] font-bold text-white bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-md transition-colors"
                                        >
                                            Login
                                        </Link>
                                    </div>
                                ) : coupon ? (
                                    <div className="flex items-center justify-between bg-emerald/10 border border-emerald/30 rounded-lg px-3 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <Tag size={14} className="text-emerald shrink-0" />
                                            <div>
                                                <p className="text-[12px] font-bold text-emerald">{coupon.code} applied</p>
                                                <p className="text-[11px] text-emerald/80">You save ₹{coupon.discountAmount.toLocaleString("en-IN")}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={removeCoupon}
                                            className="text-muted hover:text-red-500 transition-colors"
                                            aria-label="Remove coupon"
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                                            placeholder="Enter coupon code..."
                                            className="flex-1 h-10 px-3 text-[13px] rounded-lg border border-[#e0e0db] text-charcoal focus:outline-none focus:border-charcoal placeholder:text-muted/60 uppercase"
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={!couponInput.trim() || couponLoading}
                                            className="h-10 px-4 text-[12px] font-bold bg-charcoal text-white rounded-lg hover:bg-charcoal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                                        >
                                            {couponLoading ? <Loader2 size={13} className="animate-spin" /> : null}
                                            APPLY
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2.5 mb-4">
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="font-medium text-charcoal">₹ {subtotal.toLocaleString("en-IN")}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-emerald flex items-center gap-1"><Tag size={12} /> Discount ({coupon?.code})</span>
                                        <span className="font-semibold text-emerald">− ₹ {discountAmount.toLocaleString("en-IN")}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-muted">Shipping</span>
                                    <span className="font-semibold text-[#107c6f]">FREE</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px]">
                                    <span className="text-muted">GST</span>
                                    <span className="text-[#107c6f] font-medium text-[11px]">Included in price</span>
                                </div>
                            </div>

                            <div className="border-t border-[#e8e8e4] pt-3 flex justify-between mb-5">
                                <span className="text-[15px] font-bold text-charcoal">Total</span>
                                <span className="text-[15px] font-bold text-charcoal">₹ {total.toLocaleString("en-IN")}</span>
                            </div>

                            <Link href="/checkout" className="w-full h-[50px] flex items-center justify-center gap-2 bg-charcoal hover:bg-charcoal/90 text-white text-[13px] font-semibold rounded-md transition-colors duration-200">
                                Proceed to Checkout <ArrowRight size={16} strokeWidth={2} />
                            </Link>

                            <p className="text-[10px] text-muted text-center mt-3 leading-relaxed px-2">
                                Prices inclusive of all taxes. By proceeding, you agree to our{" "}
                                <Link href="/terms-and-conditions" className="underline underline-offset-2 hover:text-charcoal">Terms of Service</Link>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* You May Also Like */}
                {relatedProducts.length > 0 && (
                    <div className="mt-14 mb-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[22px] sm:text-[26px] font-semibold text-charcoal" style={{ fontFamily: "var(--font-heading)" }}>You May Also Like</h2>
                            <Link href="/products" className="text-[13px] text-charcoal font-medium hover:underline underline-offset-4">View All Collection</Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
                            {relatedProducts.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    onAddToCart={() => {
                                        const variant = p.variants?.[0];
                                        if (variant) {
                                            addItem({
                                                productVariantId: variant.id,
                                                productName: p.name,
                                                variantLabel: variant.label,
                                                sku: variant.sku,
                                                imageUrl: p.images.find(i => i.isPrimary)?.s3Url || p.images[0]?.s3Url || "",
                                                unitPrice: Number(p.salePrice ?? p.basePrice),
                                                stockQty: variant.stockQty,
                                            }, 1, getToken);
                                        }
                                    }}
                                    product={{
                                        id: p.id, name: p.name, slug: p.slug, sku: p.sku,
                                        description: p.description ?? "", shortDescription: p.metalType,
                                        basePrice: Number(p.basePrice), salePrice: p.salePrice ? Number(p.salePrice) : undefined,
                                        category: p.category as any, status: "PUBLISHED",
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
        </div>
    );
}
