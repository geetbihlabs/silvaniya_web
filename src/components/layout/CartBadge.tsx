"use client";

/**
 * CartBadge — Single Responsibility component.
 * Renders the green count badge on the cart icon.
 * Fetches count from server on mount (if signed in),
 * then subscribes to store for instant optimistic updates.
 */
import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useCartStore } from "@/store/useCartStore";

export default function CartBadge() {
    const { isSignedIn, getToken } = useAuth();
    const count = useCartStore((s) => s.count);
    const fetchCount = useCartStore((s) => s.fetchCount);
    const items = useCartStore((s) => s.items);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (isSignedIn && !hasFetched.current) {
            hasFetched.current = true;
            fetchCount(getToken);
        }
    }, [isSignedIn, fetchCount, getToken]);

    // Compute effective display count:
    // - If signed-in: use server-synced `count` from store
    // - If guest: count from local items (localStorage)
    const displayCount = isSignedIn
        ? count
        : items.reduce((sum, i) => sum + i.quantity, 0);

    if (displayCount <= 0) return null;

    return (
        <span className="absolute -top-[6px] -right-[8px] bg-emerald text-white text-[9px] font-bold font-body w-4 h-4 rounded-full flex items-center justify-center">
            {displayCount > 99 ? "99+" : displayCount}
        </span>
    );
}
