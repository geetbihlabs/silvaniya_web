"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { useAdminOrderStore } from "@/store/useAdminOrderStore";
import { useAuth } from "@clerk/nextjs";
import debounce from "lodash.debounce";

const statusTabs: { label: string; value: string }[] = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING_PAYMENT" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Returns", value: "RETURN_REQUESTED" },
    { label: "Cancelled", value: "CANCELLED" },
];

export default function AdminOrdersPage() {
    const { getToken, isLoaded } = useAuth();
    const { orders, meta, isLoading, fetchOrders, filters, setFilters } = useAdminOrderStore();
    
    // Local search state to allow immediate typing feedback
    const [localSearch, setLocalSearch] = useState(filters.search);

    // Create a debounced search function
    const debouncedSearch = useCallback(
        debounce((searchQuery: string) => {
            setFilters({ search: searchQuery, page: 1 });
            if (isLoaded) {
                fetchOrders(getToken);
            }
        }, 500),
        [setFilters, fetchOrders, getToken, isLoaded]
    );

    // Initial load
    useEffect(() => {
        if (isLoaded) {
            fetchOrders(getToken);
        }
    }, [isLoaded, fetchOrders, getToken]);

    // Cleanup debounce
    useEffect(() => {
        return () => debouncedSearch.cancel();
    }, [debouncedSearch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearch(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handleTabChange = (value: string) => {
        setFilters({ status: value, page: 1 });
        if (isLoaded) {
            fetchOrders(getToken);
        }
    };

    const handlePageChange = (page: number) => {
        if (!meta) return;
        if (page < 1 || page > meta.totalPages) return;
        setFilters({ page });
        if (isLoaded) {
            fetchOrders(getToken);
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
                title="Orders"
                subtitle={`${meta?.total || 0} total orders`}
                breadcrumbs={[{ label: "Dashboard", href: "/admin-panel/dashboard" }, { label: "Orders" }]}
                actions={<Button variant="outline" size="sm"><Download size={16} /> Export</Button>}
            />

            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
                {statusTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                            filters.status === tab.value
                                ? "bg-charcoal text-white"
                                : "bg-white text-muted border border-border hover:text-charcoal"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-border p-4 mb-6">
                <div className="relative max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        placeholder="Search by order number or customer..."
                        value={localSearch}
                        onChange={handleSearchChange}
                        className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-charcoal"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-[11px] text-muted uppercase tracking-wider border-b border-border bg-gray-50/50">
                                <th className="px-5 py-3 font-semibold">Order</th>
                                <th className="px-5 py-3 font-semibold">Customer</th>
                                <th className="px-5 py-3 font-semibold">Items</th>
                                <th className="px-5 py-3 font-semibold">Amount</th>
                                <th className="px-5 py-3 font-semibold">Payment</th>
                                <th className="px-5 py-3 font-semibold">Status</th>
                                <th className="px-5 py-3 font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-8 text-center text-muted">
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-charcoal" />
                                            <span className="ml-2">Loading orders...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-muted">No orders match your filters</td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const anyOrder = order as any;
                                    const cName = order.customerName || (anyOrder.user ? `${anyOrder.user.firstName} ${anyOrder.user.lastName}` : 'Guest');
                                    const cEmail = order.customerEmail || (anyOrder.user?.email) || 'N/A';
                                    const itemCount = anyOrder._count?.items || order.items?.length || 0;

                                    return (
                                        <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-gray-50/30">
                                            <td className="px-5 py-4">
                                                <Link href={`/admin-panel/orders/${order.id}`} className="font-semibold text-charcoal hover:text-emerald">
                                                    {order.orderNumber}
                                                </Link>
                                            </td>
                                            <td className="px-5 py-4">
                                                <Link href={`/admin-panel/customers/${anyOrder.userId || order.customerId}`} className="text-charcoal hover:text-emerald">
                                                    {cName}
                                                </Link>
                                                <p className="text-xs text-muted">{cEmail}</p>
                                            </td>
                                            <td className="px-5 py-4 text-charcoal">
                                                {itemCount} item{itemCount !== 1 ? "s" : ""}
                                            </td>
                                            <td className="px-5 py-4 font-semibold text-charcoal">{formatPrice(order.totalAmount)}</td>
                                            <td className="px-5 py-4">
                                                <StatusBadge type="payment" value={order.paymentStatus} />
                                            </td>
                                            <td className="px-5 py-4">
                                                <StatusBadge type="order" value={order.status} />
                                            </td>
                                            <td className="px-5 py-4 text-muted">
                                                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-gray-50/30">
                    <p className="text-xs text-muted">
                        Showing {orders.length} of {meta?.total || 0} orders
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
