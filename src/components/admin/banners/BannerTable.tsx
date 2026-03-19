"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff,
  Plus,
  Calendar,
  ExternalLink
} from "lucide-react";
import { Banner } from "@/types/admin.types";
import { useBannerStore } from "@/store/useBannerStore";
import { useAuth } from "@clerk/nextjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { format } from "date-fns";

interface BannerTableProps {
  onEdit: (banner: Banner) => void;
  onCreate: () => void;
}

export default function BannerTable({ onEdit, onCreate }: BannerTableProps) {
  const { banners, loading, error, fetchBanners, deleteBanner, activateBanner, deactivateBanner } = useBannerStore();
  const { getToken } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners(getToken);
  }, [fetchBanners, getToken]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    
    setDeletingId(id);
    try {
      await deleteBanner(id, getToken);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (banner: Banner) => {
    try {
      if (banner.isActive) {
        await deactivateBanner(banner.id, getToken);
      } else {
        await activateBanner(banner.id, getToken);
      }
    } catch (error) {
      console.error("Failed to toggle banner status:", error);
    }
  };

  const getPositionBadge = (position: string) => {
    const variants: Record<string, "default" | "emerald" | "outline" | "outline-emerald" | "warning" | "info"> = {
      HERO: "default",
      CATEGORY_BANNER: "emerald",
      PRODUCT_SHOWCASE: "outline",
      FOOTER_PROMO: "outline-emerald"
    };
    
    return (
      <Badge variant={variants[position] || "default"}>
        {position.replace(/_/g, " ")}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => (
    <Badge variant={isActive ? "success" : "muted"}>
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );

  if (loading && (!banners || banners.length === 0)) {
    return (
      <div className="bg-white rounded-xl border border-border p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading banners...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-border p-8 text-center">
        <div className="text-red-500 mb-2">Error loading banners</div>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <h2 className="text-xl font-semibold">All Banners</h2>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Banner
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(banners) && banners.length > 0 ? (
              banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={banner.imageUrl} 
                        alt={banner.title}
                        className="w-16 h-10 object-cover rounded-md border"
                      />
                      <div>
                        <div className="font-medium">{banner.title}</div>
                        {banner.description && (
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {banner.description}
                          </div>
                        )}
                        {banner.targetUrl && (
                          <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                            <ExternalLink className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{banner.targetUrl}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                
                <TableCell>{getPositionBadge(banner.position)}</TableCell>
                
                <TableCell>
                  <button 
                    onClick={() => handleToggleStatus(banner)}
                    className="cursor-pointer"
                  >
                    {getStatusBadge(banner.isActive)}
                  </button>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {banner.startDate && (
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar className="w-3 h-3" />
                        <span>Start: {format(new Date(banner.startDate), "MMM dd, yyyy")}</span>
                      </div>
                    )}
                    {banner.endDate && (
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar className="w-3 h-3" />
                        <span>End: {format(new Date(banner.endDate), "MMM dd, yyyy")}</span>
                      </div>
                    )}
                    {!banner.startDate && !banner.endDate && (
                      <span className="text-xs text-muted-foreground">No schedule</span>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge variant="outline">{banner.sortOrder}</Badge>
                </TableCell>
                
                <TableCell>
                  {format(new Date(banner.createdAt), "MMM dd, yyyy")}
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(banner)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(banner.id)}
                      disabled={deletingId === banner.id}
                    >
                      {deletingId === banner.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="text-muted-foreground">
                    {loading ? 'Loading banners...' : 'No banners found. Create your first banner to get started.'}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
