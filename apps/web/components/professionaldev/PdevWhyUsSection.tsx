import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import PsychologyAltOutlinedIcon from "@mui/icons-material/PsychologyAltOutlined";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";

const reasons = [
  {
    title: "Stay Current",
    description:
      "Help staff keep up with current expectations, sector changes, and ongoing development needs.",
    icon: TipsAndUpdatesOutlinedIcon,
  },
  {
    title: "Meet Compliance",
    description:
      "Support teams with professional development that strengthens awareness of current requirements and expectations.",
    icon: AssignmentTurnedInOutlinedIcon,
  },
  {
    title: "Build Capability",
    description:
      "Develop stronger internal confidence, consistency, and day to day operational capability across your team.",
    icon: PsychologyAltOutlinedIcon,
  },
];

export default function PdevWhyUsSection() {
  return (
    <section className="bg-white px-4 py-14 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Why <span className="text-red-600 dark:text-red-400">RTO</span> Teams Use Our{" "}
            <span className="text-sky-700 dark:text-sky-400">Professional</span> Development
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
            Built around real operational practice, and refined through trainer feedback to improve usability,
            assessment flow, and day to day consistency.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <article
                key={reason.title}
                className="rounded-[8px] border border-slate-300 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,23,42,0.1)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_12px_36px_rgba(0,0,0,0.28)]"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-[8px] bg-[#EBF0FF] text-[#336CFF] dark:bg-sky-950/70 dark:text-sky-300">
                  <Icon className="!text-[28px]" />
                </div>

                <h3 className="mt-5 text-2xl font-medium tracking-tight text-slate-950 dark:text-white">
                  {reason.title}
                </h3>

                <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-300">
                  {reason.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
