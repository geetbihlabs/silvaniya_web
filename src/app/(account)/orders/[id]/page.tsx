"use client";

import React from "react";
import Link from "next/link";
import {
    Truck, MapPin, Check, Package, ShoppingBag,
    Copy, Download, MessageSquare, RotateCcw, CreditCard, XCircle, Loader2
} from "lucide-react";
import { ReturnRequestModal } from "@/components/account/orders/ReturnRequestModal";
import { OrderTimeline } from "@/components/account/orders/OrderTimeline";
import { OrderItemsList } from "@/components/account/orders/OrderItemsList";
import { formatPrice } from "@/lib/utils";
import { useOrderStore, PlacedOrder } from "@/store/useOrderStore";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import api from "@/lib/axios";

// ── Helpers & Constants ────────────────────────────────────────────────────────
const STEPS = [
    { key: "placed",    label: "PLACED",          Icon: Check },
    { key: "confirmed", label: "CONFIRMED",        Icon: Check },
    { key: "packed",    label: "PACKED",           Icon: Package },
    { key: "shipped",   label: "SHIPPED",          Icon: Truck },
    { key: "out",       label: "OUT FOR DELIVERY", Icon: MapPin },
    { key: "delivered", label: "DELIVERED",        Icon: ShoppingBag },
];

const SHIPPED_STATUSES = ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

const STATUS_STEPS_MAP: Record<string, number> = {
    "PENDING_PAYMENT": 0,
    "PAYMENT_CONFIRMED": 1,
    "PROCESSING": 2,
    "SHIPPED": 3,
    "OUT_FOR_DELIVERY": 4,
    "DELIVERED": 5
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { getToken, isSignedIn } = useAuth();
    const { fetchOrderById } = useOrderStore();
    const [order, setOrder] = React.useState<PlacedOrder | null>(null);
    const [loading, setLoading] = React.useState(true);

    const [isReturnModalOpen, setIsReturnModalOpen] = React.useState(false);
    const [isSubmittingReturn, setIsSubmittingReturn] = React.useState(false);
    const [isCancelling, setIsCancelling] = React.useState(false);

    React.useEffect(() => {
        if (!isSignedIn || !id) return;
        const loadOrder = async () => {
            setLoading(true);
            const data = await fetchOrderById(id, async () => getToken());
            if (data) setOrder(data);
            setLoading(false);
        };
        loadOrder();
    }, [isSignedIn, id, fetchOrderById, getToken]);

    const handleRequestReturn = async (reason: string, detail: string, items: { orderItemId: string; quantity: number }[]) => {
        setIsSubmittingReturn(true);
        try {
            const token = await getToken();
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            await api.post(`/orders/${id}/returns`, {
                reason,
                reasonDetail: detail,
                refundMode: "WALLET",
                items,
            }, { headers });

            toast.success("Return request submitted successfully");
            setIsReturnModalOpen(false);
            // Refresh order to get updated item statuses
            const data = await fetchOrderById(id, async () => getToken());
            if (data) setOrder(data);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to submit return request");
        } finally {
            setIsSubmittingReturn(false);
        }
    };

    const handleCancelOrder = () => {
        toast(
            (t) => (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "260px" }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "#1a1a1a" }}>
                        Cancel this order?
                    </p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                        This action cannot be undone.
                    </p>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            style={{
                                padding: "6px 14px", borderRadius: "8px", border: "1px solid #e5e7eb",
                                background: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "#374151"
                            }}
                        >
                            Keep Order
                        </button>
                        <button
                            onClick={async () => {
                                toast.dismiss(t.id);
                                setIsCancelling(true);
                                try {
                                    const token = await getToken();
                                    const headers = token ? { Authorization: `Bearer ${token}` } : {};
                                    await api.patch(`/orders/${id}/status`, {
                                        status: "CANCELLED",
                                        note: "Cancelled by customer"
                                    }, { headers });
                                    toast.success("Order cancelled successfully");
                                    setOrder(prev => prev ? { ...prev, status: "CANCELLED" } : null);
                                } catch (err: any) {
                                    toast.error(err.response?.data?.message || "Failed to cancel order");
                                } finally {
                                    setIsCancelling(false);
                                }
                            }}
                            style={{
                                padding: "6px 14px", borderRadius: "8px", border: "none",
                                background: "#ef4444", color: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer"
                            }}
                        >
                            Yes, Cancel
                        </button>
                    </div>
                </div>
            ),
            { duration: Infinity, style: { padding: "14px 16px", borderRadius: "12px" } }
        );
    };

    if (loading) {
        return (
            <div className="bg-[#f5f5f3] min-h-screen py-6 lg:py-10 flex justify-center items-center">
                <p className="text-muted font-medium">Loading Order Details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="bg-[#f5f5f3] min-h-screen py-6 lg:py-10 flex justify-center items-center">
                <p className="text-muted font-medium">Order not found.</p>
            </div>
        );
    }

    const CURRENT_STEP = typeof STATUS_STEPS_MAP[order.status] === 'number' ? STATUS_STEPS_MAP[order.status] : -1;
    const canReturn = order.status === "DELIVERED";
    const canCancel = ["PENDING_PAYMENT", "PAYMENT_CONFIRMED"].includes(order.status);
    const isShipped = SHIPPED_STATUSES.includes(order.status);

    return (
        <div className="bg-[#f5f5f3] min-h-screen py-6 lg:py-10">
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* ======== BREADCRUMB ======== */}
                <nav className="flex items-center gap-1.5 text-[11px] font-medium text-muted uppercase tracking-widest mb-4">
                    <Link href="/" className="hover:text-charcoal transition-colors">Account</Link>
                    <span>/</span>
                    <Link href="/orders" className="hover:text-charcoal transition-colors">Orders</Link>
                    <span>/</span>
                    <span className="text-charcoal">#{order.orderNumber}</span>
                </nav>

                {/* ======== ORDER HEADER ======== */}
                <div className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-5 mb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                        <h1 className="text-[24px] sm:text-[28px] font-bold text-charcoal mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                            Order #{order.orderNumber}
                        </h1>
                        <p className="text-[13px] text-muted">
                            Placed on {new Date(order.createdAt).toLocaleDateString()} &bull; Paid via {order.paymentMethod.replace(/_/g, " ")}
                        </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                        <span className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                            order.status === "CANCELLED"
                                ? "bg-red-50 text-red-600 border-red-200"
                                : order.status === "RETURN_REQUESTED" || order.status === "RETURNED"
                                ? "bg-orange-50 text-orange-600 border-orange-200"
                                : "bg-[#f0f9f7] text-[#107c6f] border-[#107c6f]/20"
                        }`}>
                            <Truck size={12} strokeWidth={2} />
                            {order.status.replace(/_/g, " ")}
                        </span>
                    </div>
                </div>

                {/* ======== MAIN GRID ======== */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

                    {/* ======== LEFT COLUMN ======== */}
                    <div className="space-y-5">

                        {/* Shipping Progress — hidden for terminal/cancelled statuses */}
                        {!["CANCELLED", "RETURN_REQUESTED", "RETURNED"].includes(order.status) && (
                            <div className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-6">
                                <h2 className="text-[15px] font-bold text-charcoal mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                                    Shipping Progress
                                </h2>
                                <div className="flex items-start justify-between">
                                    {STEPS.map((step, i) => {
                                        const done = i < CURRENT_STEP;
                                        const current = i === CURRENT_STEP;
                                        const { Icon } = step;
                                        return (
                                            <div key={step.key} className="flex flex-col items-center flex-1">
                                                <div className="flex items-center w-full">
                                                    {i > 0 && (
                                                        <div className={`h-[2px] flex-1 ${i <= CURRENT_STEP ? "bg-[#107c6f]" : "bg-[#e0e0db]"}`} />
                                                    )}
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${done || current ? "bg-[#107c6f] border-[#107c6f] text-white" : "bg-white border-[#d8d8d2] text-gray-400"}`}>
                                                        <Icon size={13} strokeWidth={2.5} />
                                                    </div>
                                                    {i < STEPS.length - 1 && (
                                                        <div className={`h-[2px] flex-1 ${i < CURRENT_STEP ? "bg-[#107c6f]" : "bg-[#e0e0db]"}`} />
                                                    )}
                                                </div>
                                                <span className={`text-[8px] font-bold uppercase tracking-widest mt-2 text-center leading-tight ${done || current ? "text-[#107c6f]" : "text-gray-400"}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Order Items */}
                        <OrderItemsList order={order} />

                        {/* Tracking History */}
                        <OrderTimeline order={order} />
                    </div>

                    {/* ======== RIGHT COLUMN ======== */}
                    <div className="space-y-4">

                        {/* Shipping Details — only show once shipped */}
                        {isShipped && (
                            <div className="bg-white rounded-xl border border-[#e8e8e4] px-5 py-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Truck size={15} strokeWidth={1.8} className="text-charcoal" />
                                    <h3 className="text-[14px] font-bold text-charcoal">Shipping Details</h3>
                                </div>
                                {order.awbNumber ? (
                                    <div className="space-y-3">
                                        {order.courierPartner && (
                                            <div>
                                                <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Carrier</p>
                                                <p className="text-[13px] font-semibold text-charcoal">{order.courierPartner}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Tracking Number</p>
                                            <div className="flex items-center gap-2">
                                                {order.trackingUrl ? (
                                                    <a
                                                        href={order.trackingUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[13px] font-semibold text-[#107c6f] underline underline-offset-2 hover:text-[#0d6b5f] transition-colors"
                                                    >
                                                        {order.awbNumber}
                                                    </a>
                                                ) : (
                                                    <p className="text-[13px] font-semibold text-charcoal">{order.awbNumber}</p>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(order.awbNumber!);
                                                        toast.success("Tracking number copied!");
                                                    }}
                                                    className="text-muted hover:text-charcoal transition-colors"
                                                    title="Copy tracking number"
                                                >
                                                    <Copy size={13} strokeWidth={1.8} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-[12px] text-muted italic">Tracking information will be added soon.</p>
                                )}
                            </div>
                        )}

                        {/* Delivery Address */}
                        <div className="bg-white rounded-xl border border-[#e8e8e4] px-5 py-5">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin size={15} strokeWidth={1.8} className="text-charcoal" />
                                <h3 className="text-[14px] font-bold text-charcoal">Delivery Address</h3>
                            </div>
                            <div className="text-[13px] text-muted leading-relaxed">
                                <p className="font-semibold text-charcoal mb-0.5">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.line1}</p>
                                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                                <p className="mt-1">{order.shippingAddress.phone}</p>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-charcoal rounded-xl px-5 py-5">
                            <h3 className="text-[14px] font-bold text-white mb-4">Payment Summary</h3>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-white/60">Subtotal</span>
                                    <span className="text-white font-medium">{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-white/60">Shipping</span>
                                    <span className={Number(order.shippingCharge) === 0 ? "text-[#4ecca3] font-semibold" : "text-white font-medium"}>
                                        {Number(order.shippingCharge) === 0 ? "Free" : formatPrice(order.shippingCharge)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[13px]">
                                    <span className="text-white/60">Taxes (incl.)</span>
                                    <span className="text-white font-medium">{formatPrice(order.cgst + order.sgst)}</span>
                                </div>
                            </div>
                            <div className="border-t border-white/10 pt-3 flex justify-between mb-4">
                                <span className="text-[15px] font-bold text-white">Total</span>
                                <span className="text-[15px] font-bold text-white">{formatPrice(order.totalAmount)}</span>
                            </div>
                            <div className="bg-white/10 rounded-lg px-4 py-3 flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/15 rounded-full flex items-center justify-center shrink-0">
                                    <CreditCard size={14} className="text-white/70" strokeWidth={1.8} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/50">Paid via</p>
                                    <p className="text-[12px] text-white font-medium">{order.paymentMethod.replace(/_/g, " ")}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-center gap-2 h-11 border border-[#e8e8e4] bg-white hover:border-charcoal/30 rounded-xl text-[13px] font-semibold text-charcoal transition-colors">
                                <Download size={14} strokeWidth={1.8} />
                                Download Invoice
                            </button>
                            <Link
                                href="/support"
                                className="w-full flex items-center justify-center gap-2 h-11 border border-[#e8e8e4] bg-white hover:border-charcoal/30 rounded-xl text-[13px] font-semibold text-charcoal transition-colors"
                            >
                                <MessageSquare size={14} strokeWidth={1.8} />
                                Contact Support
                            </Link>
                            {canReturn && (
                                <button
                                    onClick={() => setIsReturnModalOpen(true)}
                                    className="w-full flex items-center justify-center gap-2 h-11 border border-charcoal bg-charcoal text-white hover:bg-charcoal/90 rounded-xl text-[13px] font-semibold transition-colors"
                                >
                                    <RotateCcw size={14} strokeWidth={1.8} />
                                    Request Return
                                </button>
                            )}
                            {canCancel && (
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={isCancelling}
                                    className="w-full flex items-center justify-center gap-2 h-11 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl text-[13px] font-semibold transition-colors disabled:opacity-50"
                                >
                                    {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle size={14} strokeWidth={1.8} />}
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ======== RETURN REQUEST MODAL ======== */}
            <ReturnRequestModal
                order={order}
                isOpen={isReturnModalOpen}
                isSubmitting={isSubmittingReturn}
                onClose={() => setIsReturnModalOpen(false)}
                onSubmit={handleRequestReturn}
            />
        </div>
    );
}
