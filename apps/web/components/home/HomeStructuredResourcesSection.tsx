import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import Image from "next/image";
import { MotionItem, MotionStructuredCard, MotionStagger } from "../common/animations/MotionReveal";
import structuredSectionBlueArrow from "../../assets/structuredsectionbluearrow.svg";
import structuredSectionRedArrow from "../../assets/structuredsectionredarrow.svg";
import structuredSectionGreenArrow from "../../assets/structuredsectiongreenarrow.svg";

const featurePoints = [
  "Contextualisation-easy",
  "Designed for clarity and consistency",
  "Reduced implementation effort",
  "Stronger evidence alignment",
];

const resourceFlow = [
  {
    title: "Structured Resources",
    body: "Designed for clarity and usability",
    icon: DescriptionOutlinedIcon,
  },
  {
    title: "Consistent Documentation",
    body: "Supports alignment across teams and delivery",
    icon: AssignmentTurnedInOutlinedIcon,
  },
  {
    title: "Simpler Implementation",
    body: "Easier to adapt and apply in real RTO operations",
    icon: BuildCircleOutlinedIcon,
  },
  {
    title: "Stronger Evidence Position",
    body: "Helps create clearer, more defensible evidence",
    icon: GppGoodOutlinedIcon,
  },
];

const sectionArrows = [
  structuredSectionBlueArrow,
  structuredSectionRedArrow,
  structuredSectionGreenArrow,
];

export default function HomeStructuredResourcesSection () {
  return (
    <section className="bg-[linear-gradient(217.7deg,#FFE6E6_17.41%,#FFFFFE_60.03%)] px-3 py-10 dark:bg-[linear-gradient(217.7deg,rgba(127,29,29,0.18)_17.41%,rgba(2,6,23,1)_60.03%)] sm:px-4 lg:px-8 lg:py-12">
      <div className="mx-auto grid max-w-[84rem] items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(380px,0.9fr)]">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
            Not just more resources.
            <span className="mt-2 block text-red-500">Better structured ones.</span>
          </h2>

          <p className="mt-5 text-lg leading-9 text-slate-700 dark:text-slate-300">
            Our resources and services are developed through collaboration between instructional designers, subject matter experts, and RTO professionals. This ensures practical application, compliance alignment, and consistency across delivery.
          </p>

          <p className="mt-5 text-lg leading-9 text-slate-700 dark:text-slate-300">
            Unlike generic off-the-shelf products, our approach focuses on clarity, usability, and audit readiness.
          </p>

          <MotionStagger className="mt-6 space-y-3">
            {featurePoints.map((point) => (
              <MotionItem key={point} className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                <CheckCircleRoundedIcon className="!text-[28px] !text-green-500" />
                <span className="text-lg font-medium leading-7">{point}</span>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>

        <div className="relative mx-auto w-full max-w-[640px]">
          <MotionStagger className="space-y-5">
            {resourceFlow.map(({ title, body, icon: Icon }, index) => (
              <MotionStructuredCard key={title} index={index} className={`relative ${index < resourceFlow.length - 1 ? "pb-6" : ""}`}>
                <div className="relative z-10 flex items-center gap-4 rounded-r-lg rounded-l-full bg-white px-4 py-4 shadow-[0_16px_36px_rgba(14,116,188,0.12)] dark:bg-slate-900 dark:shadow-[0_18px_40px_rgba(2,6,23,0.38)] sm:px-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-emerald-950/40">
                    <Icon className="!text-[34px] !text-green-500 dark:!text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-blue-600 dark:text-sky-300">
                      {title}
                    </h3>
                    <div className="mt-1 h-px w-full bg-slate-200 dark:bg-slate-700" />
                    <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                      {body}
                    </p>
                  </div>
                </div>

                {index < resourceFlow.length - 1 && (
                  <div
                    className={`absolute -bottom-5 z-0 ${
                      index === 1 ? "left-3 sm:left-1" : "right-3 sm:right-1"
                    }`}
                  >
                    <Image
                      src={sectionArrows[index]}
                      alt=""
                      width={82}
                      height={82}
                      className="pointer-events-none h-16 w-16 object-contain"
                    />
                  </div>
                )}
              </MotionStructuredCard>
            ))}
          </MotionStagger>
        </div>
      </div>
    </section>
  );
}
