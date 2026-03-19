"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, X, TrendingUp, Clock, Loader2 } from "lucide-react";
import ProductCard from "@/components/features/products/ProductCard";
import { useShopProductStore } from "@/store/useShopProductStore";
import { useDebounce } from "@/hooks/useDebounce";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@clerk/nextjs";

export default function SearchPage() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    
    const debouncedQuery = useDebounce(query, 500);
    
    const { products, isLoading, fetchProducts } = useShopProductStore();
    const { addItem } = useCartStore();
    const { getToken } = useAuth();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
        const saved = localStorage.getItem("silvaniya_recent_searches");
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch {}
        }
        document.getElementById("search-input")?.focus();
    }, []);

    const saveRecentSearch = (term: string) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        setRecentSearches(prev => {
            const filtered = prev.filter(p => p.toLowerCase() !== trimmed.toLowerCase());
            const updated = [trimmed, ...filtered].slice(0, 5);
            localStorage.setItem("silvaniya_recent_searches", JSON.stringify(updated));
            return updated;
        });
    };

    useEffect(() => {
        if (!isMounted) return;
        if (debouncedQuery.trim() !== "") {
            fetchProducts({ search: debouncedQuery, limit: 10 });
            // eslint-disable-next-line react-hooks/set-state-in-effect
            saveRecentSearch(debouncedQuery);
        }
    }, [debouncedQuery, isMounted, fetchProducts]);

    const handleClearRecent = () => {
        setRecentSearches([]);
        localStorage.removeItem("silvaniya_recent_searches");
    };

    const trendingSearches = ["Oxidized Silver", "Pearl Sets", "Toe Rings", "Anklets"];

    const handleClear = () => {
        setQuery("");
        document.getElementById("search-input")?.focus();
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            saveRecentSearch(query);
            fetchProducts({ search: query, limit: 10 });
        }
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-white flex flex-col pt-[72px] lg:pt-0">
            {/* Desktop and Mobile Header Header */}
            <header className="px-4 lg:px-8 h-16 lg:h-24 lg:mt-8 border-b border-border flex items-center justify-center gap-3 shrink-0 lg:max-w-3xl lg:mx-auto w-full">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 lg:hidden text-charcoal"
                    aria-label="Go back"
                >
                    <ChevronLeft size={24} />
                </button>
                <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center max-w-2xl w-full">
                    <Search size={20} className="absolute left-4 text-muted-light pointer-events-none" />
                    <input
                        id="search-input"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for silver designs..."
                        className="w-full h-12 pl-12 pr-12 text-base font-body text-charcoal bg-gray-50 rounded-full outline-none border border-transparent focus:border-emerald/30 transition-colors placeholder:text-muted-light shadow-sm"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-4 p-1 text-muted-light hover:text-charcoal transition-colors"
                        >
                            <X size={18} />
                        </button>
                    )}
                </form>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto lg:max-w-7xl lg:mx-auto w-full px-4 lg:px-8 pb-12">
                {query.trim() === "" ? (
                    // Default View: Recent & Trending
                    <div className="space-y-10 mt-6 lg:mt-10 max-w-2xl mx-auto">
                        {recentSearches.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-sm font-bold text-charcoal uppercase tracking-[0.12em]">Recent Searches</h2>
                                    <button
                                        className="text-xs font-semibold text-emerald hover:underline"
                                        onClick={handleClearRecent}
                                    >
                                        Clear History
                                    </button>
                                </div>
                                <ul className="space-y-2">
                                    {recentSearches.map((item, i) => (
                                        <li key={i}>
                                            <button
                                                onClick={() => setQuery(item)}
                                                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 text-sm text-muted hover:text-charcoal transition-colors text-left"
                                            >
                                                <Clock size={16} className="text-muted-light shrink-0" />
                                                <span className="flex-1 truncate font-medium">{item}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <section>
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-[0.12em] mb-5 flex items-center gap-2">
                                <TrendingUp size={16} className="text-emerald shrink-0" /> Trending Now
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {trendingSearches.map((term, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setQuery(term)}
                                        className="px-5 py-2.5 bg-gray-50 border border-border rounded-full text-sm font-medium text-charcoal hover:border-emerald/40 transition-colors"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>
                ) : (
                    // Results View
                    <div className="mt-6 lg:mt-10">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border max-w-3xl mx-auto">
                            <h2 className="text-base font-medium text-muted">
                                Search results for &quot;<span className="text-charcoal font-bold">{query}</span>&quot;
                            </h2>
                            {!isLoading && products.length > 0 && (
                                <span className="text-sm text-charcoal font-semibold">{products.length} Products</span>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 max-w-3xl mx-auto">
                                <Loader2 size={32} className="text-emerald animate-spin mb-4" />
                                <p className="text-muted text-sm tracking-wide">Searching our collection...</p>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
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
                                                unitPrice: firstVariant.priceOverride
                                                    ? Number(firstVariant.priceOverride)
                                                    : Number(product.salePrice ?? product.basePrice),
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
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                            rating: Number(product.averageRating),
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
                        ) : (
                            <div className="text-center py-20 px-4 bg-gray-50 rounded-2xl w-full max-w-2xl mx-auto mt-8">
                                <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-6 text-muted-light">
                                    <Search size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-charcoal mb-3">No results found</h3>
                                <p className="text-base text-muted max-w-md mx-auto">
                                    We couldn&apos;t find anything matching &quot;{query}&quot;. Try checking for typos or using more general terms.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
