// app/ecommerce/page.tsx (Server Component)
import type { Metadata } from "next";
import { Suspense } from 'react'
import RtoSpecialistEcommerce from './RtoSpecialistEcommerce'

export const metadata: Metadata = {
  title: "RTO Specialist E-commerce | Buy Training & Compliance Products Online",
  description:
    "Buy high-quality RTO training resources, compliance tools, and audit solutions online. Get expert-approved materials for ASQA-compliant Registered Training Organisations (RTOs).",
  keywords: [
    "RTO training",
    "training products",
    "compliance products",
    "online store",
    "RTO e-commerce",
  ],
  alternates: {
    canonical: "https://rtospecialist.com.au/ecommerce",
  },
};

export default function EcommercePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RTO Specialist E-commerce",
    url: "https://rtospecialist.com.au/ecommerce",
    description: "Explore top-rated training and compliance products for RTOs. Buy online with ease.",
    publisher: {
      "@type": "Organization",
      name: "RTO Specialist",
      url: "https://rtospecialist.com.au",
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Suspense fallback={<div>Loading search results...</div>}>
        <RtoSpecialistEcommerce />
      </Suspense>
    </div>
  )
}
