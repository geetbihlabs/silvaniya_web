/**
 * useRelatedProducts — Reusable hook for "You May Also Like" sections.
 *
 * Follows SOLID principles:
 *  - SRP: This hook is the single source of truth for related-product logic.
 *  - OCP: Pages are open to using it without needing to know the fetching strategy.
 *  - DRY: Shared between Cart page and Product Detail page.
 *
 * Multi-category support:
 *  When a cart has items from multiple categories (e.g. rings + necklaces),
 *  this hook fetches products from ALL those categories in parallel
 *  (`Promise.all`), merges them, deduplicates, and excludes specified IDs.
 */

import { useEffect, useState } from 'react';
import { useShopProductStore, ShopProduct } from '@/store/useShopProductStore';

/**
 * @param categoryIds  Array of category IDs to fetch related products from.
 *                     Cart page: all unique categoryIds from cart items.
 *                     Product page: single-element array with the product's categoryId.
 * @param excludeIds   Product IDs to exclude from the results
 *                     (cart product IDs or the current product's ID).
 */
export function useRelatedProducts(
  categoryIds: string[],
  excludeIds: string[],
): { products: ShopProduct[]; isLoading: boolean } {
  const { fetchRelatedProducts } = useShopProductStore();

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Stable key — only re-fetch when the actual category IDs change
  const categoryKey = [...new Set(categoryIds)].filter(Boolean).sort().join(',');
  const excludeKey = excludeIds.join(',');

  useEffect(() => {
    const uniqueIds = categoryKey.split(',').filter(Boolean);
    if (uniqueIds.length === 0) {
      setProducts([]);
      return;
    }

    setIsLoading(true);

    // Fetch all unique categories in parallel
    Promise.all(uniqueIds.map((id) => fetchRelatedProducts(id)))
      .then((results) => {
        // Merge and deduplicate by product ID
        const seen = new Set<string>();
        const merged: ShopProduct[] = [];
        for (const list of results) {
          for (const p of list) {
            if (!seen.has(p.id)) {
              seen.add(p.id);
              merged.push(p);
            }
          }
        }

        // Exclude current/cart product IDs
        const excluded = new Set(excludeKey.split(',').filter(Boolean));
        const filtered = merged.filter((p) => !excluded.has(p.id)).slice(0, 4);

        setProducts(filtered);
      })
      .finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryKey]);

  return { products, isLoading };
}
