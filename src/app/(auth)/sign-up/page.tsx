import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="w-full max-w-[400px] flex flex-col items-center justify-center m-4 bg-white p-8 rounded-[4px] border border-silver shadow-sm">
            <h1 className="text-2xl font-body text-charcoal mb-2 tracking-wide uppercase font-semibold">
                Complete Sign Up
            </h1>
            <p className="text-sm text-muted mb-8 text-center">
                Please provide the missing information to complete your account.
            </p>
            <SignUp />
        </div>
    );
}
