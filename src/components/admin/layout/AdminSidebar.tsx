"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Headphones,
    // Settings,
    ChevronLeft,
    Gem,
    Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Dashboard", href: "/admin-panel/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/admin-panel/products", icon: Package },
    { label: "Categories", href: "/admin-panel/categories", icon: Layers },
    { label: "Orders", href: "/admin-panel/orders", icon: ShoppingCart },
    { label: "Customers", href: "/admin-panel/customers", icon: Users },
    { label: "Support", href: "/admin-panel/support", icon: Headphones },
    // { label: "Settings", href: "/admin-panel/settings", icon: Settings },
];

interface AdminSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen bg-charcoal text-white flex flex-col z-40 transition-all duration-300",
                collapsed ? "w-[68px]" : "w-[240px]"
            )}
        >
            {/* Logo */}
            <div className="h-16 flex items-center justify-center px-4 border-b border-white/10">
                {!collapsed && (
                    <Link href="/admin-panel/dashboard" className="flex items-center">
                        <Image
                            src="/logo-white-transparent.png"
                            alt="Silvaniya"
                            width={180}
                            height={40}
                            className="object-contain"
                        />
                    </Link>
                )}
                {collapsed && (
                    <Link href="/admin-panel/dashboard" className="flex items-center justify-center">
                        <Gem size={22} className="text-emerald-light" />
                    </Link>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-white/10 text-white"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon size={20} className="shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="px-2 pb-4 space-y-1 border-t border-white/10 pt-4 flex flex-col items-center">
                <button
                    onClick={onToggle}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all w-full"
                >
                    <ChevronLeft size={20} className={cn("shrink-0 transition-transform", collapsed && "rotate-180")} />
                    {!collapsed && <span>Collapse</span>}
                </button>
                <div className="pt-2 flex justify-center w-full">
                    <UserButton 
                        appearance={{ 
                            elements: { userButtonAvatarBox: "w-8 h-8", userButtonPopoverCard: "z-[100]" } 
                        }} 
                    />
                </div>
            </div>
        </aside>
    );
}
