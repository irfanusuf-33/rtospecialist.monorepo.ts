import type { Metadata } from "next";
import RtoConsulationHeader from "../../components/common/rtoconsultationservices/RtoConsulationHeader";
import RtoConsultingWhyRegsiter from "../../components/common/rtoconsultationservices/RtoConsultingWhyRegister";
import RtoConsultationSteps from "../../components/common/rtoconsultationservices/RtoConsultationSteps";
import RtokeyConsiderations from "../../components/common/rtoconsultationservices/RtoKeyConsiderations";
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AssuredWorkloadOutlinedIcon from '@mui/icons-material/AssuredWorkloadOutlined';
import '../../client/scss/rtoconsultationservices/rtoconsultationservices.scss';
import SellRtoImg from '../../assets/sellrtoimg.webp';

export const metadata: Metadata = {
  title: "Sell Your RTO | Maximise Value & Ensure a Smooth Sale",
  description:
    "Thinking about selling your RTO? Maximise your investment with expert guidance on compliance, valuation, and buyer attraction. Get professional assistance today.",
  alternates: {
    canonical: "https://rtospecialist.com.au/rto-Sell-service",
  },
};

const headerData = {
  heading: "Maximize Your Return on Investment",
  secondary: `If you’re considering selling your Registered Training Organisation (RTO), now could be the perfect time to
capitalise on the growing demand for vocational education and training (VET) providers. Whether you're looking
to retire, pursue new ventures, or simply streamline your business operations, selling an RTO can be a strategic
decision to maximise your investment. With the right preparation, you can ensure a smooth sale process while
attracting serious buyers.`
};

const whyUsTileData = [
  {
    heading: "Leverage the Growing VET Sector",
    body: `With the increasing demand for skilled workers across various
industries, the vocational education and training sector is flourishing. This creates a prime market for
RTOs, making it an ideal time to sell
`,
    icon: <InsertChartOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Attracting Buyers",
    body: `Buyers are often attracted to established RTOs because they offer a compliant, fully
operational training business. If your RTO has a strong reputation, solid enrolment numbers, and steady
revenue streams, it becomes even more appealing to potential buyers`,
    icon: <ShoppingCartOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Unlock Your Equity",
    body: `
Selling an RTO allows you to release the equity tied up in your business, providing
you with financial freedom to explore new opportunities or invest in other ventures`,
    icon: <VpnKeyOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Streamlined Exit",
    body: `Selling an RTO can provide a smooth exit strategy, especially if you’ve built a
business that runs efficiently and complies with all regulatory standards
`,
    icon: <SellOutlinedIcon sx={{ fontSize: 40 }} />
  }
];

const componentHeading = 'Why Sell Your RTO?';
const componentSecondary = `
Selling an RTO can be a strategic
decision to maximise your investment. With the right preparation, you can ensure a smooth sale process while
attracting serious buyers.
`;

// steps component data
const stepsHeading = "Key Considerations When Selling Your RTO";
const stepsImage = SellRtoImg;
const stepsTileData = [
  {
    heading: "Compliance Status",
    body: `
One of the most critical aspects of selling an RTO is ensuring it meets all
regulatory standards set by the Australian Skills Quality Authority (ASQA). Buyers will want to know that
your RTO is fully compliant and not facing any potential compliance issues or penalties.`
  },
  {
    heading: "Scope of Registration",
    body: `
Ensure that your scope of registration is clear, up to date, and attractive to
potential buyers. A broad scope with high-demand qualifications is a significant selling point.

`
  },
  {
    heading: "Financial Health",
    body: `
Prepare your financial statements, including profit and loss reports, enrolment data,
and revenue projections. Buyers will want to review your RTO’s financial health to determine its
profitability and long-term potential.`
  },
  {
    heading: "Staff and Trainer Qualifications",
    body: `
 Make sure your staff, particularly trainers and assessors, are qualified
and compliant with national standards. Their qualifications and experience can significantly influence the
value of your RTO.`
  },
  {
    heading: "Reputation and Student Satisfaction",
    body: `
A positive reputation in the market, good student outcomes, and
industry partnerships will add to the value of your RTO. Gather testimonials, student satisfaction
surveys, and performance data to highlight your RTO’s success.
`
  },
];

// key considerations
const keyconsiderationsHeading = "How to Prepare for Selling Your RTO";

const keyconsiderationsTileData = [
  {
    heading: "Evaluate Your RTO's Market Value",
    body: ` Begin by assessing the current market value of your RTO.
Consider factors like profitability, compliance, scope of registration, and reputation. We can help you
determine a fair market price`,
    icon: <StoreOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Organise Your Documentation",
    body: ` Buyers will want to conduct thorough due diligence before committing
to a purchase. Ensure that your RTO’s financial records, compliance documents, student outcomes, and
training materials are well-organized and up-to-date`,
    icon: <AssuredWorkloadOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: "Maintain Compliance",
    body: ` It’s essential to keep your RTO compliant with ASQA regulations throughout the
sale process. A non-compliant RTO can lose value quickly, so stay vigilant in maintaining your
compliance status until the sale is finalised`,
    icon: <ArticleOutlinedIcon sx={{ fontSize: 40 }} />
  },
  {
    heading: " Prepare for Ownership Transition",
    body: ` Once a sale agreement is reached, you'll need to prepare for a
smooth transition. This includes ensuring ASQA approval for the change in ownership and helping the
new owner integrate into the business`,
    icon: <VpnKeyOutlinedIcon sx={{ fontSize: 40 }} />
  }
];

export default function SellRto () {
  return (
    <>
      <div className="rto-consulation-reg-header">
        <RtoConsulationHeader heading={headerData.heading} secondary={headerData.secondary} />
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
