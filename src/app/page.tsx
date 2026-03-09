"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroCTA from "@/components/features/hero/HeroCTA";

// ─── Categories ───────────────────────────────────────────────────────────────
const categories = [
  { name: "Mangal Sutras", slug: "mangalsutras", image: "/images/categories/mangalsutras.jpg" },
  { name: "Nose Pins", slug: "nose-pins", image: "/images/categories/nose-pins.jpg" },
  { name: "Toe Rings", slug: "toe-rings", image: "/images/categories/toe-rings.jpg" },
  { name: "Silver Coins", slug: "silver-coins", image: "/images/categories/silver-coins.jpg" },
];

// ─── Trending Products ────────────────────────────────────────────────────────
const trending = [
  {
    id: "t1",
    name: "Aditi Traditional Mangalsutra",
    subtitle: "925 Sterling Silver",
    price: 4299,
    originalPrice: 4776,
    badge: "10% OFF",
    image: "/images/products/mangalsutra-1.jpg",
    imageBgClass: "bg-[#f8f8f8]",
    href: "/products",
  },
  {
    id: "t2",
    name: "Chhavi Floral Nose Pin",
    subtitle: "Pure Silver • Handcrafted",
    price: 850,
    originalPrice: null,
    badge: null,
    image: "/images/products/nose-pin-1.jpg",
    imageBgClass: "bg-charcoal",
    href: "/products",
  },
  {
    id: "t3",
    name: "Meenakari Bridal Payal",
    subtitle: "92.5 Hallmarked Silver",
    price: 6499,
    originalPrice: null,
    badge: "BESTSELLER",
    image: "/images/products/payal-1.jpg",
    imageBgClass: "bg-charcoal",
    href: "/products",
  },
  {
    id: "t4",
    name: "50g Purity 999 Coin",
    subtitle: "Investment Grade Silver",
    price: 5150,
    originalPrice: null,
    badge: "NEW",
    image: "/images/products/coin-1.jpg",
    imageBgClass: "bg-charcoal",
    href: "/products",
  },
];

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ─── Testimonials data ────────────────────────────────────────────────────────
const testimonials = [
  {
    id: "r1",
    text: "The silver quality is exceptional. I bought a mangalsutra for my anniversary and it's even more beautiful in person. The hallmarking gives so much peace of mind.",
    name: "Priya Sharma",
    city: "Mumbai",
  },
  {
    id: "r2",
    text: "Best place for silver coins. I always buy from Silvaniya for Diwali. Fast delivery and beautiful packaging. Highly recommended for gifting.",
    name: "Ananya Iyer",
    city: "Chennai",
  },
  {
    id: "r3",
    text: "Love the minimal nose pins. They are perfect for daily wear and don't irritate the skin. The 92.5 purity is definitely genuine.",
    name: "Sneha Verma",
    city: "Delhi",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">

        {/* ══════════════════════════ HERO ══════════════════════════════ */}
        <section className="w-full bg-background py-0">
          <div className="max-w-7xl mx-auto">
            <div className="relative w-full h-[clamp(340px,42vw,500px)] rounded-[20px] overflow-hidden bg-[#1a1a1a]">
              {/* Hero image — positioned right */}
              <Image
                src="/hero.png"
                alt="Silvaniya Exclusive Festive Collection"
                fill priority sizes="100vw"
                className="object-cover object-[70%_center]"
              />
              {/* Left-side gradient fade — matches Figma dark-left treatment */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #1a1a1a 28%, rgba(26,26,26,0.75) 48%, transparent 70%)' }} />
              {/* Text block — top-left positioned, matching Figma */}
              <div className="absolute top-[48px] left-[clamp(32px,4vw,64px)] max-w-[420px]">
                {/* Label */}
                <p className="font-body text-[10.5px] font-semibold tracking-[0.25em] uppercase text-white/70 mb-[18px]">
                  Exclusive Festive Collection
                </p>
                {/* Heading */}
                <h1 className="font-heading font-medium leading-[1.15] text-white mb-8"
                  style={{ fontSize: 'clamp(36px, 3.6vw, 52px)' }}>
                  <span className="text-white">Curated for the</span>
                  <span className="block font-heading font-medium text-white">Modern</span>
                  <span className="block font-heading italic font-medium text-emerald">
                    Indian Woman
                  </span>
                </h1>
                <HeroCTA />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════ SHOP BY CATEGORY ══════════════════════ */}
        <section className="bg-background py-16 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="font-script italic text-[36px] font-normal text-charcoal leading-tight m-0">
                  Shop by Category
                </h2>
                <span className="block w-14 h-[2px] bg-emerald mt-2" />
              </div>
              <Link
                href="/products"
                className="font-body text-[14px] font-medium text-emerald no-underline self-center hover:underline"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-6 mt-10">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="no-underline cursor-pointer block group"
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-charcoal relative">
                    <Image
                      src={cat.image} alt={cat.name} fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover object-center transition-transform duration-400 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="mt-5 text-center font-body text-[12px] font-semibold tracking-[0.2em] uppercase text-charcoal">
                    {cat.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════ TRENDING NOW ════════════════════════ */}
        <section className="bg-background py-20 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-script italic text-[42px] font-normal text-charcoal m-0 mb-[10px]">
                Trending Now
              </h2>
              <p className="font-body text-[11px] font-semibold tracking-[0.22em] uppercase text-muted m-0">
                Our Most Loved Pieces This Week
              </p>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {trending.map((p) => (
                <div
                  key={p.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.07)] flex flex-col"
                >
                  {/* Image area */}
                  <div className={`relative w-full aspect-square overflow-hidden ${p.imageBgClass}`}>
                    <Image
                      src={p.image} alt={p.name} fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover object-center"
                    />
                    {p.badge && (
                      <span className="absolute top-[14px] left-[14px] font-body text-[10px] font-bold tracking-[0.08em] uppercase py-[5px] px-[10px] rounded text-white bg-emerald">
                        {p.badge}
                      </span>
                    )}
                    <button
                      className="absolute top-3 right-3 w-[34px] h-[34px] rounded-full bg-white/88 border-none flex items-center justify-center cursor-pointer"
                      aria-label="Add to wishlist"
                    >
                      <Heart size={16} className="text-silver-dark" fill="none" />
                    </button>
                  </div>
                  {/* Card content */}
                  <div className="p-[18px_20px_20px] flex-1 flex flex-col">
                    <p className="font-heading text-[16px] font-medium text-charcoal mb-1 leading-tight">
                      {p.name}
                    </p>
                    <p className="font-body text-[13px] font-normal text-muted mb-[14px]">
                      {p.subtitle}
                    </p>
                    <div className="flex items-baseline gap-2 mb-[18px]">
                      <span className="font-body text-[18px] font-semibold text-charcoal tracking-[0.01em]">
                        {fmt(p.price)}
                      </span>
                      {p.originalPrice && (
                        <span className="font-body text-[14px] font-normal text-silver-dark line-through">
                          {fmt(p.originalPrice)}
                        </span>
                      )}
                    </div>
                    <button className="mt-auto w-full py-3 bg-transparent border-[1.5px] border-charcoal font-body text-[11px] font-semibold tracking-[0.18em] uppercase text-charcoal cursor-pointer transition-all duration-300 rounded hover:bg-charcoal hover:text-white">
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════ TRUST BADGES ════════════════════════ */}
        <section className="bg-white border-t border-b border-border py-16 w-full">
          <div className="grid grid-cols-3 gap-20 max-w-7xl mx-auto">

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

        {/* ════════════════════════ BRAND STORY ════════════════════════ */}
        <section className="bg-background py-20 w-full">
          <div className="grid grid-cols-2 gap-20 items-center max-w-7xl mx-auto">

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
              <div className="mb-7">
                <span className="font-heading italic text-[40px] font-medium text-charcoal leading-tight block">
                  India&apos;s Finest Sterling Silver,
                </span>
                <span className="font-heading italic text-[40px] font-medium text-emerald leading-tight block">
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
              <div className="grid grid-cols-[auto_auto] gap-12 items-start mb-10 justify-start">
                <div>
                  <span className="font-script italic text-[36px] font-normal text-emerald block mb-1">
                    10k+
                  </span>
                  <span className="font-body text-[11px] font-semibold tracking-[0.18em] uppercase text-muted">
                    Happy Customers
                  </span>
                </div>
                <div>
                  <span className="font-script italic text-[36px] font-normal text-emerald block mb-1">
                    500+
                  </span>
                  <span className="font-body text-[11px] font-semibold tracking-[0.18em] uppercase text-muted">
                    Designs
                  </span>
                </div>
              </div>

              {/* CTA */}
              <button className="inline-block py-[18px] px-12 bg-charcoal text-white font-body text-[11px] font-semibold tracking-[0.2em] uppercase border-none rounded cursor-pointer self-start transition-colors duration-300 hover:bg-charcoal-light">
                OUR HERITAGE
              </button>
            </div>

          </div>
        </section>

        {/* ════════════════════════ TESTIMONIALS ═══════════════════════ */}
        <section className="bg-background py-20 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-script italic text-[40px] font-normal text-charcoal m-0">
                Voices of Our Customers
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white border border-border rounded-2xl p-[32px_28px_28px] flex flex-col"
                >
                  <span className="font-body text-[48px] font-bold text-emerald-light/55 leading-none mb-4 block select-none">
                    &ldquo;
                  </span>
                  <p className="font-body text-[14px] font-normal leading-[1.7] text-charcoal mb-7 flex-1">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-[14px] mt-auto">
                    <div className="w-11 h-11 rounded-full bg-silver-light shrink-0" />
                    <div>
                      <p className="font-body text-[14px] font-semibold text-charcoal mb-[2px]">
                        {t.name}
                      </p>
                      <p className="font-body text-[13px] font-normal text-muted">
                        {t.city}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}