import React from "react";
import PolicyLayout from "@/components/layout/PolicyLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us – Silvaniya | The Art of Eternal Shine",
  description: "Learn about Silvaniya – our story, our craftsmanship, and our promise to deliver hallmarked 925 sterling silver jewellery crafted with care.",
};

export default function AboutPage() {
  return (
    <PolicyLayout
      title="About Us"
      subtitle="Welcome to Silvaniya – The Art of Eternal Shine."
    >
      <p>
        At Silvaniya, we believe jewellery is more than adornment — it is a reflection of your story, your elegance, and the timeless shine within you. Born from a passion for silver, Silvaniya is dedicated to creating hallmarked 925 sterling silver jewellery that blends artistry, purity, and modern design.
      </p>
      <p>
        Each piece is crafted with care, combining traditional craftsmanship with contemporary aesthetics to offer jewellery that you can cherish for a lifetime. From delicate everyday wear to statement creations, our designs celebrate individuality while carrying the assurance of authenticity.
      </p>
      <p>
        But Silvaniya is not just about jewellery — it is about belonging. When you choose Silvaniya, you become part of our family, a community that values trust, artistry, and eternal beauty. Every order is packed with love, sealed with care, and delivered with the promise of quality that shines forever.
      </p>
      <p>
        We are here to make your special moments unforgettable, to walk beside you in your celebrations, and to ensure that every sparkle you wear feels personal, pure, and priceless.
      </p>
      <p><strong>Silvaniya – The Art of Eternal Shine.</strong></p>

      <hr />

      <h2>What Silvaniya Means</h2>
      <p>
        The name Silvaniya finds its essence in the timeless beauty of silver. Inspired by the word <em>"Silva,"</em> meaning brightness and purity, and blended with the graceful suffix <em>"–niya,"</em> it reflects elegance, artistry, and charm.
      </p>
      <p>
        Together, Silvaniya can be understood as <strong>"The Land of Silver"</strong> — a world where every creation is born from purity, crafted with care, and designed to shine eternally.
      </p>
      <p>
        For us, Silvaniya is not just a name, but a promise: a promise of authenticity, artistry, and eternal shine in every piece of jewellery we create.
      </p>
      <p><strong>Silvaniya – The Art of Eternal Shine.</strong></p>

      <hr />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", margin: "2rem 0" }}>
        <div className="highlight-box">
          <span className="section-label">Our Craftsmanship</span>
          <p style={{ margin: 0 }}>
            At Silvaniya, every piece is created with hallmarked 925 sterling silver, designed by skilled artisans who combine timeless techniques with modern creativity. Each curve, cut, and polish carries the dedication of craftsmanship that makes your jewellery not just an accessory, but an heirloom.
          </p>
        </div>
        <div className="highlight-box">
          <span className="section-label">Our Promise</span>
          <p style={{ margin: 0 }}>
            Silvaniya is built on trust and authenticity. Every design you hold is carefully inspected, securely packaged, and delivered with love. We promise jewellery that will shine with you — through every season, every celebration, every memory.
          </p>
        </div>
        <div className="highlight-box">
          <span className="section-label">Our Family</span>
          <p style={{ margin: 0 }}>
            When you choose Silvaniya, you join a family. To us, you are not just a customer — you are part of our journey. We exist to celebrate your milestones, your everyday elegance, and your eternal shine.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PolicyLayout>
  );
}
