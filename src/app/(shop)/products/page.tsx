"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/features/products/ProductCard";
import { mockProducts } from "@/data/mock-data";

const priceRanges = [
    { label: "Under ₹2,000", value: "0-2000" },
    { label: "₹2,000 - ₹5,000", value: "2000-5000" },
    { label: "₹5,000 - ₹10,000", value: "5000-10000" },
    { label: "Over ₹10,000", value: "10000-up" },
];

const occasions = ["Daily Wear", "Festive", "Wedding"];
const discounts = ["10% and above", "25% and above"];

export default function ProductListingPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
    const [selectedOccasion, setSelectedOccasion] = useState<string>("");
    const [selectedDiscount, setSelectedDiscount] = useState<string>("");

    const togglePriceRange = (value: string) => {
        setSelectedPriceRanges((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    const clearFilters = () => {
        setSelectedPriceRanges([]);
        setSelectedOccasion("");
        setSelectedDiscount("");
    };

    return (
        <div className="max-w-7xl mx-auto py-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs text-muted mb-6">
                <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
                <span>›</span>
                <Link href="/products" className="hover:text-charcoal transition-colors">Jewellery</Link>
                <span>›</span>
                <span className="text-charcoal font-medium">Mangalsutras</span>
            </nav>

            <div className="flex gap-8">
                {/* ======== FILTERS SIDEBAR ======== */}
                {/* Desktop */}
                <aside className="hidden lg:block w-56 flex-shrink-0">
                    <div className="sticky top-20">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-charcoal uppercase tracking-wider">Filters</h2>
                            <button
                                onClick={clearFilters}
                                className="text-xs text-emerald hover:underline"
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Price Range */}
                        <div className="mb-8">
                            <h3 className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-3">Price Range</h3>
                            <div className="space-y-2.5">
                                {priceRanges.map((range) => (
                                    <label key={range.value} className="flex items-center gap-2.5 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={selectedPriceRanges.includes(range.value)}
                                            onChange={() => togglePriceRange(range.value)}
                                            className="w-4 h-4 rounded border-silver accent-emerald"
                                        />
                                        <span className="text-sm text-muted group-hover:text-charcoal transition-colors">
                                            {range.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Occasion */}
                        <div className="mb-8">
                            <h3 className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-3">Occasion</h3>
                            <div className="space-y-2.5">
                                {occasions.map((occ) => (
                                    <label key={occ} className="flex items-center gap-2.5 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={selectedOccasion === occ}
                                            onChange={() => setSelectedOccasion(selectedOccasion === occ ? "" : occ)}
                                            className="w-4 h-4 rounded border-silver accent-emerald"
                                        />
                                        <span className="text-sm text-muted group-hover:text-charcoal transition-colors">
                                            {occ}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Discount */}
                        <div className="mb-8">
                            <h3 className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-3">Discount</h3>
                            <div className="space-y-2.5">
                                {discounts.map((disc) => (
                                    <label key={disc} className="flex items-center gap-2.5 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="discount"
                                            checked={selectedDiscount === disc}
                                            onChange={() => setSelectedDiscount(selectedDiscount === disc ? "" : disc)}
                                            className="w-4 h-4 border-silver accent-emerald"
                                        />
                                        <span className="text-sm text-muted group-hover:text-charcoal transition-colors">
                                            {disc}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Trust */}
                        <div className="bg-cream border border-border rounded-[2px] p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <Shield size={16} className="text-charcoal" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal">BIS Hallmarked</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <RotateCcw size={16} className="text-charcoal" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal">30-Day Returns</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ======== MAIN CONTENT ======== */}
                <div className="flex-1 min-w-0">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between bg-cream border border-border px-4 py-3 mb-6">
                        <p className="text-sm text-muted">
                            Showing <span className="font-medium text-charcoal">{mockProducts.length}</span> of{" "}
                            <span className="font-medium text-charcoal">156</span> Designs
                        </p>
                        <div className="flex items-center gap-3">
                            {/* Mobile Filter Toggle */}
                            <button
                                className="lg:hidden flex items-center gap-2 text-sm text-charcoal"
                                onClick={() => setIsFilterOpen(true)}
                            >
                                <SlidersHorizontal size={16} />
                                Filters
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted hidden sm:inline">Sort By:</span>
                                <select className="text-sm bg-cream border border-border rounded-[2px] px-3 py-1.5 text-charcoal focus:outline-none focus:border-emerald transition-colors duration-500 font-body">
                                    <option>Featured</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest</option>
                                    <option>Top Rated</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        {mockProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-2 mt-10">
                        <button className="w-9 h-9 rounded-[2px] border border-border text-muted hover:border-charcoal hover:text-charcoal transition-colors duration-500 text-sm">
                            ‹
                        </button>
                        <button className="w-9 h-9 rounded-[2px] bg-charcoal text-white text-sm font-medium">
                            1
                        </button>
                        <button className="w-9 h-9 rounded-[2px] border border-border text-muted hover:border-charcoal hover:text-charcoal transition-colors duration-500 text-sm">
                            2
                        </button>
                        <span className="text-muted text-sm px-1">...</span>
                        <button className="w-9 h-9 rounded-[2px] border border-border text-muted hover:border-charcoal hover:text-charcoal transition-colors duration-500 text-sm">
                            12
                        </button>
                        <button className="w-9 h-9 rounded-[2px] border border-border text-muted hover:border-charcoal hover:text-charcoal transition-colors duration-500 text-sm">
                            ›
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Filter Overlay */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsFilterOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-72 bg-cream p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-charcoal uppercase tracking-wider">Filters</h2>
                            <button onClick={() => setIsFilterOpen(false)}>
                                <X size={20} className="text-charcoal" />
                            </button>
                        </div>

                        {/* Price Range */}
                        <div className="mb-8">
                            <h3 className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-3">Price Range</h3>
                            <div className="space-y-2.5">
                                {priceRanges.map((range) => (
                                    <label key={range.value} className="flex items-center gap-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedPriceRanges.includes(range.value)}
                                            onChange={() => togglePriceRange(range.value)}
                                            className="w-4 h-4 rounded border-silver accent-emerald"
                                        />
                                        <span className="text-sm text-muted">{range.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Occasion */}
                        <div className="mb-8">
                            <h3 className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-3">Occasion</h3>
                            <div className="space-y-2.5">
                                {occasions.map((occ) => (
                                    <label key={occ} className="flex items-center gap-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedOccasion === occ}
                                            onChange={() => setSelectedOccasion(selectedOccasion === occ ? "" : occ)}
                                            className="w-4 h-4 rounded border-silver accent-emerald"
                                        />
                                        <span className="text-sm text-muted">{occ}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <Button variant="emerald" className="w-full mt-4" onClick={() => setIsFilterOpen(false)}>
                            Apply Filters
                        </Button>
                        <Button variant="ghost" className="w-full mt-2" onClick={clearFilters}>
                            Clear All
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
