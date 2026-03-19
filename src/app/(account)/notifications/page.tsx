"use client";

import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Package,
  Truck,
  CheckCircle2,
  RotateCcw,
  XCircle,
  CreditCard,
  MessageSquare,
  ShieldAlert,
  BarChart2,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Notification } from "@/services/notificationService";

// ── Helpers ────────────────────────────────────────────────────────────────────

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function typeIcon(type: string) {
  const cls = "w-5 h-5";
  switch (type) {
    case "ORDER_CONFIRMED":  return <Package       className={cls} />;
    case "ORDER_SHIPPED":    return <Truck         className={cls} />;
    case "ORDER_DELIVERED":  return <CheckCircle2  className={cls} />;
    case "RETURN_APPROVED":  return <RotateCcw     className={cls} />;
    case "RETURN_REJECTED":  return <XCircle       className={cls} />;
    case "REFUND_PROCESSED": return <CreditCard    className={cls} />;
    case "TICKET_REPLY":     return <MessageSquare className={cls} />;
    case "TICKET_RESOLVED":  return <CheckCheck    className={cls} />;
    case "LOW_STOCK_ALERT":  return <BarChart2     className={cls} />;
    case "ACCOUNT_ACTIVITY": return <ShieldAlert   className={cls} />;
    default:                 return <Bell          className={cls} />;
  }
}

function typeColor(type: string): string {
  switch (type) {
    case "ORDER_CONFIRMED":
    case "ORDER_DELIVERED":
    case "RETURN_APPROVED":
    case "TICKET_RESOLVED":
      return "text-emerald-600 bg-emerald-50";
    case "ORDER_SHIPPED":
      return "text-blue-600 bg-blue-50";
    case "RETURN_REJECTED":
      return "text-red-600 bg-red-50";
    case "REFUND_PROCESSED":
      return "text-amber-600 bg-amber-50";
    default:
      return "text-slate-600 bg-slate-100";
  }
}

function typeLabel(type: string): string {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function NotifSkeleton() {
  return (
    <div className="flex gap-4 p-5 animate-pulse border-b border-border/50">
      <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-4 bg-slate-200 rounded w-2/5" />
        <div className="h-3.5 bg-slate-100 rounded w-full" />
        <div className="h-3.5 bg-slate-100 rounded w-4/5" />
        <div className="h-3 bg-slate-100 rounded w-1/4 mt-1" />
      </div>
    </div>
  );
}

// ── Notification Row ──────────────────────────────────────────────────────────

function NotifRow({ notif, onRead }: { notif: Notification; onRead: (n: Notification) => void }) {
  const router = useRouter();

  function handleClick() {
    onRead(notif);
    const orderId = notif.metadata?.orderId;
    if (orderId) router.push(`/orders/${orderId}`);
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full flex gap-4 p-5 text-left border-b border-border/50 last:border-0 transition-colors hover:bg-slate-50/80 ${
        !notif.isRead ? "bg-emerald-50/20" : ""
      }`}
    >
      <span className={`mt-0.5 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${typeColor(notif.type)}`}>
        {typeIcon(notif.type)}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-[13px] font-body ${!notif.isRead ? "font-semibold text-charcoal" : "font-normal text-charcoal/70"}`}>
            {notif.title}
          </span>
          <span className="hidden sm:inline text-[11px] font-body text-muted-light bg-slate-100 rounded-full px-2 py-0.5">
            {typeLabel(notif.type)}
          </span>
        </div>
        <p className="text-[13px] font-body text-muted leading-relaxed">{notif.body}</p>
        <p className="text-[11px] font-body text-muted-light mt-1.5">{relativeTime(notif.createdAt)}</p>
      </div>

      {!notif.isRead && (
        <span className="mt-2 w-2.5 h-2.5 rounded-full bg-emerald shrink-0" />
      )}
    </button>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
        <Bell size={36} className="text-muted-light/60" strokeWidth={1.2} />
      </div>
      <div className="text-center">
        <p className="text-[16px] font-heading font-semibold text-charcoal mb-1">All caught up!</p>
        <p className="text-[14px] font-body text-muted">
          No notifications yet. We&apos;ll let you know when something happens.
        </p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const { isSignedIn, getToken } = useAuth();
  const {
    notifications,
    unreadCount,
    currentPage,
    totalPages,
    isLoading,
    fetchNotifications,
    markAllAsRead,
    markAsRead,
  } = useNotificationStore();

  const getTokenCb = useCallback(() => getToken(), [getToken]);

  useEffect(() => {
    if (isSignedIn) fetchNotifications(getTokenCb, 1);
  }, [isSignedIn, getTokenCb, fetchNotifications]);

  function handlePrev() {
    if (currentPage > 1) fetchNotifications(getTokenCb, currentPage - 1);
  }
  function handleNext() {
    if (currentPage < totalPages) fetchNotifications(getTokenCb, currentPage + 1);
  }

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1
            className="text-[36px] sm:text-[44px] font-bold text-charcoal leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Notifications
          </h1>
          <p className="text-[13px] text-muted mt-1 max-w-[420px] leading-relaxed">
            Stay up to date with your orders, returns, and account activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead(getTokenCb)}
            className="flex items-center gap-2 h-9 px-4 border border-[#d8d8d2] rounded-lg text-[13px] font-medium text-charcoal bg-white hover:border-charcoal/40 transition-colors self-start shrink-0"
          >
            <CheckCheck size={14} strokeWidth={2} />
            Mark all as read
            <span className="ml-1 bg-[#e84c4c] text-white text-[11px] font-bold rounded-full px-1.5 py-0.5">
              {unreadCount}
            </span>
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="bg-white border border-[#e8e8e4] rounded-xl overflow-hidden">
        {isLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => <NotifSkeleton key={i} />)}
          </>
        ) : notifications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-border/40">
            {notifications.map((n) => (
              <NotifRow
                key={n.id}
                notif={n}
                onRead={(item) => {
                  if (!item.isRead) markAsRead(item.id, getTokenCb);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentPage <= 1}
            className="flex items-center gap-2 h-9 px-5 border border-[#d8d8d2] rounded-full text-[13px] font-semibold text-charcoal bg-white hover:border-charcoal/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <span className="text-[13px] font-body text-muted">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-2 h-9 px-5 border border-[#d8d8d2] rounded-full text-[13px] font-semibold text-charcoal bg-white hover:border-charcoal/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
