"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Banner, BannerPosition } from "@/types/admin.types";
import { useBannerStore } from "@/store/useBannerStore";
import { useAuth } from "@clerk/nextjs";
import { X, Upload, Calendar, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";

interface BannerFormProps {
  banner?: Banner;
  onSave: () => void;
  onCancel: () => void;
}

const POSITION_OPTIONS: { value: BannerPosition; label: string }[] = [
  { value: "HERO", label: "Hero Banner" },
  { value: "CATEGORY_BANNER", label: "Category Banner" },
  { value: "PRODUCT_SHOWCASE", label: "Product Showcase" },
  { value: "FOOTER_PROMO", label: "Footer Promo" },
];

export default function BannerForm({ banner, onSave, onCancel }: BannerFormProps) {
  const { createBanner, updateBanner, loading, uploadImage } = useBannerStore();
  const { getToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: banner?.title || "",
    description: banner?.description || "",
    imageUrl: banner?.imageUrl || "",
    targetUrl: banner?.targetUrl || "",
    position: banner?.position || "HERO",
    startDate: banner?.startDate ? format(new Date(banner.startDate), "yyyy-MM-dd") : "",
    endDate: banner?.endDate ? format(new Date(banner.endDate), "yyyy-MM-dd") : "",
    isActive: banner?.isActive ?? true,
    sortOrder: banner?.sortOrder.toString() || "0",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    } else if (!isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "Please enter a valid URL";
    }
    
    if (formData.targetUrl && !isValidUrl(formData.targetUrl)) {
      newErrors.targetUrl = "Please enter a valid URL";
    }
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ imageUrl: 'Please select an image file' });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ imageUrl: 'Image size must be less than 5MB' });
      return;
    }

    setUploading(true);
    try {
      const publicUrl = await uploadImage(file, getToken);
      if (publicUrl) {
        setFormData(prev => ({ ...prev, imageUrl: publicUrl }));
        setErrors(prev => ({ ...prev, imageUrl: '' }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const bannerData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        imageUrl: formData.imageUrl.trim(),
        targetUrl: formData.targetUrl.trim() || undefined,
        position: formData.position,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        isActive: formData.isActive,
        sortOrder: parseInt(formData.sortOrder) || 0,
      };
      
      if (banner) {
        await updateBanner(banner.id, bannerData, getToken);
      } else {
        await createBanner(bannerData, getToken);
      }
      
      onSave();
    } catch (error) {
      console.error("Failed to save banner:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <h2 className="text-xl font-semibold">
          {banner ? "Edit Banner" : "Create New Banner"}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter banner title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Position *</Label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm"
            >
              {POSITION_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter banner description (optional)"
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image *</Label>
          <div className="flex gap-2">
            <Input
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/banner-image.jpg or upload an image"
              className={errors.imageUrl ? "border-red-500" : ""}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={triggerFileInput}
              disabled={uploading}
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl}</p>}
          
          {formData.imageUrl && (
            <div className="mt-2">
              <div className="relative group">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="w-full h-40 object-cover rounded-md border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="targetUrl">Target URL</Label>
          <Input
            id="targetUrl"
            name="targetUrl"
            value={formData.targetUrl}
            onChange={handleChange}
            placeholder="https://example.com/promotion (optional)"
            className={errors.targetUrl ? "border-red-500" : ""}
          />
          {errors.targetUrl && <p className="text-sm text-red-500">{errors.targetUrl}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <div className="relative">
              <Input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
              <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <div className="relative">
              <Input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={errors.endDate ? "border-red-500" : ""}
              />
              <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
            </div>
            {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              type="number"
              id="sortOrder"
              name="sortOrder"
              value={formData.sortOrder}
              onChange={handleChange}
              min="0"
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              banner ? "Update Banner" : "Create Banner"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
