"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatNumber } from "@/hooks/useDashboardData";

interface TopProductsChartProps {
  data: { productId: string; name: string; salesCount: number; revenue: number }[];
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-border rounded-lg shadow-lg">
        <p className="text-sm font-medium text-charcoal mb-1 truncate max-w-48">
          {payload[0].payload.name}
        </p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="text-muted">Sales:</span>{" "}
            <span className="font-semibold">{formatNumber(payload[0].value)}</span>
          </p>
          <p className="text-sm">
            <span className="text-muted">Revenue:</span>{" "}
            <span className="font-semibold text-emerald">{formatCurrency(payload[0].payload.revenue)}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function TopProductsChart({ data, isLoading }: TopProductsChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <p className="text-muted text-center">No product data available</p>
        </CardContent>
      </Card>
    );
  }

  // Format data and truncate long product names
  const chartData = data.map(item => ({
    ...item,
    displayName: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis 
                type="number" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatNumber(value)}
              />
              <YAxis 
                dataKey="displayName" 
                type="category" 
                width={120}
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="salesCount"
                fill="#10b981"
                name="Units Sold"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}