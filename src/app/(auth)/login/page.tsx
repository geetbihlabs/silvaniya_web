"use client";

import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "@/components/ui/otp-input";
import { sendWhatsAppOtp, verifyWhatsAppOtp } from "@/lib/api/auth";

type Step = "PHONE_INPUT" | "OTP_INPUT";

export default function LoginPage() {
    const { signIn } = useSignIn();
    const router = useRouter();

    const [step, setStep] = useState<Step>("PHONE_INPUT");
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");

    const handleGoogleSignIn = async () => {
        try {
            await signIn.sso({
                strategy: "oauth_google",
                redirectUrl: "/",
                redirectCallbackUrl: "/sso-callback",
            });
        } catch (error) {
            toast.error("Failed to authenticate with Google.");
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!phoneNumber) {
            toast.error("Please enter a valid phone number.");
            return;
        }

        // Basic validation for country code format (assuming standard format)
        // Ensure + is added if the user forgot it (very basic, ideally use a lib)
        let formattedPhone = phoneNumber.trim();
        if (!formattedPhone.startsWith('+')) {
            // Defaulting to India as per Open Questions, could be dynamic
            formattedPhone = `+91${formattedPhone.replace(/^0+/, '')}`;
        }

        try {
            setIsLoading(true);
            await sendWhatsAppOtp(formattedPhone);
            setPhoneNumber(formattedPhone);
            toast.success("OTP sent to your WhatsApp!");
            setStep("OTP_INPUT");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            setIsLoading(true);
            const { ticket } = await verifyWhatsAppOtp(phoneNumber, otp);

            const res = await signIn.ticket({
                ticket: ticket,
            });

            if (!res.error) {
                await signIn.finalize();
                toast.success("Successfully logged in!");
                router.push("/"); // Redirect to home or intended destination
            } else {
                toast.error("Verification failed. Please try again.");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Invalid OTP. Please check and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[400px] flex flex-col items-center justify-center m-4 bg-white p-8 rounded-[4px] border border-silver shadow-sm">
            <h1 className="text-2xl font-body text-charcoal mb-2 tracking-wide uppercase font-semibold">
                Welcome
            </h1>
            <p className="text-sm text-muted mb-8 text-center">
                Sign in to Silvaniya using your WhatsApp number.
            </p>

            <div className="w-full relative overflow-hidden min-h-[220px]">
                <AnimatePresence mode="wait">
                    {step === "PHONE_INPUT" && (
                        <motion.form
                            key="phone"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleSendOtp}
                            className="flex flex-col gap-6"
                        >
                            <Input
                                label="WhatsApp Number"
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                disabled={isLoading}
                                autoFocus
                            />
                            
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending OTP...
                                    </>
                                ) : (
                                    "Continue with WhatsApp"
                                )}
                            </Button>

                            <div className="relative my-2">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-silver" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-muted">Or continue with</span>
                                </div>
                            </div>

                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                    <path fill="none" d="M0 0h48v48H0z"/>
                                </svg>
                                Google
                            </Button>
                        </motion.form>
                    )}

                    {step === "OTP_INPUT" && (
                        <motion.form
                            key="otp"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            onSubmit={handleVerifyOtp}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex flex-col items-center justify-center w-full gap-4">
                                <label className="label-caps block text-charcoal text-center">
                                    Enter 6-digit code sent to <br/>
                                    <span className="font-semibold">{phoneNumber}</span>
                                </label>
                                
                                <InputOTP 
                                    maxLength={6} 
                                    value={otp} 
                                    onChange={(value) => setOtp(value)}
                                    disabled={isLoading}
                                    autoFocus
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>

                            <div className="flex flex-col gap-3 mt-4">
                                <Button type="submit" disabled={isLoading || otp.length !== 6} className="w-full">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify & Sign In"
                                    )}
                                </Button>
                                
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={() => setStep("PHONE_INPUT")}
                                    disabled={isLoading}
                                    className="w-full"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Change Phone Number
                                </Button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
