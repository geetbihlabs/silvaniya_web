export const SITE_NAME = "Silvaniya";
export const SITE_TAGLINE = "The Art of Eternal Shine";
export const SITE_DESCRIPTION =
  "Empowering the spirit of Indian heritage through fine silver artistry. Every piece is a story of tradition, purity, and grace.";

export const NAV_LINKS = [
  { label: "Jewellery", href: "/products?category=jewellery" },
  { label: "Mangalsutras", href: "/products?category=mangalsutras" },
  { label: "New Arrivals", href: "/products?category=new-arrivals" },
  { label: "Best Sellers", href: "/products?category=best-sellers" },
] as const;

export const FOOTER_SHOP_LINKS = [
  { label: "New Arrivals", href: "/products?category=new-arrivals" },
  { label: "Bestsellers", href: "/products?category=best-sellers" },
  { label: "Wedding Special", href: "/products?category=wedding-special" },
  { label: "Gifting Guide", href: "/products?category=gifting-guide" },
  { label: "999 Silver Coins", href: "/products?category=silver-coins" },
] as const;

export const FOOTER_SUPPORT_LINKS = [
  { label: "Track Order", href: "/track-order" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Purity Certificate", href: "/purity-certificate" },
  { label: "FAQs", href: "/faqs" },
] as const;

export const ACCOUNT_SIDEBAR_LINKS = [
  // { label: "My Profile", href: "/profile", icon: "User" },
  { label: "Order History", href: "/orders", icon: "Package" },
  { label: "Saved Addresses", href: "/addresses", icon: "MapPin" },
  { label: "My Wishlist", href: "/wishlist", icon: "Heart" },
  { label: "Notifications", href: "/notifications", icon: "Bell" },
] as const;

export const SOCIAL_LINKS = {
  facebook: "https://facebook.com/silvaniya",
  instagram: "https://instagram.com/silvaniya",
} as const;

export const CONTACT_INFO = {
  phone: "+91 1800-SILVA-99",
  email: "concierge@silvaniya.com",
} as const;

export const TRUST_BADGES = [
  {
    title: "Hallmarked Silver",
    description: "Every piece is BIS hallmarked for purity, ensuring the highest quality standards.",
    icon: "Shield",
  },
  {
    title: "Secure Shipping",
    description: "Fully insured and tamper-proof packaging with free shipping across India.",
    icon: "Truck",
  },
  {
    title: "Purity Certificate",
    description: "Each product comes with a certificate of purity and authenticity.",
    icon: "Award",
  },
] as const;
