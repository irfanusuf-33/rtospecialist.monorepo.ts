import type { Metadata } from "next";
import RtoConsultingWhyRegsiter from "../../components/common/rtoconsultationservices/RtoConsultingWhyRegister";
import RtoConsultationSteps from "../../components/common/rtoconsultationservices/RtoConsultationSteps";
import RtokeyConsiderations from "../../components/common/rtoconsultationservices/RtoKeyConsiderations";
import RtoConsultationSecondHeader from "../../components/common/rtoconsultationservices/RtoConsultationSecondHeader";
import PlayLessonOutlinedIcon from '@mui/icons-material/PlayLessonOutlined';
import AssuredWorkloadOutlinedIcon from '@mui/icons-material/AssuredWorkloadOutlined';
import PriceCheckOutlinedIcon from '@mui/icons-material/PriceCheckOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import ModelTrainingOutlinedIcon from '@mui/icons-material/ModelTrainingOutlined';
import '../../client/scss/rtoconsultationservices/rtoconsultationservices.scss';
import LeaseRtoImg from '../../assets/leasertoimg.webp';

export const metadata: Metadata = {
  title: "Lease a Delivery Location for RTO Training | RTO Specialist",
  description:
    "Lease a professional and ASQA-compliant training space for RTO, CRICOS, and ELICOS courses. Our leasing options help education providers expand and meet compliance requirements.",
  alternates: {
    canonical: "https://rtospecialist.com.au/rto-lease-delivery-location-service",
  },
  openGraph: {
    type: "website",
    url: "https://rtospecialist.com.au/rto-lease-delivery-location-service",
    title: "Lease a Delivery Location for RTO & CRICOS Training | RTO Specialist",
    description:
      "Lease a professional and ASQA-compliant training space for RTO, CRICOS, and ELICOS courses. Our leasing options help education providers expand and meet compliance requirements.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lease a Delivery Location for RTO & CRICOS Training | RTO Specialist",
    description:
      "Lease a professional and ASQA-compliant training space for RTO, CRICOS, and ELICOS courses. Our leasing options help education providers expand and meet compliance requirements.",
  },
};

const headerData = {
  heading: "Lease a Delivery Location for Your CRICOS Training Programs",
  secondary: `Looking for a professional and compliant space to deliver your training programs? Leasing a delivery location can
be a smart solution for RTO, CRICOS and ELICOS providers seeking to expand their reach or offer courses in
new areas. Whether you need a permanent space or a temporary location for specific courses, we offer flexible
leasing options tailored to your training needs.`
};

const whyUsTileData = [
  {
    heading: "Meet ASQA Compliance Requirements",
    body: `If you’re an RTO, it's essential to have a delivery location that
meets the Australian Skills Quality Authority (ASQA) standards. Leasing a compliant space ensures that
you have the facilities needed for high-quality, accredited training
`,
    icon: <AssuredWorkloadOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Professional Learning Environment",
    body: `A well-equipped, dedicated training space enhances the learning
experience for your students and helps establish your reputation as a professional and credible
education provider`,
    icon: <PlayLessonOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Cost-Effective",
    body: `
Leasing a location can be more cost-effective than buying or building your own training
facility, especially for short-term courses or temporary needs. You can allocate resources to other
aspects of your business, such as course development and marketing`,
    icon: <PriceCheckOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Customised Solutions",
    body: `Lease options can be tailored to fit the specific requirements of your training
programs. Whether you need classroom spaces, computer labs, or practical workshop areas, you can
find a delivery location that suits your curriculum
`,
    icon: <SettingsSuggestOutlinedIcon sx={{ fontSize: 40 }} />
  }
];

const componentHeading = 'Why Lease a Delivery Location?';
const componentSecondary = `
Whether you need a permanent space or a temporary location for specific courses, we offer flexible
leasing options tailored to your training needs.
`;

// steps component data
const stepsHeading = "What to Consider When Leasing a Delivery Location";
const stepsImage = LeaseRtoImg;
const stepsTileData = [
  {
    heading: "Compliance and Facilities",
    body: `
Ensure that the leased location meets all the necessary Class 9B
compliance standards, including facilities for practical training, accessibility, and safety requirements.
This is particularly important for RTOs that need to maintain ASQA compliance`
  },
  {
    heading: "Location and Accessibility",
    body: `
 Choose a delivery location that is easily accessible to your target student
population. Consider proximity to public transportation, parking availability, and local amenities when
selecting a site

`
  },
  {
    heading: "Leasing Terms",
    body: `
    Short-term, long-term, and part-time leasing agreements can give you the freedom to
    adjust based on demand`
  },
  {
    heading: "Equipment and Resources",
    body: `
    Ensure the location is equipped with the technology, tools, and resources
    needed for your training programs. This includes audiovisual equipment, seating arrangements, and
    space for practical assessments if required`
  },
  {
    heading: "Branding Opportunities",
    body: `
    Depending on your lease agreement, you may have the opportunity to brand
    the space with your organisation’s signage, helping to build your brand identity and visibility in the
    community
`
  },
];

// key considerations
const keyconsiderationsHeading = "How Leasing a Delivery Location Works";

const keyconsiderationsTileData = [
  {
    heading: "Identify Your Needs",
    body: `Determine the type of training programs you’ll be delivering, the facilities required,
    and the duration of your lease`,
    icon: <SearchOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Search for Suitable Locations",
    body: `We can find a delivery locations that meet your compliance
    requirements and are conveniently located for your students`,
    icon: <PinDropOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Assess the Space",
    body: `Visit potential locations to ensure they offer the facilities and resources necessary
    for your specific courses`,
    icon: <MapOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Negotiate the Lease",
    body: `We can finalise terms that fit your business needs, including pricing, length of
    lease, and any additional services`,
    icon: <SettingsSuggestOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Set Up and Start Training",
    body: `Once the lease is signed, prepare the space for your training programs and
    start delivering high-quality education in your new location`,
    icon: <ModelTrainingOutlinedIcon sx={{ fontSize: 40 }} />
  }
];

export default function SellRto() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Lease a Delivery Location for RTO & CRICOS Training",
    provider: {
      "@type": "EducationalOrganization",
      name: "RTO Specialist",
      url: "https://rtospecialist.com.au",
    },
    serviceType: "Leasing a Delivery Location",
    description:
      "Lease a professional and ASQA-compliant training space for RTO, CRICOS, and ELICOS courses. Our leasing options help education providers expand and meet compliance requirements.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-316-555-0116",
      contactType: "Customer Service",
      email: "Info@rtospecialist.com.au",
      availableLanguage: ["English"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="rto-consulation-reg-header">
        <RtoConsultationSecondHeader heading={headerData.heading} secondary={headerData.secondary} />
      </div>
      <div className="rto-consultation-why-regsiter">
        <RtoConsultingWhyRegsiter tileData={whyUsTileData} heading={componentHeading} secondary={componentSecondary} />
      </div>
      <div className="rto-consultation-steps">
        <RtoConsultationSteps image={stepsImage} heading={stepsHeading} tileData={stepsTileData} />
      </div>
      <div className="rto-key-considerations">
        <RtokeyConsiderations heading={keyconsiderationsHeading} tileData={keyconsiderationsTileData} />
      </div>
    </>
  );
}
