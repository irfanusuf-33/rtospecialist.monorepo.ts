import type { Metadata } from "next";
import MembershipPlansClient from "../../components/membership/MembershipPlansClient";

export const metadata: Metadata = {
  title: "RTO Membership Plans - Get Exclusive Benefits & Discounts",
  description:
    "Choose the best RTO membership plan and get discounts, access to professional development, and exclusive industry benefits. Join now!",
  keywords: [
    "RTO membership",
    "training plans",
    "compliance experts",
    "professional development",
    "industry staff database",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://rtospecialist.com.au/membership-plans",
  },
  openGraph: {
    title: "RTO Membership Plans - Get Exclusive Benefits & Discounts",
    description:
      "Choose the best RTO membership plan and get discounts, access to professional development, and exclusive industry benefits. Join now!",
    type: "website",
    url: "https://rtospecialist.com.au/membership-plans",
    images: [
      {
        url: "https://rtospecialist.com.au/images/membership-banner.jpg",
      },
    ],
  },
};

export default function MembershipPlansPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "RTO Membership Plans",
    description:
      "Join our RTO Membership to get discounts, access to professional development, and exclusive benefits.",
    offers: [
      {
        "@type": "Offer",
        name: "Executive Member",
        priceCurrency: "AUD",
        price: "999",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "VIP Member",
        priceCurrency: "AUD",
        price: "1999",
        availability: "https://schema.org/InStock",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <MembershipPlansClient />
    </>
  );
}
