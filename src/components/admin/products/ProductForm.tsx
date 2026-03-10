"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import PageHeader from "@/components/admin/shared/PageHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useDropzone } from 'react-dropzone';
import Image from "next/image";

const productSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  sku: z.string().min(3, "SKU is required"),
  weight: z.coerce.number().min(0, "Weight must be positive"),
  description: z.string().optional(),
  tags: z.string().optional(),
  
  price: z.coerce.number().min(0, "Price must be positive"),
  comparePrice: z.coerce.number().optional(),
  stockQuantity: z.coerce.number().min(0).optional(),
  lowStockThreshold: z.coerce.number().min(0).optional(),
  
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).default("DRAFT"),
  isFeatured: z.boolean().default(false),
  
  category: z.enum([
    "RINGS", "NECKLACES", "BANGLES", "EARRINGS", "BRACELETS", 
    "PENDANTS", "CHAINS", "ANKLETS", "NOSE_PINS", "MAANG_TIKKA", "OTHER"
  ]),
  collectionId: z.string().optional(),
  metalType: z.enum([
    "GOLD_22K", "GOLD_18K", "GOLD_14K", "PLATINUM", 
    "SILVER_925", "SILVER_999", "WHITE_GOLD", "ROSE_GOLD", "OTHER"
  ]),
  gemstoneType: z.enum([
    "NONE", "DIAMOND", "RUBY", "EMERALD", "SAPPHIRE", 
    "PEARL", "CUBIC_ZIRCONIA", "OTHER"
  ]).default("NONE"),
  
  bisHallmark: z.boolean().default(false),
  certificateNo: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    initialValues?: Partial<ProductFormValues> & { images?: Record<string, unknown>[] };
    onSubmit: (data: ProductFormValues, imageFiles: File[]) => Promise<boolean>;
    onDeleteExistingImage?: (mediaId: string) => Promise<boolean>;
    isSubmitting: boolean;
    title: string;
}

export default function ProductForm({ initialValues, onSubmit, onDeleteExistingImage, isSubmitting, title }: ProductFormProps) {
    const router = useRouter();
    
    // Image Management State
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
    const [imagePreviews, setImagePreviews] = useState<{ id?: string, url: string, isExisting: boolean }[]>(
        initialValues?.images?.map(img => ({
            id: typeof img.id === 'string' ? img.id : undefined,
            url: typeof img.url === 'string' ? img.url : '',
            isExisting: true
        })) || []
    );
    
    // Cleanup previews on unmount
    React.useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => {
                if (!preview.isExisting) {
                    URL.revokeObjectURL(preview.url);
                }
            });
        };
    }, [imagePreviews]);

    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        // Prevent exceeding 8 images
        if (imagePreviews.length + acceptedFiles.length > 8) {
            toast.error("Maximum 8 images allowed");
            return;
        }

        const newPreviews = acceptedFiles.map(file => ({
            url: URL.createObjectURL(file),
            isExisting: false
        }));
        
        setImageFiles(prev => [...prev, ...acceptedFiles]);
        setImagePreviews(prev => [...prev, ...newPreviews]);
    }, [imagePreviews]);

    const removeImage = async (index: number) => {
        const previewToRemove = imagePreviews[index];
        
        if (!previewToRemove.isExisting) {
            // Newly added file — just remove from local state
            const newFileIndex = imagePreviews.slice(0, index).filter(p => !p.isExisting).length;
            const newFiles = [...imageFiles];
            newFiles.splice(newFileIndex, 1);
            setImageFiles(newFiles);
            URL.revokeObjectURL(previewToRemove.url);
            setImagePreviews(prev => prev.filter((_, i) => i !== index));
        } else {
            // Existing image — call the backend delete API
            if (!previewToRemove.id || !onDeleteExistingImage) {
                toast.error("Cannot delete this image.");
                return;
            }
            setDeletingImageId(previewToRemove.id);
            const success = await onDeleteExistingImage(previewToRemove.id);
            setDeletingImageId(null);
            if (success) {
                setImagePreviews(prev => prev.filter((_, i) => i !== index));
                toast.success("Image deleted.");
            }
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp']
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        maxFiles: 8
    });
    
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: initialValues?.name ?? "",
            sku: initialValues?.sku ?? "",
            weight: initialValues?.weight ?? 0,
            price: initialValues?.price ?? 0,
            description: initialValues?.description ?? "",
            tags: initialValues?.tags ?? "",
            comparePrice: initialValues?.comparePrice ?? undefined,
            stockQuantity: initialValues?.stockQuantity ?? undefined,
            lowStockThreshold: initialValues?.lowStockThreshold ?? undefined,
            metaTitle: initialValues?.metaTitle ?? "",
            metaDescription: initialValues?.metaDescription ?? "",
            category: initialValues?.category ?? "RINGS",
            collectionId: initialValues?.collectionId ?? "",
            certificateNo: initialValues?.certificateNo ?? "",
            status: initialValues?.status ?? "DRAFT",
            isFeatured: initialValues?.isFeatured ?? false,
            metalType: initialValues?.metalType ?? "SILVER_925",
            gemstoneType: initialValues?.gemstoneType ?? "NONE",
            bisHallmark: initialValues?.bisHallmark ?? false,
        }
    });

    const onSubmitHandler = async (data: Record<string, unknown>) => {
        const parsedData = productSchema.parse(data);
        const success = await onSubmit(parsedData, imageFiles);
        if (success) {
            router.push("/admin-panel/products");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit((d) => onSubmitHandler(d))}>
                <PageHeader
                    title={title}
                    breadcrumbs={[
                        { label: "Dashboard", href: "/admin-panel/dashboard" },
                        { label: "Products", href: "/admin-panel/products" },
                        { label: title },
                    ]}
                    actions={
                        <>
                            <Button variant="outline" size="sm" type="button" onClick={() => router.back()} disabled={isSubmitting}>
                                <ArrowLeft size={16} /> Cancel
                            </Button>
                            <Button 
                                variant="primary" 
                                size="sm" 
                                type="button"
                                onClick={() => {
                                    setValue('status', 'DRAFT');
                                    handleSubmit((d) => onSubmitHandler(d))();
                                }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting && watch('status') === 'DRAFT' ? <Loader2 size={16} className="animate-spin" /> : null}
                                Save as Draft
                            </Button>
                            <Button 
                                variant="emerald" 
                                size="sm" 
                                type="button"
                                onClick={() => {
                                    setValue('status', 'PUBLISHED');
                                    handleSubmit((d) => onSubmitHandler(d))();
                                }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting && watch('status') === 'PUBLISHED' ? <Loader2 size={16} className="animate-spin" /> : null}
                                Publish
                            </Button>
                        </>
                    }
                />

                <div className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Basic Information</h2>
                            <div className="space-y-5">
                                <div>
                                    <Input label="Product Name" placeholder="Elegant Floral Silver Necklace" {...register("name")} />
                                    {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <Input label="SKU" placeholder="SLV-XXX" {...register("sku")} />
                                        {errors.sku && <p className="text-error text-xs mt-1">{errors.sku.message}</p>}
                                    </div>
                                    <div>
                                        <Input label="Weight (grams)" type="number" step="0.01" placeholder="24.5" {...register("weight")} />
                                        {errors.weight && <p className="text-error text-xs mt-1">{errors.weight.message}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="label-uppercase block mb-2 text-charcoal">Description</label>
                                    <textarea
                                        {...register("description")}
                                        rows={5}
                                        className="w-full px-4 py-3 text-sm rounded-md border border-border text-charcoal placeholder:text-muted-light focus:outline-none focus:border-charcoal resize-none"
                                        placeholder="Detailed product description..."
                                    />
                                </div>
                                <Input label="Tags (comma separated)" placeholder="Silver, Handmade, Necklace" {...register("tags")} />
                            </div>
                        </section>

                        {/* Pricing */}
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Pricing</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div>
                                    <Input label="Base Price (₹)" type="number" placeholder="5999" {...register("price")} />
                                    {errors.price && <p className="text-error text-xs mt-1">{errors.price.message}</p>}
                                </div>
                                <div>
                                    <Input label="Sale Price (₹)" type="number" placeholder="4999" {...register("comparePrice")} />
                                </div>
                                <div>
                                    <Input label="Stock Quantity" type="number" placeholder="15" {...register("stockQuantity")} />
                                </div>
                            </div>
                            <div className="mt-5">
                                <Input label="Low Stock Threshold" type="number" placeholder="5" {...register("lowStockThreshold")} />
                            </div>
                        </section>

                        {/* Images */}
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Product Images</h2>
                            <div 
                                {...getRootProps()} 
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                                    ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-charcoal/30'}`}
                            >
                                <input {...getInputProps()} />
                                <Upload size={32} className={`mx-auto mb-3 ${isDragActive ? 'text-primary' : 'text-muted'}`} />
                                <p className="text-sm font-medium text-charcoal mb-1">
                                    {isDragActive ? "Drop the images here" : "Click to upload or drag and drop"}
                                </p>
                                <p className="text-xs text-muted">PNG, JPG, WEBP up to 5MB. Maximum 8 images.</p>
                            </div>

                            {imagePreviews.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={preview.id ?? preview.url} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                                            <Image 
                                                src={preview.url} 
                                                alt={`Preview ${index + 1}`} 
                                                fill
                                                className="object-cover"
                                            />
                                            {/* Delete button */}
                                            {deletingImageId === preview.id ? (
                                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                                    <Loader2 size={18} className="animate-spin text-charcoal" />
                                                </div>
                                            ) : (
                                                <button 
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error hover:text-white"
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                            {index === 0 && (
                                                <span className="absolute bottom-1 left-1 text-[9px] font-medium bg-emerald text-white px-1.5 py-0.5 rounded shadow">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* SEO */}
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">SEO</h2>
                            <div className="space-y-5">
                                <Input label="Meta Title" placeholder="Elegant Floral Silver Necklace | Silvaniya" {...register("metaTitle")} />
                                <div>
                                    <label className="label-uppercase block mb-2 text-charcoal">Meta Description</label>
                                    <textarea
                                        {...register("metaDescription")}
                                        rows={3}
                                        className="w-full px-4 py-3 text-sm rounded-md border border-border text-charcoal placeholder:text-muted-light focus:outline-none focus:border-charcoal resize-none"
                                        placeholder="Search engine description..."
                                    />
                                </div>
                                <Input 
                                    label="URL Slug (Auto-generated)" 
                                    disabled 
                                    value={watch('name') ? watch('name').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : ""}
                                    placeholder="elegant-floral-silver-necklace" 
                                />
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Visibility */}
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Visibility</h2>
                            <div className="space-y-4">
                                <select {...register("status")} className="w-full h-10 px-3 text-sm rounded-md border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal">
                                    <option value="DRAFT">Draft</option>
                                    <option value="PUBLISHED">Published</option>
                                    <option value="ARCHIVED">Archived</option>
                                </select>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="isFeatured" {...register("isFeatured")} className="rounded border-gray-300 text-charcoal focus:ring-charcoal" />
                                    <label htmlFor="isFeatured" className="text-sm font-medium text-charcoal">Is Featured</label>
                                </div>
                            </div>
                        </section>

                        {/* Category */}
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Organization</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="label-uppercase block mb-2 text-charcoal">Category *</label>
                                    <select {...register("category")} className="w-full h-10 px-3 text-sm rounded-md border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal">
                                        <option value="">Select category...</option>
                                        <option value="RINGS">Rings</option>
                                        <option value="NECKLACES">Necklaces</option>
                                        <option value="BANGLES">Bangles</option>
                                        <option value="EARRINGS">Earrings</option>
                                        <option value="BRACELETS">Bracelets</option>
                                        <option value="PENDANTS">Pendants</option>
                                        <option value="CHAINS">Chains</option>
                                        <option value="ANKLETS">Anklets</option>
                                        <option value="NOSE_PINS">Nose Pins</option>
                                        <option value="MAANG_TIKKA">Maang Tikka</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                    {errors.category && <p className="text-error text-xs mt-1">{errors.category.message}</p>}
                                </div>
                                <Input label="Collection ID (Optional UUID)" placeholder="00000000-0000-0000-0000-000000000000" {...register("collectionId")} />
                                <div>
                                    <label className="label-uppercase block mb-2 text-charcoal">Metal Type</label>
                                    <select {...register("metalType")} className="w-full h-10 px-3 text-sm rounded-md border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal">
                                        <option value="GOLD_22K">22K Gold</option>
                                        <option value="GOLD_18K">18K Gold</option>
                                        <option value="GOLD_14K">14K Gold</option>
                                        <option value="PLATINUM">Platinum</option>
                                        <option value="SILVER_925">925 Silver</option>
                                        <option value="SILVER_999">999 Silver</option>
                                        <option value="WHITE_GOLD">White Gold</option>
                                        <option value="ROSE_GOLD">Rose Gold</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label-uppercase block mb-2 text-charcoal">Gemstone Type</label>
                                    <select {...register("gemstoneType")} className="w-full h-10 px-3 text-sm rounded-md border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal">
                                        <option value="NONE">None</option>
                                        <option value="DIAMOND">Diamond</option>
                                        <option value="RUBY">Ruby</option>
                                        <option value="EMERALD">Emerald</option>
                                        <option value="SAPPHIRE">Sapphire</option>
                                        <option value="PEARL">Pearl</option>
                                        <option value="CUBIC_ZIRCONIA">Cubic Zirconia</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Certification */}
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Certification</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="bisHallmark" {...register("bisHallmark")} className="rounded border-gray-300 text-charcoal focus:ring-charcoal" />
                                    <label htmlFor="bisHallmark" className="text-sm font-medium text-charcoal">BIS Hallmark</label>
                                </div>
                                <Input label="Certificate No." placeholder="CERT-XXXXX" {...register("certificateNo")} />
                            </div>
                        </section>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
