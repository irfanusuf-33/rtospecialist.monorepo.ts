import TouchAppOutlinedIcon from "@mui/icons-material/TouchAppOutlined";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import { MotionItem, MotionStagger } from "../common/animations/MotionReveal";

const implementationSteps = [
  {
    number: "1",
    title: "Choose",
    description:
      "Browse and select resources designed for clarity and usability.",
    icon: TouchAppOutlinedIcon,
  },
  {
    number: "2",
    title: "Implement",
    description:
      "Adapt content to your specific delivery, learners, and operations.",
    icon: SettingsSuggestOutlinedIcon,
  },
  {
    number: "3",
    title: "Build",
    description:
      "Create structured, aligned documentation across your organisation.",
    icon: DescriptionOutlinedIcon,
  },
  {
    number: "4",
    title: "Maintain",
    description:
      "Keep a continuous compliance and structured system.",
    icon: HandymanOutlinedIcon,
  },
];

export default function HomeImplementationSection () {
  return (
    <section className="bg-white px-3 py-12 dark:bg-slate-950 sm:px-4 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-[84rem]">
        <h2 className="mx-auto max-w-5xl text-center text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
          Simple, structured, and built for implementation
        </h2>

        <MotionStagger className="mt-10 grid gap-8 lg:grid-cols-[1fr_minmax(88px,132px)_1fr_minmax(88px,132px)_1fr_minmax(88px,132px)_1fr] lg:items-start">
          {implementationSteps.map(({ number, title, description, icon: Icon }, index) => (
            <div key={title} className="contents">
              <MotionItem className="relative flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(180deg,#0E74BC_0.01%,#39B349_97.12%)] text-3xl font-semibold text-white shadow-lg shadow-sky-200/70 dark:shadow-sky-950/40">
                  {number}
                </div>
                <Icon className="mt-4 !text-[28px] !text-[#0E74BC] dark:!text-sky-300" />
                <h3 className="mt-2 text-[18px] font-semibold leading-none text-[#0E74BC] dark:text-sky-300">
                  {title}
                </h3>
                <p className="mt-1.5 max-w-[220px] text-[13px] leading-[1.35] text-[#4a4a4a] dark:text-slate-300">
                  {description}
                </p>
              </MotionItem>
              {index < implementationSteps.length - 1 && (
                <div className="hidden pt-6 lg:flex lg:items-center lg:justify-center">
                  <div className="flex w-full items-center">
                    <span className="h-px flex-1 bg-blue-100 dark:bg-sky-900" />
                    <EastOutlinedIcon className="!ml-0 !text-[22px] !text-blue-100 dark:!text-sky-900" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
