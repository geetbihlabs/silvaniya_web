import React from "react";
import PolicyLayout from "@/components/layout/PolicyLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jewellery Care Guide – Silvaniya",
  description: "Learn how to care for your 925 sterling silver jewellery and keep it shining forever.",
};

export default function JewelleryCareePage() {
  return (
    <PolicyLayout
      title="Jewellery Care"
      subtitle="To preserve its brilliance, your silver jewellery requires a little care and attention."
    >
      <h2>Why Does Silver Tarnish?</h2>
      <p>
        Tarnish is a thin layer of corrosion that appears as a dull grey or black coating on silver. While pure silver resists tarnish, it is too soft for everyday jewellery, which is why <strong>925 sterling silver</strong> (92.5% silver + 7.5% alloy) is used for durability.
      </p>
      <p>Sterling silver may tarnish faster in:</p>
      <ul>
        <li>Humid climates</li>
        <li>Polluted environments</li>
        <li>Exposure to chemicals such as perfumes, hairsprays, deodorants, moisturizers</li>
      </ul>

      <h3>Common Causes of Tarnish</h3>
      <ul>
        <li>Oxygen &amp; Water</li>
        <li>Sulfur &amp; Detergents</li>
        <li>Chlorine &amp; Paint</li>
        <li>Air Pollution &amp; Atmosphere</li>
        <li>Household Cleaners</li>
        <li>Bodily Chemicals (Sweat, Oils)</li>
      </ul>

      <hr />

      <h2>How to Prevent Tarnish</h2>
      <div className="highlight-box">
        <ul style={{ margin: 0 }}>
          <li>✨ Keep your jewellery in <strong>airtight containers</strong>.</li>
          <li>✨ Store in a <strong>cool, dry place</strong> with low humidity.</li>
          <li>✨ Clean gently with <strong>warm water &amp; a soft cloth</strong>.</li>
          <li>✨ Avoid contact with <strong>chemicals, perfumes, lotions, and oils</strong>.</li>
        </ul>
      </div>

      <hr />

      <h2>Tips to Care for Your 925 Sterling Silver Jewellery</h2>
      <ul>
        <li><strong>Wear Regularly:</strong> Surprisingly, wearing silver often slows tarnishing, as natural skin oils protect the metal.</li>
        <li><strong>Proper Storage:</strong> Always store in the Silvaniya box provided, away from heat and sunlight.</li>
        <li><strong>Gentle Cleaning:</strong> Wash in warm soapy water, rinse, and pat dry with a soft cloth.</li>
        <li><strong>Before Activities:</strong> Remove jewellery before swimming, bathing, or exercising.</li>
        <li><strong>Avoid Harsh Cleaners:</strong> Do not use liquid silver dips or abrasive chemicals, as they damage protective finishes.</li>
        <li><strong>Re-polishing:</strong> For long-term shine, opt for professional re-polishing services (Silvaniya offers <em>lifetime free polishing</em>).</li>
      </ul>

      <hr />

      <h2>Frequently Asked Questions</h2>

      <h3>What purity of silver do you use?</h3>
      <p>All Silvaniya creations are crafted in hallmarked 925 sterling silver, ensuring 92.5% purity, blended for strength and durability.</p>

      <h3>Do your products carry a hallmark?</h3>
      <p>Yes. Every Silvaniya piece is stamped with "925" and hallmarked as per BIS standards, assuring authenticity.</p>

      <h3>Can I wear Silvaniya jewellery daily?</h3>
      <p>Absolutely. Our jewellery is designed for both everyday wear and special occasions. We recommend avoiding harsh chemicals, perfumes, and water exposure for long-lasting shine.</p>

      <h3>Are your products nickel-free and skin safe?</h3>
      <p>Yes. All Silvaniya jewellery is nickel-free, lead-free, and hypoallergenic, making it safe and comfortable for everyday wear.</p>

      <h3>Do you offer resizing or customization?</h3>
      <p>Currently, we offer only standard sizes as per our size chart. Resizing/custom orders may be introduced soon.</p>
    </PolicyLayout>
  );
}
