"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { mockOrders } from "@/data/mock-data";
import { formatPrice } from "@/lib/utils";
import { OrderStatus } from "@/types/order.types";

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState<"ALL" | "PROCESSING" | "DELIVERED">("ALL");

    const filteredOrders = mockOrders.filter((order) => {
        if (activeTab === "ALL") return true;
        if (activeTab === "PROCESSING") return ["PENDING", "PROCESSING", "SHIPPED"].includes(order.status);
        return order.status === activeTab;
    });

    const getStatusBadge = (status: OrderStatus) => {
        switch (status) {
            case "DELIVERED":
                return <Badge variant="success">Delivered</Badge>;
            case "SHIPPED":
                return <Badge variant="info">Shipped</Badge>;
            case "PROCESSING":
            case "PENDING":
                return <Badge variant="warning">Processing</Badge>;
            case "CANCELLED":
            case "RETURNED":
                return <Badge variant="error" className="bg-red-50 text-red-700">Cancelled</Badge>;
            default:
                return <Badge variant="muted">{status}</Badge>;
        }
    };

    return (
        <div className="max-w-4xl px-4 sm:px-0">
            <h1 className="text-2xl font-semibold text-charcoal mb-4 sm:mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                Order History
            </h1>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-border mb-6 sm:mb-8 overflow-x-auto hide-scrollbar">
                {(["ALL", "PROCESSING", "DELIVERED"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-medium transition-colors border-b-2 capitalize whitespace-nowrap ${activeTab === tab
                            ? "border-charcoal text-charcoal"
                            : "border-transparent text-muted hover:text-charcoal"
                            }`}
                    >
                        {tab === "ALL" ? "All Orders" : tab.toLowerCase()}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl border border-border overflow-hidden mb-4 sm:mb-0">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
                                <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-start sm:items-center gap-x-2 sm:gap-x-8 gap-y-2">
                                    <div>
                                        <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-0.5">Order Placed</p>
                                        <p className="text-[13px] sm:text-sm font-medium text-charcoal whitespace-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric", month: "short", year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-0.5">Total</p>
                                        <p className="text-[13px] sm:text-sm font-medium text-charcoal whitespace-nowrap">{formatPrice(order.totalAmount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-0.5">Ship To</p>
                                        <p className="text-[13px] sm:text-sm font-medium text-emerald hover:underline cursor-pointer whitespace-nowrap truncate max-w-[80px] sm:max-w-none">
                                            {order.shippingAddress.fullName}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:items-end gap-1 mt-1 sm:mt-0 pt-3 sm:pt-0 border-t border-border/50 sm:border-0">
                                    <span className="text-sm font-semibold text-charcoal">#{order.orderNumber}</span>
                                    <div className="flex items-center gap-3">
                                        <Link href={`/orders/${order.id}`} className="text-xs text-muted hover:text-emerald hover:underline flex items-center gap-1">
                                            View Details <ChevronRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Order Status Bar */}
                            <div className="px-6 pt-5 pb-0">
                                <div className="flex items-center gap-3 mb-4">
                                    {getStatusBadge(order.status)}
                                    <span className="text-xs text-muted font-medium">
                                        {order.status === "DELIVERED" && order.deliveredAt
                                            ? `On ${new Date(order.deliveredAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}`
                                            : order.estimatedDelivery
                                                ? `Expected by ${new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`
                                                : ""}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                                {order.items.map((item, index) => (
                                    <div key={item.id} className={`flex gap-3 sm:gap-6 py-4 ${index !== order.items.length - 1 ? "border-b border-border/50" : ""}`}>
                                        {/* Img */}
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center text-xs text-muted">
                                            Product Img
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between gap-4">
                                            <div>
                                                <Link href={`/products/${item.productId}`}>
                                                    <h4 className="text-base font-medium text-charcoal hover:text-emerald line-clamp-2 mb-1 cursor-pointer">
                                                        {item.productName}
                                                    </h4>
                                                </Link>
                                                {item.variantInfo && <p className="text-xs text-muted">{item.variantInfo}</p>}
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-sm font-bold text-charcoal">{formatPrice(item.unitPrice)}</span>
                                                    <span className="text-xs text-muted">Qty: {item.quantity}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 sm:items-end w-full sm:w-40 shrink-0 mt-3 sm:mt-0">
                                                <Button variant="outline" size="sm" className="w-full text-xs h-8">Need Help?</Button>
                                                <Button variant="primary" size="sm" className="w-full text-xs h-8">Track Package</Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-xl border border-border p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mx-auto mb-4 text-emerald">
                            <Package size={28} />
                        </div>
                        <h3 className="text-lg font-semibold text-charcoal mb-2">No orders found</h3>
                        <p className="text-sm text-muted mb-6 max-w-sm mx-auto">
                            Looks like you haven&apos;t placed any orders in this category yet.
                        </p>
                        <Button variant="primary" asChild>
                            <Link href="/products">Start Shopping</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
