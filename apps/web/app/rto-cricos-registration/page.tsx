import type { Metadata } from "next";
import RtoConsulationHeader from "../../components/common/rtoconsultationservices/RtoConsulationHeader";
import RtoConsultingWhyRegsiter from "../../components/common/rtoconsultationservices/RtoConsultingWhyRegister";
import RtoConsultationSteps from "../../components/common/rtoconsultationservices/RtoConsultationSteps";
import RtokeyConsiderations from "../../components/common/rtoconsultationservices/RtoKeyConsiderations";
import RtoConsultationTips from "../../components/common/rtoconsultationservices/RtoConsultationTips";
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import PlayLessonOutlinedIcon from '@mui/icons-material/PlayLessonOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import '../../client/scss/rtoconsultationservices/rtoconsultationservices.scss';
import RtoCricosImg from '../../assets/rtocricosimg.webp';

export const metadata: Metadata = {
  title: "CRICOS Registration for RTOs | Expand to International Students",
  description:
    "Register your Registered Training Organisation (RTO) for CRICOS to enroll international students. Learn the key steps, compliance requirements, and benefits of becoming a Commonwealth Register of Institutions and Courses for Overseas Students (CRICOS) registered training provider in Australia.",
  keywords: [
    "CRICOS registration",
    "RTO CRICOS compliance",
    "international students RTO",
    "ASQA compliance",
    "CRICOS application process",
    "education providers Australia",
  ],
  authors: [{ name: "RTO Specialist" }],
  alternates: {
    canonical: "https://rtospecialist.com.au/rto-cricos-registration",
  },
  openGraph: {
    title: "CRICOS Registration for RTOs | Expand to International Students",
    description:
      "Ensure your RTO is CRICOS registered to enroll international students. Stay compliant with ASQA and ESOS Act requirements with our expert guidance.",
    url: "https://rtospecialist.com.au/rto-cricos-registration",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CRICOS Registration for RTOs | Expand to International Students",
    description:
      "Looking to expand your RTO to international students? Learn the CRICOS registration process and stay compliant with ASQA requirements.",
  },
};

const headerData = {
    mainheading: "New RTO Cricos Registration",
    heading: "Expand Your Reach to International Students",
    secondary: `Registering your Registered Training Organisation (RTO) with the Commonwealth Register of Institutions and
Courses for Overseas Students(CRICOS) allows you to deliver accredited courses to international students in
Australia.CRICOS registration is essential for RTOs looking to expand their business and offer high- quality
education to students from around the globe.The process requires meeting strict compliance standards to
ensure that international students receive a premium education experience in line with government regulations`
};

const whyUsTileData = [
    {
        heading: "Access the International Education Market",
        body: ` CRICOS registration allows your RTO to enroll
international students, opening the door to a growing and lucrative market. Australia is a popular
destination for international students, and becoming a CRICOS-registered provider enables you to
capitalise on this demand.`,
        icon: <AddBusinessOutlinedIcon sx={{ fontSize: 40 }} />
    },
    {
        heading: "Deliver High-Demand Courses",
        body: `International students seek vocational qualifications in areas like
business, healthcare, hospitality, and IT. CRICOS registration allows your RTO to offer these courses to
students worldwide, helping you diversify your student base`,
        icon: <PlayLessonOutlinedIcon sx={{ fontSize: 40 }} />
    },
    {
        heading: "Boost Your RTO's Reputation",
        body: `
Being a CRICOS-registered provider enhances your RTO's reputation
on the global stage. It demonstrates that your institution meets the high standards required to deliver
quality education to international students`,
        icon: <PollOutlinedIcon sx={{ fontSize: 40 }} />
    },
    {
        heading: "Why Register Your RTO for CRICOS?",
        body: ` With CRICOS registration, you can tap into international student fees,
which can be a significant revenue source. Many international students are willing to invest in education
that provides practical skills and recognised qualifications
`,
        icon: <LoginOutlinedIcon sx={{ fontSize: 40 }} />
    },
];

const componentHeading = 'Why Register Your RTO for CRICOS?';
const componentSecondary = `
CRICOS registration is essential for RTOs looking to expand their business and offer high-quality
education to students from around the globe.`;

const stepsHeading = "Key Steps in New CRICOS Registration";
const stepsImage = RtoCricosImg;
const stepsTileData = [
    {
        heading: "Understand the CRICOS Requirements",
        body: `
 The Education Services for Overseas Students (ESOS) Act
governs the registration of providers delivering courses to international students. Ensure that your RTO
complies with the National Code of Practice for Providers of Education and Training to Overseas
Students , which outlines the specific requirements for CRICOS registration.`
    },
    {
        heading: "Prepare Your Business and Compliance Systems",
        body: `
 As with standard RTO registration, you'll need a
comprehensive business plan, but for CRICOS registration, you also need to demonstrate how your
RTO will meet the additional requirements for supporting international students. This includes student
support services, marketing practices, and facilities..
`
    },
    {
        heading: "Develop CRICOS-Ready Course Offerings",
        body: `
Not all courses can be delivered to international students.
Ensure that the qualifications you plan to offer are suitable for CRICOS registration, and prepare course
delivery and assessment strategies that meet the specific needs of international learners.`
    },
    {
        heading: "Meet ESOS and ASQA Compliance Standards",
        body: `
 International students have specific needs, such as
visa support and additional pastoral care. Your RTO must have systems in place to ensure the wellbeing of international students, including support for adjusting to life in Australia and meeting the
academic requirements of their visa conditions. Additionally, your RTO must continue to meet all ASQA
standards for quality and compliance`
    },
    {
        heading: "Submit Your CRICOS Application",
        body: `
You must submit a detailed application to both ASQA and the
Department of Education for CRICOS registration. This application will include information about your
RTO's compliance with the ESOS framework, course offerings, student support systems, and facilities.
`
    },
    {
        heading: "ASQA Audit and CRICOS Approval",
        body: `
Once your application is submitted, ASQA will conduct an audit to
assess whether your RTO meets the CRICOS requirements. The audit will review your ability to support
international students, ensure compliance with ESOS regulations, and verify that your RTO meets the
required standards for delivering accredited training.`
    },
    {
        heading: "Gain CRICOS Registration",
        body: `
After a successful audit, your RTO will be registered on CRICOS, allowing
you to market and deliver courses to international students. Once registered, your institution will appear
on the CRICOS database, making it visible to students seeking education providers in Australia.

`
    },
];

const keyconsiderationsHeading = "Key Considerations for CRICOS Registration";

const keyconsiderationsTileData = [
    {
        heading: "International Student Support",
        body: ` CRICOS-registered RTOs must provide comprehensive support for
international students, including accommodation guidance, visa compliance assistance, and access to
pastoral care`,
        icon: <LanguageOutlinedIcon />
    },
    {
        heading: "Marketing and Recruitment Practices",
        body: `CRICOS providers must adhere to strict guidelines regarding
marketing and recruitment, ensuring that students are given accurate information about courses, living
conditions, and their rights as international students`,
        icon: <CampaignOutlinedIcon />
    },
    {
        heading: "Student Visa Compliance",
        body: ` CRICOS-registered providers are responsible for ensuring that students
meet the conditions of their visas, including maintaining satisfactory attendance and progress in their
studies`,
        icon: <CreditScoreOutlinedIcon />
    }
];

const consultingTipsHeading = "Tips for a Successful CRICOS Registration";
const consultingTipsTileData = [
    {
        heading: "Work with Experienced Consultants",
        body: `The CRICOS registration process is complex, and working with
experts who understand the requirements can help you avoid common pitfalls and streamline the
process`,
        icon: <WorkspacePremiumIcon sx={{ fontSize: 40 }} />
    },
    {
        heading: "Ensure Cultural Sensitivity and Support",
        body: `International students often need additional support to
adjust to life in Australia. Developing a student support framework that addresses their needs can make
your RTO more appealing and compliant`,
        icon: <SupportAgentOutlinedIcon sx={{ fontSize: 40 }} />
    },
    {
        heading: "Stay Updated on ESOS Requirements",
        body: `Compliance is ongoing, and it's essential to stay informed
about any changes to the ESOS Act and National Code that impact your RTO's CRICOS registration`,
        icon: <TipsAndUpdatesIcon sx={{ fontSize: 40 }} />
    }
];

export default function RtoCricosConsulting() {
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
