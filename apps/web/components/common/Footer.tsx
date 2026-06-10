"use client";

import Logo from "../../assets/logoImg.png";
import Link from "next/link";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import Image from "next/image";
import GetFreeSampleCard from "./GetFreeSampleCard";
import { useEffect } from "react";
import { useTrainingResourcesStore } from "@/state/useTrainingResourcesStore";
import { usePathname } from "next/navigation";

const consultingLinks = [
  {
    title: "New RTO Registration",
    link: "/rto-registration",
  },
  {
    title: "New RTO CRICOS Registration",
    link: "/rto-cricos-registration",
  },
  {
    title: "New ELICOS Registration",
    link: "/rto-elicos-registration",
  },
  {
    title: "Renew Registration",
    link: "/rto-renew-registration-service",
  },
  {
    title: "RTO Compliance Consulting",
    link: "/rto-compliance-consulting",
  },
  {
    title: "RTO Audit Services",
    link: "/rto-audit-service",
  },
  {
    title: "RTO Due Diligence",
    link: "/rto-due-deligence-consulting",
  },
  {
    title: "Website Development",
    link: "/rto-website-development-service",
  },
  {
    title: "Buy RTO",
    link: "/rto-Buy-service",
  },
  {
    title: "Sell RTO",
    link: "/rto-sell-service",
  },
  {
    title: "Lease Delivery Location",
    link: "/rto-lease-delivery-location-service",
  },
];

const quickLinks = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Contact",
    link: "/book-appointment",
  },
  { title: "Cookies Policy", link: "/legal/cookies-policy" },
  { title: "Licensing & Membership Agreements", link: "/legal/licensing-and-membership-agreements" },
  { title: "Membership Terms & Conditions", link: "/legal/membership-terms-and-conditions" },
  { title: "Privacy Policy", link: "/legal/privacy-policy" },
  { title: "Return & Refund Policy", link: "/legal/return-and-refund-policy" },
  { title: "Superseded Resource Policy", link: "/legal/superseded-resource-policy" },
  { title: "Use & Content Governance", link: "/legal/use-and-content-governance" },
  { title: "Website Terms & Conditions", link: "/legal/website-terms-and-conditions" },
];

const trainingResources = [
  { title: "SIT Hospitality", terms: ["sit", "hospitality"] },
  { title: "HLT Health Works", terms: ["hlt", "health"] },
  { title: "ELICOS", terms: ["elicos"] },
  { title: "CHC Community Services", terms: ["chc", "community"] },
  { title: "BSB Business", terms: ["bsb", "business"] },
  { title: "CPC Building & Construction", terms: ["cpc", "building", "construction"] },
  { title: "AUR Automotive", terms: ["aur", "automotive"] },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/p/RTO-Specialist-61571619574667/",
    icon: FacebookRoundedIcon,
    className: "bg-[#4267B2]",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/rto_specialist/",
    icon: InstagramIcon,
    className: "bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)]",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/rto-specialist/",
    icon: LinkedInIcon,
    className: "bg-[#0077B5]",
  },
];

export default function Footer() {
  const pathname = usePathname();
  const categories = useTrainingResourcesStore((state) => state.categories);
  const hasLoadedCategories = useTrainingResourcesStore((state) => state.hasLoadedCategories);
  const fetchCategories = useTrainingResourcesStore((state) => state.fetchCategories);
  const hideTopCard = pathname === "/book-appointment";

  useEffect(() => {
    if (!hasLoadedCategories) {
      void fetchCategories();
    }
  }, [fetchCategories, hasLoadedCategories]);

  const getTrainingResourceHref = (terms: string[]) => {
    const category = categories.find((item) => {
      const searchable = `${item.abbreviation || ""} ${item.name || ""}`.toLowerCase();

      return terms.some((term) => searchable.includes(term));
    });

    if (!category) {
      return "/ecommerce-categories";
    }

    return `/ecommerce-categories/${category._id}?name=${encodeURIComponent(category.name)}`;
  };

  return (
    <footer className="mt-0 w-full bg-white">
      {!hideTopCard ? (
        <div className="flex w-full flex-col gap-6 px-3 pt-3 sm:px-4 sm:pt-4 lg:px-6 lg:pt-6">
          <GetFreeSampleCard className="mx-auto w-full lg:w-[98%]" />
        </div>
      ) : null}

      <div className="mt-6 w-full">
        <div className="w-full bg-[linear-gradient(90deg,#0E74BC_0%,#39B349_100%)] px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4 lg:px-6 lg:pb-4 lg:pt-5">
          <div
            className={`rounded-[24px] bg-white px-4 pb-4 pt-8 text-slate-900 shadow-[0_20px_42px_rgba(2,6,23,0.14)] sm:px-6 sm:pb-5 lg:px-8 lg:pt-10`}
          >
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4">
                <div className="leading-none">
                  <Image src={Logo.src} alt="RTO Specialist logo" width={145} height={95} className="h-auto w-[145px]" loading="lazy" />
                </div>
                <p className="mt-4 max-w-[430px] text-[14px] leading-[1.65] text-slate-700 dark:text-slate-300">
                  We provide RTO consulting services, compliance consulting, and training resources for Registered Training Organisations across Australia.
                  We support ASQA compliance, audit readiness, RTO registration, CRICOS and ELICOS consulting, and RTO due diligence to help providers
                  reduce risk and maintain continuous compliance.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  {socialLinks.map(({ href, label, icon: Icon, className }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E74BC] dark:focus-visible:outline-sky-400 ${className}`}
                    >
                      <Icon sx={{ fontSize: 18 }} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
                <ul className="space-y-2.5 text-[14px]">
                  <li className="pb-1 text-[18px] font-semibold text-slate-950 dark:text-white">Training Resources</li>
                  {trainingResources.map(({ title, terms }) => (
                    <li key={title}>
                      <Link
                        href={getTrainingResourceHref(terms)}
                        className="text-slate-700 transition hover:text-[#0E74BC] hover:underline dark:text-slate-300 dark:hover:text-sky-300"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <ul className="space-y-2.5 text-[14px]">
                  <li className="pb-1 text-[18px] font-semibold text-slate-950 dark:text-white">Consulting</li>
                  {consultingLinks.map(({ title, link }) => (
                    <li key={title}>
                      <Link
                        href={link}
                        className="text-slate-700 transition hover:text-[#0E74BC] hover:underline dark:text-slate-300 dark:hover:text-sky-300"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <ul className="space-y-2.5 text-[14px]">
                  <li className="pb-1 text-[18px] font-semibold text-slate-950 dark:text-white">Quick Links</li>
                  {quickLinks.map(({ title, link }) => (
                    <li key={title}>
                      <Link
                        href={link}
                        className="text-slate-700 transition hover:text-[#0E74BC] hover:underline dark:text-slate-300 dark:hover:text-sky-300"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-7 border-t border-slate-200 pt-4 dark:border-slate-700">
              <div className="flex flex-col items-center justify-between gap-2.5 text-[11px] text-slate-600 dark:text-slate-300 sm:flex-row">
                <p>&copy; 2024 RTO Specialist. All Rights Reserved.</p>
                <div className="flex items-center gap-3">
                  <p>ABN: 33 679 788 062</p>
                  <span className="h-3 w-px bg-slate-300 dark:bg-slate-600" aria-hidden="true" />
                  <p>ACN: 679 788 062</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
