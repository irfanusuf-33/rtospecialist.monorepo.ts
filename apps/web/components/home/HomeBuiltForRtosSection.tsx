import Image from "next/image";
import { MotionItem, MotionStagger } from "../common/animations/MotionReveal";
import aqsaIcon from "../../assets/AQSAicon.svg";
import professionalsIcon from "../../assets/professionalsicon.svg";
import coverageIcon from "../../assets/coverageicon.svg";
import vetIcon from "../../assets/veticon.svg";

const builtForItems = [
  {
    title: "ASQA aligned",
    description: "Aligned with ASQA compliance requirements",
    icon: aqsaIcon,
    alt: "ASQA aligned icon",
  },
  {
    title: "Industry professionals",
    description: "Developed by industry professionals",
    icon: professionalsIcon,
    alt: "Industry professionals icon",
  },
  {
    title: "National coverage",
    description: "Supporting Registered Training Organisations across Australia",
    icon: coverageIcon,
    alt: "National coverage icon",
  },
  {
    title: "VET sector focused",
    description: "Designed for the Australian VET sector",
    icon: vetIcon,
    alt: "VET sector focused icon",
  },
];

export default function HomeBuiltForRtosSection () {
  return (
    <section className="bg-white px-3 py-8 dark:bg-slate-950 sm:px-4 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[84rem]">
        <MotionItem>
          <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Built for Australian RTOs
          </h2>
        </MotionItem>

        <MotionStagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {builtForItems.map(({ title, description, icon, alt }) => (
            <MotionItem key={title} className="text-center">
              <div className="mx-auto flex max-w-[230px] flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-[0_10px_24px_rgba(14,116,188,0.18)] dark:bg-sky-500">
                  <Image
                    src={icon}
                    alt={alt}
                    width={34}
                    height={34}
                    className="h-[34px] w-[34px] object-contain"
                  />
                </div>
                <h3 className="mt-3 whitespace-nowrap text-[1.55rem] font-semibold leading-tight text-blue-600 dark:text-sky-300">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base">
                  {description}
                </p>
              </div>
            </MotionItem>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
