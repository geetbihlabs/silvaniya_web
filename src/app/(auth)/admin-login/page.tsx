"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, validate credentials via an API here.
        window.location.href = "/admin-panel/dashboard";
    };

    return (
        <div className="w-full max-w-[400px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden m-4 border border-black/5">
            <div className="p-8 sm:p-10">
                <div className="flex flex-col items-center">
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex justify-center mb-1">
                            <Image
                                src="/logo.png"
                                alt="Silvaniya"
                                width={180}
                                height={40}
                                className="object-contain"
                                priority
                            />
                        </div>
                        {/* <span className="text-[9px] tracking-[0.2em] text-charcoal/60 uppercase">
                            Administrator Portal
                        </span> */}
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-semibold text-charcoal mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                            Admin Login
                        </h2>
                        <p className="text-sm text-muted">
                            Restricted access. Please log in with your<br />administrative credentials.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="w-full space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">
                                Email Address
                            </label>
                            <div className="relative flex items-center w-full h-12 bg-gray-50/80 rounded border border-gray-100/50 overflow-hidden focus-within:ring-1 focus-within:ring-charcoal focus-within:border-charcoal transition-all">
                                <div className="flex items-center justify-center w-12 h-full text-charcoal/40">
                                    <Mail size={16} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="admin@silvaniya.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 h-full bg-transparent outline-none text-charcoal font-medium placeholder:text-gray-300 placeholder:font-normal pr-4"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">
                                    Password
                                </label>
                            </div>
                            <div className="relative flex items-center w-full h-12 bg-gray-50/80 rounded border border-gray-100/50 overflow-hidden focus-within:ring-1 focus-within:ring-charcoal focus-within:border-charcoal transition-all">
                                <div className="flex items-center justify-center w-12 h-full text-charcoal/40">
                                    <Lock size={16} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex-1 h-full bg-transparent outline-none text-charcoal font-medium placeholder:text-gray-300 placeholder:font-normal pr-4"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            className="w-full h-12 rounded mt-2 flex items-center justify-center gap-2"
                            type="submit"
                        >
                            Sign In to Dashboard <ArrowRight size={16} />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
