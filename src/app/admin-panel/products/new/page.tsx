"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import PageHeader from "@/components/admin/shared/PageHeader";

export default function NewProductPage() {
    return (
        <div>
            <PageHeader
                title="Add New Product"
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin-panel/dashboard" },
                    { label: "Products", href: "/admin-panel/products" },
                    { label: "New Product" },
                ]}
                actions={
                    <>
                        <Button variant="outline" size="sm" asChild><Link href="/admin-panel/products"><ArrowLeft size={16} /> Cancel</Link></Button>
                        <Button variant="primary" size="sm">Save as Draft</Button>
                        <Button variant="emerald" size="sm">Publish</Button>
                    </>
                }
            />

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Basic Information</h2>
                            <div className="space-y-5">
                                <Input label="Product Name" placeholder="Elegant Floral Silver Necklace" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <Input label="SKU" placeholder="SLV-XXX" />
                                    <Input label="Weight (grams)" type="number" placeholder="24.5" />
                                </div>
                                <div>
                                    <label className="label-uppercase block mb-2 text-charcoal">Description</label>
                                    <textarea
                                        rows={5}
                                        className="w-full px-4 py-3 text-sm rounded-md border border-border text-charcoal placeholder:text-muted-light focus:outline-none focus:border-charcoal resize-none"
                                        placeholder="Detailed product description..."
                                    />
                                </div>
                                <Input label="Short Description" placeholder="925 Sterling Silver | Handcrafted" />
                            </div>
                        </section>

                        {/* Pricing */}
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Pricing</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <Input label="Base Price (₹)" type="number" placeholder="5999" />
                                <Input label="Sale Price (₹)" type="number" placeholder="4999" />
                                <Input label="Stock Quantity" type="number" placeholder="15" />
                            </div>
                            <div className="mt-5">
                                <Input label="Low Stock Threshold" type="number" placeholder="5" />
                            </div>
                        </section>

                        {/* Images */}
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Product Images</h2>
                            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-charcoal/30 transition-colors cursor-pointer">
                                <Upload size={32} className="mx-auto text-muted mb-3" />
                                <p className="text-sm font-medium text-charcoal mb-1">Click to upload or drag and drop</p>
                                <p className="text-xs text-muted">PNG, JPG up to 5MB. Maximum 8 images.</p>
                            </div>
                            <div className="mt-4 grid grid-cols-4 gap-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="relative aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-xs text-muted group">
                                        Image {i}
                                        <button className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={12} className="text-error" />
                                        </button>
                                        {i === 1 && <span className="absolute bottom-1 left-1 text-[9px] bg-emerald text-white px-1.5 py-0.5 rounded">Primary</span>}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* SEO */}
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">SEO</h2>
                            <div className="space-y-5">
                                <Input label="Meta Title" placeholder="Elegant Floral Silver Necklace | Silvaniya" />
                                <div>
                                    <label className="label-uppercase block mb-2 text-charcoal">Meta Description</label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-3 text-sm rounded-md border border-border text-charcoal placeholder:text-muted-light focus:outline-none focus:border-charcoal resize-none"
                                        placeholder="Search engine description..."
                                    />
                                </div>
                                <Input label="URL Slug" placeholder="elegant-floral-silver-necklace" />
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Visibility */}
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Visibility</h2>
                            <select className="w-full h-10 px-3 text-sm rounded-md border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal">
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="ARCHIVED">Archived</option>
                            </select>
                        </section>

                        {/* Category */}
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Organization</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="label-uppercase block mb-2 text-charcoal">Category</label>
                                    <select className="w-full h-10 px-3 text-sm rounded-md border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal">
                                        <option value="">Select category...</option>
                                        <option value="Necklaces">Necklaces</option>
                                        <option value="Rings">Rings</option>
                                        <option value="Bracelets">Bracelets</option>
                                        <option value="Earrings">Earrings</option>
                                        <option value="Mangalsutras">Mangalsutras</option>
                                        <option value="Pendants">Pendants</option>
                                        <option value="Anklets">Anklets</option>
                                    </select>
                                </div>
                                <Input label="Collection" placeholder="Heritage Collection" />
                                <div>
                                    <label className="label-uppercase block mb-2 text-charcoal">Material</label>
                                    <select className="w-full h-10 px-3 text-sm rounded-md border border-border text-charcoal bg-white focus:outline-none focus:border-charcoal">
                                        <option value="925 Sterling Silver">925 Sterling Silver</option>
                                        <option value="999 Pure Silver">999 Pure Silver</option>
                                        <option value="Silver Plated">Silver Plated</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Certification */}
                        <section className="bg-white rounded-xl border border-border p-6">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Certification</h2>
                            <div className="space-y-4">
                                <Input label="Hallmark Number" placeholder="BIS-XXXXX" />
                                <Input label="Purity (%)" placeholder="92.5" />
                            </div>
                        </section>
                    </div>
                </div>
            </form>
        </div>
    );
}
