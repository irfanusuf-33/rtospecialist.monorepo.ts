import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import { MotionEcosystemCard, MotionStagger } from "../common/animations/MotionReveal";

const ecosystemCards = [
  {
    title: "Training Resources",
    description:
      "Audit-ready resources built to reduce development time and strengthen evidence clarity across your RTO.",
    icon: MenuBookRoundedIcon,
    iconColor: "text-[#0E74BC] dark:text-sky-300",
    iconBg: "bg-[#E7F1F8] dark:bg-sky-950/50",
    listBg: "bg-[#EBF7ED] dark:bg-emerald-950/40",
    items: [
      "Fully editable and flexible formats",
      "Mapped to unit requirements and standards",
      "Structured to support clear, defensible evidence",
    ],
  },
  {
    title: "Professional Development",
    description:
      "Targeted professional development designed to strengthen internal capability and support consistent, compliant delivery.",
    icon: GroupsRoundedIcon,
    iconColor: "text-[#FF0000] dark:text-red-400",
    iconBg: "bg-[#FFE6E6] dark:bg-red-950/40",
    listBg: "bg-[#EBF7ED] dark:bg-emerald-950/40",
    items: [
      "Aligned with current regulatory expectations",
      "Supports trainers in real delivery environments",
      "Builds internal consistency and assessment quality",
    ],
  },
  {
    title: "Consulting & Support Services",
    description:
      "Specialist support designed to guide RTOs through key compliance, registration, and operational milestones.",
    icon: SupportAgentRoundedIcon,
    iconColor: "text-[#39B349] dark:text-emerald-400",
    iconBg: "bg-[#EBF7ED] dark:bg-emerald-950/40",
    listBg: "bg-[#EBF7ED] dark:bg-emerald-950/40",
    items: [
      "Support across registration and renewal processes",
      "Guidance on compliance and audit readiness",
      "Due diligence and acquisition advisory",
    ],
  },
];

export default function HomeEcosystemSection () {
  return (
    <section className="bg-white px-3 py-12 dark:bg-slate-950 sm:px-4 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-[84rem]">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl lg:text-4xl">
            A complete compliance and training support ecosystem
          </h2>
        </div>

        <MotionStagger className="mt-10 grid gap-6 lg:grid-cols-3">
          {ecosystemCards.map(({ title, description, icon: Icon, iconBg, iconColor, listBg, items }, index) => (
            <MotionEcosystemCard
              key={title}
              index={index}
              className="mx-auto flex h-full w-full max-w-[25rem] flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition dark:border-slate-800 dark:bg-slate-900 sm:p-5"
            >
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-full ${iconBg}`}>
                <Icon className={iconColor} sx={{ fontSize: 30 }} />
              </div>

              <h3 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">
                {title}
              </h3>

              <p className="my-2.5 text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base">
                {description}
              </p>

              <div className={`mt-auto rounded-lg p-3.5 pt-4 ${listBg}`}>
                <ul className="space-y-2.5 text-left text-xs leading-6 text-slate-800 dark:text-slate-200 sm:text-sm">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0E74BC] dark:bg-sky-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </MotionEcosystemCard>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
