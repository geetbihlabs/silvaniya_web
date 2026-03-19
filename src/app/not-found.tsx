"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-2xl w-full text-center space-y-10 relative z-10">
        
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-silver-light/30 rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* Animated 404 Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <h1 className="text-[120px] sm:text-[160px] md:text-[200px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-charcoal/90 to-silver/10 select-none leading-none">
            404
          </h1>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-silver-light/40 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-error" />
              <span className="font-semibold text-charcoal tracking-[0.1em] uppercase text-xs">Page Not Found</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
            Oops! You seem to be lost.
          </h2>
          <p className="text-base sm:text-lg text-charcoal/60 max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
        >
          <Button asChild variant="primary" size="lg" className="w-full sm:w-auto min-w-[160px] group shadow-lg shadow-charcoal/10 hover:shadow-xl hover:shadow-charcoal/20">
            <Link href="/">
              <Home className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
              Return Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto min-w-[160px] group">
            <Link href="/search">
              <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Search Here
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
