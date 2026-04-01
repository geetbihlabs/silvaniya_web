"use client";

import React from "react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { useProductStore } from "../../../../store/useProductStore";
import ProductForm from "../../../../components/admin/products/ProductForm";

export default function NewProductPage() {
    const { getToken } = useAuth();
    const { isSubmitting, createProduct } = useProductStore();

    const onSubmit = async (data: Record<string, unknown>, imageFiles: File[]) => {
        const tags = typeof data.tags === 'string' ? data.tags : '';
        const tagsArray = tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [];

        const payload = {
            ...data,
            description: typeof data.description === 'string' ? data.description.trim() || undefined : undefined,
            collectionId: typeof data.collectionId === 'string' ? data.collectionId.trim() || undefined : undefined,
            certificateNo: typeof data.certificateNo === 'string' ? data.certificateNo.trim() || undefined : undefined,
            metaTitle: typeof data.metaTitle === 'string' ? data.metaTitle.trim() || undefined : undefined,
            metaDescription: typeof data.metaDescription === 'string' ? data.metaDescription.trim() || undefined : undefined,
            tags: tagsArray,
        };

        const success = await createProduct(payload, getToken, imageFiles);

        if (success) {
            toast.success("Product created successfully!");
        }
        return success;
    };

    return (
        <ProductForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            title="Add New Product"
        />
    );
}
