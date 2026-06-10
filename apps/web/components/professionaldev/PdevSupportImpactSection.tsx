import Image from "next/image";
import pdSupportImg from "../../assets/pdSupportImg.svg";

const supportItems = [
  {
    number: "01",
    title: "Stronger internal capability",
    description: "Help staff apply knowledge more confidently across delivery and assessment activities.",
  },
  {
    number: "02",
    title: "More consistent practice",
    description: "Support better alignment across teams with clearer and more practical learning.",
  },
  {
    number: "03",
    title: "Reduced avoidable rework",
    description: "Strengthen practice earlier and reduce issues caused by inconsistency or capability gaps.",
  },
  {
    number: "04",
    title: "Better support for ongoing improvement",
    description: "Create a more structured approach to staff development over time.",
  },
];

export default function PdevSupportImpactSection() {
  return (
    <section className="overflow-hidden bg-white px-4 py-14 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            <span className="lg:whitespace-nowrap">
              What this <span className="text-red-600 dark:text-red-400">Supports</span> Across your{" "}
              <span className="text-sky-700 dark:text-sky-400">Organisation</span>
            </span>
          </h2>
        </div>

        <div className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:gap-14">
          <div className="space-y-6 lg:space-y-8">
            {supportItems.map((item) => (
              <article
                key={item.number}
                className="flex items-start gap-4 rounded-[28px] bg-white p-4 dark:bg-slate-950 sm:gap-5 sm:p-5"
              >
                <div className="inline-flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-[46px] bg-[#E7F1F8] text-2xl font-semibold tracking-tight text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 sm:text-3xl">
                  {item.number}
                </div>

                <div className="pt-1">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white sm:text-[1.45rem] sm:leading-8">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[34rem] text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base sm:leading-7">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="absolute inset-0 -z-10 rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.22),_transparent_38%),radial-gradient(circle_at_bottom,_rgba(148,163,184,0.16),_transparent_42%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_34%),radial-gradient(circle_at_bottom,_rgba(30,41,59,0.45),_transparent_44%)]" />
            <Image
              src={pdSupportImg}
              alt="Illustration showing how professional development supports capability, consistency, and improvement across an organisation"
              className="h-auto w-full"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
