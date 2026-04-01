import React from "react";
import PolicyLayout from "@/components/layout/PolicyLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs – Silvaniya",
  description: "Find answers to frequently asked questions about ordering, payments, delivery, and jewellery care at Silvaniya.",
};

interface FaqItem {
  q: string;
  a: React.ReactNode;
}

const PURCHASE_FAQS: FaqItem[] = [
  {
    q: "How do I know the jewellery is authentic?",
    a: "Every Silvaniya piece is crafted in hallmarked 925 sterling silver.",
  },
  {
    q: "Do I need an account to place an order?",
    a: "No, you can checkout as a guest. But creating an account helps you track orders, save favourites, and enjoy special offers.",
  },
  {
    q: "What payment methods are accepted?",
    a: (
      <>
        We accept all major debit/credit cards, UPI, net banking, and wallet payments. Cash on Delivery (COD) is also available on select pin codes. To ensure secure transactions, customers choosing COD are required to pay a <strong>₹100 advance</strong> at checkout.
        <ul>
          <li>This amount will be adjusted against your order and is fully refundable in case the product is returned due to a manufacturing defect.</li>
          <li>For returns/refunds, an <strong>unboxing video is mandatory</strong> to process the claim.</li>
        </ul>
      </>
    ),
  },
  {
    q: "Is Cash on Delivery (COD) available?",
    a: "Yes, COD is available for orders up to ₹10,000. For higher value orders, we request prepaid payment for security reasons.",
  },
  {
    q: "Can I cancel my order after placing it?",
    a: "Yes, cancellations are possible within 24 hours of purchase if the order has not been shipped. Once dispatched, cancellations cannot be processed.",
  },
  {
    q: "Do you offer gift packaging?",
    a: "Yes, every Silvaniya order comes in our premium signature box. Complimentary gift wrapping is available on request.",
  },
  {
    q: "Do you take custom or personalized orders?",
    a: "Currently, we offer only ready-to-ship designs. Bespoke/custom orders may be introduced in the future.",
  },
  {
    q: "What if the product I want is out of stock?",
    a: "You can join the waitlist on the product page. We will notify you as soon as it is back in stock.",
  },
];

const DELIVERY_FAQS: FaqItem[] = [
  {
    q: "Which courier partner delivers Silvaniya orders?",
    a: "We have partnered with Blue Dart Express Ltd., one of India's most reliable logistics companies, to ensure your jewellery reaches you safely and on time.",
  },
  {
    q: "How long does delivery take?",
    a: (
      <ul>
        <li><strong>Metro cities:</strong> 3–5 working days</li>
        <li><strong>Other locations:</strong> 5–7 working days</li>
        <li>Timelines may vary due to festivals, weather, or unforeseen courier delays, but we always strive to deliver at the earliest.</li>
      </ul>
    ),
  },
  {
    q: "Do you deliver everywhere in India?",
    a: "Yes, we offer Pan-India delivery through Blue Dart. However, in rare cases where Blue Dart does not service a location, our team will contact you with alternative options.",
  },
  {
    q: "How much is the shipping cost?",
    a: "We offer Free Delivery on all orders within India.",
  },
  {
    q: "What happens if I am not available at the time of delivery?",
    a: "Blue Dart will attempt delivery up to two times. If undelivered, the shipment will be returned to us (RTO). Re-shipping can be arranged at an additional cost.",
  },
  {
    q: "What if my package arrives tampered or damaged?",
    a: "Please do not accept the package if it looks tampered with or opened. Contact us immediately, and we will assist with a replacement or resolution.",
  },
  {
    q: "Can I track my order?",
    a: "Yes, once dispatched, you will receive an AWB (Air Waybill) number along with a tracking link to follow your shipment in real-time.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently, Silvaniya delivers only within India. International shipping will be launched soon.",
  },
];

const PAYMENT_FAQS: FaqItem[] = [
  {
    q: "Is it safe to pay online on Silvaniya?",
    a: "Absolutely. All online transactions are processed through a secure, encrypted payment gateway to ensure your personal and financial details remain safe.",
  },
  {
    q: "Can I pay in installments (EMI)?",
    a: "At present, we do not offer EMI options. However, we are working towards introducing flexible payment solutions in the near future.",
  },
  {
    q: "My payment failed, but money was deducted. What should I do?",
    a: "Don't worry. In case of a failed transaction, the amount is usually reversed to your original payment method within 5–7 business days. If not, please contact your bank or reach out to us.",
  },
  {
    q: "Can I use different payment methods for one order?",
    a: "Currently, one order can only be completed using a single payment method.",
  },
  {
    q: "Will I get an invoice for my order?",
    a: "Yes, a printed invoice will be included inside your package.",
  },
];

function FaqSection({ title, items }: { title: string; items: FaqItem[] }) {
  return (
    <>
      <h2>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {items.map((item, i) => (
          <div key={i} style={{ borderLeft: "3px solid #e5e7eb", paddingLeft: "1.25rem" }}>
            <h3 style={{ marginTop: 0, marginBottom: "0.4rem" }}>{item.q}</h3>
            <div className="faq-answer">{typeof item.a === "string" ? <p>{item.a}</p> : item.a}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function FaqsPage() {
  return (
    <PolicyLayout title="FAQs" subtitle="Answers to the most common questions about ordering, payments, and delivery.">
      <FaqSection title="Purchase Related" items={PURCHASE_FAQS} />
      <hr />
      <FaqSection title="Delivery Related" items={DELIVERY_FAQS} />
      <hr />
      <FaqSection title="Payment Related" items={PAYMENT_FAQS} />
      <hr />
      <h2>Still have questions?</h2>
      <p>📧 Reach us at <a href="mailto:support@silvaniya.com">support@silvaniya.com</a> — we are happy to help!</p>
      <p>🕒 Support Time: Mon–Sat, 10 AM – 7 PM</p>
    </PolicyLayout>
  );
}
