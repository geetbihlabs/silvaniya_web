import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

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

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="overflow-x-hidden" suppressHydrationWarning>
        <body className="antialiased overflow-x-hidden" suppressHydrationWarning>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "8px",
                fontSize: "14px",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
