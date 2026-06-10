"use client";

import { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
} from "@material-tailwind/react";

const pdevFaqs = [
  {
    question: "Who is this professional development designed for?",
    answer:
      "Our professional development is designed for RTO teams, including trainers, assessors, compliance staff, administrators, managers and leadership teams who want to strengthen capability, improve consistency and support ongoing professional practice.",
  },
  {
    question: "Can we browse the professional development library before choosing a subscription?",
    answer:
      "Yes. You can explore the available professional development topics before choosing the subscription that best suits your team, organisation size and staff development needs.",
  },
  {
    question: "What is the difference between Starter, Premium and Enterprise?",
    answer:
      "The main difference is the number of staff included, the level of access required and the type of support your organisation needs. Starter is suitable for smaller teams, Premium is designed for growing RTO teams, and Enterprise is available for larger organisations or teams that require a tailored professional development solution.",
  },
  {
    question: "How do the professional development bundles work?",
    answer:
      "Professional development bundles work through credits. When you purchase a bundle, you receive a set number of credits that can be used to choose the certifications you needs. This allows you to build a flexible PD package based on your needs, role requirements and development priorities.",
  },
  {
    question: "Can we choose the certifications we need?",
    answer:
      "Yes. Bundles and Membership allow you to select the certifications that are most relevant to you or your team. This gives your RTO flexibility to focus on the professional development areas that matter most to your staff, operations and compliance priorities.",
  },
  {
    question: "How does access work for staff members?",
    answer:
      "Access depends on the subscription selected. Starter and Premium include access for a set number of staff, while Enterprise can be tailored for larger teams or organisation wide access.",
  },
  {
    question: "Can we add more staff later?",
    answer:
      "Yes. Additional staff access can be arranged if your team grows or if you want more people across your organisation to complete professional development.",
  },
  {
    question: "Does the professional development support the 2025 Standards for RTOs?",
    answer:
      "Yes. The professional development is designed to support RTO staff capability, quality practice and continuous improvement in line with the expectations of the current VET environment, including the 2025 Standards for RTOs.",
  },
  {
    question: "Can I purchase professional development without a membership?",
    answer:
      "Yes. You can purchase selected professional development certifications or bundles without becoming a member. Membership is designed for RTOs that want ongoing access, broader team coverage and better value over time, but standalone PD options are also available.",
  },
] as const;

export default function PdevFaqSection() {
  const [openFaq, setOpenFaq] = useState(1);

  return (
    <section className="bg-white px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[32px] bg-white px-4 py-10 sm:px-6 lg:px-10 lg:py-14 dark:bg-slate-950">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 50% 38%, rgba(255, 9, 9, 0.18) 0%, rgba(255, 9, 9, 0.12) 20%, rgba(255, 255, 255, 0) 44%),
                radial-gradient(circle at 50% 40%, rgba(91, 137, 255, 0.16) 0%, rgba(91, 137, 255, 0.1) 24%, rgba(255, 255, 255, 0) 50%),
                linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)
              `,
            }}
          />

          <div className="relative mx-auto max-w-[760px]">
            <header className="mb-8 text-center lg:mb-10">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Frequently Asked <span className="text-[#FF0000] dark:text-red-400">Questions</span>
              </h2>
            </header>

            <div className="space-y-1.5">
              {pdevFaqs.map((faq, index) => {
                const faqId = index + 1;
                const isOpen = openFaq === faqId;

                return (
                  <Accordion
                    key={faq.question}
                    open={isOpen}
                    className="overflow-hidden rounded-[10px] border border-white/70 bg-white/40 backdrop-blur-[2px] dark:border-slate-700/80 dark:bg-slate-900/80"
                    icon={
                      isOpen ? (
                        <RemoveRoundedIcon className="!text-[22px] !text-slate-900 dark:!text-white" />
                      ) : (
                        <AddRoundedIcon className="!text-[22px] !text-slate-900 dark:!text-white" />
                      )
                    }
                    placeholder={undefined}
                  >
                    <AccordionHeader
                      onClick={() => setOpenFaq(isOpen ? 0 : faqId)}
                      className="border-b-0 px-4 py-4 text-left text-[15px] font-semibold leading-6 text-slate-950 hover:text-slate-950 dark:text-white dark:hover:text-white"
                      placeholder={undefined}
                    >
                      {faq.question}
                    </AccordionHeader>
                    <AccordionBody className="px-4 pb-4 pt-0 text-sm leading-6 text-slate-800 dark:text-slate-200">
                      <p>{faq.answer}</p>
                    </AccordionBody>
                  </Accordion>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
