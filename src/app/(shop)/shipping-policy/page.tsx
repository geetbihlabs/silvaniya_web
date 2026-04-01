import React from "react";
import PolicyLayout from "@/components/layout/PolicyLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy – Silvaniya",
  description: "Learn about Silvaniya's shipping process, delivery timelines, packaging, and courier partnership with Blue Dart Express.",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      title="Shipping Policy"
      subtitle="Every order is special and deserves to be handled with utmost care."
    >
      <p>
        At Silvaniya – The Art of Eternal Shine, we have partnered with <strong>Blue Dart Express Ltd.</strong>, one of India's most reliable logistics service providers, to ensure safe and timely delivery of your jewellery.
      </p>

      <hr />

      <h2>Order Processing</h2>
      <ul>
        <li>All ready-to-ship orders are dispatched within <strong>1 working day</strong> of confirmation.</li>
        <li>Customized or made-to-order jewellery may take additional time for processing. Customers will be notified of estimated timelines.</li>
      </ul>

      <h2>Delivery Timelines</h2>
      <ul>
        <li><strong>Metro cities:</strong> 3–5 working days</li>
        <li><strong>Other locations:</strong> 4–7 working days</li>
        <li><strong>Remote/Out-of-coverage areas</strong> may take slightly longer.</li>
      </ul>
      <p>Delivery timelines may vary during festivals, holidays, or unforeseen courier delays.</p>

      <h2>Packaging &amp; Security</h2>
      <ul>
        <li>Every Silvaniya order is packed in our exclusive, tamper-proof, and durable packaging.</li>
        <li>Shipments are insured in transit for your peace of mind.</li>
        <li>Please do not accept packages that appear damaged or tampered with and contact our support team immediately.</li>
      </ul>

      <h2>Shipping Charges</h2>
      <div className="highlight-box">
        <p style={{ margin: 0 }}>✨ We offer <strong>Free Pan-India Delivery</strong> on all orders. Any applicable COD charges will be displayed at checkout.</p>
      </div>

      <h2>Return to Origin (RTO)</h2>
      <p>
        In case of failed deliveries due to customer unavailability or incorrect address, the shipment will be returned to us (RTO). Re-shipping may incur additional charges.
      </p>

      <hr />

      <h2>Frequently Asked Questions</h2>

      <h3>Which courier partner delivers Silvaniya orders?</h3>
      <p>We have partnered with Blue Dart Express Ltd., one of India's most reliable logistics companies.</p>

      <h3>Do you deliver everywhere in India?</h3>
      <p>Yes, we offer Pan-India delivery through Blue Dart. However, in rare cases where Blue Dart does not service a location, our team will contact you with alternative options.</p>

      <h3>What happens if I am not available at the time of delivery?</h3>
      <p>Blue Dart will attempt delivery up to two times. If undelivered, the shipment will be returned to us (RTO). Re-shipping can be arranged at an additional cost.</p>

      <h3>Can I track my order?</h3>
      <p>Yes, once dispatched, you will receive an AWB (Air Waybill) number along with a tracking link to follow your shipment in real-time.</p>

      <h3>Do you ship internationally?</h3>
      <p>Currently, Silvaniya delivers only within India. International shipping will be launched soon.</p>

      <hr />

      <h2>Contact Us</h2>
      <p>📧 <a href="mailto:support@silvaniya.com">support@silvaniya.com</a></p>
      <p>🕒 Support Time: Mon–Sat, 10 AM – 7 PM</p>
    </PolicyLayout>
  );
}
