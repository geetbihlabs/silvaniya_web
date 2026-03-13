"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AdminOrderStatus, TicketStatus, TicketPriority } from "@/types/admin.types";

type BadgeType = "order" | "ticket" | "priority" | "visibility" | "payment" | "loyalty" | "customer" | "review";

interface StatusBadgeProps {
    type: BadgeType;
    value: string;
    className?: string;
}

const orderStatusColors: Record<AdminOrderStatus, string> = {
    PENDING_PAYMENT: "bg-yellow-50 text-yellow-700 border-yellow-200",
    PAYMENT_CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    PROCESSING: "bg-orange-50 text-orange-700 border-orange-200",
    QUALITY_CHECK: "bg-purple-50 text-purple-700 border-purple-200",
    SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
    OUT_FOR_DELIVERY: "bg-cyan-50 text-cyan-700 border-cyan-200",
    DELIVERED: "bg-green-50 text-green-700 border-green-200",
    RETURN_REQUESTED: "bg-rose-50 text-rose-700 border-rose-200",
    RETURN_APPROVED: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    RETURN_REJECTED: "bg-gray-100 text-gray-700 border-gray-300",
    RETURNED: "bg-gray-200 text-gray-800 border-gray-400",
    REFUNDED: "bg-gray-100 text-gray-600 border-gray-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const ticketStatusColors: Record<TicketStatus, string> = {
    OPEN: "bg-red-50 text-red-700 border-red-200",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
    WAITING_ON_CUSTOMER: "bg-yellow-50 text-yellow-700 border-yellow-200",
    RESOLVED: "bg-green-50 text-green-700 border-green-200",
    CLOSED: "bg-gray-100 text-gray-600 border-gray-200",
};

const priorityColors: Record<TicketPriority, string> = {
    URGENT: "bg-red-100 text-red-700 border-red-300",
    HIGH: "bg-orange-50 text-orange-700 border-orange-200",
    NORMAL: "bg-blue-50 text-blue-700 border-blue-200",
    LOW: "bg-gray-100 text-gray-600 border-gray-200",
};

function formatLabel(value: string): string {
    if (!value) return "";
    return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function StatusBadge({ type, value, className }: StatusBadgeProps) {
    let colorClass = "bg-gray-100 text-gray-600 border-gray-200";

    if (type === "order") colorClass = orderStatusColors[value as AdminOrderStatus] || colorClass;
    else if (type === "ticket") colorClass = ticketStatusColors[value as TicketStatus] || colorClass;
    else if (type === "priority") colorClass = priorityColors[value as TicketPriority] || colorClass;
    else if (type === "visibility") {
        colorClass = value === "PUBLISHED" ? "bg-green-50 text-green-700 border-green-200"
            : value === "DRAFT" ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : "bg-gray-100 text-gray-600 border-gray-200";
    } else if (type === "payment") {
        colorClass = value === "PAID" ? "bg-green-50 text-green-700 border-green-200"
            : value === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : value === "FAILED" ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-gray-100 text-gray-600 border-gray-200";
    } else if (type === "loyalty") {
        colorClass = value === "PLATINUM" ? "bg-purple-50 text-purple-700 border-purple-200"
            : value === "GOLD" ? "bg-amber-50 text-amber-700 border-amber-200"
                : value === "SILVER" ? "bg-gray-100 text-gray-600 border-gray-200"
                    : "bg-orange-50 text-orange-700 border-orange-200";
    } else if (type === "customer") {
        colorClass = value === "ACTIVE" ? "bg-green-50 text-green-700 border-green-200"
            : value === "BLOCKED" ? "bg-red-50 text-red-700 border-red-200"
                : "bg-gray-100 text-gray-600 border-gray-200";
    } else if (type === "review") {
        colorClass = value === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-200"
            : value === "APPROVED" ? "bg-green-50 text-green-700 border-green-200"
                : value === "REJECTED" ? "bg-red-50 text-red-700 border-red-200"
                    : value === "FLAGGED" ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-gray-100 text-gray-600 border-gray-200";
    }

    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide",
            colorClass,
            className
        )}>
            {formatLabel(value)}
        </span>
    );
}
