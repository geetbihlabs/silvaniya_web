"use client";

import React from "react";
import Link from "next/link";
import { 
  PlusCircle, 
  ShoppingCart, 
  MessageSquare, 
  AlertTriangle,
  Package,
  FileText,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStore } from "@/store/useDashboardStore";

interface QuickActionItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  badgeCount?: number;
  color: "emerald" | "blue" | "amber" | "rose";
}

const quickActions: QuickActionItem[] = [
  {
    title: "Add New Product",
    description: "Create a new jewelry product",
    icon: <PlusCircle size={20} />,
    href: "/admin-panel/products/create",
    color: "emerald"
  },
  {
    title: "Process Orders",
    description: "Handle pending orders",
    icon: <ShoppingCart size={20} />,
    href: "/admin-panel/orders?status=PENDING_PAYMENT",
    badgeCount: 0, // Will be populated by data
    color: "blue"
  },
  {
    title: "Support Tickets",
    description: "Respond to customer queries",
    icon: <MessageSquare size={20} />,
    href: "/admin-panel/support",
    badgeCount: 0, // Will be populated by data
    color: "amber"
  },
  {
    title: "Low Stock Items",
    description: "Review inventory alerts",
    icon: <AlertTriangle size={20} />,
    href: "/admin-panel/products?stock=low",
    badgeCount: 0, // Will be populated by data
    color: "rose"
  },
  {
    title: "Pending Reviews",
    description: "Moderate product reviews",
    icon: <Package size={20} />,
    href: "/admin-panel/reviews?status=PENDING",
    badgeCount: 0, // Will be populated by data
    color: "blue"
  },
  {
    title: "Generate Reports",
    description: "Export sales and analytics",
    icon: <FileText size={20} />,
    href: "/admin-panel/reports",
    color: "emerald"
  }
];

export default function QuickActionsPanel() {
  const { quickStats, isQuickStatsLoading: isLoading } = useDashboardStore();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Update badge counts with real data
  const actionsWithCounts = quickActions.map(action => {
    let badgeCount = action.badgeCount;
    
    if (quickStats) {
      switch (action.title) {
        case "Process Orders":
          badgeCount = quickStats.pendingOrders;
          break;
        case "Support Tickets":
          badgeCount = quickStats.openTickets;
          break;
        case "Low Stock Items":
          badgeCount = quickStats.lowStockItems;
          break;
        case "Pending Reviews":
          badgeCount = quickStats.pendingReviews;
          break;
      }
    }
    
    return { ...action, badgeCount };
  });

  const getColorClasses = (color: string) => {
    switch (color) {
      case "emerald":
        return "hover:bg-emerald-50 hover:border-emerald-200";
      case "blue":
        return "hover:bg-blue-50 hover:border-blue-200";
      case "amber":
        return "hover:bg-amber-50 hover:border-amber-200";
      case "rose":
        return "hover:bg-rose-50 hover:border-rose-200";
      default:
        return "hover:bg-gray-50 hover:border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {actionsWithCounts.map((action) => (
            <Link 
              key={action.title}
              href={action.href}
              className={`block group ${getColorClasses(action.color)} transition-colors duration-200 rounded-lg border border-border`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      action.color === "emerald" ? "bg-emerald-100 text-emerald-600" :
                      action.color === "blue" ? "bg-blue-100 text-blue-600" :
                      action.color === "amber" ? "bg-amber-100 text-amber-600" :
                      "bg-rose-100 text-rose-600"
                    }`}>
                      {action.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal group-hover:text-emerald transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  
                  {action.badgeCount !== undefined && action.badgeCount > 0 && (
                    <Badge 
                      variant="error" 
                      className="rounded-full"
                    >
                      {action.badgeCount}
                    </Badge>
                  )}
                </div>
                
                <div className="mt-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-emerald hover:text-emerald-600 p-0 h-auto font-medium"
                  >
                    Take action →
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}