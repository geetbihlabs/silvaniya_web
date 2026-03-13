"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IndianRupee, ShoppingCart, UserPlus, TrendingUp, AlertTriangle, Package, ExternalLink, RefreshCw } from "lucide-react";
import StatsCard from "@/components/admin/shared/StatsCard";
import StatusBadge from "@/components/admin/shared/StatusBadge";
import PageHeader from "@/components/admin/shared/PageHeader";
import RevenueTrendChart from "@/components/admin/dashboard/RevenueTrendChart";
import OrderDistributionChart from "@/components/admin/dashboard/OrderDistributionChart";
import TopProductsChart from "@/components/admin/dashboard/TopProductsChart";
import QuickActionsPanel from "@/components/admin/dashboard/QuickActionsPanel";
import { useDashboardStore } from "@/store/useDashboardStore";
import { formatCurrency, formatNumber } from "@/hooks/useDashboardData";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { mockInventoryAlerts, mockSupportTickets } from "@/data/admin-mock-data";

export default function DashboardPage() {
  const {
    dashboardData: data,
    recentOrders,
    isLoading,
    isOrdersLoading: ordersLoading,
    error,
    refreshAll,
    fetchDashboardData,
    fetchRecentOrders
  } = useDashboardStore();
  
  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      // Mock getToken function for now - replace with actual auth implementation
      const getToken = async () => localStorage.getItem('auth-token');
      await refreshAll(getToken);
    };
    
    initializeData();
  }, []);
  
  const openTickets = mockSupportTickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS");

  // Handle loading state
  if (isLoading && !data) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          subtitle={`Welcome back! Loading dashboard data...`}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          subtitle="Error loading dashboard data"
        />
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-800 mb-4">Failed to load dashboard data</p>
          <Button 
            onClick={async () => {
              const getToken = async () => localStorage.getItem('auth-token');
              await refreshAll(getToken);
            }} 
            variant="outline"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Use real data or fallback to mock data
  const kpis = data?.kpis || {
    totalRevenue: "0",
    totalOrders: 0,
    totalCustomers: 0,
    openTickets: 0,
    pendingReviews: 0,
    lowStockProducts: 0
  };

  const revenueTrend = data?.revenueTrend || [];
  const orderDistribution = data?.orderDistribution || {};
  const topProducts = data?.topProducts || [];
  
  // Calculate change percentages (mock data for now)
  const stats = {
    totalRevenue: parseFloat(kpis.totalRevenue),
    totalOrders: kpis.totalOrders,
    newCustomers: kpis.totalCustomers,
    avgOrderValue: kpis.totalOrders > 0 ? parseFloat(kpis.totalRevenue) / kpis.totalOrders : 0,
    revenueChange: 12.5,
    ordersChange: 8.3,
    customersChange: 15.2,
    aovChange: -2.1,
  };

    return (
        <div>
            <PageHeader
                title="Dashboard"
                subtitle={`Welcome back! Here's what's happening today — ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
                actions={
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={async () => {
                        const getToken = async () => localStorage.getItem('auth-token');
                        await refreshAll(getToken);
                      }} 
                      variant="outline" 
                      size="sm"
                      disabled={isLoading}
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                      {isLoading ? 'Refreshing...' : 'Refresh'}
                    </Button>
                  </div>
                }
            />
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    change={stats.revenueChange}
                    icon={<IndianRupee size={20} />}
                />
                <StatsCard
                    title="Total Orders"
                    value={formatNumber(stats.totalOrders)}
                    change={stats.ordersChange}
                    icon={<ShoppingCart size={20} />}
                />
                <StatsCard
                    title="New Customers"
                    value={formatNumber(stats.newCustomers)}
                    change={stats.customersChange}
                    icon={<UserPlus size={20} />}
                />
                <StatsCard
                    title="Avg. Order Value"
                    value={formatCurrency(stats.avgOrderValue)}
                    change={stats.aovChange}
                    icon={<TrendingUp size={20} />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Analytics Charts - 2 cols */}
                <div className="lg:col-span-2 space-y-6">
                    <RevenueTrendChart 
                      data={revenueTrend} 
                      isLoading={isLoading || !data} 
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <OrderDistributionChart 
                          data={orderDistribution} 
                          isLoading={isLoading || !data} 
                        />
                        <TopProductsChart 
                          data={topProducts} 
                          isLoading={isLoading || !data} 
                        />
                    </div>
                </div>
                
                {/* Quick Actions Panel - 1 col */}
                <div className="lg:max-w-md">
                    <QuickActionsPanel />
                </div>
            </div>

            {/* Recent Orders and Alerts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders - 2 cols */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-border">
                    <div className="flex items-center justify-between p-5 border-b border-border">
                        <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider">Recent Orders</h2>
                        <Link href="/admin-panel/orders" className="text-xs text-emerald font-semibold hover:underline flex items-center gap-1">
                            View All <ExternalLink size={12} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        {ordersLoading ? (
                            <div className="p-8 text-center">
                                <Skeleton className="h-4 w-32 mx-auto mb-4" />
                                <Skeleton className="h-4 w-48 mx-auto" />
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-[11px] text-muted uppercase tracking-wider border-b border-border">
                                        <th className="px-5 py-3 font-semibold">Order</th>
                                        <th className="px-5 py-3 font-semibold">Customer</th>
                                        <th className="px-5 py-3 font-semibold">Amount</th>
                                        <th className="px-5 py-3 font-semibold">Status</th>
                                        <th className="px-5 py-3 font-semibold">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order: any) => (
                                        <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-gray-50/50">
                                            <td className="px-5 py-3">
                                                <Link href={`/admin-panel/orders/${order.id}`} className="font-semibold text-charcoal hover:text-emerald">
                                                    {order.orderNumber}
                                                </Link>
                                            </td>
                                            <td className="px-5 py-3 text-charcoal">{order.user.firstName} {order.user.lastName}</td>
                                            <td className="px-5 py-3 font-medium text-charcoal">{formatCurrency(order.totalAmount)}</td>
                                            <td className="px-5 py-3"><StatusBadge type="order" value={order.status} /></td>
                                            <td className="px-5 py-3 text-muted">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
