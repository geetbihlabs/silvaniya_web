"use client";

import React from "react";
import { Banner } from "@/types/admin.types";
import { ExternalLink } from "lucide-react";

interface BannerPreviewProps {
  banner: Banner;
  className?: string;
}

export default function BannerPreview({ banner, className = "" }: BannerPreviewProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg border bg-white shadow-sm ${className}`}>
      {/* Banner Image */}
      <div className="relative h-48 w-full">
        <img
          src={banner.imageUrl}
          alt={banner.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-banner.jpg';
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold mb-1">{banner.title}</h3>
          {banner.description && (
            <p className="text-sm opacity-90 mb-2">{banner.description}</p>
          )}
          
          {banner.targetUrl && (
            <div className="flex items-center gap-1 text-xs opacity-80">
              <ExternalLink className="w-3 h-3" />
              <span>Click to view</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="p-3 bg-gray-50 border-t">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              banner.isActive 
                ? "bg-green-100 text-green-800" 
                : "bg-gray-100 text-gray-800"
            }`}>
              {banner.isActive ? "Active" : "Inactive"}
            </span>
            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
              {banner.position.replace(/_/g, " ")}
            </span>
          </div>
          
          <div className="text-gray-500">
            Order: {banner.sortOrder}
          </div>
        </div>
        
        {(banner.startDate || banner.endDate) && (
          <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
            {banner.startDate && (
              <div>Scheduled: {new Date(banner.startDate).toLocaleDateString()}</div>
            )}
            {banner.endDate && (
              <div>Expires: {new Date(banner.endDate).toLocaleDateString()}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
