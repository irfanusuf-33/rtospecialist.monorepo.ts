"use client";

import Link from "next/link";

interface ProductGroup {
  electiveUnits?: boolean;
  coreUnits?: boolean;
}

interface GroupHeaderProps {
  groupID: string;
  addMultipleProductsToCart: (e: React.ChangeEvent<HTMLInputElement>) => void;
  productGroup: ProductGroup;
}

export default function GroupHeader ({ groupID, addMultipleProductsToCart, productGroup }: GroupHeaderProps) {
  const normalised = groupID.toLowerCase();
  const isElective = normalised.includes("elective");
  const isCore = normalised.includes("core");
  const accentClass = isCore
    ? "text-red-600 dark:text-red-400"
    : isElective
      ? "text-blue-600 dark:text-sky-300"
      : "text-[#39B349] dark:text-emerald-400";
  const chipClass = isCore
    ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300"
    : isElective
      ? "bg-blue-50 text-blue-600 dark:bg-sky-950 dark:text-sky-300"
      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
  const buttonClass = isCore
    ? "bg-red-500 hover:bg-red-600"
    : "bg-[#0E74BC] hover:bg-[#0b5f98]";
  const isGroupCartReady = isElective ? productGroup.electiveUnits : productGroup.coreUnits;

  return (
    <div className="mb-5 mt-3 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950" id="ecom-cart">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={`text-2xl font-semibold uppercase tracking-tight ${accentClass}`}>
            {groupID}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Browse structured resources grouped for faster purchasing and delivery planning.
          </p>
        </div>

        {(isElective || isCore) && (
          <div className="flex items-center gap-3">
            {isGroupCartReady ? (
              <Link
                href="/accounts/cart"
                className={`inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-semibold text-white transition ${buttonClass}`}
              >
                Go to cart
              </Link>
            ) : (
              <label className={`inline-flex cursor-pointer items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white transition ${buttonClass}`}>
                Add all to cart
                <input
                  type="checkbox"
                  checked={false}
                  value={groupID}
                  onChange={(e) => addMultipleProductsToCart(e)}
                  className="sr-only"
                />
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
