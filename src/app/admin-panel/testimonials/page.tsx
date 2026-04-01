"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTestimonialAdminStore } from "@/store/useTestimonialAdminStore";
import { useAuth } from "@clerk/nextjs";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function TestimonialsAdminPage() {
  const { testimonials, meta, isLoading, fetchTestimonials, toggleStatus, deleteTestimonial } = useTestimonialAdminStore();
  const { getToken, isLoaded } = useAuth();
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (isLoaded) {
      fetchTestimonials(getToken, page, limit);
    }
  }, [isLoaded, fetchTestimonials, getToken, page]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete testimonial by ${name}?`)) {
      await deleteTestimonial(id, getToken);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    toggleStatus(id, currentStatus, getToken);
  };

  if (isLoading && testimonials.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground hidden sm:block">
            Manage customer quotes for the homepage
          </p>
        </div>
        <Button asChild>
          <Link href="/admin-panel/testimonials/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-border text-charcoal/70">
              <tr>
                <th className="px-6 py-4 font-medium">Customer Info</th>
                <th className="px-6 py-4 font-medium">Quote Snippet</th>
                <th className="px-6 py-4 font-medium">Status / Sort</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {t.avatarUrl ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                          <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 flex items-center justify-center text-gray-500 font-bold">
                          {t.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-charcoal">{t.name}</div>
                        {t.city && <div className="text-xs text-muted-foreground">{t.city}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-[250px]">
                    <div className="truncate text-gray-600" title={t.text}>
                      "{t.text}"
                    </div>
                    <div className="text-xs text-emerald font-medium mt-1">
                      {t.rating} Stars
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 items-start">
                      <button
                        onClick={() => handleToggleStatus(t.id, t.isActive)}
                        className={`px-2 py-1 text-[11px] font-semibold rounded-full hover:opacity-80 transition-opacity ${
                          t.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        title="Click to toggle status"
                      >
                        {t.isActive ? "ACTIVE" : "INACTIVE"}
                      </button>
                      <span className="text-xs text-muted-foreground border px-2 py-0.5 rounded">
                        Sort: {t.sortOrder}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="icon" asChild className="h-8 w-8">
                        <Link href={`/admin-panel/testimonials/${t.id}/edit`}>
                          <Edit className="h-4 w-4 text-gray-600" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(t.id, t.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                    No testimonials found. Add your first customer highlight!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-1">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium">{(page - 1) * limit + 1}</span>–
            <span className="font-medium">{Math.min(page * limit, meta.total)}</span>{" "}
            of <span className="font-medium">{meta.total}</span> testimonials
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              ← Prev
            </Button>
            <span className="text-sm font-medium px-2">
              Page {page} of {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages || isLoading}
            >
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
