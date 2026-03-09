"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { mockAdminCustomers } from "@/data/admin-mock-data";
import { formatPrice } from "@/lib/utils";

export default function AdminCustomersPage() {
    const [search, setSearch] = useState("");
    const [filterTier, setFilterTier] = useState("ALL");

    const filtered = mockAdminCustomers.filter((c) => {
        const matchesSearch = `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
        const matchesTier = filterTier === "ALL" || c.loyaltyTier === filterTier;
        return matchesSearch && matchesTier;
    });

    return (
        <div>
            <PageHeader
                title="Customers"
                subtitle={`${mockAdminCustomers.length} registered customers`}
                breadcrumbs={[{ label: "Dashboard", href: "/admin-panel/dashboard" }, { label: "Customers" }]}
                actions={<Button variant="outline" size="sm"><Download size={16} /> Export</Button>}
            />

            {/* Filters */}
            <div className="bg-white rounded-xl border border-border p-4 mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-charcoal" />
                </div>
                <select value={filterTier} onChange={(e) => setFilterTier(e.target.value)}
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
                            {filtered.map((customer) => (
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
