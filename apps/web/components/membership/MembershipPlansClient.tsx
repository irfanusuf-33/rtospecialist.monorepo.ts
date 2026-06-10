"use client";

import { useMemo, useState } from "react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import type { ComponentType, ReactNode } from "react";
import {
  Accordion as MaterialAccordion,
  AccordionBody as MaterialAccordionBody,
  AccordionHeader as MaterialAccordionHeader,
} from "@material-tailwind/react";

type AnyProps = { children?: ReactNode; [key: string]: unknown };
const Accordion = MaterialAccordion as unknown as ComponentType<AnyProps>;
const AccordionBody = MaterialAccordionBody as unknown as ComponentType<AnyProps>;
const AccordionHeader = MaterialAccordionHeader as unknown as ComponentType<AnyProps>;
import GroupMembPaymentModal from "../../components/membership/GroupMembPaymentModal";
import { useAccountsStore } from "../../state/useAccountsStore";
import { useGlobalToastStore } from "../../state/useGlobalToastStore";
import { useRouter } from "next/navigation";

type PlanCard = {
  key: "essential" | "growth" | "enterprise";
  name: string;
  subtitle: string;
  currentPrice: string;
  oldPrice: string;
  offLabel: string;
  buttonText: string;
  included: string[];
  addonMainPrice: string;
  addonSeats: number;
  addonRows: Array<{ key: string; label: string; subLabel: string; price: string }>;
  planId: number;
  classes: {
    headerBg: string;
    priceColor: string;
    badgeBg: string;
    badgeText: string;
    buttonBg: string;
    buttonHover: string;
    border: string;
    addonIcon: string;
  };
  badge: string;
};

export type MembershipAddonPayload = {
  planKey: PlanCard["key"];
  baseAmount: number;
  addonPack: { selected: boolean; qty: number; unitPrice: number; total: number };
  newUsers: { qty: number; unitPrice: number; total: number };
  pdUsers: { qty: number; unitPrice: number; total: number };
  addonAmount: number;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
};

const planCards: PlanCard[] = [
  {
    key: "essential",
    name: "Essential",
    subtitle: "Build for smaller RTOs and lower volume buyers",
    currentPrice: "$1,200",
    oldPrice: "$1,800",
    offLabel: "30% OFF",
    buttonText: "Choose Essential",
    included: [
      "3 annual resource credits",
      "3.5% discount on additional unit purchases",
      "Tailored customer service"
    ],
    addonMainPrice: "$750",
    addonSeats: 5,
    addonRows: [
      { key: "new-user", label: "+1 new user", subLabel: "Priced per additional user", price: "$69" },
      { key: "pd-users", label: "+1 PD x users", subLabel: "Additional PD usage bundle", price: "$27" },
    ],
    planId: 1,
    classes: {
      headerBg: "bg-[#E7F1F8] dark:bg-sky-950/35",
      priceColor: "text-[#0E74BC] dark:text-sky-300",
      badgeBg: "bg-[#0E74BC]",
      badgeText: "text-white",
      buttonBg: "bg-[#0E74BC]",
      buttonHover: "hover:bg-[#0b5f98] dark:hover:bg-sky-500",
      border: "border-transparent",
      addonIcon: "text-[#0E74BC] dark:text-sky-300",
    },
    badge: "Entry Plan",
  },
  {
    key: "growth",
    name: "Growth",
    subtitle: "Build for growing RTOs with repeat purchasing needs",
    currentPrice: "$6,400",
    oldPrice: "$9,200",
    offLabel: "30% OFF",
    buttonText: "Choose Growth",
    included: [
      "10 annual resource credits",
      "10% discount on additional unit purchases",
      "Tailored customer service"
    ],
    addonMainPrice: "$1,350",
    addonSeats: 10,
    addonRows: [
      { key: "new-user", label: "+1 new user", subLabel: "Priced per additional user", price: "$59" },
      { key: "pd-users", label: "+1 PD x users", subLabel: "Additional PD usage bundle", price: "$25" },
    ],
    planId: 2,
    classes: {
      headerBg: "bg-[#EBF7ED] dark:bg-emerald-950/35",
      priceColor: "text-[#39B349] dark:text-emerald-400",
      badgeBg: "bg-[#39B349]",
      badgeText: "text-white",
      buttonBg: "bg-[#0E74BC]",
      buttonHover: "hover:bg-[#0b5f98] dark:hover:bg-sky-500",
      border: "border-transparent",
      addonIcon: "text-[#39B349] dark:text-emerald-400",
    },
    badge: "Premium Tier",
  },
  {
    key: "enterprise",
    name: "Enterprise",
    subtitle: "Best for larger or more active RTOs with ongoing demand",
    currentPrice: "$8,500",
    oldPrice: "$12,000",
    offLabel: "30% OFF",
    buttonText: "Choose Enterprise",
    included: [
      "20 annual resource credits",
      "15% discount on additional unit purchases",
      "Tailored customer service"
    ],
    addonMainPrice: "$1,500",
    addonSeats: 15,
    addonRows: [
      { key: "new-user", label: "+1 new user", subLabel: "Priced per additional user", price: "$49" },
      { key: "pd-users", label: "+1 PD x users", subLabel: "Additional PD usage bundle", price: "$23" },
    ],
    planId: 3,
    classes: {
      headerBg: "bg-[#FFE6E6] dark:bg-red-950/35",
      priceColor: "text-[#FF0000] dark:text-red-400",
      badgeBg: "bg-[#FF0000]",
      badgeText: "text-white",
      buttonBg: "bg-[#FF0000]",
      buttonHover: "hover:bg-red-700 dark:hover:bg-red-500",
      border: "border-[#ff4d4d] dark:border-red-500/70",
      addonIcon: "text-[#0E74BC] dark:text-sky-300",
    },
    badge: "Most Popular",
  },
];

const membershipFaqs = [
  {
    question: "What are credits and how can they be used?",
    answer: [
      "Credits are part of your membership and can be used to purchase individual training and assessment units.",
      "Each credit gives you access to one unit, allowing you to select exactly what you need without committing to full qualifications upfront.",
      "This provides flexibility for your RTO to:",
      "Purchase units progressively based on demand",
      "Access specific units required for scope expansion or delivery",
      "Avoid large upfront investment in full resource packages",
      "The credit system is designed to give you more control over how and when you invest in resources, while still benefiting from the structure and support of the membership.",
    ],
  },
  {
    question: "Are the resources aligned with ASQA expectations?",
    answer: [
      "Our resources are developed to align with current Australian VET requirements and are structured to support stronger evidence practices across delivery and assessment.",
      "They are designed to reduce rework, improve consistency, and support clearer implementation across your RTO.",
      "As with any purchased resource, your organisation must still review and contextualise the material to reflect your own delivery model, learner cohort, and operational environment.",
    ],
  },
  {
    question: "Do we still need to contextualise the resources?",
    answer: [
      "Yes.",
      "Contextualisation remains an essential part of using any external resource responsibly within an RTO.",
      "Our resources are designed to give you a strong starting point, reduce development time, and support a more structured implementation process, while still allowing your team to adapt content to your specific context.",
    ],
  },
  {
    question: "How is the membership different from purchasing standalone resources?",
    answer: [
      "Standalone resources solve a one off need.",
      "The membership is designed to support a broader and more consistent system over time.",
      "It combines access to resources, update support, professional development, and additional operational value so your organisation can move away from reactive fixes and toward a more stable compliance and capability workflow.",
    ],
  },
  {
    question: "What happens when training packages or standards change?",
    answer: [
      "Change across the VET sector creates pressure on internal teams, especially when resources need to be reviewed, updated, and rolled out quickly.",
      "The membership is designed to reduce that pressure by giving your organisation access to ongoing updates and supporting a more structured way to manage change over time.",
      "This helps reduce rework and lowers the risk of relying on outdated material.",
    ],
  },
  {
    question: "Can this support audit preparation?",
    answer: [
      "The membership is designed to support stronger audit readiness by improving how resources, systems, and evidence are organised across your RTO.",
      "It helps teams create greater consistency, reduce ambiguity, and strengthen the structure behind delivery and assessment practices.",
      "It does not guarantee any regulatory outcome, but it is built to support a stronger and more defensible operational position.",
    ],
  },
  {
    question: "Who is this membership designed for?",
    answer: [
      "This membership is designed for RTO leaders and operational teams who need stronger systems, less internal rework, and more confidence in how resources and compliance activity are managed.",
      "It is particularly relevant for CEOs, compliance managers, heads of training, and teams responsible for delivery quality, assessment systems, and audit readiness.",
    ],
  },
  {
    question: "Can resources be used across multiple qualifications?",
    answer: [
      "Resources are developed at unit level, which creates flexibility where the same units are used across different qualifications.",
      "This can help reduce duplicated work, improve internal consistency, and make deployment more efficient across scope areas where unit overlap exists.",
    ],
  },
  {
    question: "How does professional development fit into the membership?",
    answer: [
      "Professional development is included to ensure your team is not only accessing resources, but also strengthening the capability needed to use them effectively.",
      "This supports ongoing currency, stronger implementation, and a more confident internal approach to training, assessment, and compliance related responsibilities.",
    ],
  },
  {
    question: "How are your resources developed?",
    answer: [
      "Our resources are developed through a structured process involving instructional design capability, subject matter expertise, and practical input aligned with real RTO environments.",
      "The goal is to produce resources that are practical to use, structured for consistency, and suitable for organisations that need both usability and stronger evidence foundations.",
    ],
  },
] as const;

export default function MembershipPlansClient() {
  const customer = useAccountsStore((state) => state.customer);
  const router = useRouter();
  const setToast = useGlobalToastStore((state) => state.setToastState);

  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState(0);
  const [expanded, setExpanded] = useState<Record<PlanCard["key"], boolean>>({
    essential: false,
    growth: false,
    enterprise: false,
  });
  const [addonQty, setAddonQty] = useState<Record<string, number>>({});
  const [addonPayload, setAddonPayload] = useState<MembershipAddonPayload | null>(null);
  const [openFaq, setOpenFaq] = useState(1);

  const handleModalState = (value?: boolean) => {
    if (typeof value === "boolean") {
      setOpen(value);
      return;
    }
    setOpen((curr) => !curr);
  };

  const toNumber = (value: string) => Number(value.replace(/[^0-9.]/g, "")) || 0;

  const calculateDynamicTotal = (planKey: PlanCard["key"]) => {
    const selectedCard = planCards.find((card) => card.key === planKey);
    if (!selectedCard) return selectedCard?.currentPrice || '$0';

    const baseAmount = toNumber(selectedCard.currentPrice);
    
    // Add PD Pack cost if dropdown is open (clicked)
    const addonPackSelected = expanded[planKey];
    const addonPackAmount = addonPackSelected ? toNumber(selectedCard.addonMainPrice) : 0;
    
    // Add individual add-on costs
    const newUsersQty = addonQty[`${planKey}-new-user`] || 0;
    const pdUsersQty = addonQty[`${planKey}-pd-users`] || 0;
    
    const newUsersUnit = toNumber(selectedCard.addonRows.find((row) => row.key === "new-user")?.price || "$0");
    const pdUsersUnit = toNumber(selectedCard.addonRows.find((row) => row.key === "pd-users")?.price || "$0");
    
    const newUsersTotal = newUsersQty * newUsersUnit;
    const pdUsersTotal = pdUsersQty * pdUsersUnit;
    
    const totalAmount = baseAmount + addonPackAmount + newUsersTotal + pdUsersTotal;
    
    return `$${totalAmount.toLocaleString()}`;
  };

  const getButtonText = (planKey: PlanCard["key"], planName: string) => {
    const newUsersQty = addonQty[`${planKey}-new-user`] || 0;
    const pdUsersQty = addonQty[`${planKey}-pd-users`] || 0;
    const hasAnyAddons = newUsersQty > 0 || pdUsersQty > 0;
    const pdPackSelected = expanded[planKey];
    
    if (!pdPackSelected && !hasAnyAddons) {
      return `Choose ${planName}`;
    }
    
    return `Choose ${planName} - ${calculateDynamicTotal(planKey)}`;
  };

  const handleOpen = (planId: number, planKey: PlanCard["key"]) => {
    if (!customer.isAuthenticated) {
      router.push("/user/login");
      return;
    }
    if (customer.accountType !== "GENERAL") {
      setToast({ html: "You need to login as a Client to purchase", show: true });
      return;
    }
    const selectedCard = planCards.find((card) => card.key === planKey);
    if (!selectedCard) {
      return;
    }

    const baseAmount = toNumber(selectedCard.currentPrice);
    const addonPackUnit = toNumber(selectedCard.addonMainPrice);
    const addonPackSelected = expanded[planKey];
    const addonPackQty = addonPackSelected ? 1 : 0;
    const addonPackTotal = addonPackUnit * addonPackQty;

    const newUsersQty = addonQty[`${planKey}-new-user`] || 0;
    const pdUsersQty = addonQty[`${planKey}-pd-users`] || 0;

    const newUsersUnit = toNumber(selectedCard.addonRows.find((row) => row.key === "new-user")?.price || "$0");
    const pdUsersUnit = toNumber(selectedCard.addonRows.find((row) => row.key === "pd-users")?.price || "$0");

    const newUsersTotal = newUsersQty * newUsersUnit;
    const pdUsersTotal = pdUsersQty * pdUsersUnit;
    const addonAmount = addonPackTotal + newUsersTotal + pdUsersTotal;
    const subtotal = baseAmount + addonAmount;
    const totalAmount = subtotal; // No GST added

    setAddonPayload({
      planKey,
      baseAmount,
      addonPack: {
        selected: addonPackSelected,
        qty: addonPackQty,
        unitPrice: addonPackUnit,
        total: addonPackTotal,
      },
      newUsers: {
        qty: newUsersQty,
        unitPrice: newUsersUnit,
        total: newUsersTotal,
      },
      pdUsers: {
        qty: pdUsersQty,
        unitPrice: pdUsersUnit,
        total: pdUsersTotal,
      },
      addonAmount,
      subtotal,
      gstAmount: 0, // No GST
      totalAmount,
    });

    if (!open) {
      setPlan(planId);
    }
    handleModalState();
  };

  const toggleOptionalAddons = (key: PlanCard["key"]) => {
    setExpanded((current) => {
      const newExpanded = { ...current, [key]: !current[key] };
      
      // If closing the PD Pack, reset all add-on quantities to 0
      if (current[key] === true) { // Was open, now closing
        setAddonQty((currentQty) => {
          const newQty = { ...currentQty };
          newQty[`${key}-new-user`] = 0;
          newQty[`${key}-pd-users`] = 0;
          return newQty;
        });
      }
      
      return newExpanded;
    });
  };

  const updateAddonQty = (planKey: PlanCard["key"], rowKey: string, diff: number) => {
    const id = `${planKey}-${rowKey}`;
    setAddonQty((current) => ({
      ...current,
      [id]: Math.max(0, (current[id] || 0) + diff),
    }));
  };

  const noteText = useMemo(
    () => "Membership fees must be paid 12 months upfront. No monthly membership payment options are available.",
    []
  );

  return (
    <section className="bg-white px-3 py-10 dark:bg-slate-950 sm:px-4 lg:px-6 lg:py-14">
      <div className="mx-auto max-w-[1240px]">
        <header className="mb-8 text-center lg:mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Suitable <span className="text-[#FF0000] dark:text-red-400">Membership</span> plans
          </h1>
        </header>

        <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
          {planCards.map((card) => {
            return (
            <article
              key={card.key}
              className={`relative mx-auto flex h-full w-full max-w-[360px] flex-col overflow-hidden rounded-xl border bg-white shadow-[0px_4px_7.8px_1px_#00000012] dark:bg-slate-900 ${card.classes.border}`}
            >
              <span className={`absolute right-0 top-0 rounded-bl-md rounded-tr-md px-3 py-1 text-xs font-semibold leading-tight ${card.classes.badgeBg} ${card.classes.badgeText}`}>
                {card.badge.split(" ").map((segment, index) => (
                  <span key={`${card.key}-badge-${segment}-${index}`} className="block">
                    {segment}
                  </span>
                ))}
              </span>

              <div className={`rounded-br-[48px] px-5 pb-4 pt-6 ${card.classes.headerBg}`}>
                <h2 className="text-2xl font-semibold leading-tight text-slate-950 dark:text-white">{card.name}</h2>
                <p className="mt-2 max-w-[270px] text-sm leading-[1.35] text-slate-700 dark:text-slate-300">{card.subtitle}</p>

                <p className={`mt-3 text-4xl font-semibold leading-none ${card.classes.priceColor}`}>
                  {calculateDynamicTotal(card.key)}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-xl font-medium text-slate-500 line-through dark:text-slate-400">{card.oldPrice}</span>
                  <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-white">{card.offLabel}</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col px-5 pb-4 pt-3">
                <p className="text-base font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Included in plan</p>
                <ul className="mt-2.5 space-y-2">
                  {card.included.map((item) => (
                    <li key={`${card.key}-${item}`} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200">
                      <CheckCircleRoundedIcon className="!text-[20px] !text-[#4bbf63] dark:!text-emerald-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-3 text-base font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Optional add ons</p>

                <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900/70">
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-3 text-left"
                    onClick={() => toggleOptionalAddons(card.key)}
                    aria-expanded={expanded[card.key]}
                    aria-controls={`addons-${card.key}`}
                  >
                    <div className="flex items-start gap-2">
                      <AddCircleOutlineRoundedIcon className={`!text-[18px] ${card.classes.addonIcon}`} />
                      <div>
                        <p className="text-base font-semibold text-slate-900 dark:text-slate-100">PD Pack, {card.addonSeats} Seats</p>
                        <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                          Add {card.addonSeats} professional development seats
                        </p>
                      </div>
                    </div>
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{card.addonMainPrice}</p>
                  </button>

                  {expanded[card.key] && (
                    <div id={`addons-${card.key}`} className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-700">
                      <div className="space-y-2.5">
                        {card.addonRows.map((row) => {
                          const qtyKey = `${card.key}-${row.key}`;
                          const value = addonQty[qtyKey] || 0;

                          return (
                            <div key={qtyKey} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{row.label}</p>
                                <p className="text-xs leading-[1.3] text-slate-500 dark:text-slate-400">{row.subLabel}</p>
                              </div>

                              <div className="flex items-center rounded-full border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800">
                                <button
                                  type="button"
                                  className="grid h-7 w-7 place-items-center text-slate-700 transition hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700"
                                  onClick={() => updateAddonQty(card.key, row.key, -1)}
                                  aria-label={`Decrease ${row.label}`}
                                >
                                  <RemoveRoundedIcon className="!text-[16px]" />
                                </button>
                                <span className="w-8 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</span>
                                <button
                                  type="button"
                                  className="grid h-7 w-7 place-items-center text-slate-700 transition hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700"
                                  onClick={() => updateAddonQty(card.key, row.key, 1)}
                                  aria-label={`Increase ${row.label}`}
                                >
                                  <AddRoundedIcon className="!text-[16px]" />
                                </button>
                              </div>

                              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{row.price}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  className={`mt-4 inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white transition ${card.classes.buttonBg} ${card.classes.buttonHover} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E74BC] dark:focus-visible:outline-sky-400`}
                  onClick={() => handleOpen(card.planId, card.key)}
                  aria-label={getButtonText(card.key, card.name)}
                >
                  {getButtonText(card.key, card.name)}
                </button>
              </div>
            </article>
          );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-[#f5c77a] bg-[#fff8ee] px-4 py-3 dark:border-amber-700/60 dark:bg-amber-950/30 sm:px-5">
          <p className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <InfoOutlinedIcon className="!text-[18px] !text-amber-500 dark:!text-amber-400" />
            <span>{noteText}</span>
          </p>
        </div>

        <section className="relative mt-12 overflow-hidden rounded-[32px] bg-white px-4 py-10 sm:px-6 lg:mt-16 lg:px-10 lg:py-14">
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
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Frequently Asked <span className="text-[#FF0000]">Questions</span>
              </h2>
            </header>

            <div className="space-y-1.5">
              {membershipFaqs.map((faq, index) => {
                const faqId = index + 1;
                const isOpen = openFaq === faqId;

                return (
                  <Accordion
                    key={faq.question}
                    open={isOpen}
                    className="overflow-hidden rounded-[10px] border border-white/70 bg-white/40 backdrop-blur-[2px]"
                  >
                    <AccordionHeader
                      onClick={() => setOpenFaq(isOpen ? 0 : faqId)}
                      className="border-b-0 px-4 py-4 text-left text-[15px] font-semibold leading-6 text-slate-950 hover:text-slate-950"
                    >
                      {faq.question}
                    </AccordionHeader>
                    <AccordionBody className="px-4 pb-4 pt-0 text-sm leading-6 text-slate-800">
                      <div className="space-y-3">
                        {faq.answer.map((line, lineIndex) => {
                          const isBullet = lineIndex > 2 && index === 0 && lineIndex < 6;

                          return (
                            <p key={`${faq.question}-${lineIndex}`} className={isBullet ? "pl-5" : ""}>
                              {isBullet ? `- ${line}` : line}
                            </p>
                          );
                        })}
                      </div>
                    </AccordionBody>
                  </Accordion>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <GroupMembPaymentModal open1={open} handleOpen1={handleModalState} plan={plan} addonPayload={addonPayload} />
    </section>
  );
}
