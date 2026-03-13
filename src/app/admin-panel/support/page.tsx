"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import ErrorBanner from "@/components/admin/shared/ErrorBanner";
import LoadingSpinner from "@/components/admin/shared/LoadingSpinner";
import { useSupportStore } from "@/store/useSupportStore";
import { TicketStatus } from "@/types/admin.types";

const statusTabs = [
    { label: "All", value: "ALL" },
    { label: "Open", value: "OPEN" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Waiting", value: "WAITING_ON_CUSTOMER" },
    { label: "Resolved", value: "RESOLVED" },
];

export default function AdminSupportPage() {
    const [activeTab, setActiveTab] = useState("ALL");
    const [search, setSearch] = useState("");
    
    const { 
        tickets, 
        loading, 
        error, 
        pagination, 
        fetchTickets, 
        setFilters,
        clearError
    } = useSupportStore();

    // Fetch tickets on mount and when filters change
    useEffect(() => {
        const filters: any = {};
        if (activeTab !== "ALL") {
            filters.status = activeTab as TicketStatus;
        }
        if (search) {
            filters.search = search;
        }
        
        setFilters(filters);
        fetchTickets({ page: 1, limit: 20, ...filters });
    }, [activeTab, search, fetchTickets, setFilters]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleTabChange = (tabValue: string) => {
        setActiveTab(tabValue);
    };

    const openTicketsCount = tickets.filter(t => t.status === "OPEN").length;

    return (
        <div>
            <PageHeader
                title="Customer Support"
                subtitle={`${openTicketsCount} open tickets`}
                breadcrumbs={[{ label: "Dashboard", href: "/admin-panel/dashboard" }, { label: "Support" }]}
            />

            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
                {statusTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${activeTab === tab.value ? "bg-charcoal text-white" : "bg-white text-muted border border-border hover:text-charcoal"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-border p-4 mb-6">
                <div className="relative max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input 
                        type="text" 
                        placeholder="Search tickets..." 
                        value={search} 
                        onChange={handleSearch}
                        className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-charcoal" 
                    />
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <LoadingSpinner size="md" />
                </div>
            )}

            {/* Error State */}
            {error && (
                <ErrorBanner 
                    error={error}
                    onDismiss={clearError}
                    onRetry={() => {
                        const filters: any = {};
                        if (activeTab !== "ALL") {
                            filters.status = activeTab as TicketStatus;
                        }
                        if (search) {
                            filters.search = search;
                        }
                        fetchTickets({ page: 1, limit: 20, ...filters });
                    }}
                    className="mb-6"
                />
            )}

            {/* Tickets */}
            {!loading && (
                <div className="bg-white rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-[11px] text-muted uppercase tracking-wider border-b border-border bg-gray-50/50">
                                    <th className="px-5 py-3 font-semibold">Ticket</th>
                                    <th className="px-5 py-3 font-semibold">Subject</th>
                                    <th className="px-5 py-3 font-semibold">Customer</th>
                                    <th className="px-5 py-3 font-semibold">Priority</th>
                                    <th className="px-5 py-3 font-semibold">Status</th>
                                    <th className="px-5 py-3 font-semibold">Assigned</th>
                                    <th className="px-5 py-3 font-semibold">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-b border-border/50 last:border-0 hover:bg-gray-50/30">
                                        <td className="px-5 py-4 font-mono text-xs font-semibold text-charcoal">
                                            <Link href={`/admin-panel/support/${ticket.id}`} className="hover:text-emerald">
                                                {ticket.ticketNumber}
                                            </Link>
                                        </td>
                                        <td className="px-5 py-4">
                                            <Link href={`/admin-panel/support/${ticket.id}`} className="text-sm font-medium text-charcoal hover:text-emerald line-clamp-1">
                                                {ticket.subject}
                                            </Link>
                                            {ticket.orderNumber && <p className="text-xs text-muted">Order: {ticket.orderNumber}</p>}
                                        </td>
                                        <td className="px-5 py-4">
                                            <Link href={`/admin-panel/customers/${ticket.userId}`} className="text-charcoal hover:text-emerald">
                                                {ticket.customerName}
                                            </Link>
                                        </td>
                                        <td className="px-5 py-4"><StatusBadge type="priority" value={ticket.priority} /></td>
                                        <td className="px-5 py-4"><StatusBadge type="ticket" value={ticket.status} /></td>
                                        <td className="px-5 py-4 text-charcoal">
                                            {ticket.assignedTo || <span className="text-muted italic">Unassigned</span>}
                                        </td>
                                        <td className="px-5 py-4 text-muted">
                                            {new Date(ticket.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                        </td>
                                    </tr>
                                ))}
                                {tickets.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-12 text-center text-muted">
                                            {search || activeTab !== "ALL" 
                                                ? "No tickets match your filters" 
                                                : "No tickets found"
                                            }
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between px-5 py-4 border-t border-border">
                            <div className="text-sm text-muted">
                                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tickets
                            </div>
                            <div className="flex gap-2">
                                <button
                                    disabled={pagination.page === 1}
                                    onClick={() => fetchTickets({ page: pagination.page - 1 })}
                                    className="px-3 py-1 text-sm border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <button
                                    disabled={pagination.page === pagination.totalPages}
                                    onClick={() => fetchTickets({ page: pagination.page + 1 })}
                                    className="px-3 py-1 text-sm border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
