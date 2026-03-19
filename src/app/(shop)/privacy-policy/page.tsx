import React from "react";
import Link from "next/link";
import { ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Silvaniya – The Art of Eternal Shine",
  description:
    "Learn how Silvaniya – The Art of Eternal Shine collects, uses, and protects your personal information.",
};

const Section = ({ number, title, children }: { number: string; title: string; children: React.ReactNode }) => (
  <section className="border-b border-border last:border-0 py-10">
    <div className="flex items-start gap-4 mb-5">
      <span className="shrink-0 w-9 h-9 bg-emerald/10 text-emerald rounded-full flex items-center justify-center font-body font-bold text-sm">{number}</span>
      <h2 className="font-heading text-xl sm:text-2xl text-charcoal pt-1">{title}</h2>
    </div>
    <div className="pl-0 sm:pl-13 font-body text-[15px] text-muted leading-relaxed space-y-3">{children}</div>
  </section>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2 mt-2">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2.5">
        <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-emerald" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-cream min-h-screen">
      {/* Hero */}
      <div className="bg-white border-b border-border py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald/10 rounded-full mb-5">
            <ShieldCheck className="w-7 h-7 text-emerald" />
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-charcoal mb-4">Privacy Policy</h1>
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

          <Section number="1" title="Introduction">
            <p>This Privacy Policy describes how Silvaniya – The Art of Eternal Shine collects, uses, stores, and protects your personal information when you visit or make a purchase from our website.</p>
            <p>By accessing or using our website, you agree to the terms of this Privacy Policy.</p>
          </Section>

          <Section number="2" title="Information We Collect">
            <p className="font-semibold text-charcoal">A. Personal Information (Provided by You)</p>
            <BulletList items={["Full Name", "Phone Number", "Email Address", "Billing & Shipping Address", "Payment Information (processed securely via third-party gateways)", "Order details and purchase history", "Communication records (emails, WhatsApp, chat, etc.)"]} />

            <p className="font-semibold text-charcoal mt-4">B. Automatically Collected Information</p>
            <BulletList items={["IP Address", "Browser type and device information", "Pages visited, time spent", "Cookies and tracking data"]} />

            <p className="font-semibold text-charcoal mt-4">C. Optional Information</p>
            <BulletList items={["Reviews, feedback, testimonials", "Social media interactions"]} />
          </Section>

          <Section number="3" title="How We Use Your Information">
            <p>We use your information for the following purposes:</p>
            <BulletList items={["To process and deliver orders", "To manage payments and transactions", "To provide customer support", "To improve website performance and user experience", "To send updates, offers, and promotional messages", "To prevent fraud and ensure security"]} />
          </Section>

          <Section number="4" title="Legal Basis for Processing">
            <p>We process your data based on:</p>
            <BulletList items={["Your consent", "Contractual necessity (order processing)", "Legal obligations under Indian law", "Legitimate business interests"]} />
          </Section>

          <Section number="5" title="Sharing of Information">
            <p>We do <strong className="text-charcoal">NOT</strong> sell your personal data. We may share your information with:</p>
            <BulletList items={["Payment gateways (Razorpay, Stripe, etc.)", "Logistics & delivery partners", "IT service providers and hosting platforms", "Legal authorities (if required by law)"]} />
          </Section>

          <Section number="6" title="Cookies & Tracking Technologies">
            <p>We use cookies to:</p>
            <BulletList items={["Enhance user experience", "Analyze traffic", "Remember preferences", "Run marketing campaigns"]} />
            <p className="mt-3">You can disable cookies via browser settings, but this may affect website functionality.</p>
          </Section>

          <Section number="7" title="Data Security">
            <p>We implement industry-standard security measures including:</p>
            <BulletList items={["SSL encryption", "Secure payment gateways (PCI-DSS compliant)", "Restricted internal access", "Regular monitoring"]} />
          </Section>

          <Section number="8" title="Data Retention">
            <p>We retain your data:</p>
            <BulletList items={["As long as required for order fulfillment", "For legal and tax compliance", "Until you request deletion"]} />
          </Section>

          <Section number="9" title="Your Rights">
            <p>You have the right to:</p>
            <BulletList items={["Access your personal data", "Correct inaccurate information", "Request deletion of your data", "Withdraw consent for marketing"]} />
            <div className="mt-5 flex items-center gap-2 text-charcoal font-semibold">
              <Mail className="w-4 h-4 text-emerald" />
              <span>To exercise these rights, contact us at:</span>
              <a href="mailto:support@silvaniya.com" className="text-emerald hover:underline">support@silvaniya.com</a>
            </div>
          </Section>

          <Section number="10" title="Third-Party Links">
            <p>Our website may contain links to third-party websites. We are not responsible for their privacy practices.</p>
          </Section>

          <Section number="11" title="Children's Privacy">
            <p>Our services are not intended for individuals under 18 years of age. We do not knowingly collect data from minors.</p>
          </Section>

          <Section number="12" title="International Users">
            <p>If you access our website from outside India, you consent to data processing in India.</p>
          </Section>

          <Section number="13" title="Changes to This Policy">
            <p>We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated effective date.</p>
          </Section>

          <Section number="14" title="Contact Information">
            <p className="font-semibold text-charcoal">Vernium Gold Private Limited</p>
            <p className="italic text-sm">Owner of Silvaniya – The Art of Eternal Shine</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald shrink-0" /><span>Business Address, India</span></div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald shrink-0" /><a href="mailto:support@silvaniya.com" className="text-emerald hover:underline">support@silvaniya.com</a></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald shrink-0" /><span>+91 XXXXX XXXXX</span></div>
            </div>
          </Section>

        </div>

        {/* Related Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm font-body">
          <Link href="/terms-and-conditions" className="text-emerald hover:underline font-semibold">Terms & Conditions →</Link>
          <Link href="/refund-policy" className="text-emerald hover:underline font-semibold">Refund & Return Policy →</Link>
        </div>
      </div>
    </main>
  );
}
