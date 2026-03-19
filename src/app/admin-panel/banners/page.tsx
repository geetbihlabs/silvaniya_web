"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Banner } from "@/types/admin.types";
import { useBannerStore } from "@/store/useBannerStore";
import BannerTable from "@/components/admin/banners/BannerTable";
import BannerForm from "@/components/admin/banners/BannerForm";
import BannerPreview from "@/components/admin/banners/BannerPreview";

export default function BannersPage() {
  const { error, clearError } = useBannerStore();
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | undefined>(undefined);

  const handleCreate = () => {
    setEditingBanner(undefined);
    setShowForm(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingBanner(undefined);
    clearError();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBanner(undefined);
    clearError();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
        <p className="text-gray-600 mt-1">
          Create and manage promotional banners for your storefront
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-red-800">Error</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
          <button 
            onClick={clearError}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content */}
      {showForm ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BannerForm
              banner={editingBanner}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
          <div>
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-semibold mb-4">Preview</h3>
              {editingBanner ? (
                <BannerPreview banner={editingBanner} />
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Fill in the form to see a preview of your banner
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <BannerTable 
          onEdit={handleEdit}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
