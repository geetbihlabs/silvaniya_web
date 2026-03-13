"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderDistributionChartProps {
  data: Record<string, number>;
  isLoading?: boolean;
}

// Color palette for different order statuses
const COLORS = {
  PENDING_PAYMENT: "#f59e0b",
  PAYMENT_CONFIRMED: "#3b82f6",
  PROCESSING: "#8b5cf6",
  QUALITY_CHECK: "#06b6d4",
  SHIPPED: "#10b981",
  OUT_FOR_DELIVERY: "#f97316",
  DELIVERED: "#16a34a",
  RETURN_REQUESTED: "#ef4444",
  RETURN_APPROVED: "#f97316",
  RETURN_REJECTED: "#dc2626",
  RETURNED: "#9ca3af",
  REFUNDED: "#6b7280",
  CANCELLED: "#6b7280"
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-border rounded-lg shadow-lg">
        <p className="text-sm font-medium text-charcoal capitalize">
          {payload[0].name.replace(/_/g, ' ').toLowerCase()}
        </p>
        <p className="text-sm text-emerald font-semibold">
          {payload[0].value} orders
        </p>
      </div>
    );
  }
  return null;
};

export default function OrderDistributionChart({ data, isLoading }: OrderDistributionChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Convert object to array format for Recharts
  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0) // Only show statuses with orders
    .map(([status, count]) => ({
      name: status,
      value: count,
      color: COLORS[status as keyof typeof COLORS] || "#9ca3af"
    }))
    .sort((a, b) => b.value - a.value); // Sort by count descending

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <p className="text-muted text-center">No order data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  `${name.replace(/_/g, ' ').split(' ').map(word => word[0]).join('').toUpperCase()} ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                formatter={(value) => (
                  <span className="capitalize text-sm">
                    {value.replace(/_/g, ' ').toLowerCase()}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}