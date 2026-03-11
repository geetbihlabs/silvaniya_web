"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import { useCategoryStore, Category } from "@/store/useCategoryStore";

export default function EditCategoryPage() {
  const { id } = useParams() as { id: string };
  const { getCategory } = useCategoryStore();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategory() {
      if (id) {
        const data = await getCategory(id);
        setCategory(data);
        setLoading(false);
      }
    }
    loadCategory();
  }, [id, getCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-charcoal/40" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-muted">
        Category not found.
      </div>
    );
  }

  return <CategoryForm mode="edit" initialData={category} />;
}
