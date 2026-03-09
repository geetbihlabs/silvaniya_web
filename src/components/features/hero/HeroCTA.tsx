"use client";

import Link from "next/link";

export default function HeroCTA() {
    return (
        <Link
            href="/products"
            className="inline-block bg-emerald hover:bg-emerald-dark text-white font-body text-[11px] font-semibold tracking-[0.2em] uppercase py-[16px] px-[36px] rounded transition-colors duration-300"
        >
            SHOP NOW
        </Link>
    );
}
