"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    return (
        <div className="w-full max-w-[400px] flex items-center justify-center m-4">
            <SignIn path="/login" routing="path" signUpUrl="/login/sign-up" />
        </div>
    );
}
