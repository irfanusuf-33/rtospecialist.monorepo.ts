import type { Metadata } from "next";
import PDevHeader from "../../components/professionaldev/PdevHeader";
import PdevWhyUsSection from "../../components/professionaldev/PdevWhyUsSection";
import PdevSupportImpactSection from "../../components/professionaldev/PdevSupportImpactSection";
import PdevHowItWorksSection from "../../components/professionaldev/PdevHowItWorksSection";
import PdevMembershipCtaSection from "../../components/professionaldev/PdevMembershipCtaSection";
import PdevFaqSection from "../../components/professionaldev/PdevFaqSection";
import PdevBottomCtaSection from "../../components/professionaldev/PdevBottomCtaSection";
import Pdevmempricing from "../../components/professionaldev/Pdevmempricing";
import PdevOurProducts from "../../components/professionaldev/PdevOurProducts";
// import '../../client/scss/professionaldev/professionaldev.scss';

export const metadata: Metadata = {
  title: "Professional Development & Certification Plans | RTO Specialist",
  description:
    "Explore our professional development plans and certifications tailored for educators and training professionals. Stay compliant and enhance your skills with lifetime access.",
  keywords: [
    "Professional Development",
    "Training",
    "Certification",
    "RTO",
    "ASQA",
    "VET",
    "Career Growth",
    "Education",
    "Skills Enhancement",
  ],
  alternates: {
    canonical: "https://rtospecialist.com.au/professional-development-plans",
  },
  openGraph: {
    type: "website",
    url: "https://rtospecialist.com.au/professional-development-plans",
    title: "Professional Development & Certification Plans | RTO Specialist",
    description:
      "Explore our professional development plans and certifications tailored for educators and training professionals. Stay compliant and enhance your skills with lifetime access.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Development & Certification Plans | RTO Specialist",
    description:
      "Explore our professional development plans and certifications tailored for educators and training professionals. Stay compliant and enhance your skills with lifetime access.",
  },
};

export default function ProfessionalDevelopmentPlans() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "RTO Specialist",
    url: "https://rtospecialist.com.au",
    description:
      "Enhance your skills with our comprehensive professional development programs. Stay compliant with industry standards and improve your assessment practices.",
    offers: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "Single Certification Program",
        description:
          "Gain a professional certification with lifetime access, career development resources, and networking opportunities.",
        offers: {
          "@type": "Offer",
          price: "55",
          priceCurrency: "AUD",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "EducationalOccupationalProgram",
        name: "Basic Professional Development Plan",
        description:
          "Get access to professional development resources for personal use with up to 7 certifications included.",
        offers: {
          "@type": "Offer",
          price: "249",
          priceCurrency: "AUD",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "EducationalOccupationalProgram",
        name: "Starter Professional Development Plan",
        description:
          "Access to professional development for 5 staff members with additional staff options available.",
        offers: {
          "@type": "Offer",
          price: "799",
          priceCurrency: "AUD",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "EducationalOccupationalProgram",
        name: "Premium Professional Development Plan",
        description:
          "Includes access for 10 professional staff members with additional team options at a discounted rate.",
        offers: {
          "@type": "Offer",
          price: "1399",
          priceCurrency: "AUD",
          availability: "https://schema.org/InStock",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PDevHeader />
      <PdevOurProducts />
      <Pdevmempricing />
      <PdevWhyUsSection />
      <PdevSupportImpactSection />
      <PdevHowItWorksSection />
      <PdevMembershipCtaSection />
      <PdevFaqSection />
      <PdevBottomCtaSection />
      {/* <PdevOurFocus />
      <PdevCertification />
      <PdevProgramFeatures /> */}
    </>
  );
}
