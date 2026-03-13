"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Download, Edit2, Trash2, Loader2, ChevronLeft, ChevronRight, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { useProductStore } from "@/store/useProductStore";
import { useAuth } from "@clerk/nextjs";

const CATEGORIES = [
    "ALL", "RINGS", "NECKLACES", "BANGLES", "EARRINGS", "BRACELETS",
    "PENDANTS", "CHAINS", "ANKLETS", "NOSE_PINS", "MAANG_TIKKA", "OTHER",
] as const;

const METAL_TYPES = [
    "ALL", "GOLD_22K", "GOLD_18K", "GOLD_14K", "PLATINUM",
    "SILVER_925", "SILVER_999", "WHITE_GOLD", "ROSE_GOLD", "OTHER",
] as const;

const formatLabel = (val: string) =>
    val === "ALL" ? null : val.replace(/_/g, " ");

export default function AdminProductsPage() {
    const { getToken } = useAuth();
    const { products, meta, isLoading, fetchProducts, deleteProduct } = useProductStore();

    // Confirm delete modal state
    const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter state
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("ALL");
    const [filterMetalType, setFilterMetalType] = useState("ALL");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce search: wait 500ms after typing stops before updating debouncedSearch
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchInput(val);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setDebouncedSearch(val);
            setCurrentPage(1);
        }, 500);
    };
    useEffect(() => () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); }, []);

    // Build filter params and pass to server whenever any filter or page changes
    const doFetch = useCallback(() => {
        const params: Record<string, unknown> = { page: currentPage, limit: 20 };
        if (debouncedSearch) params.search = debouncedSearch;
        if (filterCategory !== "ALL") params.category = filterCategory;
        if (filterMetalType !== "ALL") params.metalType = filterMetalType;
        if (filterStatus !== "ALL") params.status = filterStatus;
        fetchProducts(getToken, params);
    }, [getToken, fetchProducts, currentPage, debouncedSearch, filterCategory, filterMetalType, filterStatus]);

    useEffect(() => {
        doFetch();
    }, [doFetch]);

    // Reset to page 1 when any filter (other than page) changes
    const handleCategoryChange = (val: string) => { setFilterCategory(val); setCurrentPage(1); };
    const handleMetalTypeChange = (val: string) => { setFilterMetalType(val); setCurrentPage(1); };
    const handleStatusChange = (val: string) => { setFilterStatus(val); setCurrentPage(1); };

    const clearAllFilters = () => {
        setSearchInput("");
        setDebouncedSearch("");
        setFilterCategory("ALL");
        setFilterMetalType("ALL");
        setFilterStatus("ALL");
        setCurrentPage(1);
    };

    const handleDeleteConfirm = async () => {
        if (!confirmDelete) return;
        setIsDeleting(true);
        await deleteProduct(confirmDelete.id, getToken);
        setIsDeleting(false);
        setConfirmDelete(null);
    };

    const hasActiveFilters =
        searchInput !== "" || filterCategory !== "ALL" || filterMetalType !== "ALL" || filterStatus !== "ALL";

    const handlePageChange = (page: number) => {
        if (page < 1 || page > meta.totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getPageNumbers = (): number[] => {
        const pages: number[] = [];
        const delta = 2;
        const from = Math.max(1, meta.page - delta);
        const to = Math.min(meta.totalPages, meta.page + delta);
        for (let i = from; i <= to; i++) pages.push(i);
        return pages;
    };

    return (
        <>
            <PageHeader
                title="Products"
                subtitle={`${meta.total} total products`}
                breadcrumbs={[{ label: "Dashboard", href: "/admin-panel/dashboard" }, { label: "Products" }]}
                actions={
                    <>
                        <Button variant="outline" size="sm"><Download size={16} /> Export</Button>
                        <Button variant="primary" size="sm" asChild>
                            <Link href="/admin-panel/products/new"><Plus size={16} /> Add Product</Link>
                        </Button>
                    </>
                }
            />

            {/* Filters */}
            <div className="bg-white rounded-xl border border-border p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                {/* Search */}
                <div className="relative flex-1 min-w-0">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        placeholder="Search by name or SKU..."
                        value={searchInput}
                        onChange={handleSearchChange}
                        className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-charcoal"
                    />
                </div>

                {/* Category */}
                <select
                    value={filterCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="h-10 px-4 text-sm rounded-lg border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal"
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat === "ALL" ? "All Categories" : formatLabel(cat)}
                        </option>
                    ))}
                </select>

                {/* Metal Type */}
                <select
                    value={filterMetalType}
                    onChange={(e) => handleMetalTypeChange(e.target.value)}
                    className="h-10 px-4 text-sm rounded-lg border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal"
                >
                    {METAL_TYPES.map((m) => (
                        <option key={m} value={m}>
                            {m === "ALL" ? "All Metals" : formatLabel(m)}
                        </option>
                    ))}
                </select>

                {/* Status */}
                <select
                    value={filterStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="h-10 px-4 text-sm rounded-lg border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal"
                >
                    <option value="ALL">All Status</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                </select>

                {/* Clear filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="flex items-center gap-1.5 h-10 px-3 text-sm text-muted hover:text-charcoal rounded-lg border border-border hover:bg-gray-50 transition-colors whitespace-nowrap"
                    >
                        <X size={14} />
                        Clear
                    </button>
                )}
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-[11px] text-muted uppercase tracking-wider border-b border-border bg-gray-50/50">
                                <th className="px-5 py-3 font-semibold">Product</th>
                                <th className="px-5 py-3 font-semibold">SKU</th>
                                <th className="px-5 py-3 font-semibold">Category</th>
                                <th className="px-5 py-3 font-semibold">Price</th>
                                <th className="px-5 py-3 font-semibold">Stock</th>
                                <th className="px-5 py-3 font-semibold">Status</th>
                                <th className="px-5 py-3 font-semibold">Sales</th>
                                <th className="px-5 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="px-5 py-10 text-center text-muted">
                                        <Loader2 size={24} className="animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-5 py-12 text-center">
                                        <p className="text-muted text-sm">No products found.</p>
                                        {hasActiveFilters && (
                                            <button
                                                onClick={clearAllFilters}
                                                className="mt-2 text-xs text-charcoal underline underline-offset-2"
                                            >
                                                Clear filters
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ) : products.map((product: Record<string, unknown>) => {
                                const images = product.images as Array<{ s3Url: string; altText?: string }> | undefined;
                                const primaryImage = images?.find((img) => (img as Record<string, unknown>).isPrimary) ?? images?.[0];
                                const stockQty = Number(product.stock ?? 0);
                                const lowStock = Number(product.lowStockThreshold ?? 0);

                                return (
                                    <tr key={String(product.id)} className="border-b border-border/50 last:border-0 hover:bg-gray-50/30">
                                        {/* Product Name + Thumbnail */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
                                                    {primaryImage ? (
                                                        <Image
                                                            src={primaryImage.s3Url}
                                                            alt={primaryImage.altText || String(product.name)}
                                                            width={40}
                                                            height={40}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-[9px] text-muted font-medium">IMG</span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <Link
                                                        href={`/admin-panel/products/${String(product.id)}/edit`}
                                                        className="text-sm font-medium text-charcoal hover:text-emerald line-clamp-1"
                                                    >
                                                        {String(product.name || '')}
                                                    </Link>
                                                    <p className="text-xs text-muted">{String(product.metalType || '').replace(/_/g, ' ')}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* SKU */}
                                        <td className="px-5 py-4 text-muted font-mono text-xs">{String(product.sku || '')}</td>

                                        {/* Category */}
                                        <td className="px-5 py-4 text-charcoal capitalize">
                                            {(() => {
                                                const cat = product.category;
                                                if (cat && typeof cat === 'object') {
                                                    return String((cat as Record<string, unknown>).name || '').replace(/_/g, ' ');
                                                }
                                                return String(cat || '').replace(/_/g, ' ');
                                            })()}
                                        </td>

                                        {/* Price */}
                                        <td className="px-5 py-4">
                                            <div>
                                                <span className="font-semibold text-charcoal">
                                                    {formatPrice(Number(product.salePrice || product.basePrice || 0))}
                                                </span>
                                                {Boolean(product.salePrice) && (
                                                    <span className="block text-xs text-muted line-through">
                                                        {formatPrice(Number(product.basePrice || 0))}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Stock */}
                                        <td className="px-5 py-4">
                                            <span className={`font-semibold ${
                                                stockQty === 0
                                                    ? "text-error"
                                                    : stockQty <= lowStock
                                                        ? "text-warning"
                                                        : "text-charcoal"
                                            }`}>
                                                {stockQty}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <StatusBadge
                                                type="visibility"
                                                value={String(product.status || 'DRAFT') as "PUBLISHED" | "DRAFT" | "ARCHIVED"}
                                            />
                                        </td>

                                        {/* Sales */}
                                        <td className="px-5 py-4 text-charcoal font-medium">{Number(product.totalSold ?? 0)}</td>

                                        {/* Actions */}
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin-panel/products/${String(product.id)}/edit`}
                                                    className="p-1.5 text-muted hover:text-charcoal hover:bg-gray-100 rounded-md transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => setConfirmDelete({ id: String(product.id), name: String(product.name || 'this product') })}
                                                    className="p-1.5 text-muted hover:text-error hover:bg-red-50 rounded-md transition-colors"
                                                    title="Archive product"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-gray-50/30">
                    <p className="text-xs text-muted">
                        Showing {products.length} of {meta.total} products
                        {meta.totalPages > 1 && ` — Page ${meta.page} of ${meta.totalPages}`}
                    </p>

                    {meta.totalPages > 1 && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handlePageChange(meta.page - 1)}
                                disabled={meta.page === 1}
                                className="p-1.5 rounded-md text-muted hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={14} />
                            </button>

                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1.5 text-xs rounded-md font-semibold transition-colors ${
                                        page === meta.page
                                            ? "bg-charcoal text-white"
                                            : "text-muted hover:bg-gray-100"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(meta.page + 1)}
                                disabled={meta.page === meta.totalPages}
                                className="p-1.5 rounded-md text-muted hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => !isDeleting && setConfirmDelete(null)}
                />
                {/* Dialog */}
                <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                            <AlertTriangle size={20} className="text-error" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-charcoal">Archive Product?</h3>
                            <p className="mt-1 text-sm text-muted">
                                <span className="font-medium text-charcoal line-clamp-1">&ldquo;{confirmDelete?.name ?? ''}&rdquo;</span> will be
                                archived and hidden from the storefront. You can restore it by changing its status back to Published.
                            </p>
                        </div>
                    </div>
                    <div className="mt-5 flex gap-2 justify-end">
                        <button
                            onClick={() => setConfirmDelete(null)}
                            disabled={isDeleting}
                            className="px-4 py-2 text-sm font-medium text-charcoal bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-error hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            {isDeleting ? 'Archiving...' : 'Archive'}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
