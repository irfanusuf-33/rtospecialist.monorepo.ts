"use client";

import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DiscountIcon from '@mui/icons-material/Discount';
import { useRouter } from "next/navigation";

function EcommerceDiscountModal () {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
  };

  const handleRedirect = () => {
    router.push("/membership-plans");
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 px-4 py-6 dark:bg-black/45">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ecommerce-discount-title"
            aria-describedby="ecommerce-discount-description"
            className="relative w-full max-w-sm overflow-hidden rounded-lg border border-blue-100 bg-white p-6 text-center shadow-2xl shadow-blue-950/20 dark:border-sky-900 dark:bg-slate-950 dark:shadow-black/40 sm:p-7"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-sky-400 to-red-500" />
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Close discount offer"
            >
              <CloseIcon fontSize="small" />
            </button>

            <div className="mx-auto mt-4 grid h-20 w-20 place-items-center rounded-full border border-blue-100 bg-blue-50 text-red-500 shadow-inner dark:border-sky-900 dark:bg-sky-950/70 dark:text-red-400">
              <DiscountIcon className="!text-[42px]" />
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-sky-300">
              Member Offer
            </p>
            <h2 id="ecommerce-discount-title" className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              15% OFF
            </h2>
            <p id="ecommerce-discount-description" className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-300">
              Get 15% off eligible ecommerce resources when you view our membership options.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleRedirect}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-red-500 px-5 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                View Membership
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-blue-200 px-5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-sky-800 dark:text-sky-300 dark:hover:bg-sky-950"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed right-0 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center overflow-hidden rounded-l-lg bg-slate-950 text-white shadow-xl shadow-slate-950/25 transition hover:-translate-x-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-white dark:text-slate-950"
          aria-label="Open 15 percent discount offer"
        >
          <span className="flex min-h-36 items-center justify-center bg-red-500 px-3 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-white [writing-mode:vertical-rl]">
            15% Discount
          </span>
          <span className="grid h-9 w-full place-items-center bg-blue-700 text-white dark:bg-sky-500">
            <DiscountIcon className="!text-lg" />
          </span>
        </button>
      )}
    </>
  );
}

export default EcommerceDiscountModal;
