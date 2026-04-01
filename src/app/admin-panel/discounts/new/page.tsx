"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useDiscountAdminStore } from "@/store/useDiscountAdminStore";
import DiscountForm from "@/components/admin/discounts/DiscountForm";

export default function NewDiscountPage() {
    const router = useRouter();
    const { getToken } = useAuth();
    const { isSubmitting, createDiscount } = useDiscountAdminStore();

    const onSubmit = async (data: any) => {
        const payload = {
            code: data.code,
            description: data.description || undefined,
            discountPercent: data.discountType === "percent" ? Number(data.discountValue) : undefined,
            discountAmount: data.discountType === "flat" ? Number(data.discountValue) : undefined,
            minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : undefined,
            maxUses: data.maxUses ? Number(data.maxUses) : undefined,
            maxUsesPerUser: data.maxUsesPerUser ? Number(data.maxUsesPerUser) : undefined,
            expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined,
            isActive: data.isActive,
        };

        const success = await createDiscount(payload, getToken);
        if (success) router.push("/admin-panel/discounts");
    };

    return (
        <DiscountForm
            title="Create Coupon"
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
        />
    );
}
