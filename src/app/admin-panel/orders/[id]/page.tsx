"use client";

import React from "react";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Printer, Package, User, MapPin, CreditCard, FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { mockAdminOrders } from "@/data/admin-mock-data";
import { formatPrice } from "@/lib/utils";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const order = mockAdminOrders.find((o) => o.id === id) || mockAdminOrders[0];

    return (
        <div>
            <PageHeader
                title={`Order ${order.orderNumber}`}
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin-panel/dashboard" },
                    { label: "Orders", href: "/admin-panel/orders" },
                    { label: order.orderNumber },
                ]}
                actions={
                    <>
                        <Button variant="outline" size="sm"><Printer size={16} /> Print Invoice</Button>
                        <Button variant="primary" size="sm">Update Status</Button>
                    </>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status + Summary */}
                    <div className="bg-white rounded-xl border border-border p-6">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <StatusBadge type="order" value={order.status} />
                            <StatusBadge type="payment" value={order.paymentStatus} />
                            <span className="text-xs text-muted ml-auto">
                                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                        </div>

                        {/* Items */}
                        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Package size={16} /> Items Ordered
                        </h3>
                        <div className="space-y-3 mb-6">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-3 rounded-lg bg-gray-50 border border-border/50">
                                    <div className="w-14 h-14 rounded-lg bg-gray-200 shrink-0 flex items-center justify-center text-[9px] text-muted">IMG</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-charcoal">{item.productName}</p>
                                        <p className="text-xs text-muted">SKU: {item.sku} {item.variantInfo && `• ${item.variantInfo}`}</p>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-xs text-muted">Qty: {item.quantity}</span>
                                            <span className="text-sm font-semibold text-charcoal">{formatPrice(item.totalPrice)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="border-t border-border pt-4 space-y-2">
                            <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span className="text-charcoal">{formatPrice(order.subtotal)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-muted">Shipping</span><span className="text-emerald font-medium">{order.shippingAmount === 0 ? "FREE" : formatPrice(order.shippingAmount)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-muted">Tax</span><span className="text-charcoal">{formatPrice(order.taxAmount)}</span></div>
                            {order.discountAmount > 0 && <div className="flex justify-between text-sm"><span className="text-muted">Discount</span><span className="text-success">-{formatPrice(order.discountAmount)}</span></div>}
                            <div className="flex justify-between text-base font-bold pt-2 border-t border-border"><span>Total</span><span>{formatPrice(order.totalAmount)}</span></div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl border border-border p-6">
                        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Order Timeline</h3>
                        <div className="relative pl-6">
                            <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
                            {order.timeline.map((event, index) => (
                                <div key={event.id} className="relative pb-6 last:pb-0">
                                    <div className={`absolute left-[-18px] w-4 h-4 rounded-full border-2 border-white ${index === order.timeline.length - 1 ? "bg-emerald" : "bg-gray-300"}`} />
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <div>
                                            <p className="text-sm font-medium text-charcoal">{event.message}</p>
                                            <p className="text-xs text-muted">By {event.actor}</p>
                                        </div>
                                        <span className="text-xs text-muted whitespace-nowrap">
                                            {new Date(event.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Internal Notes */}
                    <div className="bg-white rounded-xl border border-border p-6">
                        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                            <MessageSquare size={16} /> Internal Notes
                        </h3>
                        <textarea
                            rows={3}
                            className="w-full px-4 py-3 text-sm rounded-md border border-border text-charcoal placeholder:text-muted-light focus:outline-none focus:border-charcoal resize-none"
                            placeholder="Add a private note visible only to the team..."
                        />
                        <div className="mt-3 flex justify-end">
                            <Button variant="outline" size="sm">Add Note</Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-white rounded-xl border border-border p-6">
                        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                            <User size={16} /> Customer
                        </h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-charcoal text-white flex items-center justify-center text-sm font-semibold">
                                {order.customerName.charAt(0)}
                            </div>
                            <div>
                                <Link href={`/admin-panel/customers/${order.customerId}`} className="text-sm font-semibold text-charcoal hover:text-emerald">
                                    {order.customerName}
                                </Link>
                                <p className="text-xs text-muted">{order.customerEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="bg-white rounded-xl border border-border p-6">
                        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                            <MapPin size={16} /> Shipping Address
                        </h3>
                        <div className="text-sm text-charcoal leading-relaxed">
                            <p className="font-medium">{order.shippingAddress.fullName}</p>
                            <p className="text-muted">{order.shippingAddress.addressLine1}</p>
                            <p className="text-muted">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                            <p className="text-muted mt-2">Phone: {order.shippingAddress.phone}</p>
                        </div>
                        {order.trackingNumber && (
                            <div className="mt-4 pt-4 border-t border-border">
                                <p className="text-xs text-muted uppercase font-semibold mb-1">Tracking</p>
                                <p className="text-sm font-mono font-semibold text-emerald">{order.trackingNumber}</p>
                            </div>
                        )}
                    </div>

                    {/* Payment */}
                    <div className="bg-white rounded-xl border border-border p-6">
                        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                            <CreditCard size={16} /> Payment
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-muted">Method</span><span className="text-charcoal font-medium">{order.paymentMethod}</span></div>
                            <div className="flex justify-between"><span className="text-muted">Status</span><StatusBadge type="payment" value={order.paymentStatus} /></div>
                            {order.transactionId && (
                                <div className="flex justify-between"><span className="text-muted">TXN ID</span><span className="text-charcoal font-mono text-xs">{order.transactionId}</span></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
