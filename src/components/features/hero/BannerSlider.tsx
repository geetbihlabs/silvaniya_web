"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Banner } from "@/types/admin.types";

interface BannerSliderProps {
  banners: Banner[];
  isLoading?: boolean;
}

export default function BannerSlider({ banners, isLoading = false }: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filter only active HERO banners and sort by sortOrder
  const heroBanners = banners
    .filter((b) => b.position === "HERO" && b.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const totalSlides = heroBanners.length;

  // Go to previous slide
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  }, [totalSlides]);

  // Go to next slide
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  }, [totalSlides]);

  // Go to specific slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [goToNext, isPaused, totalSlides]);

  // Reset index if banners change
  useEffect(() => {
    if (currentIndex >= totalSlides && totalSlides > 0) {
      setCurrentIndex(0);
    }
  }, [totalSlides, currentIndex]);

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="relative w-full aspect-4/5 sm:aspect-video md:aspect-1138/488 rounded-2xl md:rounded-[20px] overflow-hidden bg-[#222024]">
        {/* Skeleton Background */}
        <Skeleton className="absolute inset-0 w-full h-full rounded-2xl md:rounded-[20px] bg-gray-300" />
        
        {/* Skeleton Content - Text Area */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-0 left-0 md:left-[clamp(32px,6%,80px)] max-w-[500px]">
          {/* Skeleton Label */}
          <Skeleton className="h-3 w-48 mb-[18px] rounded bg-gray-300/80" />
          
          {/* Skeleton Title Lines */}
          <div className="space-y-3 mb-6 md:mb-8">
            <Skeleton className="h-8 md:h-10 w-full rounded bg-gray-300/80" />
            <Skeleton className="h-8 md:h-10 w-3/4 rounded bg-gray-300/80" />
            <Skeleton className="h-8 md:h-10 w-1/2 rounded bg-gray-300/80" />
          </div>
          
          {/* Skeleton CTA Button */}
          <Skeleton className="h-[72px] w-[180px] rounded bg-gray-300/80" />
        </div>
      </div>
    );
  }

  // No banners - show placeholder
  if (totalSlides === 0) {
    return (
      <div className="relative w-full aspect-4/5 sm:aspect-video md:aspect-1138/488 rounded-2xl md:rounded-[20px] overflow-hidden bg-[#222024]">
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <p className="text-lg">No banners available</p>
        </div>
      </div>
    );
  }

  // Single banner - no need for slider
  if (totalSlides === 1) {
    return (
      <SingleBannerSlide banner={heroBanners[0]} />
    );
  }

  const currentBanner = heroBanners[currentIndex];

  return (
    <div 
      className="relative w-full aspect-4/5 sm:aspect-video md:aspect-1138/488 rounded-2xl md:rounded-[20px] overflow-hidden bg-[#222024]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {heroBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <SingleBannerSlide banner={banner} />
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center cursor-pointer z-10 transition-all duration-300 shadow-lg hover:shadow-xl group"
        aria-label="Previous banner"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-charcoal group-hover:text-emerald transition-colors" />
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white flex items-center justify-center cursor-pointer z-10 transition-all duration-300 shadow-lg hover:shadow-xl group"
        aria-label="Next banner"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-charcoal group-hover:text-emerald transition-colors" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 z-10">
        {heroBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 md:w-10 h-3 bg-emerald"
                : "w-3 h-3 bg-white/60 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar (optional visual indicator for auto-rotation) */}
      {!isPaused && totalSlides > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-emerald transition-all duration-300 ease-linear"
            style={{
              width: `${((currentIndex + 1) / totalSlides) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}

// Single Banner Slide Component
function SingleBannerSlide({ banner }: { banner: Banner }) {
  return (
    <div className="relative w-full h-full">
      {/* Banner Image */}
      <Image
        src={banner.imageUrl}
        alt={banner.title}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/hero.png";
        }}
      />



      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-0 left-0 md:left-[clamp(32px,6%,80px)] max-w-[500px]">
        {/* Label/Description */}
        {banner.description && (
          <p className="font-body text-[10.5px] font-semibold tracking-[0.25em] uppercase text-white mb-[18px] animate-fade-in">
            {banner.description}
          </p>
        )}

        {/* Title */}
        <h1 className="font-heading font-medium leading-[1.12] text-white mb-6 md:mb-8 animate-fade-in-up"
          style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
          <span className="block font-normal text-white font-playfair">
            {banner.title.split(' ').slice(0, 3).join(' ')}
          </span>
          <span className="block font-normal text-white font-playfair">
            {banner.title.split(' ').slice(3, 5).join(' ')}
          </span>
          <span className="block italic font-normal text-emerald font-playfair">
            {banner.title.split(' ').slice(5).join(' ')}
          </span>
        </h1>

        {/* CTA Button */}
        {banner.targetUrl && (
          <div className="animate-fade-in-delayed">
            <Link
              href={banner.targetUrl}
              className="inline-block py-[18px] px-12 bg-emerald text-white font-body text-[11px] font-semibold tracking-[0.2em] uppercase border-none rounded cursor-pointer transition-all duration-300 hover:bg-emerald-dark"
            >
              Shop Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
