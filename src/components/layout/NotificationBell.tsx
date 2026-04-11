"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Package, Truck, CheckCircle2, RotateCcw, XCircle, CreditCard, MessageSquare, ShieldAlert, BarChart2, Mail } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Notification, notificationService } from "@/services/notificationService";
import { toast } from "react-hot-toast";

// ── Helpers ────────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 30_000;

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
    case "ORDER_CONFIRMED": return <Package className={cls} />;
    case "ORDER_SHIPPED": return <Truck className={cls} />;
    case "ORDER_DELIVERED": return <CheckCircle2 className={cls} />;
    case "RETURN_APPROVED": return <RotateCcw className={cls} />;
    case "RETURN_REJECTED": return <XCircle className={cls} />;
    case "REFUND_PROCESSED": return <CreditCard className={cls} />;
    case "TICKET_REPLY": return <MessageSquare className={cls} />;
    case "TICKET_RESOLVED": return <CheckCheck className={cls} />;
    case "LOW_STOCK_ALERT": return <BarChart2 className={cls} />;
    case "ACCOUNT_ACTIVITY": return <ShieldAlert className={cls} />;
    case "CONTACT_INQUIRY": return <Mail className={cls} />;
    default: return <Bell className={cls} />;
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
    case "CONTACT_INQUIRY":
      return "text-teal-600 bg-teal-50";
    default:
      return "text-slate-600 bg-slate-100";
  }
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function NotifSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-3 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-1/3" />
      </div>
    </div>
  );
}

// ── Notification Item ─────────────────────────────────────────────────────────

function NotifItem({ notif, onRead }: { notif: Notification; onRead: (n: Notification) => void }) {
  const router = useRouter();

  function handleClick() {
    onRead(notif);
    const orderId = notif.metadata?.orderId;
    if (orderId) router.push(`/orders/${orderId}`);
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full flex gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${!notif.isRead ? "bg-emerald-50/30" : ""}`}
    >
      {/* Icon badge */}
      <span className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${typeColor(notif.type)}`}>
        {typeIcon(notif.type)}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-body leading-snug ${notif.isRead ? "text-charcoal/70 font-normal" : "text-charcoal font-semibold"}`}>
          {notif.title}
        </p>
        <p className="text-[12px] font-body text-muted leading-relaxed mt-0.5 line-clamp-2">
          {notif.body}
        </p>
        <p className="text-[11px] font-body text-muted-light mt-1">
          {relativeTime(notif.createdAt)}
        </p>
      </div>

      {/* Unread dot */}
      {!notif.isRead && (
        <span className="mt-2 w-2 h-2 rounded-full bg-emerald shrink-0" />
      )}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function NotificationBell() {
  const { isSignedIn, getToken } = useAuth();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  const getTokenCb = useCallback(() => getToken(), [getToken]);

  // Initial fetch + interval polling for unread count
  useEffect(() => {
    if (!isSignedIn) return;
    fetchUnreadCount(getTokenCb);
    const interval = setInterval(() => fetchUnreadCount(getTokenCb), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isSignedIn, getTokenCb, fetchUnreadCount]);

  // Track unread count to show toast
  const prevUnreadRef = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (prevUnreadRef.current !== null && unreadCount > prevUnreadRef.current) {
      getTokenCb().then((token) => {
        notificationService.getMyNotifications(token, 1, 5).then((res) => {
          const latest = res.data[0];
          if (latest && !latest.isRead) {
            toast.custom(
              (t) => (
                <div
                  className={`${
                    t.visible ? 'animate-enter' : 'animate-leave'
                  } max-w-md w-full bg-white shadow-xl rounded-xl pointer-events-auto flex items-start p-4 cursor-pointer hover:bg-slate-50 border border-border/50`}
                  onClick={() => {
                    toast.dismiss(t.id);
                    router.push("/notifications");
                  }}
                >
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4 ${typeColor(latest.type)}`}>
                    {typeIcon(latest.type)}
                  </span>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-charcoal">{latest.title}</p>
                    <p className="mt-1 text-[12px] text-muted line-clamp-2 leading-relaxed">
                      {latest.body}
                    </p>
                  </div>
                </div>
              ),
              { duration: 6000, position: "bottom-right" }
            );
          }
        });
      });
    }
    prevUnreadRef.current = unreadCount;
  }, [unreadCount, getTokenCb, router]);

  // Fetch full list when dropdown opens
  useEffect(() => {
    if (open && isSignedIn) {
      fetchNotifications(getTokenCb);
    }
  }, [open, isSignedIn, getTokenCb, fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  if (!isSignedIn) return null;

  const preview = notifications.slice(0, 5);

  return (
    <div ref={panelRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative flex items-center text-charcoal transition-colors duration-300 hover:text-emerald"
      >
        <Bell size={20} strokeWidth={1.6} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-[#e84c4c] text-white text-[10px] font-bold h-4 min-w-[16px] flex items-center justify-center rounded-full px-1 z-10">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+12px)] w-[340px] bg-white rounded-2xl shadow-2xl border border-border z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell size={15} className="text-charcoal" />
              <span className="text-[14px] font-heading font-semibold text-charcoal">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[11px] font-body text-white bg-[#e84c4c] rounded-full px-2 py-0.5">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead(getTokenCb)}
                className="flex items-center gap-1 text-[11px] font-body text-emerald hover:text-emerald/70 transition-colors"
              >
                <CheckCheck size={12} />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-border/50">
            {isLoading ? (
              <>
                <NotifSkeleton />
                <NotifSkeleton />
                <NotifSkeleton />
              </>
            ) : preview.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <Bell size={32} className="text-muted-light/50" strokeWidth={1.2} />
                <p className="text-[13px] font-body text-muted">You&apos;re all caught up!</p>
              </div>
            ) : (
              preview.map((n) => (
                <NotifItem
                  key={n.id}
                  notif={n}
                  onRead={(item) => {
                    if (!item.isRead) markAsRead(item.id, getTokenCb);
                    setOpen(false);
                  }}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-4 py-3">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="block text-center text-[12px] font-body font-semibold text-emerald hover:text-emerald/70 transition-colors"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
