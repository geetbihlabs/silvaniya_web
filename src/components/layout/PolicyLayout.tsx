"use client";

import React from "react";

interface PolicyLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  updatedAt?: string;
}

export default function PolicyLayout({ children, title, subtitle, updatedAt }: PolicyLayoutProps) {
  return (
    <>
      {/* Hero Banner */}
      <div className="bg-[#1e1b2e] pt-[80px] pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <p className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-emerald-light mb-4">
            Silvaniya
          </p>
          <h1 className="font-playfair italic text-[32px] md:text-[48px] font-normal text-white leading-tight mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="font-body text-[15px] font-normal text-white/55 leading-relaxed max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
          {updatedAt && (
            <p className="font-body text-[12px] text-white/35 mt-4">
              Effective Date: {updatedAt}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-background">
        <div className="max-w-4xl mx-auto w-full px-6 md:px-8 py-12 md:py-16">
          <div className="prose-policy">
            {children}
          </div>
        </div>
      </div>

      <style>{`
        .prose-policy h2 {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 600;
          color: #1F2933;
          margin: 2.5rem 0 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }
        .prose-policy h3 {
          font-family: 'Manrope', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #1F2933;
          margin: 1.75rem 0 0.5rem;
        }
        .prose-policy p {
          font-family: 'Manrope', sans-serif;
          font-size: 14.5px;
          line-height: 1.85;
          color: #374151;
          margin-bottom: 1rem;
        }
        .prose-policy ul, .prose-policy ol {
          margin: 0.5rem 0 1.25rem 1.25rem;
        }
        .prose-policy li {
          font-family: 'Manrope', sans-serif;
          font-size: 14.5px;
          line-height: 1.85;
          color: #374151;
          margin-bottom: 0.4rem;
        }
        .prose-policy strong {
          font-weight: 700;
          color: #1F2933;
        }
        .prose-policy a {
          color: #0F766E;
          text-decoration: underline;
        }
        .prose-policy hr {
          border: 0;
          border-top: 1px solid #e5e7eb;
          margin: 2.5rem 0;
        }
        .prose-policy .highlight-box {
          background: #f0fafa;
          border-left: 3px solid #0F766E;
          border-radius: 0 8px 8px 0;
          padding: 1rem 1.25rem;
          margin: 1.5rem 0;
        }
        .prose-policy .section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #0F766E;
          margin-bottom: 0.5rem;
          display: block;
        }
      `}</style>
    </>
  );
}
