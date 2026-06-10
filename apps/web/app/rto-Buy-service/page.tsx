import type { Metadata } from "next";
import RtoConsulationHeader from "../../components/common/rtoconsultationservices/RtoConsulationHeader";
import RtoConsultingWhyRegsiter from "../../components/common/rtoconsultationservices/RtoConsultingWhyRegister";
import RtoConsultationSteps from "../../components/common/rtoconsultationservices/RtoConsultationSteps";
import RtokeyConsiderations from "../../components/common/rtoconsultationservices/RtoKeyConsiderations";
import FilterFramesOutlinedIcon from '@mui/icons-material/FilterFramesOutlined';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import '../../client/scss/rtoconsultationservices/rtoconsultationservices.scss';
import BuyRtoImg from '../../assets/buyrtoimg.webp';

export const metadata: Metadata = {
  title: "Buy an RTO | A Smart Investment in Education",
  description:
    "Buying an RTO is a smart investment in the vocational education sector. Learn about compliance, financial considerations, and the steps to acquire an RTO.",
  keywords: [
    "Buy an RTO",
    "RTO acquisition",
    "Vocational Training",
    "Education Business",
    "ASQA Compliance",
  ],
  openGraph: {
    title: "Buy an RTO | A Smart Investment in Education",
    description:
      "Explore the benefits and key considerations when buying an RTO. Get instant access to the VET sector and start delivering accredited training today.",
    url: "https://rtospecialist.com.au/rto-Buy-service",
    type: "website",
  },
  alternates: {
    canonical: "https://rtospecialist.com.au/rto-Buy-service",
  },
};

const headerData = {
  heading: " A Smart Investment in the Education Sector",
  secondary: `Acquiring a Registered Training Organisation (RTO) can be a lucrative business opportunity, allowing you to tap
into the thriving vocational education and training (VET) industry. Whether you're a seasoned education provider
or an investor looking to enter the field, purchasing an RTO gives you immediate access to an established
framework for delivering accredited training.`
};

const whyUsTileData = [
  {
    heading: "Established Framework",
    body: `When you purchase an RTO, you gain access to a fully compliant training
operation, complete with accredited qualifications and a pre-existing reputation within the industry
`,
    icon: <FilterFramesOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Immediate Market Entry",
    body: `Skip the time-consuming process of establishing an RTO from scratch. With
an existing RTO, you can start delivering courses and generating revenue immediately`,
    icon: <AddBusinessOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Access to the VET Marke",
    body: `
The demand for vocational training is continuously growing across
industries like healthcare, business, construction, and more. An RTO positions you to provide these indemand qualifications`,
    icon: <RecordVoiceOverOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Growth Potential",
    body: `As an RTO owner, you can expand your course offerings, build industry partnerships,
and reach more students across different sectors
`,
    icon: <InsertChartOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Revenue Streams",
    body: ` RTOs often have multiple revenue sources, including course fees, government
funding, and industry partnerships. An established RTO may already have a client base and consistent
income flow
`,
    icon: <MonetizationOnOutlinedIcon sx={{ fontSize: 40 }} />
  },
];

const componentHeading = 'Why Buy an RTO?';
const componentSecondary = `
Whether you're a seasoned education provider
or an investor looking to enter the field, purchasing an RTO gives you immediate access to an established
framework for delivering accredited training`;

// steps component data
const stepsHeading = "What to Consider When Buying an RTO";
const stepsImage = BuyRtoImg;
const stepsTileData = [
  {
    heading: "Compliance",
    body: `
RTOs in Australia must meet strict regulatory requirements set by the Australian Skills
Quality Authority (ASQA). Ensuring that the RTO you purchase is compliant with these standards is
essential to avoid potential penalties and operational challenges.`
  },
  {
    heading: "Scope of Registration",
    body: `
 Check the RTO’s scope of registration to understand which qualifications and
courses are currently approved. You may want to expand or adjust the scope to align with your business
goals.

`
  },
  {
    heading: "Financial Health",
    body: `
Review the RTO’s financial records to ensure it is a stable investment. Look for
strong revenue streams, student enrolment numbers, and existing partnerships.`
  },
  {
    heading: "Staff and Trainers",
    body: `
Evaluate the qualifications of the RTO’s trainers and assessors. They must meet
the national standards, and their expertise will impact the quality of the training delivered.`
  },
  {
    heading: "Reputation and Market Position",
    body: `
The RTO’s reputation within the industry can affect student
enrolment and industry relationships. Look into the RTO’s brand presence, student satisfaction, and
feedback from past and current clients.
`
  },
];

// key considerations
const keyconsiderationsHeading = "Steps to Buying an RTO";

const keyconsiderationsTileData = [
  {
    heading: "Research & Identify Potential RTOs",
    body: `Start by identifying RTOs for sale that match your goals and
budget. Consider factors like scope of registration, market reach, and location.`,
    icon: <SearchOutlinedIcon />
  },
  {
    heading: "Due Diligence",
    body: `Conduct a thorough assessment of the RTO’s financials, compliance status, and
operational structure. This ensures you’re making an informed purchase`,
    icon: <SettingsOutlinedIcon />
  },
  {
    heading: "Negotiation & Purchase",
    body: `Negotiate the terms of the sale and finalise the purchase agreement.`,
    icon: <MonetizationOnOutlinedIcon />
  },
  {
    heading: "Transition & Growth",
    body: ` Once the RTO is under your ownership, work on a smooth transition while
identifying opportunities for growth and expansion`,
    icon: <InsertChartOutlinedIcon />
  }
];

export default function BuyRto () {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "RTO Acquisition",
    description:
      "Buying an RTO gives you access to a fully compliant training operation, allowing you to enter the vocational education sector efficiently.",
    provider: {
      "@type": "Organization",
      name: "RTO Specialist",
      url: "https://rtospecialist.com.au",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="rto-consulation-reg-header">
        <RtoConsulationHeader heading={headerData.heading} secondary={headerData.secondary}/>
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
