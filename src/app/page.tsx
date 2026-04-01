"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Loader2, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroCTA from "@/components/features/hero/HeroCTA";
import BannerSlider from "@/components/features/hero/BannerSlider";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useShopProductStore } from "@/store/useShopProductStore";
import { useBannerStore } from "@/store/useBannerStore";
import { useTestimonialStore } from "@/store/useTestimonialStore";

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// Hardcoded array removed in favor of dynamic API from useTestimonialStore

export default function HomePage() {
  const { categories, fetchCategories, isLoading: categoriesLoading } = useCategoryStore();
  const { products: trending, fetchProducts, isLoading: productsLoading } = useShopProductStore();
  const { banners, fetchActiveBanners, loading: bannersLoading } = useBannerStore();
  const { testimonials, fetchActiveTestimonials, isLoading: testimonialsLoading } = useTestimonialStore();

  useEffect(() => {
    fetchCategories();
    // Fetch only featured products for "Trending Now"
    fetchProducts({ isFeatured: true, limit: 4 });
    // Fetch active HERO banners (public route)
    fetchActiveBanners();
    // Fetch active Testimonials
    fetchActiveTestimonials();
  }, [fetchCategories, fetchProducts, fetchActiveBanners, fetchActiveTestimonials]);

  // Take top 4 categories
  const displayCategories = categories.filter((c) => c.isVisible).slice(0, 4);

  // Get active HERO banners
  const heroBanners = banners.filter(b => b.position === 'HERO' && b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const currentHeroBanner = heroBanners.length > 0 ? heroBanners[0] : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">

        {/* -------------------------- HERO ------------------------------ */}
        <section className="w-full bg-background py-4 md:py-6">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <BannerSlider banners={banners} isLoading={bannersLoading} />
          </div>
        </section>

        {/* ---------------------- SHOP BY CATEGORY ---------------------- */}
        <section className="bg-background py-8 md:py-12 w-full">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-row justify-between items-end md:items-center mb-8 md:mb-10">
              <div>
                <h2 className="italic text-[28px] md:text-[36px] font-normal text-charcoal leading-tight m-0 font-playfair">
                  Shop by Category
                </h2>
                <span className="block w-14 h-[2px] bg-emerald mt-2" />
              </div>
              <Link
                href="/products"
                className="font-body text-[14px] font-medium text-emerald no-underline hover:underline pb-1 md:pb-0"
              >
                View All →
              </Link>
            </div>

            {categoriesLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 size={32} className="animate-spin text-emerald" />
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-10">
                {displayCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/products?category=${cat.slug}`}
                    className="no-underline cursor-pointer block group"
                  >
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-charcoal relative">
                      {cat.imageUrl ? (
                        <Image
                          src={cat.imageUrl} alt={cat.name} fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover object-center transition-transform duration-400 ease-out group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-5 text-center font-body text-[12px] font-semibold tracking-[0.2em] uppercase text-charcoal">
                      {cat.name}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ------------------------ TRENDING NOW ------------------------ */}
        <section className="bg-background py-8 md:py-16 w-full">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="italic text-[32px] md:text-[42px] font-normal text-charcoal m-0 mb-[10px] font-playfair">
                Trending Now
              </h2>
              <p className="font-body text-[11px] font-semibold tracking-[0.22em] uppercase text-muted m-0">
                Our Most Loved Pieces This Week
              </p>
            </div>

            {productsLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 size={40} className="animate-spin text-emerald" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trending.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.07)] flex flex-col"
                  >
                    {/* Image area */}
                    <div className="relative w-full aspect-square overflow-hidden bg-[#f8f8f8]">
                      <Link href={`/products/${p.slug}`} className="block relative w-full h-full">
                        {p.images && p.images.length > 0 ? (
                          <Image
                            src={p.images[0].s3Url} alt={p.name} fill
                            sizes="(max-width: 640px) 50vw, 25vw"
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400 text-sm">No Image</span>
                          </div>
                        )}
                      </Link>
                      {/* Fake badge logic depending on creation date or tags. For now, we can omit if not in MVP or show NEW if recent */}
                      <button
                        className="absolute top-3 right-3 w-[34px] h-[34px] rounded-full bg-white/88 border-none flex items-center justify-center cursor-pointer z-10 hover:bg-white transition-colors"
                        aria-label="Add to wishlist"
                      >
                        <Heart size={16} className="text-silver-dark hover:text-red-500 transition-colors" fill="none" />
                      </button>
                    </div>
                    {/* Card content */}
                    <div className="p-[18px_20px_20px] flex-1 flex flex-col">
                      <Link href={`/products/${p.slug}`} className="no-underline group/link">
                        <p className="font-heading text-[16px] font-medium text-charcoal mb-1 leading-tight group-hover/link:text-emerald transition-colors line-clamp-1">
                          {p.name}
                        </p>
                        <p className="font-body text-[13px] font-normal text-muted mb-[14px]">
                          {p.metalType.replace(/_/g, ' ')}
                        </p>
                      </Link>
                      <div className="flex items-baseline gap-2 mb-[18px]">
                        <span className="font-body text-[18px] font-semibold text-charcoal tracking-[0.01em]">
                          {fmt(p.salePrice || p.basePrice)}
                        </span>
                        {p.salePrice && p.salePrice < p.basePrice && (
                          <span className="font-body text-[14px] font-normal text-silver-dark line-through">
                            {fmt(p.basePrice)}
                          </span>
                        )}
                      </div>
                      <Link href={`/products/${p.slug}`} className="mt-auto w-full py-3 text-center bg-transparent border-[1.5px] border-charcoal font-body text-[11px] font-semibold tracking-[0.18em] uppercase text-charcoal cursor-pointer transition-all duration-300 rounded hover:bg-charcoal hover:text-white no-underline">
                        VIEW PRODUCT
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ------------------------ TRUST BADGES ------------------------ */}
        <section className="bg-white border-t border-b border-border py-12 md:py-16 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-20 max-w-7xl mx-auto px-4 md:px-8">

            {/* Badge 1 — Hallmarked Silver */}
            <div className="flex flex-col items-center text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className="text-charcoal mb-5"
              >
                <path d="M12 2L3 7v5c0 5.25 3.75 10.05 9 11.25C17.25 22.05 21 17.25 21 12V7L12 2z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <p className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-charcoal mb-[10px]">
                Hallmarked Silver
              </p>
              <p className="font-body text-[14px] font-normal leading-relaxed text-muted max-w-[260px] mx-auto">
                Every piece is BIS hallmarked to ensure the highest standards of quality.
              </p>
            </div>

            {/* Badge 2 — Secure Shipping */}
            <div className="flex flex-col items-center text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className="text-charcoal mb-5"
              >
                <rect x="1" y="3" width="15" height="13" rx="1" />
                <path d="M16 8h4l3 5v3h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <p className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-charcoal mb-[10px]">
                Secure Shipping
              </p>
              <p className="font-body text-[14px] font-normal leading-relaxed text-muted max-w-[260px] mx-auto">
                Fully insured global shipping with real-time tracking for your peace of mind.
              </p>
            </div>

            {/* Badge 3 — Purity Certificate */}
            <div className="flex flex-col items-center text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className="text-charcoal mb-5"
              >
                <circle cx="12" cy="8" r="6" />
                <path d="M12 2l1.5 3.5L17 6l-2.5 2.5.5 3.5L12 10.5 9 12l.5-3.5L7 6l3.5-.5L12 2z" />
                <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
              </svg>
              <p className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-charcoal mb-[10px]">
                Purity Certificate
              </p>
              <p className="font-body text-[14px] font-normal leading-relaxed text-muted max-w-[260px] mx-auto">
                Authenticity guarantee included with every order for lifelong assurance.
              </p>
            </div>

          </div>
        </section>

        {/* ------------------------ BRAND STORY ------------------------ */}
        <section className="bg-background py-12 md:py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center max-w-7xl mx-auto px-4 md:px-8">

            {/* Left — Image */}
            <div className="relative">
              <div className="w-full aspect-[4/3.6] rounded-[20px] overflow-hidden bg-charcoal relative">
                <Image
                  src="/images/brand-story.jpg"
                  alt="Silver jewellery pieces on artisan dark wood workbench"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            {/* Right — Content */}
            <div className="flex flex-col justify-center">
              {/* Heading */}
              <div className="mb-6 md:mb-7">
                <span className="italic text-[28px] md:text-[40px] font-medium text-charcoal leading-tight block font-playfair">
                  India&apos;s Finest Sterling Silver,
                </span>
                <span className="italic text-[28px] md:text-[40px] font-medium text-emerald leading-tight block font-playfair">
                  Curated for You.
                </span>
              </div>

              {/* Body */}
              <p className="font-body text-[15px] font-normal leading-[1.75] text-charcoal mb-9 max-w-[480px]">
                At Silvaniya, we bring together the timeless elegance of traditional Indian
                jewellery with modern design sensibilities. Every piece is hallmarked for
                purity, ensuring you get only the finest 92.5 sterling silver.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-[auto_auto] gap-8 md:gap-12 items-start mb-10 justify-start">
                <div>
                  <span className="italic text-[28px] md:text-[36px] font-normal text-emerald block mb-1 font-playfair">
                    10k+
                  </span>
                  <span className="font-body text-[11px] font-semibold tracking-[0.18em] uppercase text-muted">
                    Happy Customers
                  </span>
                </div>
                <div>
                  <span className="italic text-[28px] md:text-[36px] font-normal text-emerald block mb-1 font-playfair">
                    500+
                  </span>
                  <span className="font-body text-[11px] font-semibold tracking-[0.18em] uppercase text-muted">
                    Designs
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Link href="/best-sellers" className="inline-block py-[18px] px-12 bg-charcoal text-white font-body text-[11px] font-semibold tracking-[0.2em] uppercase border-none rounded cursor-pointer self-start transition-colors duration-300 hover:bg-charcoal-light text-center no-underline">
                OUR HERITAGE
              </Link>
            </div>

          </div>
        </section>

        {/* ------------------------ TESTIMONIALS ----------------------- */}
        {testimonialsLoading ? (
          <section className="bg-background py-12 md:py-16 w-full flex justify-center">
            <Loader2 size={32} className="animate-spin text-emerald" />
          </section>
        ) : testimonials.length > 0 ? (
          <section className="bg-background py-12 md:py-16 w-full">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="text-center mb-10 md:mb-12">
                <h2 className="italic text-[32px] md:text-[40px] font-normal text-charcoal m-0 font-playfair">
                  Voices of Our Customers
                </h2>
              </div>
              <style>{`
                .hide-scroll::-webkit-scrollbar { display: none; }
                .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
              `}</style>
              <div className="hide-scroll flex flex-row overflow-x-auto gap-5 md:gap-6 pb-8 snap-x snap-mandatory -mx-4 px-4 md:-mx-8 md:px-8">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white border border-border rounded-2xl p-[28px] md:p-[32px] flex flex-col shrink-0 snap-center w-[85vw] sm:w-[320px] md:w-[340px] aspect-5/4 transition-shadow duration-300 hover:shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-4 shrink-0">
                      <span className="font-body text-[42px] font-bold text-emerald/50 leading-[0.5] block select-none">
                        &ldquo;
                      </span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < (t.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 mt-1 mb-6 relative">
                      <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
                        <p className="font-body text-[13.5px] font-normal leading-[1.8] text-charcoal">
                          {t.text}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-auto shrink-0">
                      {t.avatarUrl ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-50 border border-border">
                          <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-silver shrink-0 flex items-center justify-center text-charcoal font-bold border border-border">
                          {t.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-body text-[13.5px] font-semibold text-charcoal leading-tight">
                          {t.name}
                        </p>
                        {t.city && (
                          <p className="font-body text-[12.5px] font-normal text-muted mt-0.5 leading-tight">
                            {t.city}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

      </main>

      <Footer />
    </div>
  );
}
