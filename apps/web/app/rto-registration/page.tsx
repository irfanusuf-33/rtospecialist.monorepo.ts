import type { Metadata } from "next";
import RtoConsulationHeader from "../../components/common/rtoconsultationservices/RtoConsulationHeader";
import RtoConsultingWhyRegsiter from "../../components/common/rtoconsultationservices/RtoConsultingWhyRegister";
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PaidIcon from '@mui/icons-material/Paid';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import RtoConsultationSteps from "../../components/common/rtoconsultationservices/RtoConsultationSteps";
import RtokeyConsiderations from "../../components/common/rtoconsultationservices/RtoKeyConsiderations";
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import PhonelinkOutlinedIcon from '@mui/icons-material/PhonelinkOutlined';
import CloudSyncOutlinedIcon from '@mui/icons-material/CloudSyncOutlined';
import '../../client/scss/rtoconsultationservices/rtoconsultationservices.scss';
import RtoRegistrationImg from '../../assets/registrationimg.webp';

export const metadata: Metadata = {
  title: "RTO Registration Services | Buy an RTO",
  description:
    "Get expert guidance on registering a Registered Training Organisation (RTO) in Australia. Learn about compliance, business planning, and ASQA requirements.",
  keywords: [
    "RTO registration",
    "Registered Training Organisation",
    "ASQA",
    "vocational education",
    "compliance",
  ],
  alternates: {
    canonical: "https://rtospecialist.com.au/rto-registration",
  },
};

const headerData = {
  mainheading: "New RTO Registration",
  heading: "Start Your Journey in Vocational Education",
  secondary: "Setting up a Registered Training Organisation (RTO) is a significant step toward delivering nationally accredited training in Australia. As an RTO, you' ll have the opportunity to provide students with industry-recognised qualifications that meet the demands of the workforce. The process of becoming an RTO requires thorough planning, compliance with regulatory requirements, and a commitment to quality education.",
  icon: <ModelTrainingIcon />
};

const whyUsTileData = [
  {
    heading: "Deliver Nationally Recognised Training",
    body: `As an RTO, you can offer accredited courses that are
recognised across Australia. This allows your students to receive qualifications that are highly valued by
employers and government bodies.`,
    icon: <ModelTrainingIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Access to a Growing Market",
    body: `The demand for vocational education and training (VET) continues to
rise, with industries seeking skilled workers in sectors like health, construction, business, and more.
Establishing an RTO positions you to tap into this expanding market.`,
    icon: <GroupAddIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Government Funding Opportunities",
    body: `
 Many RTOs are eligible for government funding, enabling you to
offer affordable education to students while boosting your organisation's revenue.`,
    icon: <PaidIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Flexibility and Control",
    body: `As an RTO owner, you have the flexibility to design your own courses, set your
pricing, and grow your organisation in line with your vision and goals.
`,
    icon: <SettingsIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Business Growth Potential",
    body: `Once your RTO is registered, you can expand your scope by offering
additional courses, partnering with other businesses, or targeting specific industries.
`,
    icon: <AccessibilityIcon sx={{ fontSize: 40 }} />
  },
];

const componentHeading = 'Why Register a New RTO?';
const componentSecondary = `
Setting up a Registered Training Organisation (RTO) is a significant step toward delivering nationally accredited
training in Australia. As an RTO, you'll have the opportunity to provide students with industry-recognised
qualifications that meet the demands of the workforce.`;

const stepsHeading = "Key Steps in New RTO Registration";
const stepsImage = RtoRegistrationImg;
const stepsTileData = [
  {
    heading: "Understand the Regulatory Requirements",
    body: `
        The Australian Skills Quality Authority (ASQA) oversees
RTO registration and ensures that all providers meet the national standards for quality education and
training. Before applying, familiarize yourself with the Standards for RTOs which outline the compliance
requirements for RTO operations.`
  },
  {
    heading: "Develop Your Business Plan",
    body: `
         A solid business plan is essential for RTO registration. It should include
your organisation's structure, financial forecasts, target market, course offerings, and strategies for
delivering high-quality training.
`
  },
  {
    heading: "Prepare Your Training and Assessment Strategies",
    body: `
       You'll need to demonstrate that your RTO has
effective training and assessment strategies for each course you intend to offer. This includes how you
plan to deliver training (online, in-person, or blended) and how you will assess student competency.`
  },
  {
    heading: "Meet Compliance Requirements",
    body: `
       Compliance is a critical part of the registration process. Your RTO
must have qualified trainers and assessors, suitable facilities, and policies and procedures in place to
support students, trainers, and the quality of training delivery.`
  },
  {
    heading: "Submit Your Application to ASQA",
    body: `
Once your business plan and compliance systems are in place,
you can submit your application to ASQA. This application will include detailed information about your
courses, delivery modes, trainer qualifications, and how your RTO will meet the required standards.`
  },
  {
    heading: "ASQA Audit",
    body: `
After you submit your application, ASQA will conduct an audit to assess whether your RTO
meets all regulatory requirements. The audit may involve reviewing your training materials, policies, and
systems to ensure compliance with the standards for RTOs.`
  },
  {
    heading: "Gain RTO Registration",
    body: `
if your application and audit are successful, ASQA will register your
organisation as an RTO. Once registered, you can begin marketing and delivering your accredited
courses to students across Australia.
`
  },
];

const keyconsiderationsHeading = "Tips for a Successful RTO Registration";

const keyconsiderationsTileData = [
  {
    heading: "Engage Experienced Consultants",
    body: `The RTO registration process can be complex, and working with
experienced consultants who specialise in RTO compliance can help ensure a smoother application
process`,
    icon: <BadgeOutlinedIcon />
  },
  {
    heading: "Ensure Robust Systems",
    body: ` Make sure your RTO has strong systems for record keeping, compliance,
student support, and quality assurance. These are key areas ASQA will review during the audit`,
    icon: <PhonelinkOutlinedIcon />
  },
  {
    heading: "Stay Updated on Regulations",
    body: ` Compliance doesn't end with registration. Regularly reviewing updates
from ASQA and ensuring that your RTO continues to meet the required standards is essential for
maintaining your RTO status`,
    icon: <CloudSyncOutlinedIcon />
  }
];

export default function RtoRegistrationService() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Your RTO Consultation Service",
    url: "https://rtospecialist.com.au/rto-registration",
    description: "Start your journey in vocational education by registering an RTO.",
    service: {
      "@type": "Service",
      name: "RTO Registration Consulting",
      provider: {
        "@type": "Organization",
        name: "RTO Specialist",
        url: "https://rtospecialist.com.au",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="rto-consulation-reg-header">
        <RtoConsulationHeader mainheading={headerData.mainheading} heading={headerData.heading} secondary={headerData.secondary} />
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
