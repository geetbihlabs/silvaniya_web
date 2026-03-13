import React from "react";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorBannerProps {
  error: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorBanner({ error, onDismiss, onRetry, className = "" }: ErrorBannerProps) {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-xl p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-500 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-red-800">Something went wrong</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onRetry && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRetry}
              className="text-red-600 hover:text-red-800"
            >
              Retry
            </Button>
          )}
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="text-red-500 hover:text-red-700 p-1 rounded"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}