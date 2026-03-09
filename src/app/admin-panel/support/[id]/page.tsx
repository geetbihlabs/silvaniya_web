"use client";

import React from "react";
import Link from "next/link";
import { use } from "react";
import { Send, Lock, ShoppingCart, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { mockSupportTickets, mockAdminCustomers, mockAdminOrders } from "@/data/admin-mock-data";
import { formatPrice } from "@/lib/utils";

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const ticket = mockSupportTickets.find((t) => t.id === id) || mockSupportTickets[0];
    const customer = mockAdminCustomers.find((c) => c.id === ticket.customerId);
    const relatedOrder = ticket.orderId ? mockAdminOrders.find((o) => o.id === ticket.orderId) : null;

    return (
        <div>
            <PageHeader
                title={ticket.ticketNumber}
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin-panel/dashboard" },
                    { label: "Support", href: "/admin-panel/support" },
                    { label: ticket.ticketNumber },
                ]}
                actions={
                    <>
                        <select className="h-9 px-3 text-xs rounded-lg border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal font-semibold">
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="WAITING_ON_CUSTOMER">Waiting on Customer</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                        <Button variant="emerald" size="sm">Mark Resolved</Button>
                    </>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Thread */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Ticket Info */}
                    <div className="bg-white rounded-xl border border-border p-6">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <StatusBadge type="priority" value={ticket.priority} />
                            <StatusBadge type="ticket" value={ticket.status} />
                            {ticket.assignedTo && <span className="text-xs text-muted">Assigned to <strong className="text-charcoal">{ticket.assignedTo}</strong></span>}
                        </div>
                        <h2 className="text-lg font-bold text-charcoal mb-2">{ticket.subject}</h2>
                        <p className="text-sm text-muted leading-relaxed">{ticket.description}</p>
                    </div>

                    {/* Conversation Thread */}
                    <div className="bg-white rounded-xl border border-border">
                        <div className="p-5 border-b border-border">
                            <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">Conversation</h3>
                        </div>
                        <div className="p-5 space-y-5">
                            {ticket.replies.map((reply) => (
                                <div
                                    key={reply.id}
                                    className={`rounded-xl p-4 ${reply.isInternal
                                            ? "bg-yellow-50 border border-yellow-200"
                                            : reply.authorRole === "CUSTOMER"
                                                ? "bg-gray-50 border border-border"
                                                : "bg-emerald/5 border border-emerald/20"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${reply.authorRole === "CUSTOMER" ? "bg-charcoal text-white" : "bg-emerald text-white"
                                                }`}>
                                                {reply.author.charAt(0)}
                                            </div>
                                            <span className="text-sm font-semibold text-charcoal">{reply.author}</span>
                                            {reply.isInternal && (
                                                <span className="flex items-center gap-1 text-[10px] text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full font-semibold">
                                                    <Lock size={10} /> Internal Note
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-muted">
                                            {new Date(reply.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-charcoal leading-relaxed pl-9">{reply.message}</p>
                                </div>
                            ))}
                        </div>

                        {/* Reply Area */}
                        <div className="p-5 border-t border-border">
                            <textarea
                                rows={3}
                                className="w-full px-4 py-3 text-sm rounded-lg border border-border text-charcoal placeholder:text-muted-light focus:outline-none focus:border-charcoal resize-none"
                                placeholder="Type your reply..."
                            />
                            <div className="flex items-center justify-between mt-3">
                                <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 accent-charcoal" />
                                    Internal note (not visible to customer)
                                </label>
                                <Button variant="primary" size="sm"><Send size={14} /> Send Reply</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    {customer && (
                        <div className="bg-white rounded-xl border border-border p-6">
                            <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4">Customer</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-charcoal text-white flex items-center justify-center text-sm font-semibold">
                                    {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                                </div>
                                <div>
                                    <Link href={`/admin-panel/customers/${customer.id}`} className="text-sm font-semibold text-charcoal hover:text-emerald">
                                        {customer.firstName} {customer.lastName}
                                    </Link>
                                    <p className="text-xs text-muted">{customer.email}</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm border-t border-border pt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted flex items-center gap-1"><ShoppingCart size={14} /> Orders</span>
                                    <span className="font-medium text-charcoal">{customer.totalOrders}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted flex items-center gap-1"><IndianRupee size={14} /> LTV</span>
                                    <span className="font-medium text-charcoal">{formatPrice(customer.totalSpent)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted">Tier</span>
                                    <StatusBadge type="loyalty" value={customer.loyaltyTier} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Related Order */}
                    {relatedOrder && (
                        <div className="bg-white rounded-xl border border-border p-6">
                            <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4">Related Order</h3>
                            <Link href={`/admin-panel/orders/${relatedOrder.id}`} className="text-sm font-semibold text-emerald hover:underline">
                                {relatedOrder.orderNumber}
                            </Link>
                            <div className="mt-3 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-muted">Amount</span><span className="font-medium">{formatPrice(relatedOrder.totalAmount)}</span></div>
                                <div className="flex justify-between"><span className="text-muted">Status</span><StatusBadge type="order" value={relatedOrder.status} /></div>
                                <div className="flex justify-between"><span className="text-muted">Items</span><span className="text-charcoal">{relatedOrder.items.length}</span></div>
                            </div>
                        </div>
                    )}

                    {/* Canned Responses */}
                    <div className="bg-white rounded-xl border border-border p-6">
                        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4">Quick Responses</h3>
                        <div className="space-y-2">
                            {["Shipping Delay", "Return Policy", "Refund Processed", "Repair Scheduled"].map((resp) => (
                                <button key={resp} className="w-full text-left text-xs px-3 py-2 rounded-lg border border-border text-muted hover:border-charcoal hover:text-charcoal transition-colors">
                                    {resp}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
