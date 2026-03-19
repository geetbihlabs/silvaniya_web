import React from "react";
import Link from "next/link";
import { RefreshCw, AlertTriangle, Mail, Phone, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Refund & Return Policy | Silvaniya – The Art of Eternal Shine",
  description:
    "Understand the Refund, Return, and Exchange Policy for purchases made on Silvaniya – The Art of Eternal Shine.",
};

const Section = ({ number, title, children, variant = "default" }: { number: string; title: string; children: React.ReactNode; variant?: "default" | "warning" }) => (
  <section className="border-b border-border last:border-0 py-10">
    <div className="flex items-start gap-4 mb-5">
      <span className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-body font-bold text-sm ${variant === "warning" ? "bg-warning/10 text-warning" : "bg-emerald/10 text-emerald"}`}>{number}</span>
      <h2 className="font-heading text-xl sm:text-2xl text-charcoal pt-1">{title}</h2>
    </div>
    <div className="font-body text-[15px] text-muted leading-relaxed space-y-3">{children}</div>
  </section>
);

const BulletList = ({ items, color = "emerald" }: { items: string[]; color?: "emerald" | "error" }) => (
  <ul className="space-y-2 mt-2">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2.5">
        <span className={`mt-2 shrink-0 w-1.5 h-1.5 rounded-full ${color === "error" ? "bg-error" : "bg-emerald"}`} />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default function RefundPolicyPage() {
  return (
    <main className="bg-cream min-h-screen">
      {/* Hero */}
      <div className="bg-white border-b border-border py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald/10 rounded-full mb-5">
            <RefreshCw className="w-7 h-7 text-emerald" />
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-charcoal mb-4">Refund & Return Policy</h1>
          <p className="font-body text-muted text-base sm:text-lg max-w-2xl mx-auto">
            Silvaniya – The Art of Eternal Shine, owned and operated by{" "}
            <span className="text-charcoal font-semibold">Vernium Gold Private Limited</span>
          </p>
          <p className="mt-4 font-body text-sm text-muted-light">Effective Date: 2025 · www.silvaniya.com</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 sm:p-12 space-y-2">

          <Section number="1" title="General Policy">
            <p>At Silvaniya, we maintain strict quality standards. Due to the nature of jewellery, returns are limited and subject to the conditions outlined below.</p>
          </Section>

          <Section number="2" title="Eligibility for Return">
            <p>We accept returns <strong className="text-charcoal">ONLY</strong> if:</p>
            <BulletList items={["Product is damaged on delivery", "Wrong item was delivered", "There is a manufacturing defect"]} />
            <p className="mt-4 font-semibold text-charcoal">To initiate a return, you must:</p>
            <BulletList items={["Inform us within 48 hours of delivery", "Provide an unboxing video as proof (mandatory)"]} />

            <div className="mt-6 flex items-start gap-3 bg-warning/5 border border-warning/20 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-charcoal font-body">
                <strong>Important:</strong> No unboxing video = No claim. This protects both you and us from fraudulent return requests.
              </p>
            </div>
          </Section>

          <Section number="3" title="Non-Returnable Items">
            <p>We <strong className="text-charcoal">DO NOT</strong> accept returns for:</p>
            <BulletList color="error" items={["Change of mind", "Size issues (unless wrong size delivered)", "Minor color/finish variations due to screen settings", "Used or worn products", "Products without original packaging"]} />
          </Section>

          <Section number="4" title="Refund Process">
            <BulletList items={["Once a return is approved, the refund is processed within 5–7 business days", "Refund will be issued to the original payment method"]} />
          </Section>

          <Section number="5" title="Exchange Policy">
            <p>We may allow an exchange (on a case-by-case basis) if:</p>
            <BulletList items={["The product is unused and in original condition", "The request is made within 48 hours of delivery"]} />
            <p className="mt-3">Applicable shipping costs may apply for exchanges.</p>
          </Section>

          <Section number="6" title="Cancellation Policy">
            <BulletList items={["Orders can be cancelled before dispatch only", "Once an order has shipped, cancellation is no longer possible"]} />
          </Section>

          <Section number="7" title="Damaged or Lost Shipments" variant="warning">
            <div className="flex items-start gap-3 bg-error/5 border border-error/20 rounded-xl p-4 mb-4">
              <ShieldAlert className="w-5 h-5 text-error shrink-0 mt-0.5" />
              <p className="text-sm text-charcoal font-body">
                <strong>If a package is visibly damaged upon arrival, DO NOT ACCEPT DELIVERY.</strong> If accepted, liability shifts entirely to the customer.
              </p>
            </div>
            <p>For lost shipments, please contact us promptly so we can investigate with the logistics partner.</p>
          </Section>

          <Section number="8" title="Fraud Prevention Clause">
            <p>We reserve the right to:</p>
            <BulletList items={["Reject suspicious or duplicate return claims", "Permanently block users who abuse the return policy", "Take legal action in cases of proven fraud"]} />
          </Section>

          <Section number="9" title="Contact for Returns">
            <p className="font-semibold text-charcoal">Vernium Gold Private Limited</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald shrink-0" /><a href="mailto:support@silvaniya.com" className="text-emerald hover:underline">support@silvaniya.com</a></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald shrink-0" /><span>+91 XXXXX XXXXX</span></div>
            </div>
          </Section>

        </div>

        {/* Related Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm font-body">
          <Link href="/privacy-policy" className="text-emerald hover:underline font-semibold">← Privacy Policy</Link>
          <Link href="/terms-and-conditions" className="text-emerald hover:underline font-semibold">← Terms & Conditions</Link>
        </div>
      </div>
    </main>
  );
}
