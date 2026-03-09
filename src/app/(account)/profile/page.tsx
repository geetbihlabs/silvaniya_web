"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Camera, Shield, CheckCircle2, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
    return (
        <div className="max-w-4xl space-y-4">
            {/* <h1 className="text-3xl font-semibold text-charcoal" style={{ fontFamily: "var(--font-heading)" }}>
                My Account
            </h1> */}
            <p className="text-sm text-muted mb-8">Welcome back, John</p>

            {/* Profile Header Card */}
            <div className="bg-white rounded-xl border border-border p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Avatar with Camera Icon */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border border-border bg-gray-100 shrink-0 relative">
                            {/* Placeholder for AI generated male avatar */}
                            <Image
                                src="https://ui-avatars.com/api/?name=John+Doe&background=1F2933&color=fff&size=200"
                                alt="John Doe"
                                fill
                                unoptimized
                                className="object-cover"
                            />
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-emerald-dark transition-colors shadow-sm">
                            <Camera size={14} />
                        </button>
                    </div>

                    {/* Name & Member Since */}
                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-semibold text-charcoal mb-1.5" style={{ fontFamily: "var(--font-heading)" }}>
                            John Doe
                        </h2>
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-muted">
                            <Calendar size={14} />
                            <span>Member since October 2023</span>
                        </div>
                    </div>
                </div>

                {/* Membership Badge */}
                <div className="mt-4 sm:mt-2">
                    {/* <span className="inline-flex items-center px-4 py-1.5 bg-charcoal text-white text-xs font-semibold tracking-widest uppercase rounded-full shadow-sm">
                        Silver Member
                    </span> */}
                </div>
            </div>

            {/* Personal Information Card */}
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-charcoal" style={{ fontFamily: "var(--font-heading)" }}>
                        Personal Information
                    </h3>
                    <button className="flex items-center gap-1.5 text-sm font-semibold text-emerald hover:text-emerald-dark transition-colors">
                        <Edit2 size={14} />
                        Edit Profile
                    </button>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted uppercase tracking-wider">First Name</label>
                            <Input defaultValue="John" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Last Name</label>
                            <Input defaultValue="Doe" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5 relative">
                            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <Input type="email" defaultValue="john.doe@example.com" />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald">
                                    <CheckCircle2 size={18} />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1.5 relative">
                            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Mobile Number</label>
                            <div className="relative">
                                <Input type="tel" defaultValue="+1 (555) 000-1234" />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                    <span className="bg-emerald/10 text-emerald text-[10px] font-bold px-2 py-1 rounded border border-emerald/20 uppercase tracking-widest">
                                        Verified
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Date of Birth</label>
                            <Input type="text" defaultValue="05/15/1990" />
                        </div>
                    </div>
                </form>
            </div>

            {/* Security Card */}
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Shield size={20} className="text-emerald shrink-0" />
                            <h3 className="text-xl font-semibold text-charcoal" style={{ fontFamily: "var(--font-heading)" }}>
                                Security
                            </h3>
                        </div>
                        <p className="text-sm text-muted">
                            Keep your account secure by regularly updating your password.
                        </p>
                    </div>
                    <Button variant="outline" className="w-full sm:w-auto uppercase tracking-wide text-xs px-8 h-12 border-charcoal text-charcoal font-semibold hover:bg-charcoal hover:text-white">
                        Change Password
                    </Button>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-6 pt-4">
                <button className="text-sm font-semibold text-muted hover:text-charcoal uppercase tracking-wider transition-colors">
                    Cancel Changes
                </button>
                <Button variant="primary" className="uppercase tracking-wide text-xs px-8 h-12 font-semibold">
                    Save All Changes
                </Button>
            </div>
        </div>
    );
}
