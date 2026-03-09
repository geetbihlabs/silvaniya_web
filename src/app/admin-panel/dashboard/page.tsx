"use client";

import React from "react";
import Link from "next/link";
import { IndianRupee, ShoppingCart, UserPlus, TrendingUp, AlertTriangle, Package, ExternalLink } from "lucide-react";
import StatsCard from "@/components/admin/shared/StatsCard";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import PageHeader from "@/components/admin/shared/PageHeader";
import { mockDashboardStats, mockAdminOrders, mockInventoryAlerts, mockRecentActivity, mockSupportTickets } from "@/data/admin-mock-data";
import { formatPrice } from "@/lib/utils";

export default function DashboardPage() {
    const stats = mockDashboardStats;
    const recentOrders = mockAdminOrders.slice(0, 5);
    const alerts = mockInventoryAlerts;
    const openTickets = mockSupportTickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS");

    return (
        <div>
            <PageHeader
                title="Dashboard"
                subtitle={`Welcome back! Here's what's happening today — ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                    title="Total Revenue"
                    value={formatPrice(stats.totalRevenue)}
                    change={stats.revenueChange}
                    icon={<IndianRupee size={20} />}
                />
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders.toLocaleString()}
                    change={stats.ordersChange}
                    icon={<ShoppingCart size={20} />}
                />
                <StatsCard
                    title="New Customers"
                    value={stats.newCustomers.toLocaleString()}
                    change={stats.customersChange}
                    icon={<UserPlus size={20} />}
                />
                <StatsCard
                    title="Avg. Order Value"
                    value={formatPrice(stats.avgOrderValue)}
                    change={stats.aovChange}
                    icon={<TrendingUp size={20} />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders - 2 cols */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-border">
                    <div className="flex items-center justify-between p-5 border-b border-border">
                        <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider">Recent Orders</h2>
                        <Link href="/admin-panel/orders" className="text-xs text-emerald font-semibold hover:underline flex items-center gap-1">
                            View All <ExternalLink size={12} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-[11px] text-muted uppercase tracking-wider border-b border-border">
                                    <th className="px-5 py-3 font-semibold">Order</th>
                                    <th className="px-5 py-3 font-semibold">Customer</th>
                                    <th className="px-5 py-3 font-semibold">Amount</th>
                                    <th className="px-5 py-3 font-semibold">Status</th>
                                    <th className="px-5 py-3 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-gray-50/50">
                                        <td className="px-5 py-3">
                                            <Link href={`/admin-panel/orders/${order.id}`} className="font-semibold text-charcoal hover:text-emerald">
                                                {order.orderNumber}
                                            </Link>
                                        </td>
                                        <td className="px-5 py-3 text-charcoal">{order.customerName}</td>
                                        <td className="px-5 py-3 font-medium text-charcoal">{formatPrice(order.totalAmount)}</td>
                                        <td className="px-5 py-3"><StatusBadge type="order" value={order.status} /></td>
                                        <td className="px-5 py-3 text-muted">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Inventory Alerts */}
                    <div className="bg-white rounded-xl border border-border">
                        <div className="flex items-center justify-between p-5 border-b border-border">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider flex items-center gap-2">
                                <AlertTriangle size={16} className="text-warning" />
                                Stock Alerts
                            </h2>
                            <span className="text-xs bg-red-50 text-error font-semibold px-2 py-0.5 rounded-full">{alerts.length}</span>
                        </div>
                        <div className="divide-y divide-border/50">
                            {alerts.map((alert) => (
                                <div key={alert.productId} className="px-5 py-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-charcoal">{alert.productName}</p>
                                        <p className="text-xs text-muted">{alert.sku}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${alert.status === "OUT_OF_STOCK" ? "text-error" : "text-warning"}`}>
                                            {alert.currentStock} left
                                        </p>
                                        <p className="text-[10px] text-muted">Threshold: {alert.threshold}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Open Tickets */}
                    <div className="bg-white rounded-xl border border-border">
                        <div className="flex items-center justify-between p-5 border-b border-border">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider">Open Tickets</h2>
                            <Link href="/admin-panel/support" className="text-xs text-emerald font-semibold hover:underline">View All</Link>
                        </div>
                        <div className="divide-y divide-border/50">
                            {openTickets.map((ticket) => (
                                <Link key={ticket.id} href={`/admin-panel/support/${ticket.id}`} className="px-5 py-3 block hover:bg-gray-50/50">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-charcoal line-clamp-1">{ticket.subject}</p>
                                            <p className="text-xs text-muted">{ticket.customerName}</p>
                                        </div>
                                        <StatusBadge type="priority" value={ticket.priority} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
