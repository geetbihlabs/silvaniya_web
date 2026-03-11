"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Printer, Package, User, MapPin, CreditCard, FileText, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { useAdminOrderStore } from "@/store/useAdminOrderStore";
import { useAuth } from "@clerk/nextjs";
import { AdminOrderStatus } from "@/types/admin.types";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getToken, isLoaded } = useAuth();
    const { selectedOrder: order, isLoading, isUpdating, fetchOrderById, updateOrderStatus } = useAdminOrderStore();

    const [statusToUpdate, setStatusToUpdate] = useState<AdminOrderStatus | "">("");

    useEffect(() => {
        if (isLoaded) {
            fetchOrderById(id, getToken);
        }
    }, [id, isLoaded, fetchOrderById, getToken]);

    // Set initial status matching when loaded
    useEffect(() => {
        if (order) {
            setStatusToUpdate(order.status);
        }
    }, [order]);

    if (isLoading || !order) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-charcoal mb-4" />
                <p className="text-muted">Loading order details...</p>
            </div>
        );
    }

    const anyOrder = order as any;
    const cName = order.customerName || (anyOrder.user ? `${anyOrder.user.firstName} ${anyOrder.user.lastName}` : (anyOrder.shippingAddress?.fullName || 'Guest'));
    const cEmail = order.customerEmail || (anyOrder.user?.email) || 'N/A';
    const cPhone = anyOrder.user?.phone || anyOrder.shippingAddress?.phone || 'N/A';

    const handleUpdateStatus = async () => {
        if (!statusToUpdate || statusToUpdate === order.status) return;
        
        // Simple prompt for note if necessary, or just hardcode a generic note
        const note = window.prompt("Add an optional note for this status change:") || `Status updated to ${statusToUpdate}`;
        await updateOrderStatus(id, statusToUpdate as AdminOrderStatus, note, getToken);
    };

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
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="outline" size="sm"><Printer size={16} /> Print Invoice</Button>
                        <select 
                            value={statusToUpdate}
                            onChange={(e) => setStatusToUpdate(e.target.value as AdminOrderStatus)}
                            className="h-9 px-3 text-sm rounded-lg border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal"
                        >
                            <option value="PENDING_PAYMENT">Pending Payment</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="RETURN_REQUESTED">Return Requested</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={handleUpdateStatus}
                            disabled={statusToUpdate === order.status || isUpdating}
                        >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : 'Update Status'}
                        </Button>
                    </div>
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
                            {(order.items || []).map((item: any) => (
                                <div key={item.id} className="flex gap-4 p-3 rounded-lg bg-gray-50 border border-border/50">
                                    <div className="w-14 h-14 rounded-lg bg-gray-200 shrink-0 flex items-center justify-center text-[9px] text-muted overflow-hidden">
                                        {item.productVariant?.product?.images?.[0]?.url ? (
                                            <img src={item.productVariant.product.images[0].url} alt={item.productName} className="w-full h-full object-cover" />
                                        ) : "IMG"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-charcoal">{item.productName}</p>
                                        <p className="text-xs text-muted">SKU: {item.sku} {item.variantInfo || item.variantLabel ? `• ${item.variantInfo || item.variantLabel}` : ''}</p>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-xs text-muted">Qty: {item.quantity}</span>
                                            <span className="text-sm font-semibold text-charcoal">{formatPrice(item.totalPrice || item.unitPrice * item.quantity)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="border-t border-border pt-4 space-y-2">
                            <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span className="text-charcoal">{formatPrice(order.subtotal || 0)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-muted">Shipping</span><span className="text-emerald font-medium">{order.shippingAmount === 0 || anyOrder.shippingCharge === 0 ? "FREE" : formatPrice(order.shippingAmount || anyOrder.shippingCharge)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-muted">Tax (GST)</span><span className="text-charcoal">{formatPrice((order.taxAmount || 0) + (anyOrder.cgst || 0) + (anyOrder.sgst || 0))}</span></div>
                            {order.discountAmount > 0 && <div className="flex justify-between text-sm"><span className="text-muted">Discount</span><span className="text-success">-{formatPrice(order.discountAmount)}</span></div>}
                            <div className="flex justify-between text-base font-bold pt-2 border-t border-border"><span>Total</span><span>{formatPrice(order.totalAmount)}</span></div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl border border-border p-6">
                        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Order Timeline</h3>
                        <div className="relative pl-6">
                            <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
                            {anyOrder.statusHistory?.map((event: any, index: number) => (
                                <div key={event.id} className="relative pb-6 last:pb-0">
                                    <div className={`absolute left-[-18px] w-4 h-4 rounded-full border-2 border-white ${index === 0 ? "bg-emerald" : "bg-gray-300"}`} />
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <div>
                                            <p className="text-sm font-medium text-charcoal">{event.note || `Status updated to ${event.status}`}</p>
                                            <p className="text-xs text-muted">By {event.createdBy || 'SYSTEM'}</p>
                                        </div>
                                        <span className="text-xs text-muted whitespace-nowrap">
                                            {new Date(event.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </div>
                                </div>
                            )) || <p className="text-sm text-muted">No timeline events available.</p>}
                        </div>
                    </div>

                    {/* Internal Notes */}
                    <div className="bg-white rounded-xl border border-border p-6 opacity-60">
                        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                            <MessageSquare size={16} /> Internal Notes (Coming Soon)
                        </h3>
                        <textarea
                            disabled
                            rows={3}
                            className="w-full px-4 py-3 text-sm rounded-md border border-border text-charcoal placeholder:text-muted-light focus:outline-none focus:border-charcoal resize-none cursor-not-allowed"
                            placeholder="Adding internal notes will be available soon."
                        />
                        <div className="mt-3 flex justify-end">
                            <Button variant="outline" size="sm" disabled>Add Note</Button>
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
                                {cName.charAt(0)}
                            </div>
                            <div>
                                {anyOrder.userId ? (
                                    <Link href={`/admin-panel/customers/${anyOrder.userId}`} className="text-sm font-semibold text-charcoal hover:text-emerald">
                                        {cName}
                                    </Link>
                                ) : (
                                    <span className="text-sm font-semibold text-charcoal">{cName}</span>
                                )}
                                <p className="text-xs text-muted">{cEmail}</p>
                                <p className="text-xs text-muted">{cPhone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="bg-white rounded-xl border border-border p-6">
                        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                            <MapPin size={16} /> Shipping Address
                        </h3>
                        {anyOrder.shippingAddress ? (
                            <div className="text-sm text-charcoal leading-relaxed">
                                <p className="font-medium">{anyOrder.shippingAddress.fullName}</p>
                                <p className="text-muted">{anyOrder.shippingAddress.line1}</p>
                                {anyOrder.shippingAddress.line2 && <p className="text-muted">{anyOrder.shippingAddress.line2}</p>}
                                <p className="text-muted">{anyOrder.shippingAddress.city}, {anyOrder.shippingAddress.state} {anyOrder.shippingAddress.pincode}</p>
                                <p className="text-muted mt-2">Phone: {anyOrder.shippingAddress.phone}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted">No shipping address provided.</p>
                        )}
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
                            {anyOrder.transactionId && (
                                <div className="flex justify-between"><span className="text-muted">TXN ID</span><span className="text-charcoal font-mono text-xs">{anyOrder.transactionId}</span></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
