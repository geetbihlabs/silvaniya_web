"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
    const [step, setStep] = useState<"login" | "otp">("login");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (step === "otp" && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [step]);

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length === 10) {
            setStep("otp");
        }
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join("");
        if (otpValue.length === 6) {
            window.location.href = "/profile"; // Redirect to profile
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only allow single digit
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="w-full max-w-[400px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden m-4 border border-black/5">
            <div className="p-8 sm:p-10">
                {step === "login" ? (
                    // Step 1: Mobile Number Input
                    <div className="flex flex-col items-center">
                        <div className="text-center">
                            <div className="flex justify-center mb-1">
                                <Image
                                    src="/logo.png"
                                    alt="Silvaniya"
                                    width={180}
                                    height={40}
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            {/* <span className="text-[9px] tracking-[0.2em] text-charcoal/60 uppercase">
                                The Art of Eternal Shine
                            </span> */}
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-semibold text-charcoal mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                                Login to Your Account
                            </h2>
                            <p className="text-sm text-muted">
                                Access your wishlist, orders, and<br />personalized styling.
                            </p>
                        </div>

                        <form onSubmit={handleSendOtp} className="w-full space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">
                                    Mobile Number
                                </label>
                                <div className="relative flex items-center w-full h-12 bg-gray-50/80 rounded border border-gray-100/50 overflow-hidden focus-within:ring-1 focus-within:ring-emerald focus-within:border-emerald transition-all">
                                    <div className="flex items-center justify-center pl-4 pr-3 h-full border-r border-gray-200/60">
                                        <span className="text-sm font-medium text-charcoal/60">+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="00000 00000"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                        className="flex-1 h-full px-4 bg-transparent outline-none text-charcoal font-medium placeholder:text-gray-300 placeholder:font-normal"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                variant="emerald"
                                className="w-full h-12 rounded bg-[#107c6f] hover:bg-[#0e6b5f] text-white tracking-[0.1em]"
                                type="submit"
                                disabled={phone.length !== 10}
                            >
                                GET OTP
                            </Button>
                        </form>

                        <div className="w-full text-center mt-8 mb-8 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <span className="relative px-4 text-[11px] text-gray-400 uppercase tracking-widest bg-white">
                                OR
                            </span>
                        </div>

                        <Button variant="outline" className="w-full h-12 rounded border-gray-200 text-charcoal font-semibold tracking-normal flex items-center justify-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18px" height="18px">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                            </svg>
                            Continue with Google
                        </Button>
                    </div>
                ) : (
                    // Step 2: Verify OTP
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-[#2d2538] rounded-full flex items-center justify-center text-white mb-6">
                            <ShieldCheck size={24} />
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-semibold text-charcoal mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                                Verify OTP
                            </h2>
                            <p className="text-sm text-muted">
                                Enter the 6-digit code sent to +91 {phone.slice(0, 5)} {phone.slice(5)}
                            </p>
                        </div>

                        <form onSubmit={handleVerifyOtp} className="w-full space-y-8">
                            <div className="flex justify-between gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-11 h-11 sm:w-12 sm:h-12 text-center text-xl font-bold rounded box-border border border-gray-200 text-charcoal placeholder:text-gray-300 focus:bg-white focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald transition-all"
                                        placeholder="·"
                                        required
                                    />
                                ))}
                            </div>

                            <Button
                                variant="emerald"
                                className="w-full h-12 rounded bg-[#107c6f] hover:bg-[#0e6b5f] text-white tracking-normal flex items-center justify-center gap-1 font-semibold text-sm"
                                type="submit"
                                disabled={otp.join("").length !== 6}
                            >
                                Verify & Proceed <ArrowRight size={16} />
                            </Button>
                        </form>

                        <div className="text-center mt-6 text-xs w-full">
                            <div className="text-muted mb-8">
                                Didn&apos;t receive the code? <button className="text-[#a5b4bc] hover:text-charcoal font-medium transition-colors">Resend in 00:45</button>
                            </div>

                            <button
                                onClick={() => setStep("login")}
                                className="flex items-center justify-center gap-2 text-charcoal font-medium hover:text-emerald transition-colors mx-auto"
                            >
                                <Edit2 size={12} />
                                Change Mobile Number
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Accent line for design cohesion (optional, matching OTP screen mockup tail) */}
            {step === "otp" && (
                <div className="h-1 w-full bg-linear-to-r from-emerald/40 via-emerald to-emerald/40 opacity-70" />
            )}
        </div>
    );
}
