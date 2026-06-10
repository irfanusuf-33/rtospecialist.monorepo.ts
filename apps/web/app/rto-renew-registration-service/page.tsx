import type { Metadata } from "next";
import RtoConsulationHeader from "../../components/common/rtoconsultationservices/RtoConsulationHeader";
import RtoConsultingWhyRegsiter from "../../components/common/rtoconsultationservices/RtoConsultingWhyRegister";
import RtoConsultationSteps from "../../components/common/rtoconsultationservices/RtoConsultationSteps";
import RtokeyConsiderations from "../../components/common/rtoconsultationservices/RtoKeyConsiderations";
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import '../../client/scss/rtoconsultationservices/rtoconsultationservices.scss';
import RtoRenewalImg from '../../assets/renewregistrationimg.webp';

export const metadata: Metadata = {
  title: "RTO Registration Renewal Service | Ensure ASQA Compliance & Accreditation",
  description:
    "Renew your RTO registration with expert guidance. Stay ASQA compliant, pass audits, and maintain accreditation to continue delivering nationally recognised training. Get professional support for a hassle-free renewal process.",
  alternates: {
    canonical: "https://rtospecialist.com.au/rto-renew-registration-service",
  },
};

const headerData = {
  mainheading: "Renew RTO Registration",
  heading: "Ensure Ongoing Compliance and Success",
  secondary: `
    Renewing your Registered Training Organisation (RTO) registration is a critical process that ensures your
institution can continue delivering nationally accredited training in compliance with the Australian Skills Quality
Authority (ASQA) standards. The renewal process involves a detailed review of your RTO's systems, policies,
and performance to ensure ongoing compliance with the Standards for RTOs . With proper preparation and upto-date documentation, your RTO can successfully navigate the renewal process and continue providing highquality vocational education.`
};

const whyUsTileData = [
  {
    heading: "Maintain Your RTO's Accreditation",
    body: `RTO registration renewal is essential for maintaining your ability
to deliver nationally recognised training and qualifications. Without successful renewal, your RTO risks
losing its accreditation and being unable to offer government-recognised qualifications`,
    icon: <BalanceOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Stay Compliant with ASQA Standards",
    body: `The renewal process helps ensure that your RTO continues to
meet the compliance requirements set out by ASQA. This includes your training and assessment
strategies, trainer qualifications, student support systems, and operational policies`,
    icon: <AssignmentTurnedInOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Build Trust and Credibility",
    body: `
A successfully renewed registration reinforces your RTO's reputation as a
reliable and compliant training provider. It demonstrates to students, industry partners, and government
bodies that your organisation is committed to quality education`,
    icon: <HandshakeOutlinedIcon sx={{ fontSize: 40 }} />
  },
];

const componentHeading = 'Why RTO Registration Renewal is Important?';
const componentSecondary = `
Renewing your Registered Training Organisation (RTO) registration is a critical process that ensures your
institution can continue delivering nationally accredited training in compliance with the Australian Skills Quality
Authority (ASQA) standards.`;

const stepsHeading = "Key Steps in the RTO Registration Renewal Process";
const stepsImage = RtoRenewalImg;
const stepsTileData = [
  {
    heading: "Review ASQA Compliance Requirements",
    body: `
Before starting the renewal process, review the Standards
for RTOs and ensure your RTO complies with all requirements. This includes assessing your training
and assessment practices, policies, procedures, and student support services.

`
  },
  {
    heading: "Prepare for an Internal Audit",
    body: `
Conduct an internal audit of your RTO's operations. This will help you
identify any areas that need improvement before submitting your renewal application. Review your
course delivery, assessment methods, trainer qualifications, compliance records, and student outcomes.
`
  },
  {
    heading: "Update Documentation",
    body: `
Ensure that all of your RTO's documentation is up to date and ready for
submission. This includes training and assessment strategies (TAS), policies and procedures, records of
student progress, and evidence of compliance with ASQA standards.
`
  },
  {
    heading: "Submit Your Application",
    body: `
RTOs are required to submit their renewal application to ASQA before the
registration expiry date. Be sure to include all relevant documentation and provide detailed information
about your RTO's compliance with the required standards.`
  },
  {
    heading: "ASQA Audit (If Required)",
    body: `
 ASQA may conduct a compliance audit as part of the renewal process. This
audit will review your RTO's ability to meet ongoing compliance requirements, including your training
delivery, student support systems, and governance structures.
`
  },
  {
    heading: "Address Any Non-Compliance",
    body: `
If the audit identifies any areas of non-compliance, you will be given
the opportunity to address these issues. It's important to rectify any non-compliance quickly and provide
evidence to ASQA that these issues have been resolved.
`
  },
  {
    heading: "Gain Approval and Continue Operations",
    body: `
 Once your RTO successfully passes the audit and meets all
renewal requirements, ASQA will renew your registration. Your RTO can then continue delivering
nationally recognised training to students.
`
  },
];

const keyconsiderationsHeading = "Key Considerations for RTO Registration Renewal";

const keyconsiderationsTileData = [
  {
    heading: "Ongoing Compliance",
    body: `RTOs must demonstrate ongoing compliance with ASQA standards, not just at
the time of renewal. This includes maintaining qualified staff, keeping accurate student records, and
delivering quality training consistently`,
    icon: <AssignmentTurnedInOutlinedIcon />
  },
  {
    heading: "Student Feedback and Outcomes",
    body: `As part of the renewal process, ASQA may assess student
feedback, outcomes, and the overall quality of your training. Ensure that your students are progressing
successfully and receiving adequate support throughout their studies.`,
    icon: <ThumbUpAltOutlinedIcon />
  },
  {
    heading: "Future-Proof Your RTO",
    body: `Consider any future changes to your course offerings, facilities, or student
services during the renewal process. Planning for growth and ensuring your RTO remains compliant as
you expand is key to long-term success`,
    icon: <UpdateOutlinedIcon />
  }
];

export default function RtoRenewRegConsulting() {
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
    </>
  );
}
