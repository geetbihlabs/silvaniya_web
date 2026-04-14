"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Shield, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/features/products/ProductCard";
import { useShopProductStore, ProductFilter } from "@/store/useShopProductStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@clerk/nextjs";

const priceRanges = [
    { label: "Under ₹2,000", value: "0-2000", min: 0, max: 2000 },
    { label: "₹2,000 - ₹5,000", value: "2000-5000", min: 2000, max: 5000 },
    { label: "₹5,000 - ₹10,000", value: "5000-10000", min: 5000, max: 10000 },
    { label: "Over ₹10,000", value: "10000-up", min: 10000, max: undefined },
];

function ProductListingContent() {
    const searchParams = useSearchParams();
    const { products, meta, isLoading, fetchProducts } = useShopProductStore();
    const { categories, fetchCategories } = useCategoryStore();
    const { addItem } = useCartStore();
    const { getToken } = useAuth();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");
    const [sortBy, setSortBy] = useState<string>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [currentPage, setCurrentPage] = useState(1);

    const buildFilter = useCallback((): ProductFilter => {
        const range = priceRanges.find((r) => r.value === selectedPriceRange);
        return {
            ...(range?.min !== undefined && { minPrice: range.min }),
            ...(range?.max !== undefined && { maxPrice: range.max }),
            ...(selectedCategory && { category: selectedCategory }),
            sortBy,
            sortOrder,
            page: currentPage,
            limit: 12,
        };
    }, [selectedPriceRange, selectedCategory, sortBy, sortOrder, currentPage]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts(buildFilter());
    }, [buildFilter, fetchProducts]);

    const clearFilters = () => {
        setSelectedPriceRange("");
        setSelectedCategory("");
        setCurrentPage(1);
    };

    const handleSort = (value: string) => {
        if (value === "price-asc") { setSortBy("basePrice"); setSortOrder("asc"); }
        else if (value === "price-desc") { setSortBy("basePrice"); setSortOrder("desc"); }
        else if (value === "newest") { setSortBy("createdAt"); setSortOrder("desc"); }
        else if (value === "popular") { setSortBy("totalSold"); setSortOrder("desc"); }
        else { setSortBy("createdAt"); setSortOrder("desc"); }
        setCurrentPage(1);
    };

    const FilterContent = () => (
        <>
            {/* Price Range */}
            <div className="mb-6">
                <h3 className="text-[10px] font-bold text-charcoal uppercase tracking-[0.12em] mb-3">Price Range</h3>
                <div className="space-y-2">
                    {priceRanges.map((range) => (
                        <label key={range.value} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="radio"
                                name="price-range"
                                checked={selectedPriceRange === range.value}
                                onChange={() => { setSelectedPriceRange(selectedPriceRange === range.value ? "" : range.value); setCurrentPage(1); }}
                                className="w-3.5 h-3.5 rounded-sm border-gray-300 accent-charcoal cursor-pointer"
                            />
                            <span className="text-[13px] text-muted group-hover:text-charcoal transition-colors">{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Category */}
            <div className="mb-6">
                <h3 className="text-[10px] font-bold text-charcoal uppercase tracking-[0.12em] mb-3">Category</h3>
                <div className="space-y-2">
                    {categories.filter(c => c.isVisible).map((cat) => (
                        <label key={cat.slug} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                checked={selectedCategory === cat.slug}
                                onChange={() => { setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug); setCurrentPage(1); }}
                                className="w-3.5 h-3.5 rounded-sm border-gray-300 accent-charcoal cursor-pointer"
                            />
                            <span className="text-[13px] text-muted group-hover:text-charcoal transition-colors">{cat.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Trust */}
            <div className="bg-[#f4f4f1] border border-[#e8e8e3] rounded-sm p-4 space-y-3">
                <div className="flex items-center gap-2.5">
                    <Shield size={14} className="text-charcoal shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal">BIS Hallmarked</span>
                </div>
                <div className="flex items-center gap-2.5">
                    {/* <RotateCcw size={14} className="text-charcoal shrink-0" /> */}
                    {/* <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal">30-Day Returns</span> */}
                </div>
            </div>
        </>
    );

    // Skeleton loader
    const SkeletonGrid = () => (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-md mb-3" />
                    <div className="bg-gray-200 h-4 rounded mb-2 w-3/4" />
                    <div className="bg-gray-200 h-4 rounded w-1/2" />
                </div>
            ))}
        </div>
    );

    // Pagination helper
    const totalPages = meta.totalPages;
    const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

    return (
        <div className="max-w-[1440px] mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs text-muted mb-5">
                <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
                <span className="text-gray-300">›</span>
                <span className="text-charcoal font-medium">All Jewellery</span>
            </nav>

            <div className="flex gap-6 lg:gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-52 xl:w-56 shrink-0">
                    <div className="sticky top-20">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-[0.12em]">Filters</h2>
                            <button onClick={clearFilters} className="text-xs text-muted hover:text-charcoal underline underline-offset-2 transition-colors">
                                Clear All
                            </button>
                        </div>
                        <FilterContent />
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between bg-white border border-[#e8e8e3] rounded-sm px-4 py-2.5 mb-5 shadow-sm">
                        <p className="text-[13px] text-muted">
                            Showing <span className="font-semibold text-charcoal">{products.length}</span> of{" "}
                            <span className="font-semibold text-[#107c6f]">{meta.total} Designs</span>
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                className="lg:hidden flex items-center gap-1.5 text-[13px] text-charcoal font-medium"
                                onClick={() => setIsFilterOpen(true)}
                            >
                                <SlidersHorizontal size={15} /> Filters
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] text-muted hidden sm:inline">Sort By:</span>
                                <select
                                    onChange={(e) => handleSort(e.target.value)}
                                    className="text-[13px] bg-white border border-[#d1d1cc] rounded-sm px-3 py-1.5 pr-8 text-charcoal focus:outline-none focus:border-charcoal transition-colors font-body appearance-auto"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="newest">Newest</option>
                                    <option value="popular">Best Selling</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <SkeletonGrid />
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <Search size={40} className="text-gray-300 mb-4" />
                            <p className="text-muted text-sm">No products found. Try adjusting your filters.</p>
                            <button onClick={clearFilters} className="mt-4 text-sm text-[#107c6f] underline underline-offset-2">Clear filters</button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                                {products.map((product) => {
                                    const firstVariant = product.variants?.find((v) => v.isActive) ?? product.variants?.[0];
                                    const handleAddToCart = firstVariant
                                        ? () => addItem(
                                            {
                                                productVariantId: firstVariant.id,
                                                productName: product.name,
                                                variantLabel: firstVariant.label,
                                                sku: firstVariant.sku,
                                                imageUrl: product.images.find((i) => i.isPrimary)?.s3Url ?? product.images[0]?.s3Url,
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
                                        )
                                        : undefined;

                                    return (
                                        <ProductCard key={product.id} product={{
                                            id: product.id,
                                            name: product.name,
                                            slug: product.slug,
                                            sku: product.sku,
                                            description: product.description ?? "",
                                            shortDescription: product.metalType,
                                            basePrice: Number(product.basePrice),
                                            salePrice: product.salePrice ? Number(product.salePrice) : undefined,
                                            category: product.category as any,
                                            categoryId: product.categoryId,
                                            status: product.status as "PUBLISHED" | "DRAFT" | "ARCHIVED",
                                            images: product.images.map((img) => ({
                                                id: img.id,
                                                url: img.s3Url,
                                                alt: img.altText ?? product.name,
                                                isPrimary: img.isPrimary,
                                                sortOrder: img.sortOrder,
                                            })),
                                            material: product.metalType,
                                            purity: "92.5%",
                                            isFeatured: product.isFeatured,
                                            isNewArrival: !product.isFeatured,
                                            // rating: Number(product.averageRating),
                                            reviewCount: product.reviewCount,
                                            stock: product.stock,
                                            tags: product.tags,
                                            createdAt: product.createdAt,
                                            updatedAt: product.updatedAt,
                                        }}
                                            onAddToCart={handleAddToCart}
                                        />
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-1.5 mt-10">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((p) => p - 1)}
                                        className="w-9 h-9 rounded-sm border border-[#d1d1cc] text-muted hover:border-charcoal hover:text-charcoal transition-colors text-sm flex items-center justify-center disabled:opacity-40"
                                    >‹</button>
                                    {pages.map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setCurrentPage(p)}
                                            className={`w-9 h-9 rounded-sm text-sm font-semibold flex items-center justify-center ${currentPage === p ? "bg-charcoal text-white" : "border border-[#d1d1cc] text-muted hover:border-charcoal hover:text-charcoal transition-colors"}`}
                                        >{p}</button>
                                    ))}
                                    {totalPages > 5 && <span className="text-muted text-sm px-1 flex items-center justify-center w-9 h-9">...</span>}
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage((p) => p + 1)}
                                        className="w-9 h-9 rounded-sm border border-[#d1d1cc] text-muted hover:border-charcoal hover:text-charcoal transition-colors text-sm flex items-center justify-center disabled:opacity-40"
                                    >›</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Filter Overlay */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsFilterOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-72 bg-cream p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-charcoal uppercase tracking-wider">Filters</h2>
                            <button onClick={() => setIsFilterOpen(false)}><X size={20} className="text-charcoal" /></button>
                        </div>
                        <FilterContent />
                        <Button variant="emerald" className="w-full mt-6" onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
                        <Button variant="ghost" className="w-full mt-2" onClick={clearFilters}>Clear All</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ProductListingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-charcoal">Loading products...</div>}>
            <ProductListingContent />
        </Suspense>
    );
}
