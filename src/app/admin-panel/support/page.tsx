"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import { mockSupportTickets } from "@/data/admin-mock-data";

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

    const filtered = mockSupportTickets.filter((t) => {
        const matchesTab = activeTab === "ALL" || t.status === activeTab;
        const matchesSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.customerName.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div>
            <PageHeader
                title="Customer Support"
                subtitle={`${mockSupportTickets.filter((t) => t.status === "OPEN").length} open tickets`}
                breadcrumbs={[{ label: "Dashboard", href: "/admin-panel/dashboard" }, { label: "Support" }]}
            />

            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
                {statusTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
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
                    <input type="text" placeholder="Search tickets..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-charcoal" />
                </div>
            </div>

            {/* Tickets */}
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
                            {filtered.map((ticket) => (
                                <tr key={ticket.id} className="border-b border-border/50 last:border-0 hover:bg-gray-50/30">
                                    <td className="px-5 py-4 font-mono text-xs font-semibold text-charcoal">
                                        <Link href={`/admin-panel/support/${ticket.id}`} className="hover:text-emerald">{ticket.ticketNumber}</Link>
                                    </td>
                                    <td className="px-5 py-4">
                                        <Link href={`/admin-panel/support/${ticket.id}`} className="text-sm font-medium text-charcoal hover:text-emerald line-clamp-1">
                                            {ticket.subject}
                                        </Link>
                                        {ticket.orderNumber && <p className="text-xs text-muted">Order: {ticket.orderNumber}</p>}
                                    </td>
                                    <td className="px-5 py-4">
                                        <Link href={`/admin-panel/customers/${ticket.customerId}`} className="text-charcoal hover:text-emerald">
                                            {ticket.customerName}
                                        </Link>
                                    </td>
                                    <td className="px-5 py-4"><StatusBadge type="priority" value={ticket.priority} /></td>
                                    <td className="px-5 py-4"><StatusBadge type="ticket" value={ticket.status} /></td>
                                    <td className="px-5 py-4 text-charcoal">{ticket.assignedTo || <span className="text-muted italic">Unassigned</span>}</td>
                                    <td className="px-5 py-4 text-muted">
                                        {new Date(ticket.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} className="px-5 py-12 text-center text-muted">No tickets match your filters</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
