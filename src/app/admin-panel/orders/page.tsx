"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { mockAdminOrders } from "@/data/admin-mock-data";
import { formatPrice } from "@/lib/utils";
import { AdminOrderStatus } from "@/types/admin.types";

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
    const [activeTab, setActiveTab] = useState("ALL");
    const [search, setSearch] = useState("");

    const filtered = mockAdminOrders.filter((o) => {
        const matchesTab = activeTab === "ALL" || o.status === activeTab;
        const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div>
            <PageHeader
                title="Orders"
                subtitle={`${mockAdminOrders.length} total orders`}
                breadcrumbs={[{ label: "Dashboard", href: "/admin-panel/dashboard" }, { label: "Orders" }]}
                actions={<Button variant="outline" size="sm"><Download size={16} /> Export</Button>}
            />

            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
                {statusTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${activeTab === tab.value ? "bg-charcoal text-white" : "bg-white text-muted border border-border hover:text-charcoal"
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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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
                            {filtered.map((order) => (
                                <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-gray-50/30">
                                    <td className="px-5 py-4">
                                        <Link href={`/admin-panel/orders/${order.id}`} className="font-semibold text-charcoal hover:text-emerald">
                                            {order.orderNumber}
                                        </Link>
                                    </td>
                                    <td className="px-5 py-4">
                                        <Link href={`/admin-panel/customers/${order.customerId}`} className="text-charcoal hover:text-emerald">
                                            {order.customerName}
                                        </Link>
                                        <p className="text-xs text-muted">{order.customerEmail}</p>
                                    </td>
                                    <td className="px-5 py-4 text-charcoal">
                                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
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
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-muted">No orders match your filters</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
