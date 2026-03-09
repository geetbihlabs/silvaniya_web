"use client";

import Link from "next/link";

export default function HeroCTA() {
    return (
        <Link
            href="/products"
            style={{
                display: "inline-block",
                backgroundColor: "var(--color-emerald)",
                color: "#ffffff",
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "16px 36px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                textDecoration: "none",
                transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-emerald-dark)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-emerald)";
            }}
        >
            SHOP NOW
        </Link>
    );
}
