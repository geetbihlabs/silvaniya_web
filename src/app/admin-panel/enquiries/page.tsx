"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Mail,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Tag,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import api from "@/lib/axios";
import PageHeader from "@/components/admin/shared/PageHeader";
import LoadingSpinner from "@/components/admin/shared/LoadingSpinner";
import ErrorBanner from "@/components/admin/shared/ErrorBanner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Enquiry {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  metadata: {
    name: string;
    email: string;
    subject: string;
    message: string;
  } | null;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function EnquiryModal({ enquiry, onClose }: { enquiry: Enquiry; onClose: () => void }) {
  const m = enquiry.metadata;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center">
              <Mail size={15} className="text-teal-600" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-900">
                {m?.subject ?? "Contact Enquiry"}
              </p>
              <p className="text-[11px] text-gray-400">{relativeTime(enquiry.createdAt)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors text-[18px] font-light"
          >
            ×
          </button>
        </div>

        {/* Sender Info */}
        <div className="px-6 py-4 bg-gray-50 grid grid-cols-2 gap-4 border-b border-gray-100">
          <div className="flex items-start gap-2">
            <User size={13} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">From</p>
              <p className="text-[13px] font-semibold text-gray-800">{m?.name ?? "—"}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Mail size={13} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Email</p>
              <a
                href={`mailto:${m?.email}`}
                className="text-[13px] font-semibold text-teal-600 hover:underline break-all"
              >
                {m?.email ?? "—"}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-2 col-span-2">
            <Tag size={13} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Subject</p>
              <p className="text-[13px] font-semibold text-gray-800">{m?.subject ?? "—"}</p>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-1.5 mb-3">
            <MessageSquare size={13} className="text-gray-400" />
            <p className="text-[11px] text-gray-400 uppercase tracking-wide">Message</p>
          </div>
          <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
            {m?.message ?? enquiry.body}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Calendar size={12} />
            {new Date(enquiry.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <a
            href={`mailto:${m?.email}?subject=Re: ${m?.subject}`}
            className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
          >
            <Mail size={13} />
            Reply via Email
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [page, setPage] = useState(1);

  const fetch = useCallback(async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/notifications/enquiries", { params: { page: p, limit: 20 } });
      const wrapper = res.data; // { success, data: [...], meta: {...} }
      setEnquiries(wrapper.data ?? []);
      setMeta(wrapper.meta ?? { page: p, limit: 20, total: 0, totalPages: 1 });
      setPage(p);
    } catch {
      setError("Failed to load enquiries. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(1); }, [fetch]);

  const filtered = search.trim()
    ? enquiries.filter(
        (e) =>
          e.metadata?.name?.toLowerCase().includes(search.toLowerCase()) ||
          e.metadata?.email?.toLowerCase().includes(search.toLowerCase()) ||
          e.metadata?.subject?.toLowerCase().includes(search.toLowerCase()) ||
          e.metadata?.message?.toLowerCase().includes(search.toLowerCase()),
      )
    : enquiries;

  return (
    <div>
      <PageHeader
        title="Contact Enquiries"
        subtitle={`${meta.total} enquiries received`}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-panel/dashboard" },
          { label: "Enquiries" },
        ]}
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-[13px] rounded-lg border border-gray-200 focus:outline-none focus:border-gray-400 bg-white transition-colors"
          />
        </div>
        <button
          onClick={() => fetch(page)}
          className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <ErrorBanner error={error} onDismiss={() => setError(null)} onRetry={() => fetch(page)} className="mb-6" />
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="md" />
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50/60">
                  <th className="px-5 py-3 font-semibold">Sender</th>
                  <th className="px-5 py-3 font-semibold">Subject</th>
                  <th className="px-5 py-3 font-semibold">Message Preview</th>
                  <th className="px-5 py-3 font-semibold">Received</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/40 cursor-pointer"
                    onClick={() => setSelected(e)}
                  >
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-semibold text-gray-800">
                        {e.metadata?.name ?? "—"}
                      </p>
                      <p className="text-[11px] text-gray-400">{e.metadata?.email ?? ""}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 text-teal-700 text-[11px] font-semibold rounded-full">
                        <Tag size={10} />
                        {e.metadata?.subject ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[12px] text-gray-500 max-w-[260px]">
                      <p className="line-clamp-2">{e.metadata?.message ?? e.body}</p>
                    </td>
                    <td className="px-5 py-4 text-[12px] text-gray-400 whitespace-nowrap">
                      {relativeTime(e.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      {e.isRead ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                          <CheckCircle2 size={12} />
                          Read
                        </span>
                      ) : (
                        <span className="inline-block w-2 h-2 rounded-full bg-teal-500" />
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={(ev) => { ev.stopPropagation(); setSelected(e); }}
                        className="text-[12px] font-semibold text-teal-600 hover:text-teal-800 transition-colors"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-gray-400 text-[13px]">
                      {search ? "No enquiries match your search." : "No enquiries received yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <p className="text-[12px] text-gray-400">
                {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of{" "}
                {meta.total} enquiries
              </p>
              <div className="flex gap-2">
                <button
                  disabled={meta.page === 1}
                  onClick={() => fetch(meta.page - 1)}
                  className="flex items-center gap-1 px-3 py-1.5 text-[12px] border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={13} /> Prev
                </button>
                <button
                  disabled={meta.page === meta.totalPages}
                  onClick={() => fetch(meta.page + 1)}
                  className="flex items-center gap-1 px-3 py-1.5 text-[12px] border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selected && <EnquiryModal enquiry={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
