"use client";

import React, { useEffect, useCallback, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import PageHeader from "@/components/admin/shared/PageHeader";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Notification } from "@/services/notificationService";

// ── Helpers ───────────────────────────────────────────────────────────────────

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
  const cls = "w-4 h-4";
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
  return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Filter tabs ───────────────────────────────────────────────────────────────

const FILTER_TABS = [
  { label: "All",    value: "ALL" },
  { label: "Unread", value: "UNREAD" },
  { label: "Read",   value: "READ" },
];

// ── Row ───────────────────────────────────────────────────────────────────────

function NotifRow({
  notif,
  onMarkRead,
}: {
  notif: Notification;
  onMarkRead: (n: Notification) => void;
}) {
  const router = useRouter();

  function handleView() {
    if (!notif.isRead) onMarkRead(notif);
    const orderId = notif.metadata?.orderId;
    if (orderId) router.push(`/admin-panel/orders/${orderId}`);
  }

  return (
    <tr className={`border-b border-border/50 last:border-0 hover:bg-gray-50/30 transition-colors ${!notif.isRead ? "bg-blue-50/20" : ""}`}>
      {/* Type icon + label */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${typeColor(notif.type)}`}>
            {typeIcon(notif.type)}
          </span>
          <span className="text-[11px] font-semibold text-muted whitespace-nowrap">
            {typeLabel(notif.type)}
          </span>
        </div>
      </td>

      {/* Title + body */}
      <td className="px-5 py-4 max-w-xs">
        <p className={`text-sm leading-snug ${notif.isRead ? "text-charcoal/70 font-normal" : "text-charcoal font-semibold"}`}>
          {notif.title}
        </p>
        <p className="text-xs text-muted mt-0.5 line-clamp-2 leading-relaxed">{notif.body}</p>
      </td>

      {/* User ID (metadata) */}
      <td className="px-5 py-4 text-xs text-muted">
        {notif.metadata?.orderId ? (
          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
            {notif.metadata.orderId.slice(0, 8)}…
          </span>
        ) : (
          <span className="text-muted-light">—</span>
        )}
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        {notif.isRead ? (
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
            Read
          </span>
        ) : (
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-600">
            Unread
          </span>
        )}
      </td>

      {/* Time */}
      <td className="px-5 py-4 text-xs text-muted whitespace-nowrap">
        {relativeTime(notif.createdAt)}
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <button
          onClick={handleView}
          title={notif.metadata?.orderId ? "View Order" : "Mark as read"}
          className="p-1.5 rounded-md text-muted hover:text-charcoal hover:bg-gray-100 transition-colors"
        >
          <Eye size={15} />
        </button>
      </td>
    </tr>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-b border-border/50 animate-pulse">
          <td className="px-5 py-4"><div className="flex gap-2 items-center"><div className="w-7 h-7 rounded-full bg-slate-200" /><div className="h-3 bg-slate-200 rounded w-20" /></div></td>
          <td className="px-5 py-4"><div className="h-3.5 bg-slate-200 rounded w-40 mb-2" /><div className="h-3 bg-slate-100 rounded w-56" /></td>
          <td className="px-5 py-4"><div className="h-3 bg-slate-100 rounded w-16" /></td>
          <td className="px-5 py-4"><div className="h-5 bg-slate-100 rounded-full w-12" /></td>
          <td className="px-5 py-4"><div className="h-3 bg-slate-100 rounded w-14" /></td>
          <td className="px-5 py-4"><div className="h-6 w-6 bg-slate-100 rounded" /></td>
        </tr>
      ))}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminNotificationsPage() {
  const { isLoaded, getToken } = useAuth();
  const [filterTab, setFilterTab] = useState("ALL");
  const {
    notifications,
    unreadCount,
    currentPage,
    totalPages,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  const getTokenCb = useCallback(() => getToken(), [getToken]);

  useEffect(() => {
    if (isLoaded) fetchNotifications(getTokenCb, 1);
  }, [isLoaded, getTokenCb, fetchNotifications]);

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;
    fetchNotifications(getTokenCb, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Client-side filter (unread/read tab) — the list comes from the store already paginated
  const filtered = notifications.filter((n) => {
    if (filterTab === "UNREAD") return !n.isRead;
    if (filterTab === "READ")   return n.isRead;
    return true;
  });

  const pageNumbers: number[] = (() => {
    const pages: number[] = [];
    const delta = 2;
    const from = Math.max(1, currentPage - delta);
    const to   = Math.min(totalPages, currentPage + delta);
    for (let i = from; i <= to; i++) pages.push(i);
    return pages;
  })();

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`${notifications.length} notifications · ${unreadCount} unread`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-panel/dashboard" },
          { label: "Notifications" },
        ]}
        actions={
          unreadCount > 0 ? (
            <button
              onClick={() => markAllAsRead(getTokenCb)}
              className="flex items-center gap-2 h-9 px-4 border border-border rounded-lg text-sm font-medium text-charcoal bg-white hover:bg-gray-50 transition-colors"
            >
              <CheckCheck size={15} />
              Mark all read
              <span className="bg-[#e84c4c] text-white text-[11px] font-bold rounded-full px-1.5 py-0.5 ml-1">
                {unreadCount}
              </span>
            </button>
          ) : undefined
        }
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterTab(tab.value)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
              filterTab === tab.value
                ? "bg-charcoal text-white"
                : "bg-white text-muted border border-border hover:text-charcoal"
            }`}
          >
            {tab.label}
            {tab.value === "UNREAD" && unreadCount > 0 && (
              <span className="ml-1.5 bg-[#e84c4c] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-muted uppercase tracking-wider border-b border-border bg-gray-50/50">
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Message</th>
                <th className="px-5 py-3 font-semibold">Order Ref</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Time</th>
                <th className="px-5 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                        <Bell size={24} className="text-muted-light/60" strokeWidth={1.2} />
                      </div>
                      <p className="text-sm text-muted">
                        {filterTab === "UNREAD" ? "No unread notifications" : "No notifications found"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((n: Notification) => (
                  <NotifRow
                    key={n.id}
                    notif={n}
                    onMarkRead={(item) => markAsRead(item.id, getTokenCb)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-gray-50/30">
          <p className="text-xs text-muted">
            {isLoading ? (
              <span className="flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Loading…</span>
            ) : (
              `Showing ${filtered.length} of ${notifications.length} notifications`
            )}
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="p-1.5 rounded-md text-muted hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={isLoading}
                  className={`px-3 py-1.5 text-xs rounded-md font-semibold transition-colors ${
                    page === currentPage
                      ? "bg-charcoal text-white"
                      : "text-muted hover:bg-gray-100 disabled:opacity-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="p-1.5 rounded-md text-muted hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
