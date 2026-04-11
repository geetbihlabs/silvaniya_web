// src/lib/razorpay.ts
// Typed helper to dynamically load and open the Razorpay checkout modal.

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;       // in paisa (integer)
  currency: string;     // 'INR'
  name: string;         // merchant name shown in modal
  description?: string;
  image?: string;       // logo URL
  order_id: string;     // razorpay order ID
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

/**
 * Dynamically loads the Razorpay checkout.js script.
 * Safe to call multiple times — resolves instantly if already loaded.
 * Returns true when the SDK is ready, false on load failure.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Opens the Razorpay checkout modal with the given options.
 * Throws if sdk is not yet loaded — always call loadRazorpayScript() first.
 */
export function openRazorpayModal(options: RazorpayOptions): void {
  if (typeof window === 'undefined' || !window.Razorpay) {
    throw new Error(
      'Razorpay SDK not loaded. Call loadRazorpayScript() before openRazorpayModal().',
    );
  }
  const instance = new window.Razorpay(options);
  instance.open();
}
