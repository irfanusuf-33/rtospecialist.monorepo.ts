import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { MotionItem, MotionStagger } from "../common/animations/MotionReveal";

const meaningItems = [
  "Faster Resource Implementation",
  "Reduced Audit Preparation Stress",
  "Less Reliance On Internal Redevelopment",
  "More Consistent Documentation Across Teams",
  "Clearer Evidence Trails",
  "Improved Team Confidence During Audits",
];

export default function HomeWhatThisMeansSection () {
  return (
    <section className="relative overflow-hidden bg-white py-12 dark:bg-slate-950 lg:py-16">
      <div className="absolute left-5 top-4 z-10 hidden grid-cols-5 gap-2 sm:left-8 sm:top-5 lg:grid">
        {Array.from({ length: 10 }).map((_, index) => (
          <span key={index} className="h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-sky-400" />
        ))}
      </div>

      <div className="absolute bottom-4 right-5 z-10 hidden grid-cols-5 gap-1.5 sm:bottom-5 sm:right-8 lg:grid">
        {Array.from({ length: 10 }).map((_, index) => (
          <span key={index} className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-sky-400" />
        ))}
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-10">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl lg:text-4xl">
          What this means for your organisation
        </h2>

        <div className="mx-auto mt-8 max-w-6xl rounded-[2rem] border-2 border-[#39B349] px-5 py-6 dark:border-emerald-400 sm:px-6 lg:rounded-full lg:px-8">
          <MotionStagger className="grid gap-x-12 gap-y-5 lg:grid-cols-2">
            {meaningItems.map((item) => (
              <MotionItem key={item} className="flex items-center gap-3 text-[#0E74BC] dark:text-sky-300">
                <CheckCircleRoundedIcon className="!text-[24px] !text-[#39B349] dark:!text-emerald-400" />
                <span className="text-base font-semibold leading-7 sm:text-lg">
                  {item}
                </span>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </div>
    </section>
  );
}
