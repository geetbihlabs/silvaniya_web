"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, ThumbsUp, ThumbsDown, Flag, Check, X } from "lucide-react";
import PageHeader from "@/components/admin/shared/PageHeader";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import ErrorBanner from "@/components/admin/shared/ErrorBanner";
import LoadingSpinner from "@/components/admin/shared/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { useReviewStore } from "@/store/useReviewStore";
import { formatPrice } from "@/lib/utils";

const statusTabs = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Flagged", value: "FLAGGED" },
];

export default function AdminReviewsPage() {
    const [activeTab, setActiveTab] = useState("ALL");
    const [replyText, setReplyText] = useState<Record<string, string>>({});
    
    const { 
        reviews, 
        loading, 
        error, 
        pagination, 
        fetchReviews, 
        moderateReview,
        replyToReview,
        setFilters,
        clearError
    } = useReviewStore();

    // Fetch reviews on mount and when filters change
    useEffect(() => {
        const filters: any = {};
        if (activeTab !== "ALL") {
            filters.status = activeTab;
        }
        
        setFilters(filters);
        fetchReviews({ page: 1, limit: 20, ...filters });
    }, [activeTab, fetchReviews, setFilters]);

    const handleModerate = async (reviewId: string, status: 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'PENDING') => {
        try {
            await moderateReview(reviewId, status);
        } catch (err) {
            console.error("Failed to moderate review:", err);
        }
    };

    const handleReplySubmit = async (reviewId: string) => {
        const text = replyText[reviewId];
        if (!text?.trim()) return;
        
        try {
            await replyToReview(reviewId, text);
            setReplyText(prev => ({ ...prev, [reviewId]: "" }));
        } catch (err) {
            console.error("Failed to reply to review:", err);
        }
    };

    const handleTabChange = (tabValue: string) => {
        setActiveTab(tabValue);
    };

    const pendingCount = reviews.filter(r => r.status === "PENDING").length;

    return (
        <div>
            <PageHeader
                title="Review Moderation"
                subtitle={`${pendingCount} pending reviews`}
                breadcrumbs={[{ label: "Dashboard", href: "/admin-panel/dashboard" }, { label: "Reviews" }]}
            />

            {/* Status Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
                {statusTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                            activeTab === tab.value 
                                ? "bg-charcoal text-white" 
                                : "bg-white text-muted border border-border hover:text-charcoal"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
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
                            filters.status = activeTab;
                        }
                        fetchReviews({ page: 1, limit: 20, ...filters });
                    }}
                    className="mb-6"
                />
            )}

            {/* Reviews Grid */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-xl border border-border overflow-hidden">
                            {/* Review Header */}
                            <div className="p-5 border-b border-border">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-charcoal line-clamp-1">{review.product.name}</h3>
                                        <p className="text-xs text-muted">{review.product.sku}</p>
                                    </div>
                                    <StatusBadge type="review" value={review.status} />
                                </div>
                                
                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={16} 
                                            className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-border"}
                                        />
                                    ))}
                                    <span className="text-sm font-medium text-charcoal ml-2">{review.rating}/5</span>
                                </div>
                                
                                {/* Customer Info */}
                                <div className="text-xs text-muted">
                                    By {review.user.firstName} {review.user.lastName}
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="p-5">
                                {review.title && (
                                    <h4 className="font-medium text-charcoal mb-2">{review.title}</h4>
                                )}
                                {review.body && (
                                    <p className="text-sm text-muted mb-4 line-clamp-3">{review.body}</p>
                                )}
                                
                                {/* Images */}
                                {review.images.length > 0 && (
                                    <div className="flex gap-2 mb-4">
                                        {review.images.slice(0, 3).map((img, index) => (
                                            <div key={index} className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                                                <img 
                                                    src={img} 
                                                    alt={`Review image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                        {review.images.length > 3 && (
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 border border-border flex items-center justify-center text-xs text-muted">
                                                +{review.images.length - 3}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Verified Purchase Badge */}
                                {review.isVerified && (
                                    <div className="inline-flex items-center gap-1 text-xs text-emerald bg-emerald/10 px-2 py-1 rounded-full mb-4">
                                        <Check size={12} />
                                        Verified Purchase
                                    </div>
                                )}

                                {/* Created Date */}
                                <div className="text-xs text-muted mb-4">
                                    Posted {new Date(review.createdAt).toLocaleDateString()}
                                </div>

                                {/* Admin Actions */}
                                {review.status === "PENDING" && (
                                    <div className="flex gap-2 mb-4">
                                        <Button 
                                            variant="emerald" 
                                            size="sm"
                                            onClick={() => handleModerate(review.id, "APPROVED")}
                                            className="flex-1"
                                        >
                                            <ThumbsUp size={14} /> Approve
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => handleModerate(review.id, "REJECTED")}
                                            className="flex-1"
                                        >
                                            <ThumbsDown size={14} /> Reject
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleModerate(review.id, "FLAGGED")}
                                        >
                                            <Flag size={14} />
                                        </Button>
                                    </div>
                                )}

                                {/* Admin Reply */}
                                <div className="border-t border-border pt-4">
                                    {review.adminReply ? (
                                        <div>
                                            <h5 className="text-xs font-semibold text-charcoal mb-2">Your Reply:</h5>
                                            <p className="text-sm text-charcoal bg-gray-50 p-3 rounded-lg">{review.adminReply}</p>
                                            <p className="text-xs text-muted mt-2">
                                                Replied on {new Date(review.adminReplyAt!).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <h5 className="text-xs font-semibold text-charcoal mb-2">Reply to Customer:</h5>
                                            <textarea
                                                value={replyText[review.id] || ""}
                                                onChange={(e) => setReplyText(prev => ({ ...prev, [review.id]: e.target.value }))}
                                                placeholder="Type your response..."
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-border text-charcoal placeholder:text-muted focus:outline-none focus:border-charcoal resize-none mb-2"
                                                rows={3}
                                            />
                                            <Button 
                                                variant="primary" 
                                                size="sm"
                                                onClick={() => handleReplySubmit(review.id)}
                                                disabled={!replyText[review.id]?.trim()}
                                                className="w-full"
                                            >
                                                Send Reply
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {reviews.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted">
                                {activeTab === "ALL" ? "No reviews found" : "No reviews match your filters"}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-8">
                    <div className="text-sm text-muted">
                        Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} reviews
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => fetchReviews({ page: pagination.page - 1 })}
                            className="px-3 py-1 text-sm border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <button
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => fetchReviews({ page: pagination.page + 1 })}
                            className="px-3 py-1 text-sm border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}