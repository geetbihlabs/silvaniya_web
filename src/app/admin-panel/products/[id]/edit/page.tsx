"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { useProductStore } from "../../../../../store/useProductStore";
import ProductForm from "../../../../../components/admin/products/ProductForm";
import PageHeader from "@/components/admin/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    
    const { getToken } = useAuth();
    const { isSubmitting, fetchProductById, updateProduct, deleteProductImage } = useProductStore();
    
    const [initialData, setInitialData] = useState<Record<string, unknown> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
            setIsLoading(true);
            const data = await fetchProductById(id, getToken);
            if (data) {
                // Map the backend data structure to the form initialValues
                setInitialData({
                    name: data.name,
                    sku: data.sku,
                    weight: data.weightGrams,         // API: weightGrams
                    price: data.basePrice,             // API: basePrice
                    description: data.description || "",
                    tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
                    comparePrice: data.salePrice ?? undefined,  // API: salePrice
                    stockQuantity: Array.isArray(data.variants) && data.variants.length > 0
                        ? data.variants[0]?.stockQty ?? undefined   // API: stockQty
                        : (data.stock ?? undefined),
                    lowStockThreshold: Array.isArray(data.variants) && data.variants.length > 0
                        ? data.variants[0]?.lowStockAt ?? undefined  // API: lowStockAt
                        : (data.lowStockThreshold ?? undefined),
                    metaTitle: data.metaTitle || "",
                    metaDescription: data.metaDescription || "",
                    isReturnable: data.isReturnable ?? true,
                    refundPolicy: data.refundPolicy || "",
                    allowPartialPayment: data.allowPartialPayment || false,
                    minBookingAmount: data.minBookingAmount ?? undefined,
                    category: data.category || "RINGS",
                    collectionId: data.collectionId || "",
                    certificateNo: data.certificateNo || "",
                    status: data.status || "DRAFT",
                    isFeatured: data.isFeatured || false,
                    metalType: data.metalType || "SILVER_925",
                    gemstoneType: data.gemstoneType || "NONE",
                    bisHallmark: data.bisHallmark || false,
                    images: Array.isArray(data.images)            // API: images (not media)
                        ? data.images
                            .sort((a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder)
                            .map((img: { id: string; s3Url?: string; isPrimary: boolean }) => ({
                                id: img.id,
                                url: img.s3Url,   // API: s3Url
                                isPrimary: img.isPrimary,
                            }))
                        : [],
                });
            } else {
                toast.error("Product not found");
                router.push("/admin-panel/products");
            }
            setIsLoading(false);
        };

        loadData();
    }, [id, getToken, fetchProductById, router]);

    const onSubmit = async (data: Record<string, unknown>, imageFiles: File[]) => {
        // ... tagsArray code
        const tags = typeof data.tags === 'string' ? data.tags : '';
        const tagsArray = tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];
        
        const payload = {
            ...data,
            description: typeof data.description === 'string' ? data.description.trim() || undefined : undefined,
            collectionId: typeof data.collectionId === 'string' ? data.collectionId.trim() || undefined : undefined,
            certificateNo: typeof data.certificateNo === 'string' ? data.certificateNo.trim() || undefined : undefined,
            metaTitle: typeof data.metaTitle === 'string' ? data.metaTitle.trim() || undefined : undefined,
            metaDescription: typeof data.metaDescription === 'string' ? data.metaDescription.trim() || undefined : undefined,
            isReturnable: typeof data.isReturnable === 'boolean' ? data.isReturnable : true,
            refundPolicy: typeof data.refundPolicy === 'string' ? data.refundPolicy.trim() || undefined : undefined,
            allowPartialPayment: typeof data.allowPartialPayment === 'boolean' ? data.allowPartialPayment : false,
            minBookingAmount: typeof data.minBookingAmount === 'number' ? data.minBookingAmount : undefined,
            tags: tagsArray,
        };
        
        const success = await updateProduct(id, payload, getToken, imageFiles);
        return success;
    };

    if (isLoading) {
        return (
            <div>
                <PageHeader
                    title="Edit Product"
                    breadcrumbs={[
                        { label: "Dashboard", href: "/admin-panel/dashboard" },
                        { label: "Products", href: "/admin-panel/products" },
                        { label: "Edit Product" },
                    ]}
                    actions={
                        <Button variant="outline" size="sm" onClick={() => router.back()}>
                            <ArrowLeft size={16} /> Back
                        </Button>
                    }
                />
                <div className="flex items-center justify-center p-20">
                    <Loader2 size={32} className="animate-spin text-charcoal/40" />
                </div>
            </div>
        );
    }

    if (!initialData) return null;

    return (
        <ProductForm 
            initialValues={initialData}
            onSubmit={onSubmit}
            onDeleteExistingImage={(mediaId) => deleteProductImage(id, mediaId, getToken)}
            isSubmitting={isSubmitting} 
            title={`Edit Product: ${initialData.name}`} 
        />
    );
}
