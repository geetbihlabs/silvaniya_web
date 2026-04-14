import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Truck } from "lucide-react";
import { PlacedOrder } from "@/store/useOrderStore";
import { formatPrice } from "@/lib/utils";

export const OrderItemsList = ({ order }: { order: PlacedOrder }) => {
    return (
        <div className="bg-white rounded-xl border border-[#e8e8e4] px-6 py-6">
            <h2 className="text-[15px] font-bold text-charcoal mb-5" style={{ fontFamily: "var(--font-heading)" }}>
                Order Items
            </h2>
            {order.items.map((item) => {
                const images = item.productVariant?.product?.images ?? [];
                const imgUrl = images.find(i => i.isPrimary)?.s3Url ?? images[0]?.s3Url ?? null;

                return (
                <div key={item.id} className="flex gap-4 mb-4 last:mb-0">
                    {/* Product Image */}
                    <div className="w-[100px] h-[100px] shrink-0 rounded-lg bg-[#f3f3f0] border border-[#e8e8e4] overflow-hidden flex items-center justify-center">
                        {imgUrl ? (
                            <Image
                                src={imgUrl}
                                alt={item.productName}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Package size={28} strokeWidth={1.5} className="text-gray-300" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-[16px] font-bold text-charcoal leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
                                {item.productName}
                            </h3>
                            <span className="text-[16px] font-bold text-charcoal shrink-0">{formatPrice(item.totalPrice)}</span>
                        </div>
                        <p className="text-[12px] text-muted mb-3">
                            {item.variantLabel}
                        </p>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-4">
                            <div>
                                <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Quantity</p>
                                <p className="text-[13px] font-medium text-charcoal">{item.quantity} Unit</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">SKU</p>
                                <p className="text-[13px] font-medium text-charcoal">{item.sku || "—"}</p>
                            </div>
                        </div>
                        {/* Status-specific Actions */}
                        <div className="flex gap-2">
                            {["SHIPPED", "OUT_FOR_DELIVERY"].includes(order.status) && (
                                <Link
                                    href="/track"
                                    className="flex items-center gap-2 px-4 h-9 bg-charcoal hover:bg-charcoal/90 text-white text-[12px] font-semibold rounded-md transition-colors"
                                >
                                    <Truck size={13} strokeWidth={1.8} />
                                    Track Package
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                ); })}

        </div>
    );
};
