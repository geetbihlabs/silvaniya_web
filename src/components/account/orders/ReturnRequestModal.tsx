import React, { useState, useMemo } from "react";
import { X, AlertTriangle, RotateCcw, Package } from "lucide-react";
import Image from "next/image";
import { PlacedOrder } from "@/store/useOrderStore";
import { formatPrice } from "@/lib/utils";

interface ReturnItemSelection {
    orderItemId: string;
    quantity: number;
}

interface ReturnRequestModalProps {
    order: PlacedOrder;
    isOpen: boolean;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (reason: string, detail: string, items: ReturnItemSelection[]) => void;
}

const RETURN_REASONS = [
    { value: "DEFECTIVE", label: "Product is defective or damaged" },
    { value: "WRONG_ITEM", label: "Received the wrong item" },
    { value: "QUALITY_NOT_AS_DESCRIBED", label: "Quality not as described" },
    { value: "SIZE_ISSUE", label: "Size issue" },
    { value: "CHANGED_MIND", label: "Changed my mind" },
    { value: "DAMAGED_IN_TRANSIT", label: "Damaged in transit" },
    { value: "OTHER", label: "Other" },
];

export const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({
    order, isOpen, isSubmitting, onClose, onSubmit
}) => {
    const [returnReason, setReturnReason] = useState("");
    const [returnDetail, setReturnDetail] = useState("");
    const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});

    // ⚠️ IMPORTANT: All hooks must be declared before any early return
    // (Rules of Hooks — hooks must be called in the same order every render)
    const returnableItems = useMemo(() => order.items.filter(item => {
        const isActive = !item.status || item.status === "ACTIVE";
        const notFullyReturned = (item.quantity - (item.returnedQty ?? 0)) > 0;
        const isReturnable = item.productVariant?.product?.isReturnable !== false;
        return isActive && notFullyReturned && isReturnable;
    }), [order.items]);

    const estimatedRefund = useMemo(() => {
        return order.items.reduce((sum, item) => {
            const qty = selectedItems[item.id];
            if (!qty) return sum;
            const effective = parseFloat(String(item.effectivePrice ?? item.unitPrice));
            return sum + effective * qty;
        }, 0);
    }, [selectedItems, order.items]);

    // Early return AFTER all hooks
    if (!isOpen) return null;

    const toggleItem = (itemId: string, maxQty: number) => {
        setSelectedItems(prev => {
            if (prev[itemId] !== undefined) {
                const next = { ...prev };
                delete next[itemId];
                return next;
            }
            return { ...prev, [itemId]: 1 };
        });
    };

    const setItemQty = (itemId: string, qty: number) => {
        setSelectedItems(prev => ({ ...prev, [itemId]: qty }));
    };


    const selectedCount = Object.keys(selectedItems).length;

    const handleSubmit = () => {
        if (!returnReason || selectedCount === 0) return;
        const items: ReturnItemSelection[] = Object.entries(selectedItems).map(([orderItemId, quantity]) => ({
            orderItemId,
            quantity,
        }));
        onSubmit(returnReason, returnDetail, items);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-[520px] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-[#f0f0ec]">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-muted hover:text-charcoal transition-colors p-1"
                    >
                        <X size={20} />
                    </button>
                    <div className="w-12 h-12 bg-charcoal rounded-full flex items-center justify-center mb-3">
                        <RotateCcw className="text-white" size={22} />
                    </div>
                    <h2 className="text-[20px] font-bold text-charcoal font-heading">Request Return</h2>
                    <p className="text-[13px] text-muted leading-relaxed mt-1">
                        Select the specific items you wish to return from order #{order.orderNumber}.
                    </p>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 px-6 py-4 space-y-5">

                    {/* Returnable Items Selection */}
                    <div>
                        <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-3">
                            Select Items to Return <span className="text-red-500">*</span>
                        </p>
                        {returnableItems.length === 0 ? (
                            <div className="text-[13px] text-muted text-center py-4 bg-[#f8f8f6] rounded-xl">
                                No eligible items found for return in this order.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {returnableItems.map(item => {
                                    const images = item.productVariant?.product?.images ?? [];
                                    const imgUrl = images.find(i => i.isPrimary)?.s3Url ?? images[0]?.s3Url ?? null;
                                    const availableQty = item.quantity - (item.returnedQty ?? 0);
                                    const isSelected = selectedItems[item.id] !== undefined;
                                    const effectiveUnit = parseFloat(String(item.effectivePrice ?? item.unitPrice));

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => toggleItem(item.id, availableQty)}
                                            className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                                isSelected
                                                    ? "border-charcoal bg-[#f8f8f5]"
                                                    : "border-[#e8e8e4] hover:border-charcoal/30"
                                            }`}
                                        >
                                            {/* Checkbox */}
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                                                isSelected ? "bg-charcoal border-charcoal" : "border-[#d8d8d2]"
                                            }`}>
                                                {isSelected && <span className="text-white text-[10px] font-bold">✓</span>}
                                            </div>

                                            {/* Image */}
                                            <div className="w-12 h-12 shrink-0 rounded-lg bg-[#f3f3f0] overflow-hidden flex items-center justify-center">
                                                {imgUrl ? (
                                                    <Image src={imgUrl} alt={item.productName} width={48} height={48} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Package size={18} strokeWidth={1.5} className="text-gray-300" />
                                                )}
                                            </div>

                                            {/* Item info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13px] font-semibold text-charcoal truncate">{item.productName}</p>
                                                <p className="text-[11px] text-muted">{item.variantLabel}</p>
                                                <p className="text-[11px] text-charcoal mt-0.5">
                                                    {formatPrice(effectiveUnit)} each · {availableQty} available
                                                </p>
                                            </div>

                                            {/* Qty selector (stop propagation so clicking qty doesn't deselect) */}
                                            {isSelected && availableQty > 1 && (
                                                <select
                                                    value={selectedItems[item.id]}
                                                    onClick={e => e.stopPropagation()}
                                                    onChange={e => {
                                                        e.stopPropagation();
                                                        setItemQty(item.id, parseInt(e.target.value));
                                                    }}
                                                    className="text-[12px] border border-[#e8e8e4] rounded-lg px-2 py-1 bg-white text-charcoal font-medium shrink-0"
                                                >
                                                    {Array.from({ length: availableQty }, (_, i) => i + 1).map(n => (
                                                        <option key={n} value={n}>{n} unit{n > 1 ? "s" : ""}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-[11px] font-bold text-muted uppercase tracking-widest mb-1.5">
                            Reason for Return <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full bg-[#f8f8f8] border border-[#e8e8e4] text-[14px] text-charcoal rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-charcoal"
                            value={returnReason}
                            onChange={e => setReturnReason(e.target.value)}
                        >
                            <option value="" disabled>Select a reason...</option>
                            {RETURN_REASONS.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Details */}
                    <div>
                        <label className="block text-[11px] font-bold text-muted uppercase tracking-widest mb-1.5">
                            Additional Details
                        </label>
                        <textarea
                            placeholder="Please provide any details that might help us process your return faster."
                            className="w-full bg-[#f8f8f8] border border-[#e8e8e4] text-[14px] text-charcoal rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-charcoal resize-none h-20"
                            value={returnDetail}
                            onChange={e => setReturnDetail(e.target.value)}
                        />
                    </div>

                    {/* Estimated Refund */}
                    {selectedCount > 0 && (
                        <div className="bg-[#f0f9f7] border border-[#107c6f]/15 rounded-xl px-4 py-3 flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-[#107c6f] uppercase tracking-widest">Estimated Refund</p>
                                <p className="text-[11px] text-muted mt-0.5">Includes proportional discount deduction</p>
                            </div>
                            <p className="text-[18px] font-bold text-charcoal">{formatPrice(estimatedRefund)}</p>
                        </div>
                    )}

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
                        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={15} />
                        <p className="text-xs text-amber-700 leading-relaxed font-medium">
                            Refund will be processed to your account upon admin approval. Shipping charges are non-refundable on partial returns.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[#f0f0ec] flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl border border-[#d8d8d2] text-[13px] font-bold text-charcoal hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !returnReason || selectedCount === 0}
                        className="flex-1 px-4 py-3 rounded-xl bg-charcoal text-white text-[13px] font-bold hover:bg-charcoal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {isSubmitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        Submit Return
                    </button>
                </div>
            </div>
        </div>
    );
};
