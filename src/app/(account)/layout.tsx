import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/layout/AccountSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <div className="max-w-7xl mx-auto py-8">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        <AccountSidebar />
                        <div className="flex-1 min-w-0">{children}</div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
