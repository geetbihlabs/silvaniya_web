"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminTopbar from "@/components/admin/layout/AdminTopbar";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { setGetTokenFn } from "@/lib/axios";

export default function AdminPanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { getToken } = useAuth();

    // Register Clerk's getToken globally so all axios calls auto-attach Bearer token
    useEffect(() => {
        setGetTokenFn(getToken);
    }, [getToken]);

    return (
        <div className="min-h-screen bg-[#f4f5f7]">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <AdminSidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="fixed left-0 top-0 z-50 lg:hidden">
                        <AdminSidebar
                            collapsed={false}
                            onToggle={() => setMobileMenuOpen(false)}
                        />
                    </div>
                </>
            )}

            {/* Main Content */}
            <div
                className={cn(
                    "transition-all duration-300",
                    sidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-[240px]"
                )}
            >
                <AdminTopbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
                <main className="p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}
