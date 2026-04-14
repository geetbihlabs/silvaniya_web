import React from "react";
import { PlacedOrder } from "@/store/useOrderStore";

export const OrderTimeline = ({ order }: { order: PlacedOrder }) => {
    return (
        <div className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-6">
            <h2 className="text-[15px] font-bold text-charcoal mb-5" style={{ fontFamily: "var(--font-heading)" }}>
                Tracking History
            </h2>
            <div>
                {order.statusHistory && order.statusHistory.length > 0 ? (
                    order.statusHistory.map((entry, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full shrink-0 mt-1 ${i === 0 ? "bg-[#107c6f]" : "bg-[#d8d8d2]"}`} />
                                {i < order.statusHistory.length - 1 && (
                                    <div className="w-[2px] flex-1 bg-[#e8e8e4] my-1 min-h-[24px]" />
                                )}
                            </div>
                            <div className="pb-5 flex-1">
                                <p className={`text-[13px] font-semibold leading-snug ${i === 0 ? "text-charcoal" : "text-muted"}`}>
                                    {entry.status.replace(/_/g, " ")}
                                </p>
                                {entry.note && (
                                    <p className={`text-[12px] mt-0.5 font-medium ${i === 0 ? "text-[#107c6f]" : "text-muted"}`}>
                                        {entry.note}
                                    </p>
                                )}
                                <p className="text-[11px] text-muted mt-0.5">{new Date(entry.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-[13px] text-muted">No tracking history available yet.</p>
                )}
            </div>
        </div>
    );
};
