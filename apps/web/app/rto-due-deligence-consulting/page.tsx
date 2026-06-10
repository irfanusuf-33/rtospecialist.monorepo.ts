import type { Metadata } from "next";
import RtoConsulationHeader from "../../components/common/rtoconsultationservices/RtoConsulationHeader";
import RtoConsultingWhyRegsiter from "../../components/common/rtoconsultationservices/RtoConsultingWhyRegister";
import RtoConsultationSteps from "../../components/common/rtoconsultationservices/RtoConsultationSteps";
import RtokeyConsiderations from "../../components/common/rtoconsultationservices/RtoKeyConsiderations";
import RtoConsultationTips from "../../components/common/rtoconsultationservices/RtoConsultationTips";
import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined';
import EmergencyOutlinedIcon from '@mui/icons-material/EmergencyOutlined';
import AssuredWorkloadOutlinedIcon from '@mui/icons-material/AssuredWorkloadOutlined';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import GavelIcon from '@mui/icons-material/Gavel';
import '../../client/scss/rtoconsultationservices/rtoconsultationservices.scss';
import RtoDueDeligenceImg from '../../assets/duediligenceimg.webp';

export const metadata: Metadata = {
  title: "RTO Due Diligence Consulting | Ensure Compliance & Risk-Free RTO Acquisition",
  description:
    "Conduct thorough RTO due diligence before purchasing or investing in a Registered Training Organisation. Ensure ASQA compliance, financial stability, and risk mitigation with expert consulting services.",
  alternates: {
    canonical: "https://rtospecialist.com.au/rto-due-deligence-consulting",
  },
};

const headerData = {
  mainheading:`RTO Due Diligence`,
  heading: "Ensure a Successful and Compliant Acquisition",
  secondary: `
    Purchasing or investing in a Registered Training Organisation (RTO) is a significant business decision that can
lead to growth and success in the vocational education and training sector. However, before finalising any
acquisition, conducting thorough due diligence is essential to ensure that the RTO you are acquiring is
compliant with regulatory requirements and financially viable. Proper due diligence minimises risks and ensures
that your investment is based on accurate, reliable information`
};

const whyUsTileData = [
  {
    heading: "Identify Compliance Issues",
    body: `RTOs are regulated by the Australian Skills Quality Authority (ASQA),
and non-compliance can result in penalties, fines, or even deregistration. Due diligence ensures that the
RTO you’re acquiring adheres to ASQA’s Standards for RTOs and meets all regulatory requirements`,
    icon: <PolicyOutlinedIcon sx={{fontSize: 40}} />
  },
  {
    heading: "Assess Financial Viability",
    body: `Due diligence includes a detailed financial review of the RTO’s records,
revenue streams, and liabilities. This helps you understand the financial health of the business and
ensures that you are making an informed investment decision`,
    icon: <MonetizationOnOutlinedIcon sx={{fontSize: 40}} />
  },
  {
    heading: "Verify Scope of Registration",
    body: `
 It’s essential to verify that the RTO’s scope of registration aligns with
your business goals. This includes ensuring that all qualifications and units are properly accredited and
that the RTO has the necessary resources to deliver them`,
    icon: <BalanceOutlinedIcon sx={{fontSize: 40}} />
  },
  {
    heading: "Minimise Risk",
    body: `Due diligence helps uncover any hidden liabilities or risks, such as unresolved
compliance issues, legal disputes, or financial irregularities. This protects you from unforeseen problems
after the acquisition
`,
    icon: <ReportProblemOutlinedIcon sx={{fontSize: 40}} />
  },
];

const componentHeading = 'Why RTO Due Diligence is Important?';
const componentSecondary = `
Purchasing or investing in a Registered Training Organisation (RTO) is a significant business decision that can
lead to growth and success in the vocational education and training sector.`;

// steps component data
const stepsHeading = "Key Areas of RTO Due Diligence";
const stepsImage = RtoDueDeligenceImg;
const stepsTileData = [
  {
    heading: "Compliance with ASQA Standards",
    body: `Review the RTO’s compliance history with ASQA. This includes
checking for any previous or ongoing compliance issues, audit outcomes, and whether the RTO has
been subject to any regulatory action, such as conditions or restrictions on its registration.
`
  },
  {
    heading: "Scope of Registration",
    body: `Verify the RTO’s current scope of registration, including the qualifications, units
of competency, and accredited courses it is authorised to deliver. Ensure that the scope aligns with your
business objectives and target market.
`
  },
  {
    heading: "Training and Assessment Resources",
    body: `Evaluate the RTO’s training and assessment materials to
ensure they meet compliance standards. This includes reviewing training and assessment strategies
(TAS), student assessment records, and learning resources`
  },
  {
    heading: "Trainer and Assessor Qualifications",
    body: `Check the qualifications and experience of the RTO’s trainers
and assessors. Ensure that all staff meet the national standards and have the required industry
experience to deliver the courses listed on the RTO’s scope of registration.`
  },
  {
    heading: "Student Records and Outcomes",
    body: `Review the RTO’s student records, including enrolment data,
progress reports, and completion rates. This helps assess the RTO’s performance in delivering quality
education and ensures that accurate records have been maintained.
`
  },
  {
    heading: "Financial Health",
    body: `Conduct a thorough financial review of the RTO, including profit and loss statements,
revenue streams, liabilities, and cash flow. Understanding the financial position of the RTO helps ensure
that you are acquiring a sustainable and profitable business.`
  },
  {
    heading: "Contracts and Agreements",
    body: `Review any existing contracts, agreements, or partnerships the RTO has
in place. This includes supplier contracts, partnerships with third-party training providers, lease
agreements, and any government funding arrangements.
`
  },
  {
    heading: "Legal and Regulatory Compliance",
    body: `Investigate any ongoing or past legal issues, disputes, or claims
involving the RTO. Ensure that the RTO is in good standing with ASQA and other relevant regulatory
bodies, and that there are no unresolved compliance or legal matters.
`
  }
];

// key considerations
const keyconsiderationsHeading = "Benefits of RTO Due Diligence";

const keyconsiderationsTileData = [
  {
    heading: "Informed Decision-Making",
    body: `By conducting thorough due diligence, you gain a complete understanding
of the RTO’s compliance status, financial health, and operational capacity. This enables you to make a
well-informed investment decision`,
    icon: <Diversity2OutlinedIcon />
  },
  {
    heading: "Risk Mitigation",
    body: ` Uncovering potential compliance or financial risks before acquisition allows you to
address these issues upfront or renegotiate the terms of the sale, protecting your investment from
unexpected liabilities`,
    icon: <EmergencyOutlinedIcon />
  },
  {
    heading: "Smooth Transition",
    body: `Conducting due diligence ensures that you’re aware of any operational or
compliance challenges, allowing you to plan for a smooth transition after the acquisition. This includes
making necessary changes to systems, staffing, or course delivery`,
    icon: <AssuredWorkloadOutlinedIcon />
  },
  {
    heading: "Maximise Return on Investment",
    body: `By ensuring that the RTO is fully compliant and financially stable,
you can maximise the value of your investment and set the foundation for future growth and success`,
    icon: <CurrencyExchangeOutlinedIcon />
  }
];

// consulting tips tile data
const consultingTipsHeading = "Steps in Conducting RTO Due Diligence";
const consultingTipsTileData = [
  {
    heading: "Engage Compliance Experts",
    body: ` Due diligence for an RTO requires specialised knowledge of the
vocational education and training sector, as well as ASQA’s regulatory framework. Engaging compliance
experts can help ensure that no critical areas are overlooked`,
    icon: <MilitaryTechIcon sx={{fontSize: 40}} />
  },
  {
    heading: "Review Documentation",
    body: `Gather and review all relevant documentation, including financial records,
compliance reports, student data, training materials, and legal contracts`,
    icon: <DocumentScannerIcon sx={{fontSize: 40}} />
  },
  {
    heading: "Assess the Compliance and Financial Status",
    body: `Evaluate the RTO’s compliance with ASQA standards
and its financial viability. This includes reviewing audit results, financial statements, and regulatory
reports`,
    icon: <AssuredWorkloadIcon sx={{fontSize: 40}} />
  },
  {
    heading: "Identify Risks and Liabilities",
    body: ` Highlight any potential risks or liabilities, such as compliance issues,
financial instability, or legal disputes, and develop a strategy for mitigating these risks before completing
the acquisition`,
    icon: <ManageSearchIcon sx={{fontSize: 40}} />
  },
  {
    heading: "Finalise the Purchase Agreement",
    body: `Once due diligence is completed, you can negotiate the final terms
of the acquisition, ensuring that all identified risks are addressed or accounted for in the sale agreement`,
    icon: <GavelIcon sx={{fontSize: 40}} />
  }
];

export default function RtoDueDeligenceConsulting () {
  return (
    <>
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
      <div className="rto-consulting-tips">
        <RtoConsultationTips heading={consultingTipsHeading} tileData={consultingTipsTileData} />
      </div>
    </>
  );
}
