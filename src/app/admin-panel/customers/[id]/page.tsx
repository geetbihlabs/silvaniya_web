"use client";

import React from "react";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Mail, Phone, MapPin, ShoppingCart, IndianRupee, Calendar, ShieldCheck, Ban } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { mockAdminCustomers, mockAdminOrders, mockSupportTickets } from "@/data/admin-mock-data";
import { formatPrice } from "@/lib/utils";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const customer = mockAdminCustomers.find((c) => c.id === id) || mockAdminCustomers[0];
    const customerOrders = mockAdminOrders.filter((o) => o.customerId === customer.id);
    const customerTickets = mockSupportTickets.filter((t) => t.customerId === customer.id);

    return (
        <div>
            <PageHeader
                title={`${customer.firstName} ${customer.lastName}`}
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin-panel/dashboard" },
                    { label: "Customers", href: "/admin-panel/customers" },
                    { label: `${customer.firstName} ${customer.lastName}` },
                ]}
                actions={
                    <>
                        <Button variant="outline" size="sm"><Mail size={16} /> Send Email</Button>
                        <Button variant="outline" size="sm" className="text-error border-error hover:bg-red-50"><Ban size={16} /> Block</Button>
                    </>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Card */}
                    <div className="bg-charcoal text-white rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-silver-light flex items-center justify-center text-2xl font-bold text-charcoal">
                                {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{customer.firstName} {customer.lastName}</h2>
                                <div className="flex items-center gap-3 mt-1">
                                    <StatusBadge type="loyalty" value={customer.loyaltyTier} />
                                    <StatusBadge type="customer" value={customer.status} />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                            <div className="bg-white/5 rounded-lg p-3"><p className="text-xs text-white/60 mb-1">Orders</p><p className="text-lg font-bold">{customer.totalOrders}</p></div>
                            <div className="bg-white/5 rounded-lg p-3"><p className="text-xs text-white/60 mb-1">Total Spent</p><p className="text-lg font-bold">{formatPrice(customer.totalSpent)}</p></div>
                            <div className="bg-white/5 rounded-lg p-3"><p className="text-xs text-white/60 mb-1">Avg. Order</p><p className="text-lg font-bold">{formatPrice(customer.avgOrderValue)}</p></div>
                            <div className="bg-white/5 rounded-lg p-3"><p className="text-xs text-white/60 mb-1">Member Since</p><p className="text-lg font-bold">{new Date(customer.registeredAt).getFullYear()}</p></div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="bg-white rounded-xl border border-border">
                        <div className="p-5 border-b border-border">
                            <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">Order History</h3>
                        </div>
                        {customerOrders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-[11px] text-muted uppercase tracking-wider border-b border-border">
                                            <th className="px-5 py-3 font-semibold">Order</th>
                                            <th className="px-5 py-3 font-semibold">Amount</th>
                                            <th className="px-5 py-3 font-semibold">Status</th>
                                            <th className="px-5 py-3 font-semibold">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customerOrders.map((order) => (
                                            <tr key={order.id} className="border-b border-border/50 last:border-0">
                                                <td className="px-5 py-3"><Link href={`/admin-panel/orders/${order.id}`} className="font-semibold text-charcoal hover:text-emerald">{order.orderNumber}</Link></td>
                                                <td className="px-5 py-3 font-medium">{formatPrice(order.totalAmount)}</td>
                                                <td className="px-5 py-3"><StatusBadge type="order" value={order.status} /></td>
                                                <td className="px-5 py-3 text-muted">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-sm text-muted">No orders found for this customer.</div>
                        )}
                    </div>

                    {/* Support Tickets */}
                    <div className="bg-white rounded-xl border border-border">
                        <div className="p-5 border-b border-border">
                            <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">Support Tickets</h3>
                        </div>
                        {customerTickets.length > 0 ? (
                            <div className="divide-y divide-border/50">
                                {customerTickets.map((ticket) => (
                                    <Link key={ticket.id} href={`/admin-panel/support/${ticket.id}`} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50/50 block">
                                        <div>
                                            <p className="text-sm font-medium text-charcoal">{ticket.subject}</p>
                                            <p className="text-xs text-muted">{ticket.ticketNumber}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <StatusBadge type="priority" value={ticket.priority} />
                                            <StatusBadge type="ticket" value={ticket.status} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-sm text-muted">No support tickets from this customer.</div>
                        )}
                    </div>
                </div>

                {/* Right - Sidebar */}
                <div className="space-y-6">
                    {/* Contact Info */}
                    <div className="bg-white rounded-xl border border-border p-6">
                        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4">Contact Information</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3"><Mail size={16} className="text-muted shrink-0" /><span className="text-charcoal">{customer.email}</span></div>
                            <div className="flex items-center gap-3"><Phone size={16} className="text-muted shrink-0" /><span className="text-charcoal">{customer.phone}</span></div>
                            {customer.city && <div className="flex items-center gap-3"><MapPin size={16} className="text-muted shrink-0" /><span className="text-charcoal">{customer.city}, {customer.state}</span></div>}
                            <div className="flex items-center gap-3"><Calendar size={16} className="text-muted shrink-0" /><span className="text-charcoal">Registered {new Date(customer.registeredAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span></div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl border border-border p-6">
                        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Button variant="outline" size="sm" className="w-full justify-start">Issue Discount Code</Button>
                            <Button variant="outline" size="sm" className="w-full justify-start">Add Store Credit</Button>
                            <Button variant="outline" size="sm" className="w-full justify-start">Reset Password</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
