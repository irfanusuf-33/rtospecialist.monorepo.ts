import Image from "next/image";
import howWorksStep1 from "../../assets/howWorksStep1.svg";
import howWorksStep2 from "../../assets/howWorksStep2.svg";
import howWorksStep3 from "../../assets/howWorksStep3.svg";
import howWorksStep4 from "../../assets/howWorksStep4.svg";
import pdHowWorksArrow from "../../assets/pdHowWorksArrow.svg";

const steps = [
  {
    title: "Browse the library",
    description:
      "Review the available professional development content and identify what is relevant for your team.",
    icon: howWorksStep1,
  },
  {
    title: "Choose your subscription",
    description:
      "Select the plan that best suits your staff numbers and capability goals.",
    icon: howWorksStep2,
  },
  {
    title: "Give your team access",
    description:
      "Provide access to the staff members included in your subscription.",
    icon: howWorksStep3,
  },
  {
    title: "Build capability over time",
    description:
      "Use the subscription to support stronger learning, clearer practice, and ongoing team development.",
    icon: howWorksStep4,
  },
] as const;

export default function PdevHowItWorksSection() {
  return (
    <section className="bg-white px-4 py-14 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            How it <span className="text-red-600 dark:text-red-400">Works</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:mt-16 xl:grid-cols-4 xl:gap-10">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {index < steps.length - 1 ? (
                <div className="absolute left-[calc(50%+4.5rem)] top-8 hidden w-[calc(100%-5.5rem)] -translate-y-1/2 xl:block">
                  <Image
                    src={pdHowWorksArrow}
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-full object-contain opacity-90 dark:opacity-75"
                  />
                </div>
              ) : null}

              <article className="mx-auto flex max-w-[280px] flex-col items-center text-center">
                <Image
                  src={step.icon}
                  alt=""
                  aria-hidden="true"
                  className="h-16 w-16 object-contain"
                />

                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                  {step.title}
                </h3>

                <p className="mt-4 text-base leading-8 text-slate-700 dark:text-slate-300">
                  {step.description}
                </p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
