import type { Metadata } from "next";
import RtoConsulationHeader from "../../components/common/rtoconsultationservices/RtoConsulationHeader";
import RtoConsultingWhyRegsiter from "../../components/common/rtoconsultationservices/RtoConsultingWhyRegister";
import RtoConsultationSteps from "../../components/common/rtoconsultationservices/RtoConsultationSteps";
import RtokeyConsiderations from "../../components/common/rtoconsultationservices/RtoKeyConsiderations";
import RtoConsultationTips from "../../components/common/rtoconsultationservices/RtoConsultationTips";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import ConnectWithoutContactOutlinedIcon from '@mui/icons-material/ConnectWithoutContactOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import InterpreterModeOutlinedIcon from '@mui/icons-material/InterpreterModeOutlined';
import FlagIcon from '@mui/icons-material/Flag';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import Groups2Icon from '@mui/icons-material/Groups2';
import KeyIcon from '@mui/icons-material/Key';
import SpeedIcon from '@mui/icons-material/Speed';
import BugReportIcon from '@mui/icons-material/BugReport';
import '../../client/scss/rtoconsultationservices/rtoconsultationservices.scss';
import RtoWebsiteDevImg from '../../assets/webdevimg.webp';

export const metadata: Metadata = {
  title: "Professional Website Development for RTOs | Boost Enrolments & SEO Visibility",
  description:
    "Build a high-quality RTO website with expert development services. Enhance enrolments, improve user experience, and optimize for SEO. Get a custom website tailored to your RTO's needs.",
  alternates: {
    canonical: "https://rtospecialist.com.au/rto-website-development-service",
  },
};

const headerData = {
  mainheading: "RTO Website Development",
  heading: "Build a Powerful Online Presence",
  secondary: `
    In today’s digital landscape, having a professional, user-friendly website is essential for any business, especially
for Registered Training Organisations (RTOs) and educational institutions. Your website is often the first point
of contact for prospective students and industry partners, making it a critical tool for showcasing your courses,
facilitating enrolments, and providing essential information. Effective website development ensures that your
RTO’s online presence is not only visually appealing but also functional, mobile-responsive, and optimised for
search engines.`
};

const whyUsTileData = [
  {
    heading: "First Impressions Matter",
    body: `A well-designed website immediately conveys professionalism and
trustworthiness. It helps establish your RTO as a credible institution that students and partners can rely
on`,
    icon: <SupervisorAccountOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Increase Enrolments",
    body: `An intuitive website with clear navigation, course listings, and easy enrolment
processes can significantly boost student registrations and engagement`,
    icon: <GroupAddIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "24/7 Access to Information",
    body: `
 Your website acts as a round-the-clock resource where prospective and
current students can access essential information about courses, schedules, trainers, and contact
details`,
    icon: <LoginOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Enhance Communication",
    body: `With integrated forms, chat features, and email sign-ups, your website can
streamline communication between your RTO and prospective students, making it easy for them to ask
questions, receive support, and start the enrolment process
`,
    icon: <InterpreterModeOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Boost Visibility with SEO",
    body: `A well-optimised website ensures that your RTO appears in search engine
results when prospective students search for relevant courses. This increases traffic to your site and
drives more enrolments.
`,
    icon: <VisibilityOutlinedIcon sx={{ fontSize: 40 }} />
  },

];

const componentHeading = 'Why Website Development is Important for Your RTO?';
const componentSecondary = `
A well-optimised website ensures that your RTO appears in search engine
results when prospective students search for relevant courses. This increases traffic to your site and
drives more enrolments`;

// steps component data
const stepsHeading = "Key Features of a Professional RTO Website";
const stepsImage = RtoWebsiteDevImg;
const stepsTileData = [
  {
    heading: "Course Listings and Descriptions",
    body: `
Provide detailed information about the qualifications and units of
competency offered by your RTO. Include descriptions, entry requirements, duration, fees, and learning
outcomes.
`
  },
  {
    heading: "Online Enrolment System",
    body: `
Integrate an enrolment system that allows students to browse available
courses, register, and make payments directly through your website.
`
  },
  {
    heading: "Student Portal",
    body: `
Offer a secure portal where current students can log in to access course materials,
check their progress, and communicate with trainers.
`
  },
  {
    heading: "Mobile Responsiveness",
    body: `
Ensure that your website is optimised for all devices, including smartphones
and tablets. A mobile-responsive design provides a seamless experience for users on any platform.`
  },
  {
    heading: "User-Friendly Navigation",
    body: `
Design a website that is easy to navigate, with clear menus, intuitive layout,
and well-organised content. This improves the user experience and helps visitors find the information
they need quickly.
`
  },
  {
    heading: "Contact and Support Features",
    body: `
Include contact forms, live chat options, or chatbot features to provide
prospective students with immediate assistance and support, helping them make decisions faster.`
  },
  {
    heading: "Testimonials and Success Stories",
    body: `
 Showcase testimonials from satisfied students and graduates,
highlighting their achievements and positive experiences with your RTO. This helps build trust and
credibility with prospective students.
`
  },
  {
    heading: "Blog and News Section",
    body: `
 Keep your website updated with relevant content, including blog posts, news,
and industry updates. This can boost your SEO ranking and keep students engaged with your RTO.
`
  },
];

// key considerations
const keyconsiderationsHeading = "Benefits of Professional Website Development";

const keyconsiderationsTileData = [
  {
    heading: "Customised Design",
    body: `Tailor your website to reflect your RTO’s brand and values, creating a unique
online presence that stands out from competitors`,
    icon: <TuneOutlinedIcon />
  },
  {
    heading: "Improved Enrolment Process",
    body: ` Simplify the enrolment process with integrated forms and payment
gateways, allowing students to sign up for courses quickly and easily`,
    icon: <BadgeOutlinedIcon />
  },
  {
    heading: "Increased Visibility",
    body: `With search engine optimisation (SEO) best practices, your website can rank
higher in search engine results, driving more traffic and increasing enrolments`,
    icon: <VisibilityOutlinedIcon />
  },
  {
    heading: "Enhanced Student Engagement",
    body: `A user-friendly website keeps visitors engaged, providing them with
the information they need and encouraging them to explore your courses and services further`,
    icon: <SupervisorAccountOutlinedIcon />
  },
  {
    heading: "Efficient Communication",
    body: `Integrated communication tools such as contact forms, live chat, and
automated emails make it easier to respond to inquiries and guide prospective students through the
enrolment process`,
    icon: <ConnectWithoutContactOutlinedIcon />
  }
];

// consulting tips tile data
const consultingTipsHeading = "Steps to Developing a High-Quality Website";
const consultingTipsTileData = [
  {
    heading: "Define Your Goals",
    body: `Identify the primary purpose of your website. Are you focused on boosting
enrolments, providing course information, or enhancing student support? Defining clear goals will guide
the design and development process`,
    icon: <FlagIcon sx={{fontSize: 40}} />
  },
  {
    heading: "Choose the Right Platform",
    body: `Consider your RTO’s needs for scalability, ease of use, and ongoing
management`,
    icon: <IntegrationInstructionsIcon sx={{fontSize: 40}} />
  },
  {
    heading: "Design for Your Audience",
    body: `Your website should be designed with your target audience in mind. Focus
on creating a clean, easy-to-navigate interface that appeals to prospective students and industry
partners`,
    icon: <Groups2Icon sx={{fontSize: 40}} />
  },
  {
    heading: "Integrate Key Features",
    body: `Ensure your website includes key functionalities like course listings, enrolment
forms, payment gateways, and a student portal`,
    icon: <KeyIcon sx={{fontSize: 40}} />
  },
  {
    heading: "Optimise for SEO",
    body: `Incorporate SEO best practices, including keyword optimisation, meta tags, and fast
page load times, to ensure your website ranks well in search engines`,
    icon: <SpeedIcon sx={{fontSize: 40}} />
  },
  {
    heading: "Test and Launch",
    body: `Before launching, thoroughly test your website for usability, mobile responsiveness,
and speed. Ensure that all features, such as forms and payment systems, are working correctly`,
    icon: <BugReportIcon sx={{fontSize: 40}} />
  }
];

export default function RtoWebsiteDevConsulting () {
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
