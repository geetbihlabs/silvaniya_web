"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string;
    change: number; // percentage
    icon: React.ReactNode;
    className?: string;
}

export default function StatsCard({ title, value, change, icon, className }: StatsCardProps) {
    const isPositive = change >= 0;
    return (
        <div className={cn("bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow", className)}>
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center text-charcoal">
                    {icon}
                </div>
                <div className={cn(
                    "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                    isPositive ? "bg-green-50 text-success" : "bg-red-50 text-error"
                )}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(change)}%
                </div>
            </div>
            <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-1">{title}</p>
            <p className="text-2xl font-bold text-charcoal">{value}</p>
        </div>
    );
}
