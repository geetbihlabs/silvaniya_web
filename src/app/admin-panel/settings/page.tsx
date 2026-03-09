"use client";

import React from "react";
import PageHeader from "@/components/admin/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminSettingsPage() {
    return (
        <div>
            <PageHeader
                title="Settings"
                subtitle="Manage your admin panel preferences"
                breadcrumbs={[{ label: "Dashboard", href: "/admin-panel/dashboard" }, { label: "Settings" }]}
            />

            <div className="max-w-2xl space-y-6">
                {/* Store Info */}
                <section className="bg-white rounded-xl border border-border p-6">
                    <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Store Information</h2>
                    <div className="space-y-5">
                        <Input label="Store Name" defaultValue="Silvaniya Jewellery" />
                        <Input label="Store Email" defaultValue="concierge@silvaniya.com" />
                        <Input label="Store Phone" defaultValue="+91 1800-SILVA-99" />
                        <Input label="GST Number" placeholder="GSTIN..." />
                    </div>
                </section>

                {/* Notifications */}
                <section className="bg-white rounded-xl border border-border p-6">
                    <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-5">Notifications</h2>
                    <div className="space-y-4">
                        {[
                            { label: "New order placed", desc: "Receive an alert when a new order is placed" },
                            { label: "Low stock warning", desc: "Get notified when products fall below threshold" },
                            { label: "New support ticket", desc: "Alert when a customer creates a ticket" },
                            { label: "Return requested", desc: "Notification when a return is requested" },
                        ].map((item) => (
                            <label key={item.label} className="flex items-start justify-between gap-4 p-3 rounded-lg border border-border hover:bg-gray-50 cursor-pointer">
                                <div>
                                    <p className="text-sm font-medium text-charcoal">{item.label}</p>
                                    <p className="text-xs text-muted">{item.desc}</p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-5 h-5 mt-0.5 accent-emerald" />
                            </label>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end">
                    <Button variant="emerald" size="lg">Save Settings</Button>
                </div>
            </div>
        </div>
    );
}
