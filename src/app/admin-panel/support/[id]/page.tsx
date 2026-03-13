"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { use } from "react";
import { Send, Lock, ShoppingCart, IndianRupee, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import ErrorBanner from "@/components/admin/shared/ErrorBanner";
import LoadingSpinner from "@/components/admin/shared/LoadingSpinner";
import { useSupportStore } from "@/store/useSupportStore";
import supportService from "@/services/support.service";
import { formatPrice } from "@/lib/utils";
import { TicketStatus } from "@/types/admin.types";

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [replyText, setReplyText] = useState("");
    const [isInternalNote, setIsInternalNote] = useState(false);
    const [showCannedResponses, setShowCannedResponses] = useState(false);
    const [cannedResponses, setCannedResponses] = useState<any[]>([]);
    
    const { 
        currentTicket, 
        loading, 
        error, 
        fetchTicketById, 
        replyToTicket,
        updateTicketStatus,
        clearError
    } = useSupportStore();

    // Fetch ticket data on mount
    useEffect(() => {
        fetchTicketById(id);
    }, [id, fetchTicketById]);

    // Fetch canned responses
    useEffect(() => {
        const fetchCannedResponses = async () => {
            try {
                const responses = await supportService.getCannedResponses();
                setCannedResponses(responses);
            } catch (err) {
                console.error("Failed to fetch canned responses:", err);
            }
        };
        
        fetchCannedResponses();
    }, []);

    const handleStatusChange = async (newStatus: TicketStatus) => {
        try {
            await updateTicketStatus(id, newStatus);
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const handleReplySubmit = async () => {
        if (!replyText.trim()) return;
        
        try {
            await replyToTicket(id, {
                body: replyText,
                isInternalNote
            });
            setReplyText("");
            setIsInternalNote(false);
        } catch (err) {
            console.error("Failed to send reply:", err);
        }
    };

    const insertCannedResponse = (body: string) => {
        setReplyText(prev => prev + (prev ? "\n\n" : "") + body);
        setShowCannedResponses(false);
    };

    if (loading && !currentTicket) {
        return (
            <div className="flex justify-center items-center h-96">
                <LoadingSpinner size="md" />
            </div>
        );
    }

    if (error && !currentTicket) {
        return (
            <ErrorBanner 
                error={error}
                onDismiss={clearError}
                onRetry={() => fetchTicketById(id)}
            />
        );
    }

    if (!currentTicket) {
        return (
            <div className="text-center py-12">
                <p className="text-muted">Ticket not found</p>
            </div>
        );
    }

    const ticket = currentTicket;
    const customer = ticket.user;
    const relatedOrder = ticket.order;

    return (
        <div>
            <PageHeader
                title={ticket.ticketNumber}
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin-panel/dashboard" },
                    { label: "Support", href: "/admin-panel/support" },
                    { label: ticket.ticketNumber },
                ]}
                actions={
                    <>
                        <select 
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                            className="h-9 px-3 text-xs rounded-lg border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal font-semibold"
                        >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="WAITING_ON_CUSTOMER">Waiting on Customer</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                        <Button 
                            variant="emerald" 
                            size="sm"
                            onClick={() => handleStatusChange("RESOLVED")}
                        >
                            Mark Resolved
                        </Button>
                    </>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Thread */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Ticket Info */}
                    <div className="bg-white rounded-xl border border-border p-6">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <StatusBadge type="priority" value={ticket.priority} />
                            <StatusBadge type="ticket" value={ticket.status} />
                            {ticket.assignedTo && (
                                <span className="text-xs text-muted">
                                    Assigned to <strong className="text-charcoal">{ticket.assignedTo}</strong>
                                </span>
                            )}
                            {ticket.slaBreached && (
                                <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full font-semibold">
                                    SLA Breached
                                </span>
                            )}
                        </div>
                        <h2 className="text-lg font-bold text-charcoal mb-2">{ticket.subject}</h2>
                        <p className="text-sm text-muted leading-relaxed">{ticket.description || "No description provided"}</p>
                        <div className="mt-4 pt-4 border-t border-border text-xs text-muted">
                            <div className="flex gap-4">
                                <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
                                {ticket.resolvedAt && (
                                    <span>Resolved: {new Date(ticket.resolvedAt).toLocaleString()}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Conversation Thread */}
                    <div className="bg-white rounded-xl border border-border">
                        <div className="p-5 border-b border-border">
                            <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">Conversation</h3>
                        </div>
                        <div className="p-5 space-y-5">
                            {ticket.replies.map((reply) => (
                                <div
                                    key={reply.id}
                                    className={`rounded-xl p-4 ${reply.isInternalNote
                                            ? "bg-yellow-50 border border-yellow-200"
                                            : reply.authorRole === "CUSTOMER"
                                                ? "bg-gray-50 border border-border"
                                                : "bg-emerald/5 border border-emerald/20"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${reply.authorRole === "CUSTOMER" ? "bg-charcoal text-white" : "bg-emerald text-white"
                                                }`}>
                                                {reply.author.charAt(0)}
                                            </div>
                                            <span className="text-sm font-semibold text-charcoal">{reply.author}</span>
                                            {reply.isInternalNote && (
                                                <span className="flex items-center gap-1 text-[10px] text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full font-semibold">
                                                    <Lock size={10} /> Internal Note
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-muted">
                                            {new Date(reply.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-charcoal leading-relaxed pl-9">{reply.body}</p>
                                </div>
                            ))}
                            {ticket.replies.length === 0 && (
                                <div className="text-center py-8 text-muted">
                                    No replies yet
                                </div>
                            )}
                        </div>

                        {/* Reply Area */}
                        <div className="p-5 border-t border-border">
                            <div className="relative mb-3">
                                <button
                                    onClick={() => setShowCannedResponses(!showCannedResponses)}
                                    className="flex items-center gap-2 text-xs text-muted hover:text-charcoal px-3 py-2 rounded-lg border border-border hover:border-charcoal transition-colors"
                                >
                                    Quick Responses
                                    <ChevronDown size={14} className={showCannedResponses ? "rotate-180" : ""} />
                                </button>
                                
                                {showCannedResponses && cannedResponses.length > 0 && (
                                    <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                        <div className="p-2 text-xs text-muted border-b border-border">
                                            Select a response to insert
                                        </div>
                                        <div className="divide-y divide-border">
                                            {cannedResponses.map((response) => (
                                                <button
                                                    key={response.id}
                                                    onClick={() => insertCannedResponse(response.body)}
                                                    className="w-full text-left p-3 text-sm text-charcoal hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="font-medium">{response.title}</div>
                                                    <div className="text-xs text-muted mt-1 line-clamp-2">
                                                        {response.body.substring(0, 100)}...
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="p-2 border-t border-border text-center">
                                            <Link 
                                                href="/admin-panel/support/canned-responses" 
                                                className="text-xs text-emerald hover:underline"
                                            >
                                                Manage Responses
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <textarea
                                rows={3}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="w-full px-4 py-3 text-sm rounded-lg border border-border text-charcoal placeholder:text-muted-light focus:outline-none focus:border-charcoal resize-none"
                                placeholder="Type your reply..."
                            />
                            <div className="flex items-center justify-between mt-3">
                                <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={isInternalNote}
                                        onChange={(e) => setIsInternalNote(e.target.checked)}
                                        className="w-4 h-4 accent-charcoal" 
                                    />
                                    Internal note (not visible to customer)
                                </label>
                                <Button 
                                    variant="primary" 
                                    size="sm"
                                    onClick={handleReplySubmit}
                                    disabled={!replyText.trim() || loading}
                                >
                                    {loading ? (
                                        <LoadingSpinner size="sm" className="mr-2" />
                                    ) : (
                                        <Send size={14} />
                                    )}
                                    Send Reply
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    {customer && (
                        <div className="bg-white rounded-xl border border-border p-6">
                            <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4">Customer</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-charcoal text-white flex items-center justify-center text-sm font-semibold">
                                    {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                                </div>
                                <div>
                                    <Link href={`/admin-panel/customers/${customer.id}`} className="text-sm font-semibold text-charcoal hover:text-emerald">
                                        {customer.firstName} {customer.lastName}
                                    </Link>
                                    <p className="text-xs text-muted">{customer.email}</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm border-t border-border pt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted flex items-center gap-1"><ShoppingCart size={14} /> Orders</span>
                                    <span className="font-medium text-charcoal">-</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted flex items-center gap-1"><IndianRupee size={14} /> LTV</span>
                                    <span className="font-medium text-charcoal">-</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted">Tier</span>
                                    <StatusBadge type="loyalty" value="BRONZE" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Related Order */}
                    {relatedOrder && (
                        <div className="bg-white rounded-xl border border-border p-6">
                            <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4">Related Order</h3>
                            <Link href={`/admin-panel/orders/${relatedOrder.id}`} className="text-sm font-semibold text-emerald hover:underline">
                                {relatedOrder.orderNumber}
                            </Link>
                            <div className="mt-3 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-muted">Amount</span><span className="font-medium">{formatPrice(relatedOrder.totalAmount)}</span></div>
                                <div className="flex justify-between"><span className="text-muted">Status</span><StatusBadge type="order" value={relatedOrder.status} /></div>
                                <div className="flex justify-between"><span className="text-muted">Items</span><span className="text-charcoal">{relatedOrder.items?.length || 0}</span></div>
                            </div>
                        </div>
                    )}

                    {/* Canned Responses */}
                    <div className="bg-white rounded-xl border border-border p-6">
                        <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4">Quick Responses</h3>
                        <div className="space-y-2">
                            {["Shipping Delay", "Return Policy", "Refund Processed", "Repair Scheduled"].map((resp) => (
                                <button key={resp} className="w-full text-left text-xs px-3 py-2 rounded-lg border border-border text-muted hover:border-charcoal hover:text-charcoal transition-colors">
                                    {resp}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
