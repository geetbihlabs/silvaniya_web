"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, Download, MoreHorizontal, Eye, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { mockAdminProducts } from "@/data/admin-mock-data";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("ALL");
    const [filterVisibility, setFilterVisibility] = useState("ALL");

    const categories = ["ALL", ...new Set(mockAdminProducts.map((p) => p.category))];

    const filtered = mockAdminProducts.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = filterCategory === "ALL" || p.category === filterCategory;
        const matchesVisibility = filterVisibility === "ALL" || p.visibility === filterVisibility;
        return matchesSearch && matchesCategory && matchesVisibility;
    });

    return (
        <div>
            <PageHeader
                title="Products"
                subtitle={`${mockAdminProducts.length} total products`}
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
            <div className="bg-white rounded-xl border border-border p-4 mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        placeholder="Search by name or SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-charcoal"
                    />
                </div>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="h-10 px-4 text-sm rounded-lg border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat === "ALL" ? "All Categories" : cat}</option>
                    ))}
                </select>
                <select
                    value={filterVisibility}
                    onChange={(e) => setFilterVisibility(e.target.value)}
                    className="h-10 px-4 text-sm rounded-lg border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal"
                >
                    <option value="ALL">All Status</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                </select>
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
                            {filtered.map((product) => (
                                <tr key={product.id} className="border-b border-border/50 last:border-0 hover:bg-gray-50/30">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center text-[9px] text-muted">IMG</div>
                                            <div className="min-w-0">
                                                <Link href={`/admin-panel/products/${product.id}`} className="text-sm font-medium text-charcoal hover:text-emerald line-clamp-1">
                                                    {product.name}
                                                </Link>
                                                <p className="text-xs text-muted">{product.material}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-muted font-mono text-xs">{product.sku}</td>
                                    <td className="px-5 py-4 text-charcoal">{product.category}</td>
                                    <td className="px-5 py-4">
                                        <div>
                                            <span className="font-semibold text-charcoal">{formatPrice(product.salePrice || product.basePrice)}</span>
                                            {product.salePrice && (
                                                <span className="block text-xs text-muted line-through">{formatPrice(product.basePrice)}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`font-semibold ${product.stock === 0 ? "text-error" : product.stock <= product.lowStockThreshold ? "text-warning" : "text-charcoal"}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge type="visibility" value={product.visibility} />
                                    </td>
                                    <td className="px-5 py-4 text-charcoal font-medium">{product.salesCount}</td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/admin-panel/products/${product.id}`} className="p-1.5 text-muted hover:text-charcoal hover:bg-gray-100 rounded-md transition-colors" title="Edit">
                                                <Edit2 size={14} />
                                            </Link>
                                            <button className="p-1.5 text-muted hover:text-error hover:bg-red-50 rounded-md transition-colors" title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-gray-50/30">
                    <p className="text-xs text-muted">Showing {filtered.length} of {mockAdminProducts.length} products</p>
                    <div className="flex gap-1">
                        <button className="px-3 py-1.5 text-xs rounded-md bg-charcoal text-white font-semibold">1</button>
                        <button className="px-3 py-1.5 text-xs rounded-md text-muted hover:bg-gray-100">2</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
