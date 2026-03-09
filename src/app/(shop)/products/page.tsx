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
        <div className="max-w-[1440px] mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs text-muted mb-5">
                <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
                <span className="text-gray-300">›</span>
                <Link href="/products" className="hover:text-charcoal transition-colors">Jewellery</Link>
                <span className="text-gray-300">›</span>
                <span className="text-charcoal font-medium">Mangalsutras</span>
            </nav>

            <div className="flex gap-6 lg:gap-8">
                {/* ======== FILTERS SIDEBAR ======== */}
                {/* Desktop */}
                <aside className="hidden lg:block w-52 xl:w-56 shrink-0">
                    <div className="sticky top-20">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-[0.12em]">Filters</h2>
                            <button
                                onClick={clearFilters}
                                className="text-xs text-muted hover:text-charcoal underline underline-offset-2 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <h3 className="text-[10px] font-bold text-charcoal uppercase tracking-[0.12em] mb-3">Price Range</h3>
                            <div className="space-y-2">
                                {priceRanges.map((range) => (
                                    <label key={range.value} className="flex items-center gap-2.5 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={selectedPriceRanges.includes(range.value)}
                                            onChange={() => togglePriceRange(range.value)}
                                            className="w-3.5 h-3.5 rounded-sm border-gray-300 accent-charcoal cursor-pointer"
                                        />
                                        <span className="text-[13px] text-muted group-hover:text-charcoal transition-colors">
                                            {range.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Occasion */}
                        <div className="mb-6">
                            <h3 className="text-[10px] font-bold text-charcoal uppercase tracking-[0.12em] mb-3">Occasion</h3>
                            <div className="space-y-2">
                                {occasions.map((occ) => (
                                    <label key={occ} className="flex items-center gap-2.5 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={selectedOccasion === occ}
                                            onChange={() => setSelectedOccasion(selectedOccasion === occ ? "" : occ)}
                                            className="w-3.5 h-3.5 rounded-sm border-gray-300 accent-charcoal cursor-pointer"
                                        />
                                        <span className="text-[13px] text-muted group-hover:text-charcoal transition-colors">
                                            {occ}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Discount */}
                        <div className="mb-6">
                            <h3 className="text-[10px] font-bold text-charcoal uppercase tracking-[0.12em] mb-3">Discount</h3>
                            <div className="space-y-2">
                                {discounts.map((disc) => (
                                    <label key={disc} className="flex items-center gap-2.5 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="discount"
                                            checked={selectedDiscount === disc}
                                            onChange={() => setSelectedDiscount(selectedDiscount === disc ? "" : disc)}
                                            className="w-3.5 h-3.5 border-gray-300 accent-charcoal cursor-pointer"
                                        />
                                        <span className="text-[13px] text-muted group-hover:text-charcoal transition-colors">
                                            {disc}
                                        </span>
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
                                <RotateCcw size={14} className="text-charcoal shrink-0" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal">30-Day Returns</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ======== MAIN CONTENT ======== */}
                <div className="flex-1 min-w-0">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between bg-white border border-[#e8e8e3] rounded-sm px-4 py-2.5 mb-5 shadow-sm">
                        <p className="text-[13px] text-muted">
                            Showing <span className="font-semibold text-charcoal">{mockProducts.length}</span> of{" "}
                            <span className="font-semibold text-[#107c6f]">156 Designs</span>
                        </p>
                        <div className="flex items-center gap-3">
                            {/* Mobile Filter Toggle */}
                            <button
                                className="lg:hidden flex items-center gap-1.5 text-[13px] text-charcoal font-medium"
                                onClick={() => setIsFilterOpen(true)}
                            >
                                <SlidersHorizontal size={15} />
                                Filters
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] text-muted hidden sm:inline">Sort By:</span>
                                <select className="text-[13px] bg-white border border-[#d1d1cc] rounded-sm px-3 py-1.5 pr-8 text-charcoal focus:outline-none focus:border-charcoal transition-colors font-body appearance-auto">
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
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                        {mockProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-1.5 mt-10">
                        <button className="w-9 h-9 rounded-sm border border-[#d1d1cc] text-muted hover:border-charcoal hover:text-charcoal transition-colors text-sm flex items-center justify-center">
                            ‹
                        </button>
                        <button className="w-9 h-9 rounded-sm bg-charcoal text-white text-sm font-semibold flex items-center justify-center">
                            1
                        </button>
                        <button className="w-9 h-9 rounded-sm border border-[#d1d1cc] text-muted hover:border-charcoal hover:text-charcoal transition-colors text-sm flex items-center justify-center">
                            2
                        </button>
                        <span className="text-muted text-sm px-1 flex items-center justify-center w-9 h-9">...</span>
                        <button className="w-9 h-9 rounded-sm border border-[#d1d1cc] text-muted hover:border-charcoal hover:text-charcoal transition-colors text-sm flex items-center justify-center">
                            12
                        </button>
                        <button className="w-9 h-9 rounded-sm border border-[#d1d1cc] text-muted hover:border-charcoal hover:text-charcoal transition-colors text-sm flex items-center justify-center">
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
