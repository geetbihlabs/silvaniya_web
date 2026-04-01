"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Loader2, Save, ArrowLeft, Upload } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import PageHeader from "@/components/admin/shared/PageHeader";
import { Testimonial, useTestimonialAdminStore } from "@/store/useTestimonialAdminStore";

interface TestimonialFormProps {
  title: string;
  testimonial?: Testimonial;
}

export default function TestimonialForm({ title, testimonial }: TestimonialFormProps) {
  const router = useRouter();
  const { createTestimonial, updateTestimonial, isSubmitting, uploadImage } = useTestimonialAdminStore();
  const { getToken } = useAuth();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: testimonial?.name || "",
    city: testimonial?.city || "",
    text: testimonial?.text || "",
    avatarUrl: testimonial?.avatarUrl || "",
    rating: testimonial?.rating?.toString() || "5",
    isActive: testimonial?.isActive ?? true,
    sortOrder: testimonial?.sortOrder?.toString() || "0",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.text.trim()) newErrors.text = "Quote text is required";
    if (formData.avatarUrl && !isValidUrl(formData.avatarUrl)) {
      newErrors.avatarUrl = "Please enter a valid URL";
    }
    const ratingNum = parseInt(formData.rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      newErrors.rating = "Rating must be between 1 and 5";
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

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    setUploading(true);
    try {
      const publicUrl = await uploadImage(file, getToken);
      if (publicUrl) {
        setFormData((prev) => ({ ...prev, avatarUrl: publicUrl }));
        setErrors((prev) => ({ ...prev, avatarUrl: "" }));
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = {
        name: formData.name.trim(),
        city: formData.city.trim() || undefined,
        text: formData.text.trim(),
        avatarUrl: formData.avatarUrl.trim() || undefined,
        rating: parseInt(formData.rating),
        isActive: formData.isActive,
        sortOrder: parseInt(formData.sortOrder) || 0,
      };

      let success;
      if (testimonial) {
        success = await updateTestimonial(testimonial.id, data, getToken);
      } else {
        success = await createTestimonial(data, getToken);
      }
      if (success) router.push("/admin-panel/testimonials");
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <>
      <PageHeader
        title={title}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin-panel/dashboard" },
          { label: "Testimonials", href: "/admin-panel/testimonials" },
          { label: title },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft size={16} /> Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left: Main Area */}
          <div className="space-y-5">
            {/* Basic Info */}
            <section className="bg-white rounded-xl border border-border p-6">
              <h3 className="text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-5">
                Customer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">
                    Customer Name <span className="text-error">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Priya Sharma"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">
                    City / Location
                  </label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Testimonial Quote <span className="text-error">*</span>
                </label>
                <Textarea
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  placeholder="The silver quality is exceptional..."
                  rows={4}
                  className={errors.text ? "border-red-500" : ""}
                />
                {errors.text && <p className="text-sm text-red-500 mt-1">{errors.text}</p>}
              </div>
            </section>

            {/* Media */}
            <section className="bg-white rounded-xl border border-border p-6">
              <h3 className="text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-5">
                Avatar Image
              </h3>
              <div className="space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    uploading ? "border-gray-300 bg-gray-50" : "border-border hover:border-charcoal hover:bg-gray-50/50"
                  }`}
                  onClick={() => !uploading && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-charcoal/40" />
                      <span className="text-sm font-medium text-muted">Uploading image...</span>
                    </div>
                  ) : formData.avatarUrl ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm bg-gray-50">
                        <img
                          src={formData.avatarUrl}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                        />
                      </div>
                      <div className="text-xs font-medium text-charcoal bg-white border border-border px-3 py-1.5 rounded-full shadow-sm">
                        Click to change image
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                        <Upload className="w-5 h-5 text-gray-400" />
                      </div>
                      <span className="text-sm font-semibold text-charcoal">Click to upload avatar</span>
                      <span className="text-xs text-muted">Max size: 2MB</span>
                    </div>
                  )}
                </div>
                {errors.avatarUrl && <p className="text-sm text-center text-red-500 mt-1">{errors.avatarUrl}</p>}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            {/* Status & Options */}
            <section className="bg-white rounded-xl border border-border p-6">
              <h3 className="text-[11px] font-bold tracking-[0.14em] uppercase text-muted mb-5">
                Display Options
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">
                    Rating (1-5)
                  </label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={handleChange}
                  />
                  {errors.rating && <p className="text-sm text-red-500 mt-1">{errors.rating}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-1.5">
                    Sort Order
                  </label>
                  <Input
                    id="sortOrder"
                    name="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={handleChange}
                    placeholder="0 (Lower shows first)"
                  />
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded border-gray-300 text-charcoal focus:ring-charcoal mt-0.5"
                    />
                    <div>
                      <label htmlFor="isActive" className="text-sm font-medium text-charcoal cursor-pointer">
                        Active
                      </label>
                      <p className="text-[11px] text-muted mt-0.5">Show on homepage</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="w-full h-[46px] flex items-center justify-center gap-2 bg-charcoal text-white text-[13px] font-semibold rounded-lg hover:bg-charcoal/90 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSubmitting ? "Saving..." : testimonial ? "Update Testimonial" : "Add Testimonial"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
