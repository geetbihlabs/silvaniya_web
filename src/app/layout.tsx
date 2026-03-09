import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Silvaniya — The Art of Eternal Shine",
    template: "%s | Silvaniya",
  },
  description:
    "Empowering the spirit of Indian heritage through fine silver artistry. Every piece is a story of tradition, purity, and grace.",
  keywords: [
    "silver jewellery",
    "sterling silver",
    "925 silver",
    "Indian jewellery",
    "mangalsutra",
    "hallmarked silver",
    "Silvaniya",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
