"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { useAdminCustomerStore } from "@/store/useAdminCustomerStore";
import { useAuth } from "@clerk/nextjs";
import debounce from "lodash.debounce";

export default function AdminCustomersPage() {
    const { getToken, isLoaded } = useAuth();
    const { customers, meta, isLoading, fetchCustomers, filters, setFilters } = useAdminCustomerStore();
    
    // Local search state to allow immediate typing feedback
    const [localSearch, setLocalSearch] = useState(filters.search);

    // Create a debounced search function
    const debouncedSearch = useCallback(
        debounce((searchQuery: string) => {
            setFilters({ search: searchQuery, page: 1 });
            if (isLoaded) {
                fetchCustomers(getToken);
            }
        }, 500),
        [setFilters, fetchCustomers, getToken, isLoaded]
    );

    // Initial load
    useEffect(() => {
        if (isLoaded) {
            fetchCustomers(getToken);
        }
    }, [isLoaded, fetchCustomers, getToken]);

    // Cleanup debounce
    useEffect(() => {
        return () => debouncedSearch.cancel();
    }, [debouncedSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearch(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({ tier: e.target.value, page: 1 });
        if (isLoaded) {
            fetchCustomers(getToken);
        }
    };

    const handlePageChange = (page: number) => {
        if (!meta) return;
        if (page < 1 || page > meta.totalPages) return;
        setFilters({ page });
        if (isLoaded) {
            fetchCustomers(getToken);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getPageNumbers = (): number[] => {
        if (!meta) return [];
        const pages: number[] = [];
        const delta = 2;
        const from = Math.max(1, meta.page - delta);
        const to = Math.min(meta.totalPages, meta.page + delta);
        for (let i = from; i <= to; i++) pages.push(i);
        return pages;
    };

    return (
        <div>
            <PageHeader
                title="Customers"
                subtitle={`${meta?.total || 0} registered customers`}
                breadcrumbs={[{ label: "Dashboard", href: "/admin-panel/dashboard" }, { label: "Customers" }]}
                actions={<Button variant="outline" size="sm"><Download size={16} /> Export</Button>}
            />

            {/* Filters */}
            <div className="bg-white rounded-xl border border-border p-4 mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input type="text" placeholder="Search by name or email..." value={localSearch} onChange={handleSearchChange}
                        className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-charcoal" />
                </div>
                <select value={filters.tier} onChange={handleTierChange}
                    className="h-10 px-4 text-sm rounded-lg border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal">
                    <option value="ALL">All Tiers</option>
                    <option value="PLATINUM">Platinum</option>
                    <option value="GOLD">Gold</option>
                    <option value="SILVER">Silver</option>
                    <option value="BRONZE">Bronze</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-[11px] text-muted uppercase tracking-wider border-b border-border bg-gray-50/50">
                                <th className="px-5 py-3 font-semibold">Customer</th>
                                <th className="px-5 py-3 font-semibold">Orders</th>
                                <th className="px-5 py-3 font-semibold">Total Spent</th>
                                <th className="px-5 py-3 font-semibold">Avg. Order</th>
                                <th className="px-5 py-3 font-semibold">Tier</th>
                                <th className="px-5 py-3 font-semibold">Status</th>
                                <th className="px-5 py-3 font-semibold">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-8 text-center text-muted">
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-charcoal" />
                                            <span className="ml-2">Loading customers...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-8 text-center text-muted">
                                        No customers found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id} className="border-b border-border/50 last:border-0 hover:bg-gray-50/30">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-charcoal text-white flex items-center justify-center text-xs font-semibold shrink-0">
                                                    {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                                                </div>
                                                <div>
                                                    <Link href={`/admin-panel/customers/${customer.id}`} className="text-sm font-medium text-charcoal hover:text-emerald">
                                                        {customer.firstName} {customer.lastName}
                                                    </Link>
                                                    <p className="text-xs text-muted">{customer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-charcoal font-medium">{customer.totalOrders}</td>
                                        <td className="px-5 py-4 font-semibold text-charcoal">{formatPrice(customer.totalSpent)}</td>
                                        <td className="px-5 py-4 text-charcoal">{formatPrice(customer.avgOrderValue)}</td>
                                        <td className="px-5 py-4"><StatusBadge type="loyalty" value={customer.loyaltyTier} /></td>
                                        <td className="px-5 py-4"><StatusBadge type="customer" value={customer.status} /></td>
                                        <td className="px-5 py-4 text-muted">
                                            {new Date(customer.registeredAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-gray-50/30">
                    <p className="text-xs text-muted">
                        Showing {customers.length} of {meta?.total || 0} customers
                        {meta && meta.totalPages > 1 && ` — Page ${meta.page} of ${meta.totalPages}`}
                    </p>

                    {meta && meta.totalPages > 1 && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handlePageChange(meta.page - 1)}
                                disabled={meta.page === 1 || isLoading}
                                className="p-1.5 rounded-md text-muted hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={14} />
                            </button>

                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    disabled={isLoading}
                                    className={`px-3 py-1.5 text-xs rounded-md font-semibold transition-colors ${
                                        page === meta.page
                                            ? "bg-charcoal text-white"
                                            : "text-muted hover:bg-gray-100 disabled:opacity-50"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(meta.page + 1)}
                                disabled={meta.page === meta.totalPages || isLoading}
                                className="p-1.5 rounded-md text-muted hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
