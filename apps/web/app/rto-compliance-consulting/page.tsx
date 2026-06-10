import type { Metadata } from "next";
import RtoConsulationHeader from "../../components/common/rtoconsultationservices/RtoConsulationHeader";
import RtoConsultingWhyRegsiter from "../../components/common/rtoconsultationservices/RtoConsultingWhyRegister";
import RtoConsultationSteps from "../../components/common/rtoconsultationservices/RtoConsultationSteps";
import RtokeyConsiderations from "../../components/common/rtoconsultationservices/RtoKeyConsiderations";
import RtoConsultationTips from "../../components/common/rtoconsultationservices/RtoConsultationTips";
import SettingsIcon from '@mui/icons-material/Settings';
import SelfImprovementOutlinedIcon from '@mui/icons-material/SelfImprovementOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import MoveUpOutlinedIcon from '@mui/icons-material/MoveUpOutlined';
import CloudSyncOutlinedIcon from '@mui/icons-material/CloudSyncOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import PanToolIcon from '@mui/icons-material/PanTool';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import '../../client/scss/rtoconsultationservices/rtoconsultationservices.scss';
import RtoComplianceConsultingImg from '../../assets/rtocomplianceimg.webp';

export const metadata: Metadata = {
  title: "RTO Specialist | RTO Compliance Consulting | Stay Compliant & Grow",
  description:
    "Ensure your RTO stays compliant with ASQA regulations through expert ongoing compliance consulting services. Avoid penalties, improve training quality, and stay ahead.",
  keywords: [
    "RTO compliance consulting",
    "ASQA compliance",
    "RTO audits",
    "ongoing compliance support",
    "training organisation compliance",
  ],
  alternates: {
    canonical: "https://rtospecialist.com.au/rto-compliance-consulting",
  },
};

const headerData = {
  mainheading: `RTO Compliance Consulting`,
  heading: "Ongoing Consulting: Stay Ahead with Expert Support",
  secondary: `
    Maintaining compliance as a Registered Training Organisation (RTO) is an ongoing responsibility that requires
regular monitoring, updates, and audits to ensure your operations meet the standards set by the Australian
Skills Quality Authority (ASQA). Ongoing compliance consulting provides your RTO with expert guidance to
help you navigate the complexities of regulatory requirements, avoid penalties, and ensure your organisation
continues delivering high-quality, nationally accredited training.
    `
};

const whyUsTileData = [
  {
    heading: "Ensure Continuous ASQA Compliance",
    body: ` Compliance doesn't end after registration or renewal. Your
RTO must consistently adhere to the Standards for RTOs to avoid penalties or loss of accreditation.
Ongoing consulting provides your team with regular support, audits, and advice to ensure compliance at
all times`,
    icon: <AssignmentTurnedInOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Mitigate Risks and Avoid Penalties",
    body: ` Non-compliance can result in hefty fines, restrictions, or even the
suspension or cancellation of your RTO's registration. With ongoing consulting, you can identify and
address potential compliance issues before they become significant problems`,
    icon: <MoveUpOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Stay Updated with Regulatory Changes",
    body: `
The VET sector is constantly evolving, and ASQA
requirements may change over time. Our compliance experts stay on top of regulatory updates and
ensure your RTO is always aligned with the latest industry standards`,
    icon: <CloudSyncOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Support for Internal Audits",
    body: `As an RTO owner, you have the flexibility to design your own courses, set your
pricing, and grow your organisation in line with your vision and goals.
`,
    icon: <SettingsIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Business Growth Potential",
    body: `Regular internal audits are critical for maintaining compliance and
preparing for ASQA audits. Ongoing consulting provides expert support for conducting these internal
reviews, ensuring that your RTO meets all operational and compliance benchmarks
`,
    icon: <PollOutlinedIcon sx={{ fontSize: 40 }} />
  },
];

const componentHeading = 'Why Choose Ongoing Compliance Consulting?';
const componentSecondary = `
Maintaining compliance as a Registered Training Organisation (RTO) is an ongoing responsibility that requires
regular monitoring, updates, and audits to ensure your operations meet the standards set by the Australian
Skills Quality Authority (ASQA).`;

const stepsHeading = "Key Services in Ongoing Compliance Consulting";
const stepsImage = RtoComplianceConsultingImg;
const stepsTileData = [
  {
    heading: "Regular Compliance Audits",
    body: `
We conduct routine audits of your RTO's operations to ensure you are
meeting ASQA's compliance requirements. These audits review your training and assessment
strategies, staff qualifications, student records, and overall governance structures.`
  },
  {
    heading: "Tailored Compliance Advice",
    body: `
 Our team offers personalised advice and solutions to address specific
compliance challenges your RTO may face. Whether it's updating your training materials, adjusting
student support services, or ensuring staff qualifications are current, we tailor our consulting to your
organisation's needs.
`
  },
  {
    heading: "Continuous Improvement Strategies",
    body: `
Compliance is not just about meeting minimum standards; it's
about delivering exceptional education. We help your RTO develop continuous improvement plans that
enhance training delivery, student outcomes, and operational efficiency.`
  },
  {
    heading: "Support for ASQA Audits",
    body: `
Preparing for an ASQA audit can be daunting, but with ongoing consulting,
you'll always be ready. We assist in gathering evidence, updating documentation, and preparing your
team for successful audits.
`
  },
  {
    heading: "Risk Management",
    body: `
We help identify potential risks that could lead to non-compliance, such as gaps in
training assessment processes, outdated policies, or inadequate student support. By proactively
managing these risks, your RTO can avoid non-compliance issues.`
  },
  {
    heading: "Policy and Procedure Updates",
    body: `
ASQA requires RTOs to have up-to-date policies and procedures in
place. Our consultants ensure that your documentation, from student support policies to assessment
procedures, remains current and fully compliant.
`
  },
  {
    heading: "Staff Training and Development",
    body: `Ensuring that your trainers and assessors remain compliant with the
latest industry standards is critical. We provide guidance on professional development, trainer
qualifications, and best practices for delivering high-quality training.`
  },
];

const keyconsiderationsHeading = "Benefits of Ongoing Compliance Consulting";

const keyconsiderationsTileData = [
  {
    heading: "Peace of Mind:",
    body: `With expert consultants continuously monitoring your compliance status, you can focus
on delivering education without worrying about regulatory challenges`,
    icon: <SelfImprovementOutlinedIcon />
  },
  {
    heading: "Proactive Compliance",
    body: `Instead of reacting to compliance issues as they arise, ongoing consulting
allows your RTO to be proactive in identifying and resolving potential problems before they impact your
operations`,
    icon: <AssignmentTurnedInOutlinedIcon />
  },
  {
    heading: "Improved Student Outcomes",
    body: `A compliant RTO often delivers better training outcomes. By focusing on
compliance, you can ensure that students receive the high-quality education and support they need to
succeed`,
    icon: <PsychologyOutlinedIcon />
  },
  {
    heading: "Cost-Effective",
    body: ` Addressing non-compliance issues after they arise can be costly and time-consuming.
Ongoing consulting helps you avoid these issues, saving your organisation time, money, and resources
in the long run`,
    icon: <MonetizationOnOutlinedIcon />
  }
];

const consultingTipsHeading = "Who Should Consider Ongoing Compliance Consulting?";
const consultingTipsTileData = [
  {
    heading: "New RTOs",
    body: `If you've recently registered your RTO, ongoing consulting ensures that you stay compliant
as your organisation grows and evolves`,
    icon: <PanToolIcon sx={{fontSize: 40}} />
  },
  {
    heading: "Established RTOs",
    body: `Even experienced RTOs can benefit from external compliance support to keep up
with regulatory changes and maintain high standards`,
    icon: <MilitaryTechIcon sx={{fontSize: 40}} />
  },
  {
    heading: "RTOs Expanding Their Scope",
    body: `If you're adding new qualifications to your scope or expanding into new
areas of training, ongoing consulting ensures that you remain compliant throughout the process`,
    icon: <OpenWithIcon sx={{fontSize: 40}} />
  }
];

export default function RtoComplianceConsulting() {
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
