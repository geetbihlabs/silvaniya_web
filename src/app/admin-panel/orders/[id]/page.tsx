"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Printer, Package, User, MapPin, CreditCard, FileText, MessageSquare, Loader2, RotateCcw, Truck, Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { useAdminOrderStore } from "@/store/useAdminOrderStore";
import { useAuth } from "@clerk/nextjs";
import { AdminOrderStatus } from "@/types/admin.types";
import { toast } from "react-hot-toast";

const ADMIN_STEPS = [
    { key: "PENDING_PAYMENT", label: "Pending",   Icon: Check },
    { key: "PAYMENT_CONFIRMED", label: "Confirmed", Icon: Check },
    { key: "PROCESSING",        label: "Packed", Icon: Package },
    { key: "SHIPPED",           label: "Shipped",          Icon: Truck },
    { key: "OUT_FOR_DELIVERY",  label: "Out For Delivery", Icon: MapPin },
    { key: "DELIVERED",         label: "Delivered",        Icon: ShoppingBag },
];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { getToken, isLoaded } = useAuth();
    const { selectedOrder: order, isLoading, isUpdating, fetchOrderById, updateOrderStatus } = useAdminOrderStore();

    const [statusToUpdate, setStatusToUpdate] = useState<AdminOrderStatus | "">("");
    const [trackingAwb, setTrackingAwb] = useState("");
    const [trackingCarrier, setTrackingCarrier] = useState("");
    const [trackingUrl, setTrackingUrl] = useState("");
    const [isSavingTracking, setIsSavingTracking] = useState(false);

    useEffect(() => {
        if (isLoaded) {
            fetchOrderById(id, getToken);
        }
    }, [id, isLoaded, fetchOrderById, getToken]);

    // Set initial status matching when loaded
    useEffect(() => {
        if (order) {
            setStatusToUpdate(order.status);
            setTrackingAwb((order as any).awbNumber || "");
            setTrackingCarrier((order as any).courierPartner || "");
            setTrackingUrl((order as any).trackingUrl || "");
        }
    }, [order]);

    const handleSaveTracking = async () => {
        if (!trackingAwb.trim() || !trackingCarrier.trim()) {
            return;
        }
        setIsSavingTracking(true);
        await useAdminOrderStore.getState().updateTracking(
            id,
            { awbNumber: trackingAwb.trim(), courierPartner: trackingCarrier.trim(), trackingUrl: trackingUrl.trim() || undefined },
            getToken
        );
        setIsSavingTracking(false);
    };

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

        toast(
            (t) => {
                let note = "";
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "260px" }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "#1a1a1a" }}>
                            Add an optional note:
                        </p>
                        <input
                            type="text"
                            placeholder={`Status updated to ${statusToUpdate}`}
                            onChange={(e) => { note = e.target.value; }}
                            autoFocus
                            style={{
                                width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #e5e7eb",
                                fontSize: "13px", outline: "none", color: "#1a1a1a"
                            }}
                        />
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "4px" }}>
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                style={{
                                    padding: "6px 14px", borderRadius: "8px", border: "1px solid #e5e7eb",
                                    background: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "#374151"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    toast.dismiss(t.id);
                                    await updateOrderStatus(id, statusToUpdate as AdminOrderStatus, note || `Status updated to ${statusToUpdate}`, getToken);
                                }}
                                style={{
                                    padding: "6px 14px", borderRadius: "8px", border: "none",
                                    background: "#107c6f", color: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer"
                                }}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                );
            },
            { duration: Infinity, style: { padding: "14px 16px", borderRadius: "12px" } }
        );
    };

    const handleResolveReturn = async (approved: boolean) => {
        toast(
            (t) => {
                let note = "";
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "260px" }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "#1a1a1a" }}>
                            {`Note for ${approved ? 'approving' : 'rejecting'} this return:`}
                        </p>
                        <input
                            type="text"
                            placeholder={approved ? 'Return Approved' : 'Return Rejected'}
                            onChange={(e) => { note = e.target.value; }}
                            autoFocus
                            style={{
                                width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #e5e7eb",
                                fontSize: "13px", outline: "none", color: "#1a1a1a"
                            }}
                        />
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "4px" }}>
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                style={{
                                    padding: "6px 14px", borderRadius: "8px", border: "1px solid #e5e7eb",
                                    background: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "#374151"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    toast.dismiss(t.id);
                                    const success = await useAdminOrderStore.getState().resolveReturnRequest(id, approved, note || (approved ? 'Return Approved' : 'Return Rejected'), getToken);
                                    if (success) {
                                        setStatusToUpdate(approved ? "RETURN_APPROVED" : "RETURN_REJECTED");
                                    }
                                }}
                                style={{
                                    padding: "6px 14px", borderRadius: "8px", border: "none",
                                    background: approved ? "#107c6f" : "#ef4444", color: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer"
                                }}
                            >
                                {approved ? "Approve" : "Reject"}
                            </button>
                        </div>
                    </div>
                );
            },
            { duration: Infinity, style: { padding: "14px 16px", borderRadius: "12px" } }
        );
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
                            <option value="PAYMENT_CONFIRMED">Payment Confirmed</option>
                            <option value="PROCESSING">Packed / Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="RETURN_REQUESTED">Return Requested</option>
                            <option value="RETURN_APPROVED">Return Approved</option>
                            <option value="RETURN_REJECTED">Return Rejected</option>
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

                    {/* Interactive Status Stepper */}
                    {!["CANCELLED", "RETURN_REQUESTED", "RETURN_APPROVED", "RETURN_REJECTED"].includes(order.status) && (
                        <div className="bg-white rounded-xl border border-border p-6 mt-6">
                            <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-6">
                                Update Order Status
                            </h3>
                            <div className="flex items-start justify-between">
                                {ADMIN_STEPS.map((step, i) => {
                                    const currentStepIndex = ADMIN_STEPS.findIndex(s => s.key === order.status);
                                    const done = i <= currentStepIndex;
                                    const current = i === currentStepIndex;
                                    const { Icon } = step;
                                    return (
                                        <div key={step.key} className="flex flex-col items-center flex-1 cursor-pointer group" onClick={() => {
                                            if (step.key !== order.status && !isUpdating) {
                                                toast(
                                                    (t) => {
                                                        let note = "";
                                                        return (
                                                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "260px" }}>
                                                                <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "#1a1a1a" }}>
                                                                    {`Update status to ${step.label}?`}
                                                                </p>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Optional note..."
                                                                    onChange={(e) => { note = e.target.value; }}
                                                                    autoFocus
                                                                    style={{
                                                                        width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #e5e7eb",
                                                                        fontSize: "13px", outline: "none", color: "#1a1a1a"
                                                                    }}
                                                                />
                                                                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "4px" }}>
                                                                    <button onClick={() => toast.dismiss(t.id)} style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "#374151" }}>Cancel</button>
                                                                    <button onClick={async () => {
                                                                        toast.dismiss(t.id);
                                                                        setStatusToUpdate(step.key as AdminOrderStatus);
                                                                        await updateOrderStatus(id, step.key as AdminOrderStatus, note || `Status updated to ${step.key}`, getToken);
                                                                    }} style={{ padding: "6px 14px", borderRadius: "8px", border: "none", background: "#107c6f", color: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Confirm</button>
                                                                </div>
                                                            </div>
                                                        );
                                                    },
                                                    { duration: Infinity, style: { padding: "14px 16px", borderRadius: "12px" } }
                                                );
                                            }
                                        }}>
                                            <div className="flex items-center w-full">
                                                {i > 0 && (
                                                    <div className={`h-[2px] flex-1 transition-colors ${done ? "bg-emerald" : "bg-gray-200 group-hover:bg-emerald/50"}`} />
                                                )}
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-transform ${done ? "bg-emerald border-emerald text-white" : current ? "bg-white border-emerald text-emerald" : "bg-white border-gray-300 text-gray-400 group-hover:border-emerald/50 group-hover:text-emerald/50"} ${!current && !isUpdating && 'group-hover:scale-110'}`}>
                                                    {isUpdating && statusToUpdate === step.key ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} strokeWidth={2.5} />}
                                                </div>
                                                {i < ADMIN_STEPS.length - 1 && (
                                                    <div className={`h-[2px] flex-1 transition-colors ${i < currentStepIndex ? "bg-emerald" : "bg-gray-200 group-hover:bg-emerald/50"}`} />
                                                )}
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest mt-3 text-center leading-tight ${done ? "text-emerald" : "text-gray-400 group-hover:text-emerald/70"}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}



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

                    {/* Return Action Panel (If Return Requested) */}
                    {(order.status === "RETURN_REQUESTED" || (anyOrder.returns && anyOrder.returns.some((r: any) => r.status === "REQUESTED"))) && (() => {
                        const activeReturn = anyOrder.returns?.find((r: any) => r.status === "REQUESTED");
                        return (
                            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
                                <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <RotateCcw size={16} /> Return Request Action Required
                                </h3>
                                <p className="text-sm text-amber-800 mb-4">
                                    The customer has requested a return. Review the specific items below and take action.
                                </p>

                                {/* Return reason */}
                                {activeReturn?.reason && (
                                    <div className="bg-white rounded-lg border border-amber-200 px-4 py-3 mb-4">
                                        <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-1">Reason</p>
                                        <p className="text-sm text-charcoal font-medium">{activeReturn.reason.replace(/_/g, " ")}</p>
                                        {activeReturn.reasonDetail && (
                                            <p className="text-xs text-muted mt-1">{activeReturn.reasonDetail}</p>
                                        )}
                                    </div>
                                )}

                                {/* Items being returned */}
                                {activeReturn?.items && activeReturn.items.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-2">Items to Return</p>
                                        <div className="space-y-2">
                                            {activeReturn.items.map((retItem: any) => {
                                                const orderItem = (order.items || []).find((i: any) => i.id === retItem.orderItemId);
                                                if (!orderItem) return null;
                                                const effectiveUnit = parseFloat(String(orderItem.effectivePrice ?? orderItem.unitPrice));
                                                const itemRefund = effectiveUnit * retItem.quantity;
                                                const imgUrl = orderItem.productVariant?.product?.images?.find((i: any) => i.isPrimary)?.s3Url
                                                    ?? orderItem.productVariant?.product?.images?.[0]?.s3Url;
                                                return (
                                                    <div key={retItem.orderItemId} className="flex items-center gap-3 bg-white rounded-lg border border-amber-200 p-3">
                                                        <div className="w-10 h-10 shrink-0 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
                                                            {imgUrl ? (
                                                                <img src={imgUrl} alt={orderItem.productName} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Package size={14} className="text-gray-300" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-charcoal truncate">{orderItem.productName}</p>
                                                            <p className="text-xs text-muted">SKU: {orderItem.sku}</p>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="text-xs text-muted">Qty: {retItem.quantity}</p>
                                                            <p className="text-sm font-bold text-charcoal">{formatPrice(itemRefund)}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="mt-3 bg-amber-100 rounded-lg px-4 py-2.5 flex justify-between items-center">
                                            <p className="text-xs font-bold text-amber-900 uppercase tracking-widest">Total Refund Amount</p>
                                            <p className="text-base font-bold text-charcoal">{formatPrice(activeReturn.refundAmount)}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleResolveReturn(true)}
                                        disabled={isUpdating}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                                    >
                                        Approve Return
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleResolveReturn(false)}
                                        disabled={isUpdating}
                                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 flex-1"
                                    >
                                        Reject Return
                                    </Button>
                                </div>
                            </div>
                        );
                    })()}


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

                    {/* Shipping Address */}
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
                    </div>

                    {/* Tracking Info (Admin editable) */}
                    <div className="bg-white rounded-xl border border-border p-6">
                        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Truck size={16} /> Tracking Info
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1">Carrier / Courier</label>
                                <input
                                    type="text"
                                    value={trackingCarrier}
                                    onChange={(e) => setTrackingCarrier(e.target.value)}
                                    placeholder="e.g. Delhivery, Shiprocket"
                                    className="w-full h-9 px-3 text-sm rounded-md border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal placeholder:text-muted/50"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1">AWB / Tracking Number <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={trackingAwb}
                                    onChange={(e) => setTrackingAwb(e.target.value)}
                                    placeholder="e.g. 1234567890"
                                    className="w-full h-9 px-3 text-sm rounded-md border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal placeholder:text-muted/50"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1">Tracking URL <span className="text-muted/60">(optional)</span></label>
                                <input
                                    type="url"
                                    value={trackingUrl}
                                    onChange={(e) => setTrackingUrl(e.target.value)}
                                    placeholder="https://track.delhivery.com/..."
                                    className="w-full h-9 px-3 text-sm rounded-md border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal placeholder:text-muted/50"
                                />
                            </div>
                            <p className="text-[10px] text-muted">Saving will mark the order as <strong>SHIPPED</strong> if not already.</p>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSaveTracking}
                                disabled={!trackingAwb.trim() || !trackingCarrier.trim() || isSavingTracking}
                                className="w-full"
                            >
                                {isSavingTracking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Tracking Info"}
                            </Button>
                        </div>
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
