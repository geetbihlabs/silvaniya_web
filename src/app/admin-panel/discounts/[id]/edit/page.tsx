"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useDiscountAdminStore, Discount } from "@/store/useDiscountAdminStore";
import DiscountForm from "@/components/admin/discounts/DiscountForm";

export default function EditDiscountPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { getToken } = useAuth();
    const { isSubmitting, updateDiscount, fetchDiscountById } = useDiscountAdminStore();
    const [discount, setDiscount] = useState<Discount | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetchDiscountById(id, getToken).then((d) => {
            setDiscount(d);
            setIsLoading(false);
        });
    }, [id, getToken, fetchDiscountById]);

    const onSubmit = async (data: any) => {
        const payload = {
            code: data.code,
            description: data.description || undefined,
            discountPercent: data.discountType === "percent" ? Number(data.discountValue) : null,
            discountAmount: data.discountType === "flat" ? Number(data.discountValue) : null,
            minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : null,
            maxUses: data.maxUses ? Number(data.maxUses) : null,
            maxUsesPerUser: data.maxUsesPerUser ? Number(data.maxUsesPerUser) : null,
            expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null,
            isActive: data.isActive,
        };
        const success = await updateDiscount(id, payload, getToken);
        if (success) router.push("/admin-panel/discounts");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 size={32} className="animate-spin text-charcoal/40" />
            </div>
        );
    }

    if (!discount) return <p className="text-muted p-6">Coupon not found.</p>;

    // Map existing discount back to form default values
    const defaultValues = {
        code: discount.code,
        description: discount.description ?? "",
        discountType: discount.discountPercent != null ? "percent" as const : "flat" as const,
        discountValue: Number(discount.discountPercent ?? discount.discountAmount ?? 0),
        minOrderAmount: discount.minOrderAmount ? Number(discount.minOrderAmount) : undefined,
        maxUses: discount.maxUses ? Number(discount.maxUses) : undefined,
        maxUsesPerUser: discount.maxUsesPerUser ? Number(discount.maxUsesPerUser) : undefined,
        expiresAt: discount.expiresAt
            ? new Date(discount.expiresAt).toISOString().slice(0, 16) // format for datetime-local
            : "",
        isActive: discount.isActive,
    };

    return (
        <DiscountForm
            title={`Edit Coupon: ${discount.code}`}
            defaultValues={defaultValues}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
        />
    );
}
