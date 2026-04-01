"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TestimonialForm from "@/components/admin/testimonials/TestimonialForm";

export default function NewTestimonialPage() {
  return <TestimonialForm title="Create Testimonial" />;
}
