import React from "react";
import Image from "next/image";
import { ProductImage } from "@/types/product.types";
import { cn } from "@/lib/utils";

interface ProductCardImageProps {
    images: ProductImage[];
    productName: string;
    className?: string;
}

export function ProductCardImage({ images, productName, className }: ProductCardImageProps) {
    const primaryImage = images.find((img) => img.isPrimary) || images[0];
    const hoverImage = images.length > 1 ? images[images.length - 1] : null;

    if (!primaryImage) {
        return (
            <div className={cn("w-full h-full bg-[#1a1a1a] flex items-center justify-center text-white/30 text-xs text-center p-4", className)}>
                {productName}
            </div>
        );
    }

    return (
        <div className={cn("relative w-full h-full group/image", className)}>
            {/* Primary Image */}
            <img
                src={primaryImage.url}
                alt={primaryImage.alt || productName}
                className={cn(
                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out",
                    hoverImage ? "opacity-100 group-hover/image:opacity-0" : "opacity-100"
                )}
            />

            {/* Hover Image (Last Image) */}
            {hoverImage && (
                <img
                    src={hoverImage.url}
                    alt={hoverImage.alt || productName}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover/image:opacity-100"
                />
            )}
        </div>
    );
}
