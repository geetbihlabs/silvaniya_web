"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Loader2, AlertTriangle, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import PageHeader from "@/components/admin/shared/PageHeader";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useAuth } from "@clerk/nextjs";

export default function AdminCategoriesPage() {
  const { getToken } = useAuth();
  const { categories, isLoading, fetchCategories, deleteCategory } = useCategoryStore();
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setIsDeleting(true);
    await deleteCategory(confirmDelete.id, getToken);
    setIsDeleting(false);
    setConfirmDelete(null);
  };

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle={`Manage your product categories`}
        breadcrumbs={[{ label: "Dashboard", href: "/admin-panel/dashboard" }, { label: "Categories" }]}
        actions={
          <Button variant="primary" size="sm" asChild>
            <Link href="/admin-panel/categories/new">
              <Plus size={16} className="mr-2" /> 
              Add Category
            </Link>
          </Button>
        }
      />

      <div className="bg-white rounded-xl border border-border overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-muted uppercase tracking-wider border-b border-border bg-gray-50/50">
                <th className="px-5 py-3 font-semibold">Image</th>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Slug</th>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Visibility</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">
                    <Loader2 size={24} className="animate-spin mx-auto" />
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted">
                    No categories found. Start by creating one.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-b border-border/50 last:border-0 hover:bg-gray-50/30">
                    <td className="px-5 py-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center shrink-0 border border-border/50">
                        {category.imageUrl ? (
                          <Image
                            src={category.imageUrl}
                            alt={category.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={16} className="text-muted/50" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-charcoal">{category.name}</td>
                    <td className="px-5 py-4 text-muted font-mono text-xs">{category.slug}</td>
                    <td className="px-5 py-4 text-charcoal">{category.sortOrder}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-[10px] font-semibold rounded-full uppercase tracking-wider ${
                          category.isVisible
                            ? "bg-emerald/10 text-emerald"
                            : "bg-gray-100 text-muted"
                        }`}
                      >
                        {category.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin-panel/categories/${category.id}/edit`}
                          className="p-1.5 text-muted hover:text-charcoal hover:bg-gray-100 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => setConfirmDelete({ id: category.id, name: category.name })}
                          className="p-1.5 text-muted hover:text-error hover:bg-red-50 rounded-md transition-colors"
                          title="Delete category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isDeleting && setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle size={20} className="text-error" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-charcoal">Delete Category?</h3>
                <p className="mt-1 text-sm text-muted">
                  Are you sure you want to delete <span className="font-medium text-charcoal">&ldquo;{confirmDelete.name}&rdquo;</span>? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-charcoal bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-error hover:bg-red-700 rounded-lg transition-colors"
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
