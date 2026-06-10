import type { Metadata } from "next";
// import '../client/scss/home/home.scss';
import "keen-slider/keen-slider.min.css";
import { MotionSection } from "../components/common/animations/MotionReveal";
import Header from "../components/home/Header";
import HomeClaritySection from "../components/home/HomeClaritySection";
import HomeEcosystemSection from "../components/home/HomeEcosystemSection";
import HomeImplementationSection from "../components/home/HomeImplementationSection";
import HomeExploreServicesSection from "../components/home/HomeExploreServicesSection";
import HomeExploreMembershipSection from "../components/home/HomeExploreMembershipSection";
import HomeBuiltForRtosSection from "../components/home/HomeBuiltForRtosSection";
import HomeSampleSection from "../components/home/HomeSampleSection";
import HomeStructuredResourcesSection from "../components/home/HomeStructuredResourcesSection";
import HomeWhatThisMeansSection from "../components/home/HomeWhatThisMeansSection";
import OurServices from "../components/home/OurServices";
import CookiesAgreement from "../components/common/CookiesAgreement";
import HomeRegisterPopup from "../components/home/HomeRegisterPopup";
import Reviews from '@/components/home/Reviews';

export const metadata: Metadata = {
  title: "RTO Specialist | Expert RTO Compliance, Training, CRICOS, ELICOS & ASQA Audit",
  description:
    "RTO Specialist offers comprehensive services for RTO registration, buying and selling RTOs, CRICOS & ELICOS compliance, job placement, hiring, audits, and training solutions. Ensure ASQA compliance with expert support tailored to your needs.",
  keywords: [
    "Registered Training Organisations Specialist",
    "RTO compliance",
    "RTO registration",
    "ASQA compliance",
    "RTO Training",
    "RTO support",
    "training resources",
    "Australia RTO services",
  ],
  authors: [{ name: "RTO Specialist" }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://rtospecialist.com.au/",
  },
  openGraph: {
    title: "RTO Specialist | Expert Compliance & Training Support in Australia",
    description:
      "Need help with RTO compliance? RTO Specialist offers expert guidance, training materials, and consulting services to ensure your RTO meets ASQA standards.",
    url: "https://rtospecialist.com.au/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RTO Specialist | Compliance & Training Support",
    description:
      "Helping RTOs in Australia stay compliant with ASQA standards through expert support and training resources.",
  },
};

export default function Home () {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RTO Specialist",
    url: "https://rtospecialist.com.au/",
    description:
      "RTO Specialist helps Registered Training Organisations (RTOs) in Australia with compliance, training resources, and expert support.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-316-555-0116",
      contactType: "customer service",
      availableLanguage: "English",
    },
  };

  return (
    <div className="home-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div>
        <Header />
      </div>
      <MotionSection>
        <HomeClaritySection />
      </MotionSection>
      <MotionSection>
        <HomeEcosystemSection />
      </MotionSection>
      <MotionSection>
        <HomeWhatThisMeansSection />
      </MotionSection>
      <MotionSection className="home-our-services">
        <OurServices />
      </MotionSection>
      <MotionSection>
        <HomeImplementationSection />
      </MotionSection>
      <MotionSection>
        <HomeStructuredResourcesSection />
      </MotionSection>
      <MotionSection>
        <HomeExploreServicesSection />
      </MotionSection>
      <MotionSection>
        <HomeExploreMembershipSection />
      </MotionSection>
      <MotionSection>
        <HomeBuiltForRtosSection />
      </MotionSection>
      <MotionSection>
        <HomeSampleSection />
      </MotionSection>
      <MotionSection className="home-reviews">
        <Reviews/>
      </MotionSection>
      <HomeRegisterPopup />
      <CookiesAgreement />
    </div>
  );
}
