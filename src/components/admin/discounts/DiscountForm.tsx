"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/admin/shared/PageHeader";

const discountSchema = z.object({
    code: z.string().min(3, "Code must be at least 3 characters"),
    description: z.string().optional(),
    discountType: z.enum(["percent", "flat"]),
    discountValue: z.coerce.number().min(0.01, "Value must be greater than 0"),
    minOrderAmount: z.coerce.number().min(0).optional(),
    maxUses: z.coerce.number().min(1).optional(),
    maxUsesPerUser: z.coerce.number().min(1).optional(),
    expiresAt: z.string().optional(),
    isActive: z.boolean(),
});

type DiscountFormValues = z.infer<typeof discountSchema>;

export interface DiscountFormProps {
    title: string;
    defaultValues?: Partial<DiscountFormValues>;
    isSubmitting: boolean;
    onSubmit: (data: DiscountFormValues) => Promise<void>;
}

export default function DiscountForm({ title, defaultValues, isSubmitting, onSubmit }: DiscountFormProps) {
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<DiscountFormValues>({
        resolver: zodResolver(discountSchema) as any,
        defaultValues: {
            code: "",
            description: "",
            discountType: "percent",
            discountValue: 10,
            minOrderAmount: undefined,
            maxUses: undefined,
            maxUsesPerUser: undefined,
            expiresAt: "",
            isActive: true,
            ...defaultValues,
        },
    });

    const discountType = watch("discountType");

    return (
        <>
            <PageHeader
                title={title}
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin-panel/dashboard" },
                    { label: "Discounts", href: "/admin-panel/discounts" },
                    { label: title },
                ]}
                actions={
                    <Button variant="outline" size="sm" onClick={() => router.back()}>
                        <ArrowLeft size={16} /> Back
                    </Button>
                }
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
                    {/* Left: Main */}
                    <div className="space-y-5">
                        {/* Basic Info */}
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h3 className="text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-5">Coupon Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">
                                        Coupon Code <span className="text-error">*</span>
                                    </label>
                                    <input
                                        {...register("code")}
                                        placeholder="e.g. SAVE10"
                                        className="w-full h-10 px-3 text-sm font-mono uppercase rounded-lg border border-border text-charcoal focus:outline-none focus:border-charcoal"
                                        onChange={(e) => {
                                            e.target.value = e.target.value.toUpperCase();
                                            register("code").onChange(e);
                                        }}
                                    />
                                    {errors.code && <p className="text-error text-xs mt-1">{errors.code.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">Description (optional)</label>
                                    <input
                                        {...register("description")}
                                        placeholder="e.g. 10% off on all orders above ₹500"
                                        className="w-full h-10 px-3 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-charcoal"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Discount Value */}
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h3 className="text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-5">Discount Value</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">Type <span className="text-error">*</span></label>
                                    <select
                                        {...register("discountType")}
                                        className="w-full h-10 px-3 text-sm rounded-lg border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal"
                                    >
                                        <option value="percent">Percentage (%)</option>
                                        <option value="flat">Flat Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">
                                        Value <span className="text-error">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted font-medium">
                                            {discountType === "percent" ? "%" : "₹"}
                                        </span>
                                        <input
                                            {...register("discountValue")}
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            placeholder={discountType === "percent" ? "10" : "200"}
                                            className="w-full h-10 pl-8 pr-3 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-charcoal"
                                        />
                                    </div>
                                    {errors.discountValue && <p className="text-error text-xs mt-1">{errors.discountValue.message}</p>}
                                </div>
                            </div>
                        </section>

                        {/* Restrictions */}
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h3 className="text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-5">Restrictions (Optional)</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">Minimum Order Amount (₹)</label>
                                    <input
                                        {...register("minOrderAmount")}
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 500 (leave blank for none)"
                                        className="w-full h-10 px-3 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-charcoal"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">Max Total Uses</label>
                                    <input
                                        {...register("maxUses")}
                                        type="number"
                                        min="1"
                                        placeholder="Blank = unlimited"
                                        className="w-full h-10 px-3 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-charcoal"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">Max Uses Per User</label>
                                    <input
                                        {...register("maxUsesPerUser")}
                                        type="number"
                                        min="1"
                                        placeholder="Per-user limit"
                                        className="w-full h-10 px-3 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-charcoal"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">Expiry Date</label>
                                    <input
                                        {...register("expiresAt")}
                                        type="datetime-local"
                                        className="w-full h-10 px-3 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-charcoal"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right: Status + Submit */}
                    <div className="space-y-5">
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h3 className="text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-5">Status</h3>
                            <div className="flex items-start gap-2">
                                <input type="checkbox" id="isActive" {...register("isActive")} className="rounded border-gray-300 text-charcoal focus:ring-charcoal mt-0.5" />
                                <div>
                                    <label htmlFor="isActive" className="text-sm font-medium text-charcoal cursor-pointer">Active</label>
                                    <p className="text-[11px] text-muted mt-0.5">Customers can use this coupon when active.</p>
                                </div>
                            </div>
                        </section>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-[46px] flex items-center justify-center gap-2 bg-charcoal text-white text-[13px] font-semibold rounded-lg hover:bg-charcoal/90 transition-colors disabled:opacity-60"
                        >
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {isSubmitting ? "Saving..." : "Save Coupon"}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}
