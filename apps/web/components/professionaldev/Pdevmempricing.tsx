"use client";

import { useState } from "react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useRouter } from "next/navigation";
import { useAccountsStore } from "../../state/useAccountsStore";
import { useGlobalToastStore } from "../../state/useGlobalToastStore";
import AddPaymentMethod from "./pdevmodal/AddPaymentMethod";
import PdevModal from "./pdevmodal/PdevModal";

type PricingCard = {
  key: "starter" | "premium" | "enterprise";
  name: string;
  currentPrice?: string;
  oldPrice?: string;
  offLabel?: string;
  buttonText: string;
  included: string[];
  addonRows?: Array<{ key: string; label: string; price: string }>;
  planId?: number;
  contactOnly?: boolean;
  classes: {
    headerBg: string;
    priceColor: string;
    badgeBg: string;
    badgeText: string;
    buttonBg: string;
    buttonHover: string;
    border: string;
  };
  badge: string;
};

type PdMembershipPayload = {
  totalPdUsersWithCertification: number;
  totalPdUsers: number;
};

const pricingCards: PricingCard[] = [
  {
    key: "starter",
    name: "Starter",
    currentPrice: "899",
    buttonText: "Choose Starter",
    included: [
      "Access for 5 staff members.",
      "5 PD from the library x staff member.",
    ],
    addonRows: [
      { key: "new-user", label: "+1 new user with 5 PD", price: "$199" },
      { key: "pd-users", label: "+1 PD x users", price: "$38" },
    ],
    planId: 2,
    classes: {
      headerBg: "bg-[#E7F1F8] dark:bg-sky-950/35",
      priceColor: "text-[#0E74BC] dark:text-sky-300",
      badgeBg: "bg-[#0E74BC]",
      badgeText: "text-white",
      buttonBg: "bg-[#0E74BC]",
      buttonHover: "hover:bg-[#0b5f98] dark:hover:bg-sky-500",
      border: "border-transparent",
    },
    badge: "Entry Plan",
  },
  {
    key: "premium",
    name: "Premium",
    currentPrice: "1499",
    buttonText: "Choose Premium",
    included: [
      "Access for 10 staff members.",
      "5 PD from the library x staff member.",
    ],
    addonRows: [
      { key: "new-user", label: "1 new user with 5 PD", price: "$179" },
      { key: "pd-users", label: "+1 PD x users", price: "$33" },
    ],
    planId: 3,
    classes: {
      headerBg: "bg-[#F8E8E8] dark:bg-red-950/35",
      priceColor: "text-[#FF0000] dark:text-red-400",
      badgeBg: "bg-[#FF0000]",
      badgeText: "text-white",
      buttonBg: "bg-[#FF0000]",
      buttonHover: "hover:bg-red-700 dark:hover:bg-red-500",
      border: "border-transparent",
    },
    badge: "Premium Tier",
  },
  {
    key: "enterprise",
    name: "Enterprise",
    buttonText: "Contact us",
    included: [
      "Custom Professional development staff.",
      "Custom PD Access x Staff Member",
      "Custom Pricing.",
    ],
    contactOnly: true,
    classes: {
      headerBg: "bg-[#EBF7ED] dark:bg-emerald-950/35",
      priceColor: "text-[#39B349] dark:text-emerald-400",
      badgeBg: "bg-[#39B349]",
      badgeText: "text-white",
      buttonBg: "bg-[#39B349]",
      buttonHover: "hover:bg-emerald-600 dark:hover:bg-emerald-500",
      border: "border-transparent",
    },
    badge: "Most Popular",
  },
];

const toNumber = (value: string) => Number(value.replace(/[^0-9.]/g, "")) || 0;

export default function PdevMemPricing() {
  const setToastState = useGlobalToastStore((state) => state.setToastState);
  const customer = useAccountsStore((state) => state.customer);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [plan, setPlan] = useState(0);
  const [addonQty, setAddonQty] = useState<Record<string, number>>({});
  const [pdMembershipPayload, setPdMembershipPayload] = useState<PdMembershipPayload | undefined>(undefined);

  const handleOpen = () => {
    if (customer.accountType !== "GENERAL") {
      setToastState({ html: "your account does not allow to submit membership queries!", show: true });
      return;
    }

    setOpen((curr) => !curr);
  };

  const getPdMembershipPayload = (card: PricingCard): PdMembershipPayload | undefined => {
    if (card.contactOnly) return undefined;

    const baseUsersWithCertification = card.key === "starter" ? 5 : 10;
    const baseUsers = card.key === "starter" ? 5 : 10;
    const additionalUsersWithCertification = addonQty[`${card.key}-new-user`] || 0;
    const additionalPdUsers = addonQty[`${card.key}-pd-users`] || 0;

    return {
      totalPdUsersWithCertification: baseUsersWithCertification + additionalUsersWithCertification,
      totalPdUsers: baseUsers + additionalUsersWithCertification + additionalPdUsers,
    };
  };

  const handleOpen1 = (card: PricingCard) => {
    if (!customer.isAuthenticated) {
      return router.push("/user/login");
    }

    if (customer.accountType !== "GENERAL") {
      setToastState({ html: "You need to login as a Client to purchase", show: true });
      return;
    }

    if (!open1) {
      setPlan(card.planId || 0);
      setPdMembershipPayload(getPdMembershipPayload(card));
    }

    setOpen1((curr) => !curr);
  };

  const updateAddonQty = (planKey: PricingCard["key"], rowKey: string, diff: number) => {
    const id = `${planKey}-${rowKey}`;
    setAddonQty((current) => ({
      ...current,
      [id]: Math.max(0, (current[id] || 0) + diff),
    }));
  };

  const calculateDynamicTotal = (card: PricingCard) => {
    if (card.contactOnly) return "";

    const baseAmount = toNumber(card.currentPrice || "");
    const addonAmount =
      card.addonRows?.reduce((sum, row) => {
        const qty = addonQty[`${card.key}-${row.key}`] || 0;
        return sum + qty * toNumber(row.price);
      }, 0) || 0;

    return `${(baseAmount + addonAmount).toLocaleString()}`;
  };

  const getButtonText = (card: PricingCard) => {
    if (card.contactOnly) return card.buttonText;

    const hasAnyAddons = card.addonRows?.some((row) => (addonQty[`${card.key}-${row.key}`] || 0) > 0);
    if (!hasAnyAddons) return card.buttonText;

    return `${card.buttonText} - ${calculateDynamicTotal(card)}`;
  };

  return (
    <section className="bg-white px-3 py-10 dark:bg-slate-950 sm:px-4 lg:px-6 lg:py-14" id="pricing">
      <div className="mx-auto max-w-[1240px]">
        <header className="mb-8 text-center lg:mb-10">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Professional Development <span className="text-[#FF0000] dark:text-red-400">Subscriptions</span>
          </h2>
          <p className="mx-auto mt-4 max-w-4xl text-base leading-8 text-slate-600 dark:text-slate-300">
            Choose the subscription that best fits your team size and capability needs. Our professional
            development subscriptions are designed to give RTOs a structured way to access ongoing learning
            across the year.
          </p>
        </header>

        <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
          {pricingCards.map((card) => (
            <article
              key={card.key}
              className={`relative mx-auto flex h-full w-full max-w-[360px] flex-col overflow-hidden rounded-xl border bg-white shadow-[0px_4px_7.8px_1px_#00000012] dark:bg-slate-900 ${card.classes.border}`}
            >
              <span
                className={`absolute right-0 top-0 rounded-bl-md rounded-tr-md px-3 py-1 text-center text-xs font-semibold leading-tight ${card.classes.badgeBg} ${card.classes.badgeText}`}
              >
                {card.badge.split(" ").map((segment, index) => (
                  <span key={`${card.key}-badge-${segment}-${index}`} className="block">
                    {segment}
                  </span>
                ))}
              </span>

              <div className={`rounded-br-[48px] px-5 pb-4 pt-6 ${card.classes.headerBg}`}>
                <h3 className="text-2xl font-semibold leading-tight text-slate-950 dark:text-white">{card.name}</h3>
                {!card.contactOnly ? (
                  <div className={`mt-4 text-4xl font-semibold leading-none ${card.classes.priceColor}`}>
                    {calculateDynamicTotal(card)} <span className="text-[0.88em]">AU$</span>
                  </div>
                ) : (
                  <div className="mt-4 h-10" aria-hidden="true" />
                )}

                {card.oldPrice && card.offLabel ? (
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-xl font-medium text-slate-500 line-through dark:text-slate-400">
                      {card.oldPrice}
                    </span>
                    <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-white">
                      {card.offLabel}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col px-5 pb-4 pt-3">
                <p className="text-base font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Included in plan
                </p>
                <ul className="mt-3 space-y-3">
                  {card.included.map((item) => (
                    <li key={`${card.key}-${item}`} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700 dark:text-slate-200">
                      <CheckCircleRoundedIcon className="!text-[20px] !text-[#4bbf63] dark:!text-emerald-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {card.addonRows?.length ? (
                  <>
                    <p className="mt-5 text-base font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Optional add ons
                    </p>

                    <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900/70">
                      <div className="space-y-2.5">
                        {card.addonRows.map((row) => {
                          const qtyKey = `${card.key}-${row.key}`;
                          const value = addonQty[qtyKey] || 0;

                          return (
                            <div key={qtyKey} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                              <div>
                                <p className="text-sm font-medium leading-[1.3] text-slate-900 dark:text-slate-100">
                                  {row.label}
                                </p>
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
                                <span className="w-8 text-center text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {value}
                                </span>
                                <button
                                  type="button"
                                  className="grid h-7 w-7 place-items-center text-slate-700 transition hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700"
                                  onClick={() => updateAddonQty(card.key, row.key, 1)}
                                  aria-label={`Increase ${row.label}`}
                                >
                                  <AddRoundedIcon className="!text-[16px]" />
                                </button>
                              </div>

                              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                AUD {toNumber(row.price)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mt-5 flex-1" />
                )}

                <button
                  type="button"
                  onClick={card.contactOnly ? handleOpen : () => handleOpen1(card)}
                  className={`mt-4 inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white transition ${card.classes.buttonBg} ${card.classes.buttonHover} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E74BC] dark:focus-visible:outline-sky-400`}
                >
                  {getButtonText(card)}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <PdevModal open={open} handleOpen={handleOpen} />
      <AddPaymentMethod
        open1={open1}
        handleOpen1={() => setOpen1((curr) => !curr)}
        plan={plan}
        pdMembershipPayload={pdMembershipPayload}
      />
    </section>
  );
}
