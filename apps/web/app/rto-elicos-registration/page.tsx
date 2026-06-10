import type { Metadata } from "next";
import RtoConsulationHeader from "../../components/common/rtoconsultationservices/RtoConsulationHeader";
import RtoConsultingWhyRegsiter from "../../components/common/rtoconsultationservices/RtoConsultingWhyRegister";
import RtoConsultationSteps from "../../components/common/rtoconsultationservices/RtoConsultationSteps";
import RtokeyConsiderations from "../../components/common/rtoconsultationservices/RtoKeyConsiderations";
import RtoConsultationTips from "../../components/common/rtoconsultationservices/RtoConsultationTips";
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import FlightTakeoffOutlinedIcon from '@mui/icons-material/FlightTakeoffOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import DesktopMacIcon from '@mui/icons-material/DesktopMac';
import '../../client/scss/rtoconsultationservices/rtoconsultationservices.scss';
import RtoElicosImg from '../../assets/elicosregistrationimg.webp';

export const metadata: Metadata = {
  title: "ELICOS Registration | Register for English Language Courses in Australia",
  description:
    "Gain ELICOS registration to offer English Language Intensive Courses for Overseas Students (ELICOS) in Australia. Learn about compliance, ASQA audits, and student support requirements.",
  alternates: {
    canonical: "https://rtospecialist.com.au/rto-elicos-registration",
  },
};

const headerData = {
  mainheading: "New ELICOS Registration",
  heading: "Deliver Quality English Language Education",
  secondary: `
    Registering to deliver English Language Intensive Courses for Overseas Students (ELICOS) is an excellent
opportunity to enter the growing market for English language education in Australia. ELICOS courses are
specifically designed for international students looking to improve their English skills, whether for academic
purposes, professional development, or personal growth. To offer ELICOS courses, your organisation must meet
strict compliance standards and gain registration under the Education Services for Overseas Students (ESOS)
framework.`
};

const whyUsTileData = [
  {
    heading: "High Demand for English Language Courses",
    body: `Australia is a top destination for students seeking to
improve their English proficiency, with international students choosing ELICOS courses to prepare for
further study or improve their employment prospects`,
    icon: <OndemandVideoOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Broaden Your International Reach",
    body: `ELICOS registration allows you to attract and enrol international
students from around the world, helping you tap into a lucrative and expanding global market`,
    icon: <FlightTakeoffOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Prepare Students for Success",
    body: `
ELICOS courses help international students gain the language skills
needed for academic success in Australia's universities, vocational courses, or for professional
purposes`,
    icon: <ThumbUpAltOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Enhanced Reputation",
    body: `Becoming an approved ELICOS provider gives your institution credibility and
trust among international students and education agents. It signals that your courses meet national
quality standards for English language instruction.
`,
    icon: <WorkspacePremiumOutlinedIcon sx={{ fontSize: 40 }} />
  },
];

const componentHeading = 'Why Register for ELICOS?';
const componentSecondary = `
Registering to deliver English Language Intensive Courses for Overseas Students (ELICOS) is an excellent
opportunity to enter the growing market for English language education in Australia`;

const stepsHeading = "Key Steps in New ELICOS Registration";
const stepsImage = RtoElicosImg;
const stepsTileData = [
  {
    heading: "Understand the Regulatory Framework",
    body: `
ELICOS providers must comply with the National ELICOS
Standards, which are part of the ESOS Act. These standards ensure that international students receive
high-quality education in safe and supportive environments. You must also comply with the ASQA
standards if you are an RTO.`
  },
  {
    heading: "Develop ELICOS Course Offerings",
    body: `
ELICOS courses typically include General English, English for
Academic Purposes (EAP), and English for Specific Purposes (ESP). Your course curriculum must be
carefully designed to meet the needs of international students and comply with the national ELICOS
standards for course structure, hours of instruction, and learning outcomes.
`
  },
  {
    heading: "Ensure Teacher Qualifications",
    body: `
All ELICOS teachers must hold appropriate qualifications, such as a
recognised TESOL qualification or a degree in education with a specialisation in English language
teaching. Ensure that your teaching staff meet these requirements before applying for registration.`
  },
  {
    heading: "Create a Student Support Framework",
    body: `
ELICOS providers are required to offer comprehensive support
services for international students, including orientation, academic counselling, and assistance with
adjusting to life in Australia. This is crucial to meet ESOS standards and ensure the well-being of
students.`
  },
  {
    heading: "Develop Compliant Facilities and Resources",
    body: `
ELICOS providers must have suitable facilities,
including classrooms, learning materials, and technology to support English language instruction. Your
location must also provide a safe and supportive environment for international students.`
  },
  {
    heading: "Submit Your Application",
    body: `
 To offer ELICOS courses, you must submit an application for CRICOS
registration through ASQA. This application includes detailed information about your course offerings,
teacher qualifications, compliance with the ELICOS standards, and your ability to support international
students.`
  },
  {
    heading: "ASQA Audit and Approval",
    body: `
After submitting your application, ASQA will conduct an audit to ensure
your organisation meets the required ELICOS standards and ESOS compliance. This includes
assessing your curriculum, teacher qualifications, student support systems, and facilities. A successful
audit will lead to your institution being registered as an ELICOS provider on CRICOS.`
  },
];

const keyconsiderationsHeading = "Key Considerations for ELICOS Registration";

const keyconsiderationsTileData = [
  {
    heading: "ELICOS Standards Compliance",
    body: `You must ensure that your ELICOS courses meet the minimum
number of contact hours (20 hours per week) and adhere to strict requirements for class sizes, teacher
qualifications, and student progression`,
    icon: <LanguageOutlinedIcon />
  },
  {
    heading: "Student Visa Requirements",
    body: ` ELICOS courses are often a pathway for students on student visas. Your
institution is responsible for ensuring that students maintain visa compliance, including attendance and
academic progress`,
    icon: <CreditScoreOutlinedIcon />
  },
  {
    heading: "Marketing and Recruitment",
    body: `Your marketing practices must comply with the ESOS Act, ensuring that
you provide accurate and transparent information about your ELICOS courses, fees, and living
conditions in Australia`,
    icon: <CampaignOutlinedIcon />
  }
];

const consultingTipsHeading = "Tips for a Successful ELICOS Registration";
const consultingTipsTileData = [
  {
    heading: "Work with Compliance Experts",
    body: `The ELICOS registration process involves multiple layers of
compliance, from curriculum development to student welfare. Working with experts who understand the
regulatory framework can help streamline your application process`,
    icon: <MilitaryTechIcon sx={{fontSize: 40}} />
  },
  {
    heading: "Focus on Student Experience",
    body: `International students often face challenges when adjusting to a new
country and language environment. By providing a strong support framework, you can differentiate your
institution and ensure high levels of student satisfaction`,
    icon: <AssignmentIndIcon sx={{fontSize: 40}} />
  },
  {
    heading: "Monitor Ongoing Compliance",
    body: ` Once registered, ongoing compliance with the ELICOS standards and
ESOS Act is essential. Ensure you have robust systems in place to monitor teacher qualifications,
student attendance, and learning outcomes`,
    icon: <DesktopMacIcon sx={{fontSize: 40}} />
  }
];

export default function RtoElicosConsulting() {
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
