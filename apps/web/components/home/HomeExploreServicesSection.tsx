import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import Image from "next/image";
import Link from "next/link";
import { MotionExploreServiceCard, MotionStagger } from "../common/animations/MotionReveal";
import servicesSectionConsulting from "../../assets/servicessectionconsulting.svg";
import servicesSectionRegistration from "../../assets/servicessectionregistration.svg";
import servicesSectionAudit from "../../assets/servicessectionaudit.svg";
import servicesSectionTraining from "../../assets/servicessectiontraining.svg";
import servicesSectionDeligence from "../../assets/servicessectiondeligence.svg";
import servicesSectionCricos from "../../assets/servicessectioncricos.svg";

const serviceCards = [
  {
    title: "RTO Consulting Services",
    href: "/rto-compliance-consulting",
    icon: servicesSectionConsulting,
    alt: "RTO consulting services icon",
  },
  {
    title: "RTO Registration Support",
    href: "/rto-registration",
    icon: servicesSectionRegistration,
    alt: "RTO registration support icon",
  },
  {
    title: "Compliance & Audit Support",
    href: "/rto-audit-service",
    icon: servicesSectionAudit,
    alt: "Compliance and audit support icon",
  },
  {
    title: "Training Resources",
    href: "/training",
    icon: servicesSectionTraining,
    alt: "Training resources icon",
  },
  {
    title: "Due Diligence (Buy/Sell RTO)",
    href: "/rto-due-deligence-consulting",
    icon: servicesSectionDeligence,
    alt: "Due diligence consulting icon",
  },
  {
    title: "CRICOS / ELICOS Support",
    href: "/rto-cricos-elicos-registration",
    icon: servicesSectionCricos,
    alt: "CRICOS and ELICOS support icon",
  },
];

export default function HomeExploreServicesSection () {
  return (
    <section className="bg-[linear-gradient(202.45deg,#E7F1F8_13.89%,#FFFFFF_46.6%)] px-3 py-8 dark:bg-[linear-gradient(202.45deg,rgba(14,116,188,0.14)_13.89%,rgba(2,6,23,1)_46.6%)] sm:px-4 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[84rem]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Explore our services
          </h2>
        </div>

        <MotionStagger className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {serviceCards.map(({ title, href, icon, alt }, index) => (
            <MotionExploreServiceCard key={title} index={index}>
              <Link
                href={href}
                className="group block rounded-lg border border-blue-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-[0_18px_40px_rgba(14,116,188,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-400 dark:hover:shadow-[0_20px_42px_rgba(2,132,199,0.18)]"
              >
                <div className="flex h-full min-h-[138px] flex-col">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(180deg,#0E74BC_0.01%,#39B349_97.12%)]">
                    <Image src={icon} alt={alt} width={30} height={30} className="h-8 w-8 object-contain" />
                  </div>

                  <h3 className="mt-5 text-[1.45rem] font-semibold leading-tight text-blue-600 transition-colors group-hover:text-blue-700 dark:text-sky-300 dark:group-hover:text-sky-200">
                    {title}
                  </h3>

                  <div className="mt-auto pt-3">
                    <span className="inline-flex items-center gap-1 text-base font-semibold text-red-500 transition-colors group-hover:text-red-600 dark:text-red-400 dark:group-hover:text-red-300">
                      Learn More
                      <ArrowForwardOutlinedIcon className="!text-[18px]" />
                    </span>
                  </div>
                </div>
              </Link>
            </MotionExploreServiceCard>
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
