"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Tag, ToggleLeft, ToggleRight, Edit2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/admin/shared/PageHeader";
import { useAuth } from "@clerk/nextjs";
import { useDiscountAdminStore, Discount } from "@/store/useDiscountAdminStore";

function formatRupee(n: number) {
    return `₹${n.toLocaleString("en-IN")}`;
}

function formatDate(d: string | null | undefined) {
    if (!d) return "No expiry";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminDiscountsPage() {
    const { getToken } = useAuth();
    const { discounts, meta, isLoading, fetchDiscounts, deactivateDiscount, toggleDiscountStatus } = useDiscountAdminStore();
    const [confirmDeactivate, setConfirmDeactivate] = useState<Discount | null>(null);
    const [isDeactivating, setIsDeactivating] = useState(false);

    useEffect(() => {
        fetchDiscounts(getToken);
    }, [fetchDiscounts, getToken]);

    const handleDeactivate = async () => {
        if (!confirmDeactivate) return;
        setIsDeactivating(true);
        await deactivateDiscount(confirmDeactivate.id, getToken);
        setIsDeactivating(false);
        setConfirmDeactivate(null);
    };

    return (
        <>
            <PageHeader
                title="Coupons & Discounts"
                subtitle={`${meta.total} total coupons`}
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin-panel/dashboard" },
                    { label: "Discounts" },
                ]}
                actions={
                    <Button variant="primary" size="sm" asChild>
                        <Link href="/admin-panel/discounts/new"><Plus size={16} /> Create Coupon</Link>
                    </Button>
                }
            />

            <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-[11px] text-muted uppercase tracking-wider border-b border-border bg-gray-50/50">
                                <th className="px-5 py-3 font-semibold">Code</th>
                                <th className="px-5 py-3 font-semibold">Discount</th>
                                <th className="px-5 py-3 font-semibold">Min Order</th>
                                <th className="px-5 py-3 font-semibold">Uses</th>
                                <th className="px-5 py-3 font-semibold">Expires</th>
                                <th className="px-5 py-3 font-semibold">Status</th>
                                <th className="px-5 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-10 text-center text-muted">
                                        <Loader2 size={24} className="animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : discounts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-14 text-center">
                                        <Tag size={36} className="mx-auto text-gray-300 mb-3" />
                                        <p className="text-muted text-sm">No coupons yet. Create your first one!</p>
                                    </td>
                                </tr>
                            ) : discounts.map((d) => {
                                const isExpired = d.expiresAt ? new Date(d.expiresAt) < new Date() : false;
                                return (
                                <tr key={d.id} className="border-b border-border/50 last:border-0 hover:bg-gray-50/30">
                                    <td className="px-5 py-4">
                                        <div>
                                            <span className="font-mono font-bold text-charcoal text-sm bg-gray-100 px-2 py-0.5 rounded">{d.code}</span>
                                            {d.description && <p className="text-[11px] text-muted mt-1">{d.description}</p>}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 font-semibold text-charcoal">
                                        {d.discountPercent
                                            ? `${d.discountPercent}% off`
                                            : d.discountAmount
                                                ? `${formatRupee(Number(d.discountAmount))} off`
                                                : "—"}
                                    </td>
                                    <td className="px-5 py-4 text-muted">
                                        {d.minOrderAmount ? formatRupee(Number(d.minOrderAmount)) : "None"}
                                    </td>
                                    <td className="px-5 py-4 text-muted">
                                        <span className="font-medium text-charcoal">{d.usedCount}</span>
                                        {d.maxUses ? ` / ${d.maxUses}` : " / ∞"}
                                    </td>
                                    <td className="px-5 py-4 text-muted text-[12px]">{formatDate(d.expiresAt)}</td>
                                    <td className="px-5 py-4">
                                        <button
                                            onClick={() => toggleDiscountStatus(d.id, d.isActive, getToken)}
                                            className={`transition-opacity ${isExpired ? 'cursor-not-allowed' : 'hover:opacity-80'}`}
                                            title={isExpired ? "Coupon has expired" : (d.isActive ? "Deactivate Coupon" : "Activate Coupon")}
                                            disabled={isExpired}
                                        >
                                            {isExpired ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                                                    <X size={13} /> Expired
                                                </span>
                                            ) : d.isActive ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald bg-emerald/10 px-2 py-0.5 rounded-full">
                                                    <ToggleRight size={13} /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted bg-gray-100 px-2 py-0.5 rounded-full">
                                                    <ToggleLeft size={13} /> Inactive
                                                </span>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/admin-panel/discounts/${d.id}/edit`}
                                                className="p-1.5 text-muted hover:text-charcoal hover:bg-gray-100 rounded-md transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </Link>
                                            {d.isActive && !isExpired && (
                                                <button
                                                    onClick={() => setConfirmDeactivate(d)}
                                                    className="p-1.5 text-muted hover:text-error hover:bg-red-50 rounded-md transition-colors"
                                                    title="Deactivate"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Deactivate Confirm Modal */}
            {confirmDeactivate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isDeactivating && setConfirmDeactivate(null)} />
                    <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
                        <h3 className="text-base font-semibold text-charcoal mb-2">Deactivate Coupon?</h3>
                        <p className="text-sm text-muted mb-5">
                            <span className="font-mono font-bold text-charcoal">{confirmDeactivate.code}</span> will be deactivated and customers won't be able to use it.
                        </p>
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setConfirmDeactivate(null)} disabled={isDeactivating} className="px-4 py-2 text-sm font-medium text-charcoal bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50">
                                Cancel
                            </button>
                            <button onClick={handleDeactivate} disabled={isDeactivating} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-error hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50">
                                {isDeactivating ? <Loader2 size={14} className="animate-spin" /> : null}
                                {isDeactivating ? "Deactivating..." : "Deactivate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
