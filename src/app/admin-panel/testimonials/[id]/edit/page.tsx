"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TestimonialForm from "@/components/admin/testimonials/TestimonialForm";
import { useTestimonialAdminStore, Testimonial } from "@/store/useTestimonialAdminStore";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function EditTestimonialPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { fetchTestimonialById } = useTestimonialAdminStore();
  const { getToken, isLoaded } = useAuth();
  
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && id) {
      const loadData = async () => {
        const data = await fetchTestimonialById(id, getToken);
        if (data) {
          setTestimonial(data);
        } else {
          router.push("/admin-panel/testimonials");
        }
        setLoading(false);
      };
      
      loadData();
    }
  }, [id, isLoaded, getToken, fetchTestimonialById, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!testimonial) {
    return null;
  }

  return <TestimonialForm title="Edit Testimonial" testimonial={testimonial} />;
}
