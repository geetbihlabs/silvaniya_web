"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

import { useCategoryStore, Category, CreateCategoryDto, UpdateCategoryDto } from "@/store/useCategoryStore";
import { Button } from "@/components/ui/Button";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isVisible: z.boolean().default(true),
  sortOrder: z.coerce.number().min(0, "Sort order must be 0 or greater").default(0),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: Category;
  mode: "create" | "edit";
}

export default function CategoryForm({ initialData, mode }: CategoryFormProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const { createCategory, updateCategory, uploadImage, isLoading } = useCategoryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1
  });

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  React.useEffect(() => {
    return () => {
      if (imageFile && imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imageFile, imagePreview]);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      imageUrl: initialData?.imageUrl || "",
      isVisible: initialData?.isVisible ?? true,
      sortOrder: initialData?.sortOrder || 0,
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      let finalImageUrl = data.imageUrl || imagePreview || undefined;

      if (imageFile) {
        toast.loading("Uploading image...", { id: "categoryImage" });
        const uploadedUrl = await uploadImage(imageFile, getToken);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
          toast.success("Image uploaded successfully!", { id: "categoryImage" });
        } else {
          toast.error("Failed to upload image. Please try again.", { id: "categoryImage" });
          setIsSubmitting(false);
          return;
        }
      }

      const payload = { ...data, imageUrl: finalImageUrl };

      if (mode === "create") {
        const result = await createCategory(payload as CreateCategoryDto, getToken);
        if (result) {
          router.push("/admin-panel/categories");
          router.refresh();
        }
      } else if (mode === "edit" && initialData) {
        const result = await updateCategory(initialData.id, payload as UpdateCategoryDto, getToken);
        if (result) {
          router.push("/admin-panel/categories");
          router.refresh();
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormLoading = isLoading || isSubmitting;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin-panel/categories"
          className="p-2 border border-border rounded-lg text-muted hover:text-charcoal hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-playfair font-semibold text-charcoal">
            {mode === "create" ? "Add Category" : "Edit Category"}
          </h1>
          <p className="text-sm text-muted">
            {mode === "create" ? "Create a new product category." : "Update an existing product category."}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-charcoal">Category Name *</label>
              <input
                {...form.register("name")}
                className="w-full h-11 px-4 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald transition-all"
                placeholder="e.g. Rings, Necklaces"
              />
              {form.formState.errors.name && (
                <p className="text-xs text-error">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-charcoal">Sort Order</label>
              <input
                type="number"
                {...form.register("sortOrder")}
                className="w-full h-11 px-4 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald transition-all"
                placeholder="0"
              />
              {form.formState.errors.sortOrder && (
                <p className="text-xs text-error">{form.formState.errors.sortOrder.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-charcoal">Description (Optional)</label>
            <textarea
              {...form.register("description")}
              className="w-full p-4 text-sm rounded-lg border border-border text-charcoal focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald transition-all min-h-[100px] resize-y"
              placeholder="Brief description of the category..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-charcoal">Category Image (Optional)</label>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer
                ${isDragActive ? 'border-emerald bg-emerald/5' : 'border-border hover:border-charcoal/30'}`}
            >
              <input {...getInputProps()} />
              {!imagePreview ? (
                <>
                  <Upload size={28} className={`mx-auto mb-2 ${isDragActive ? 'text-emerald' : 'text-muted'}`} />
                  <p className="text-sm font-medium text-charcoal mb-1">
                    {isDragActive ? "Drop the image here" : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted">PNG, JPG, WEBP up to 5MB.</p>
                </>
              ) : null}
            </div>

            {imagePreview && (
              <div className="mt-4 relative w-32 h-32 bg-gray-50 rounded-lg overflow-hidden border border-border group">
                <Image 
                  src={imagePreview} 
                  alt="Category preview" 
                  fill
                  className="object-cover"
                />
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error hover:text-white pointer-events-auto"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <input type="hidden" {...form.register("imageUrl")} />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                id="isVisible"
                {...form.register("isVisible")}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border checked:border-emerald checked:bg-emerald transition-all"
              />
              <svg
                className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <label htmlFor="isVisible" className="text-sm font-medium text-charcoal cursor-pointer select-none">
              Visible on Storefront
            </label>
          </div>

          <div className="pt-6 border-t border-border flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin-panel/categories")}
              disabled={isFormLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isFormLoading}>
              {isFormLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {mode === "create" ? "Create Category" : "Save Changes"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
