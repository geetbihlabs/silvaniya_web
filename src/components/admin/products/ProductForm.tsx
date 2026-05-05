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
import api from "@/lib/axios";

const PRESET_SIZES = ["Free Size", "XS", "S", "M", "L", "XL", "XXL", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];

const productSchema = z.object({
    name: z.string().min(3, "Product name is required"),
    sellerName: z.string().optional(),
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

    isReturnable: z.boolean().default(true),
    refundPolicy: z.string().optional(),
    careInstructions: z.union([z.string(), z.array(z.string())]).optional(),
    allowPartialPayment: z.boolean().default(false),
    minBookingAmount: z.coerce.number().min(0).optional(),

    status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).default("DRAFT"),
    isFeatured: z.boolean().default(false),

    categoryId: z.string().min(1, "Please select a category"),
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

    sizes: z.array(z.string()).optional(),
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

    // Sizes Management State
    const [selectedSizes, setSelectedSizes] = useState<string[]>(
        Array.isArray((initialValues as any)?.sizes) ? (initialValues as any).sizes : []
    );
    const [customSizeInput, setCustomSizeInput] = useState("");

    const toggleSize = (size: string) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const addCustomSize = () => {
        const trimmed = customSizeInput.trim();
        if (trimmed && !selectedSizes.includes(trimmed)) {
            setSelectedSizes(prev => [...prev, trimmed]);
        }
        setCustomSizeInput("");
    };

    const removeSize = (size: string) => {
        setSelectedSizes(prev => prev.filter(s => s !== size));
    };

    // Categories Management State
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    // Fetch categories on mount
    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data?.data || []);
            } catch (err) {
                console.error("Failed to load categories:", err);
                toast.error("Failed to load categories");
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

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
        trigger,
        formState: { errors },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: initialValues?.name ?? "",
            sellerName: (initialValues as any)?.sellerName ?? "",
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
            isReturnable: initialValues?.isReturnable ?? true,
            refundPolicy: initialValues?.refundPolicy ?? "",
            careInstructions: initialValues?.careInstructions ?? [],
            allowPartialPayment: initialValues?.allowPartialPayment ?? false,
            minBookingAmount: initialValues?.minBookingAmount ?? undefined,
            categoryId: initialValues?.categoryId ?? "",
            collectionId: initialValues?.collectionId ?? "",
            certificateNo: initialValues?.certificateNo ?? "",
            status: initialValues?.status ?? "DRAFT",
            isFeatured: initialValues?.isFeatured ?? false,
            metalType: initialValues?.metalType ?? "SILVER_925",
            gemstoneType: initialValues?.gemstoneType ?? "NONE",
            bisHallmark: initialValues?.bisHallmark ?? false,
        }
    });

    // Convert careInstructions from array (API) to string for textarea (edit mode)
    React.useEffect(() => {
        const careValue = initialValues?.careInstructions;
        // Only convert if it's an array (from API in edit mode)
        if (careValue && Array.isArray(careValue) && careValue.length > 0) {
            setValue('careInstructions', careValue.join('\n') as any);
        }
    }, [initialValues?.careInstructions, setValue]);

    // Set categoryId from initialValues after categories are loaded (for edit mode)
    React.useEffect(() => {
        if (!isLoadingCategories && initialValues?.categoryId && categories.length > 0) {
            setValue('categoryId', initialValues.categoryId);
        }
    }, [isLoadingCategories, initialValues?.categoryId, categories.length, setValue]);

    const onSubmitHandler = async (data: Record<string, unknown>) => {
        // Convert careInstructions from string (textarea) to array before validation
        let processedData = { ...data };
        if (typeof data.careInstructions === 'string') {
            const lines = data.careInstructions.split('\n').map((line: string) => line.trim()).filter(Boolean);
            processedData.careInstructions = lines.length > 0 ? lines : [];
        }

        // Include selected sizes (empty array = no sizes = not sent)
        processedData.sizes = selectedSizes.length > 0 ? selectedSizes : [];

        const parsedData = productSchema.parse(processedData);
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
                                onClick={async () => {
                                    setValue('status', 'DRAFT');
                                    // Validate only required fields without auto-focus
                                    const isValid = await trigger(['name', 'sku', 'weight', 'price', 'categoryId']);
                                    if (isValid) {
                                        handleSubmit((d) => onSubmitHandler(d))();
                                    }
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
                                onClick={async () => {
                                    setValue('status', 'PUBLISHED');
                                    // Validate only required fields without auto-focus
                                    const isValid = await trigger(['name', 'sku', 'weight', 'price', 'categoryId']);
                                    if (isValid) {
                                        handleSubmit((d) => onSubmitHandler(d))();
                                    }
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
                                    <div>
                                        <Input
                                            label="Seller Name (Internal — not visible on storefront)"
                                            placeholder="e.g. Rajesh Kumar / Vernium Gold Pvt. Ltd."
                                            {...register("sellerName")}
                                        />
                                        <p className="text-[11px] text-muted mt-1">For internal tracking only. Use this to filter products by seller in the admin panel.</p>
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

                                    {/* Size Options */}
                                    <div>
                                        <label className="label-uppercase block mb-2 text-charcoal">
                                            Size Options
                                            <span className="ml-2 text-[10px] font-normal text-muted normal-case">(optional — leave empty if not applicable)</span>
                                        </label>

                                        {/* Preset size chips */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {PRESET_SIZES.map(size => (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    onClick={() => toggleSize(size)}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
                                                        selectedSizes.includes(size)
                                                            ? 'bg-charcoal text-white border-charcoal'
                                                            : 'bg-white text-charcoal border-border hover:border-charcoal/50'
                                                    }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Custom size input */}
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={customSizeInput}
                                                onChange={e => setCustomSizeInput(e.target.value)}
                                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomSize(); } }}
                                                placeholder="Add custom size (e.g. 22, 42, King)"
                                                className="flex-1 px-3 py-2 text-sm rounded-md border border-border text-charcoal placeholder:text-muted-light focus:outline-none focus:border-charcoal"
                                            />
                                            <button
                                                type="button"
                                                onClick={addCustomSize}
                                                className="px-3 py-2 text-xs font-medium rounded-md border border-border text-charcoal hover:bg-charcoal hover:text-white transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>

                                        {/* Selected sizes display */}
                                        {selectedSizes.length > 0 && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-[11px] text-muted mb-2">Selected sizes:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedSizes.map(size => (
                                                        <span
                                                            key={size}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-charcoal text-white text-xs rounded-full font-medium"
                                                        >
                                                            {size}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeSize(size)}
                                                                className="ml-0.5 hover:text-red-300 transition-colors"
                                                            >
                                                                <X size={10} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
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
                                    <div className="flex items-start gap-2">
                                        <input type="checkbox" id="isFeatured" {...register("isFeatured")} className="rounded border-gray-300 text-charcoal focus:ring-charcoal mt-0.5" />
                                        <div>
                                            <label htmlFor="isFeatured" className="text-sm font-medium text-charcoal cursor-pointer">
                                                🔥 Feature on Best Sellers Page
                                            </label>
                                            <p className="text-[11px] text-muted mt-0.5">This product will appear on the <strong>/best-sellers</strong> page visible to customers.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Category */}
                            <section className="bg-white rounded-xl border border-border p-6">
                                <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Organization</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="label-uppercase block mb-2 text-charcoal justify-between items-center">
                                            <span>Category *</span>
                                            {isLoadingCategories && <Loader2 size={12} className="animate-spin text-charcoal" />}
                                        </label>
                                        <select
                                            {...register("categoryId")}
                                            disabled={isLoadingCategories}
                                            className="w-full h-10 px-3 text-sm rounded-md border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal disabled:opacity-50"
                                        >
                                            <option value="">Select category...</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        {errors.categoryId && <p className="text-error text-xs mt-1">{errors.categoryId.message}</p>}
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

                            {/* Payment Options */}
                            <section className="bg-white rounded-xl border border-border p-6">
                                <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Payment Options</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="allowPartialPayment" {...register("allowPartialPayment")} className="rounded border-gray-300 text-charcoal focus:ring-charcoal" />
                                        <label htmlFor="allowPartialPayment" className="text-sm font-medium text-charcoal">Allow Partial Payment (Booking)</label>
                                    </div>
                                    {watch("allowPartialPayment") && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                            <Input label="Minimum Booking Amount (₹) *" type="number" placeholder="1000" {...register("minBookingAmount")} />
                                            {errors.minBookingAmount && <p className="text-error text-xs mt-1">{errors.minBookingAmount.message}</p>}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Returns & Refund Policy */}
                            <section className="bg-white rounded-xl border border-border p-6">
                                <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Returns & Shipping</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="isReturnable" {...register("isReturnable")} className="rounded border-gray-300 text-charcoal focus:ring-charcoal" />
                                        <label htmlFor="isReturnable" className="text-sm font-medium text-charcoal">Product is Returnable</label>
                                    </div>
                                    <div>
                                        <label className="label-uppercase block mb-2 text-charcoal">Returns & Shipping Policy</label>
                                        <textarea
                                            {...register("refundPolicy")}
                                            rows={4}
                                            className="w-full px-4 py-3 text-sm rounded-md border border-border text-charcoal placeholder:text-muted-light focus:outline-none focus:border-charcoal resize-none"
                                            placeholder="E.g., 7-day no questions asked return policy. Must include original packaging..."
                                        />
                                    </div>
                                    <div>
                                        <label className="label-uppercase block mb-2 text-charcoal">Care Instructions (one per line)</label>
                                        <textarea
                                            {...register("careInstructions")}
                                            rows={5}
                                            className="w-full px-4 py-3 text-sm rounded-md border border-border text-charcoal placeholder:text-muted-light focus:outline-none focus:border-charcoal resize-none"
                                            placeholder="Enter each care instruction on a new line&#10;Example:&#10;Store in the provided airtight pouch&#10;Clean with a soft polishing cloth&#10;Avoid contact with perfumes and water"
                                        />
                                        <p className="text-xs text-muted mt-1">Each line will be displayed as a separate bullet point</p>
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
