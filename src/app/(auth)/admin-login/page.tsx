"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";

export default function AdminLoginPage() {
    return (
        <div className="w-full max-w-[400px] flex items-center justify-center m-4">
            <SignIn 
                path="/admin-login" 
                routing="path" 
                forceRedirectUrl={`${process.env.NEXT_PUBLIC_APP_URL ?? ''}/admin-panel/dashboard`}
            />
        </div>
    );
}
