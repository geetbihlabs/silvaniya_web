"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronLeft, X, TrendingUp, Clock } from "lucide-react";
import { mockProducts } from "@/data/mock-data";
import ProductCard from "@/components/features/products/ProductCard";

export default function MobileSearchPage() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState(["Silver Necklace", "Mangalsutra", "Rings"]);

    // Auto-focus input on mount
    useEffect(() => {
        document.getElementById("mobile-search-input")?.focus();
    }, []);

    const trendingSearches = ["Oxidized Silver", "Pearl Sets", "Toe Rings", "Anklets"];

    const searchResults = query.trim() === "" ? [] : mockProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 4);

    const handleClear = () => {
        setQuery("");
        document.getElementById("mobile-search-input")?.focus();
    };

    return (
        <div className="fixed inset-0 z-100 bg-white flex flex-col lg:hidden">
            {/* Search Header */}
            <header className="px-4 h-16 border-b border-border flex items-center gap-3 shrink-0">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 text-charcoal"
                    aria-label="Go back"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1 relative flex items-center">
                    <Search size={18} className="absolute left-3 text-muted-light pointer-events-none" />
                    <input
                        id="mobile-search-input"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for silver designs..."
                        className="w-full h-10 pl-10 pr-10 text-sm font-body text-charcoal bg-gray-50 rounded-full outline-none border border-transparent focus:border-emerald/30 transition-colors placeholder:text-muted-light"
                    />
                    {query && (
                        <button
                            onClick={handleClear}
                            className="absolute right-3 p-1 text-muted-light hover:text-charcoal"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                {query.trim() === "" ? (
                    // Default View: Recent & Trending
                    <div className="p-4 space-y-8 mt-2">
                        {recentSearches.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider">Recent Searches</h2>
                                    <button
                                        className="text-xs font-semibold text-emerald"
                                        onClick={() => setRecentSearches([])}
                                    >
                                        Clear
                                    </button>
                                </div>
                                <ul className="space-y-3">
                                    {recentSearches.map((item, i) => (
                                        <li key={i}>
                                            <button
                                                onClick={() => setQuery(item)}
                                                className="w-full flex items-center gap-3 text-sm text-muted hover:text-charcoal transition-colors text-left"
                                            >
                                                <Clock size={16} className="text-muted-light shrink-0" />
                                                <span className="flex-1 truncate">{item}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <section>
                            <h2 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                                <TrendingUp size={16} className="text-emerald shrink-0" /> Trending Now
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {trendingSearches.map((term, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setQuery(term)}
                                        className="px-4 py-2 bg-gray-50 border border-border rounded-full text-xs font-medium text-charcoal hover:border-emerald/40 transition-colors"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>
                ) : (
                    // Results View
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-medium text-muted">
                                Showing results for &quot;<span className="text-charcoal font-semibold">{query}</span>&quot;
                            </h2>
                            {searchResults.length > 0 && (
                                <span className="text-xs text-muted font-medium">{searchResults.length} Results</span>
                            )}
                        </div>

                        {searchResults.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {searchResults.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 px-4">
                                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 text-muted-light">
                                    <Search size={28} />
                                </div>
                                <h3 className="text-lg font-semibold text-charcoal mb-2">No results found</h3>
                                <p className="text-sm text-muted mb-6">
                                    We couldn&apos;t find anything matching &quot;{query}&quot;. Try adjusting your search.
                                </p>
                            </div>
                        )}

                        {searchResults.length > 0 && (
                            <div className="mt-8 text-center pb-4">
                                <Link
                                    href={`/products?q=${encodeURIComponent(query)}`}
                                    className="inline-block px-6 py-3 border border-charcoal text-sm font-semibold text-charcoal rounded-md hover:bg-charcoal hover:text-white transition-colors"
                                >
                                    View All Results
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
