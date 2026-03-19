import React from "react";
import Link from "next/link";
import { FileText, Mail, Phone } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Silvaniya – The Art of Eternal Shine",
  description:
    "Read the Terms & Conditions governing the use of Silvaniya – The Art of Eternal Shine and purchases made on our website.",
};

const Section = ({ number, title, children }: { number: string; title: string; children: React.ReactNode }) => (
  <section className="border-b border-border last:border-0 py-10">
    <div className="flex items-start gap-4 mb-5">
      <span className="shrink-0 w-9 h-9 bg-emerald/10 text-emerald rounded-full flex items-center justify-center font-body font-bold text-sm">{number}</span>
      <h2 className="font-heading text-xl sm:text-2xl text-charcoal pt-1">{title}</h2>
    </div>
    <div className="font-body text-[15px] text-muted leading-relaxed space-y-3">{children}</div>
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

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-cream min-h-screen">
      {/* Hero */}
      <div className="bg-white border-b border-border py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald/10 rounded-full mb-5">
            <FileText className="w-7 h-7 text-emerald" />
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-charcoal mb-4">Terms & Conditions</h1>
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
            <p>This website (www.silvaniya.com) is owned and operated by Vernium Gold Private Limited. By accessing or purchasing from this website, you agree to be legally bound by these Terms & Conditions.</p>
            <p>If you do not agree, please do not use this website.</p>
          </Section>

          <Section number="2" title="Eligibility">
            <BulletList items={["You must be 18 years or older", "You must provide accurate and complete information", "Any misuse, fraud, or false identity will result in immediate account termination"]} />
          </Section>

          <Section number="3" title="Products & Pricing">
            <BulletList items={[
              "All products are 925 Sterling Silver unless stated otherwise",
              "Prices are listed in INR (₹)",
              "Prices may change without notice (market-linked pricing logic applies)",
              "We reserve the right to cancel orders due to pricing errors"
            ]} />
          </Section>

          <Section number="4" title="Order Acceptance & Cancellation">
            <p>Orders are confirmed only after successful payment. We reserve the right to:</p>
            <BulletList items={["Cancel suspicious or high-risk orders", "Limit quantities purchased", "Reject orders due to stock issues"]} />
            <p className="mt-3">If we cancel an order, you will receive a full refund.</p>
          </Section>

          <Section number="5" title="Payments">
            <BulletList items={[
              "We accept secure payments via trusted gateways",
              "We do NOT store card details",
              "All transactions are processed through PCI-DSS compliant providers"
            ]} />
          </Section>

          <Section number="6" title="Shipping & Delivery">
            <BulletList items={[
              "Delivery timelines are estimated, not guaranteed",
              "Delays due to logistics, weather, or other external factors are not our liability",
              "Risk transfers to the customer after delivery is confirmed"
            ]} />
          </Section>

          <Section number="7" title="Intellectual Property">
            <p>All content including images, branding, logo, product designs, and text is the exclusive property of <strong className="text-charcoal">Vernium Gold Private Limited</strong>. Unauthorized use will result in legal action.</p>
          </Section>

          <Section number="8" title="User Conduct">
            <p>You agree NOT to:</p>
            <BulletList items={["Use the website for fraudulent purposes", "Attempt hacking or data breaches", "Misuse offers or promotional loopholes", "Post false or misleading reviews"]} />
            <p className="mt-3">Violations will result in account termination and/or legal action.</p>
          </Section>

          <Section number="9" title="Limitation of Liability">
            <p>We are not liable for:</p>
            <BulletList items={["Indirect or consequential damages", "Loss of data, revenue, or profits", "Delays beyond our control"]} />
            <p className="mt-3">Our maximum liability is limited to the order value paid.</p>
          </Section>

          <Section number="10" title="Warranty Disclaimer">
            <p>All products are sold "as is", except for manufacturing defects. Jewellery wear-and-tear, tarnishing due to misuse or improper care is not covered under warranty.</p>
          </Section>

          <Section number="11" title="Governing Law">
            <p>These Terms are governed by the laws of India. Disputes shall fall under the jurisdiction of the relevant courts in India.</p>
          </Section>

          <Section number="12" title="Modifications">
            <p>We can update these Terms at any time. Continued use of the website constitutes acceptance of any changes.</p>
          </Section>

          <Section number="13" title="Contact">
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
          <Link href="/refund-policy" className="text-emerald hover:underline font-semibold">Refund & Return Policy →</Link>
        </div>
      </div>
    </main>
  );
}
