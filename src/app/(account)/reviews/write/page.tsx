"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Star, ImagePlus, X } from "lucide-react";

const PRODUCT = {
    name: "Infinity Link Bracelet",
    price: "$120.00",
    collection: "925 Sterling Silver",
};

export default function WriteReviewPage() {
    const [rating, setRating] = useState(4);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [recommend, setRecommend] = useState(false);
    const [photos, setPhotos] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach((file) => {
            const url = URL.createObjectURL(file);
            setPhotos((prev) => [...prev, url]);
        });
    };

    const removePhoto = (i: number) => {
        setPhotos((prev) => prev.filter((_, idx) => idx !== i));
    };

    if (submitted) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[#f0f9f7] flex items-center justify-center mx-auto mb-4">
                        <Star size={28} className="text-[#107c6f] fill-[#107c6f]" />
                    </div>
                    <h2 className="text-[26px] font-bold text-charcoal mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                        Thank You!
                    </h2>
                    <p className="text-[13px] text-muted mb-6">Your review has been submitted successfully.</p>
                    <Link
                        href="/orders"
                        className="inline-flex items-center px-6 h-11 bg-charcoal text-white text-[13px] font-semibold rounded-lg hover:bg-charcoal/90 transition-colors"
                    >
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-12 px-4">
            <div className="max-w-[640px] mx-auto">

                {/* ======== HEADER ======== */}
                <div className="text-center mb-8">
                    <h1
                        className="text-[38px] sm:text-[44px] font-bold text-charcoal mb-2 leading-tight"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Share Your Experience
                    </h1>
                    <p className="text-[13px] text-muted leading-relaxed">
                        Your feedback helps us refine our craftsmanship and guide<br className="hidden sm:block" /> others in finding their perfect piece.
                    </p>
                </div>

                {/* ======== PRODUCT CARD ======== */}
                <div className="bg-[#f5f5f3] rounded-xl flex items-center gap-4 px-5 py-4 mb-8">
                    <div className="w-[72px] h-[72px] shrink-0 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-[10px] text-white/20 overflow-hidden">
                        Img
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1">Reviewing</p>
                        <p className="text-[16px] font-bold text-charcoal leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
                            {PRODUCT.name}
                        </p>
                        <p className="text-[13px] text-[#107c6f] font-semibold mt-0.5">{PRODUCT.price}</p>
                    </div>
                </div>

                {/* ======== STAR RATING ======== */}
                <div className="text-center mb-7">
                    <p className="text-[10px] font-bold text-[#107c6f] uppercase tracking-widest mb-3">Overall Rating</p>
                    <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => {
                            const filled = star <= (hoveredRating || rating);
                            return (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(star)}
                                    className="transition-transform hover:scale-110 active:scale-95"
                                    aria-label={`Rate ${star} stars`}
                                >
                                    <Star
                                        size={32}
                                        strokeWidth={1.5}
                                        className={filled ? "text-[#107c6f] fill-[#107c6f]" : "text-[#d8d8d2]"}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ======== FORM FIELDS ======== */}
                <div className="space-y-5 mb-6">
                    {/* Review Title */}
                    <div>
                        <label className="block text-[13px] font-semibold text-charcoal mb-1.5">Review Title</label>
                        <input
                            type="text"
                            placeholder="Summarize your experience"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full h-11 px-4 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors"
                        />
                    </div>

                    {/* Review Message */}
                    <div>
                        <label className="block text-[13px] font-semibold text-charcoal mb-1.5">Review Message</label>
                        <textarea
                            rows={5}
                            placeholder="What did you love about this piece? How was the fit and finish?"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-3 text-[13px] text-charcoal rounded-lg border border-[#d8d8d2] bg-white placeholder:text-gray-400 focus:outline-none focus:border-charcoal transition-colors resize-none"
                        />
                    </div>

                    {/* Add Photos */}
                    <div>
                        <label className="block text-[13px] font-semibold text-charcoal mb-2">Add Photos</label>
                        <div className="flex flex-wrap gap-3">
                            {/* Upload zone */}
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="w-[120px] h-[90px] rounded-xl border-2 border-dashed border-[#d8d8d2] hover:border-charcoal/40 flex flex-col items-center justify-center gap-1.5 text-muted transition-colors"
                            >
                                <ImagePlus size={20} strokeWidth={1.5} />
                                <span className="text-[11px] font-medium">Upload</span>
                            </button>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handlePhotoUpload}
                            />
                            {/* Uploaded previews */}
                            {photos.map((src, i) => (
                                <div key={i} className="relative w-[120px] h-[90px] rounded-xl overflow-hidden border border-[#e8e8e4]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removePhoto(i)}
                                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-charcoal/70 hover:bg-charcoal flex items-center justify-center transition-colors"
                                    >
                                        <X size={10} strokeWidth={2.5} className="text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ======== RECOMMEND CHECKBOX ======== */}
                <label className="flex items-center gap-3 cursor-pointer mb-8 select-none">
                    <div
                        onClick={() => setRecommend(!recommend)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${recommend ? "bg-charcoal border-charcoal" : "border-[#d8d8d2] bg-white"}`}
                    >
                        {recommend && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </div>
                    <span className="text-[13px] text-charcoal">I would recommend this product to a friend</span>
                </label>

                {/* ======== SUBMIT ======== */}
                <div className="flex flex-col items-center gap-3">
                    <button
                        onClick={() => setSubmitted(true)}
                        className="w-full sm:w-[280px] h-[50px] bg-charcoal hover:bg-charcoal/90 text-white text-[14px] font-semibold rounded-lg transition-colors duration-200"
                    >
                        Submit Review
                    </button>
                    <p className="text-[11px] text-muted text-center">
                        By submitting, you agree to our{" "}
                        <Link href="/support" className="text-[#107c6f] hover:underline">Terms of Use</Link>
                        {" "}and{" "}
                        <Link href="/support" className="text-[#107c6f] hover:underline">Privacy Policy</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
