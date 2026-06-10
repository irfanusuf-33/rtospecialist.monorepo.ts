import type { Metadata } from "next";
import RtoConsulationHeader from "../../components/common/rtoconsultationservices/RtoConsulationHeader";
import RtoConsultingWhyRegsiter from "../../components/common/rtoconsultationservices/RtoConsultingWhyRegister";
import RtoConsultationSteps from "../../components/common/rtoconsultationservices/RtoConsultationSteps";
import RtokeyConsiderations from "../../components/common/rtoconsultationservices/RtoKeyConsiderations";
import SettingsIcon from '@mui/icons-material/Settings';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import FlightTakeoffOutlinedIcon from '@mui/icons-material/FlightTakeoffOutlined';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import '../../client/scss/rtoconsultationservices/rtoconsultationservices.scss';

export const metadata: Metadata = {
  title: "RTO CRICOS ELICOS Registration | Expand Your Educational Reach",
  description:
    "Get your RTO registered for CRICOS and ELICOS to offer accredited vocational training and English language courses for international students. Ensure compliance with ASQA and CRICOS standards, attract a global student base, and grow your training organization. Start your RTO CRICOS ELICOS registration today!",
  alternates: {
    canonical: "https://rtospecialist.com.au/rto-cricos-elicos-registration",
  },
};

const headerData = {
  mainheading: "NEW RTO CRICOS ELICOS Registration",
  heading: "Expand Your Reach with Vocational and English Language Courses",
  secondary: `
    Registering a new RTO for CRICOS ELICOS allows you to deliver both accredited vocational training and
English Language Intensive Courses for Overseas Students (ELICOS) to international students. This dual
registration enhances your institution's offerings, giving you the flexibility to provide language support and
industry-specific qualifications, catering to the diverse needs of international learners. The process requires
meeting both the Australian Skills Quality Authority (ASQA) and the Commonwealth Register of Institutions and
Courses for Overseas Students (CRICOS) standards.
`
};

const whyUsTileData = [
  {
    heading: "Access a Larger International Market",
    body: ` CRICOS registration allows your RTO to deliver courses to
international students, broadening your market to include learners from all over the world. Adding
ELICOS courses to your scope enables you to serve students who need to improve their English before
or alongside their vocational studies`,
    icon: <FlightTakeoffOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Diversify Your Course Offerings",
    body: `With RTO CRICOS ELICOS registration, you can offer a wider range
of programs, including vocational courses and intensive English training, attracting students from
different backgrounds and educational goals`,
    icon: <TerminalOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Boost Your Reputation",
    body: `
CRICOS ELICOS registration establishes your RTO as a reputable provider of
both vocational training and English language education, enhancing your credibility in the global
education sector`,
    icon: <MonetizationOnOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Flexibility and Control",
    body: `As an RTO owner, you have the flexibility to design your own courses, set your
pricing, and grow your organisation in line with your vision and goals.
`,
    icon: <SettingsIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Increased Revenue Potential",
    body: `Offering a combination of vocational and ELICOS courses enables you
to capture a larger share of the international student market, increasing your revenue streams through
diverse course offerings
`,
    icon: <PollOutlinedIcon sx={{ fontSize: 40 }} />
  },

];

const componentHeading = 'Why Register for RTO CRICOS ELICOS?';
const componentSecondary = `
Registering a new RTO for CRICOS ELICOS allows you to deliver both accredited vocational training and
English Language Intensive Courses for Overseas Students (ELICOS) to international students.`;

// steps component data
const stepsHeading = "Key Steps in RTO CRICOS ELICOS Registration";

const stepsTileData = [
  {
    heading: "Understand the Regulatory Framework",
    body: `
CRICOS and ELICOS registration involves compliance with
multiple regulatory standards, including the ESOS Act, the National Code of Practice for Providers of
Education and Training to Overseas Students and the National ELICOS Standards. You’ll also need
to comply with ASQA’s Standards for Registered Training Organisations (RTOs).
`
  },
  {
    heading: "Develop Your Course Offerings",
    body: `
As an RTO, you’ll offer accredited vocational qualifications, but
adding ELICOS to your scope requires creating well-structured English language courses that meet the
learning needs of international students. Ensure that your ELICOS courses are designed to comply with
the ELICOS standards, which mandate specific hours of instruction, learning outcomes, and teacher
qualifications.
`
  },
  {
    heading: "Ensure Teacher Qualifications",
    body: `
ELICOS teachers must meet specific qualifications, such as having a
recognised TESOL qualification or a degree in English language teaching. For vocational courses,
trainers must meet ASQA standards. Ensure that your RTO employs qualified staff for both streams.`
  },
  {
    heading: "Prepare for Compliance Audits",
    body: `
 Both ASQA and CRICOS require a thorough review of your RTO’s
systems, policies, and procedures during the registration process. This includes ensuring that your RTO
is compliant with student support services, course delivery methods, and marketing practices under the
ESOS Act and ELICOS Standards.`
  },
  {
    heading: "Submit Your Application",
    body: `
 Your application for RTO CRICOS ELICOS registration must be submitted to
ASQA, along with all relevant documentation regarding your course offerings, student support services,
compliance systems, and teacher qualifications. The application will also detail how your RTO meets the
requirements for delivering both vocational and ELICOS courses to international students.
`
  },
  {
    heading: "ASQA and CRICOS Audit",
    body: `
After submitting your application, ASQA will conduct an audit to ensure your
RTO is compliant with both the RTO standards and the CRICOS and ELICOS requirements. This audit
will cover your course structures, student support systems, teacher qualifications, and facilities to
confirm that your RTO is capable of delivering high-quality education to international students.`
  },
  {
    heading: "Gain RTO CRICOS ELICOS Registration",
    body: `
Upon successful completion of the audit, your RTO will be
granted CRICOS and ELICOS registration, allowing you to start marketing and delivering both
vocational and English language courses to international students. Your institution will be listed on the
CRICOS register, making it accessible to students and education agents worldwide.
`
  },
];

// key considerations
const keyconsiderationsHeading = "Key Considerations for RTO CRICOS ELICOS Registration";

const keyconsiderationsTileData = [
  {
    heading: "Student Support Services",
    body: ` International students require additional support in terms of visa
compliance, adjusting to life in Australia, and academic guidance. Ensure your RTO has robust support
systems in place to meet these needs`,
    icon: <SupportAgentOutlinedIcon />
  },
  {
    heading: "Compliance with ELICOS Standards",
    body: `ELICOS courses must meet specific criteria, including providing
20 hours of face-to-face teaching per week, maintaining appropriate class sizes, and ensuring qualified
staff. Your RTO must also maintain compliance with the broader ASQA standards for vocational
education`,
    icon: <AssignmentTurnedInOutlinedIcon />
  },
  {
    heading: "Marketing and Recruitment",
    body: `Marketing practices must align with the ESOS Act, ensuring that your
RTO provides accurate and clear information about courses, fees, living conditions, and the rights of
international students`,
    icon: <CampaignOutlinedIcon />
  }
];

export default function RtoCricosElicosConsulting () {
  return (
    <>
      <div className="rto-consulation-reg-header">
        <RtoConsulationHeader mainheading={headerData.mainheading} heading={headerData.heading} secondary={headerData.secondary}/>
      </div>
      <div className="rto-consultation-why-regsiter">
        <RtoConsultingWhyRegsiter tileData={whyUsTileData} heading={componentHeading} secondary={componentSecondary} />
      </div>
      <div className="rto-consultation-steps">
        <RtoConsultationSteps heading={stepsHeading} tileData={stepsTileData} />
      </div>
      <div className="rto-key-considerations">
        <RtokeyConsiderations heading={keyconsiderationsHeading} tileData={keyconsiderationsTileData} />
      </div>
    </>
  );
}
