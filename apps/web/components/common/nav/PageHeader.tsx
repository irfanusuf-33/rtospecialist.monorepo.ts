"use client";

import UserProfileBar from "../UserPofilebar";
import Link from 'next/link';
import { useAccountsStore } from "../../../state/useAccountsStore";
import { useCartStore } from "../../../state/useCartStore";
import { useGuestCartStore } from "../../../state/useGuestCartStore";
import Logo from '../../../assets/logoImg.png';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import Search from "../Search";
// import '../../../client/scss/navigation/pageHeader.scss'
import Image from "next/image";
import BookFreeSampleModal from "../BookFreeSampleModal";

function CreditTooltipChip({
  count,
  tooltip,
  accentClass,
  Icon,
}: {
  count: number;
  tooltip: string;
  accentClass: string;
  Icon: typeof DescriptionOutlinedIcon;
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        title={tooltip}
        aria-label={`${count}. ${tooltip}`}
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E74BC] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800"
      >
        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${accentClass}`}>
          <Icon className="!text-[13px]" aria-hidden="true" />
        </span>
        <span>{count}</span>
      </button>
      <div className="pointer-events-none absolute right-0 top-full z-20 mt-2 hidden w-52 rounded-xl bg-slate-950 px-3 py-2 text-left text-[11px] font-medium leading-4 text-white shadow-lg group-hover:block group-focus-within:block dark:bg-slate-100 dark:text-slate-950">
        {tooltip}
      </div>
    </div>
  );
}

export default function PageHeader () {

  const customer = useAccountsStore((state) => state.customer);
  const userCartLength = useCartStore((state) => state.userCartLength);
  const guestCartLength = useGuestCartStore((state) => state.products.length);
  const visibleCartLength = customer.isAuthenticated ? userCartLength : guestCartLength;
  const availableTrainingCredits = Number(customer.unitCredits) || 0;
  const availablePdevCredits = Number(customer.certCredits) || 0;

  return (
    <header className="relative z-50 w-full border-b border-slate-200 bg-white px-4 py-1 text-[#0E74BC] shadow-sm dark:border-sky-800 dark:bg-sky-900 dark:text-white sm:px-6 lg:px-11">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3">
        <Link href="/" className="flex shrink-0 items-center" aria-label="RTO Specialist home">
          <Image src={Logo.src} className="h-auto w-[76px] object-contain sm:w-[86px]" alt="RTO Specialist logo" width={130} height={84} priority />
        </Link>

        <div className="hidden min-w-[360px] flex-[1_1_640px] lg:block xl:max-w-[720px] [&_input[type=search]]:!h-9 [&_input[type=search]]:!min-h-9 [&_input[type=search]]:!border-[#0E74BC] [&_input[type=search]]:!bg-white [&_input[type=search]]:!py-1 [&_input[type=search]]:!pl-5 [&_input[type=search]]:!pr-20 [&>div]:!w-full dark:[&_input[type=search]]:!border-white/70 dark:[&_input[type=search]]:!bg-white dark:[&_input[type=search]]:!text-slate-950">
          <Search />
        </div>

        <div className="hidden items-center gap-5 text-sm font-medium xl:flex">
          <a href="tel:+610370739799" className="inline-flex items-center gap-1.5 whitespace-nowrap transition hover:text-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E74BC] dark:hover:text-white/80 dark:focus-visible:outline-white">
            <CallIcon className="!text-[22px]" aria-hidden="true" />
            <span>+61 (03) 7073 9799</span>
          </a>
          <a href="mailto:enquiries@rtospecialist.com.au" className="inline-flex items-center gap-1.5 whitespace-nowrap transition hover:text-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E74BC] dark:hover:text-white/80 dark:focus-visible:outline-white">
            <EmailIcon className="!text-[22px]" aria-hidden="true" />
            <span>enquiries@rtospecialist.com.au</span>
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {customer.isAuthenticated ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CreditTooltipChip
                count={availableTrainingCredits}
                tooltip="Unit credits show how many training packages you can get for free."
                accentClass="bg-sky-100 text-[#0E74BC] dark:bg-sky-950 dark:text-sky-300"
                Icon={DescriptionOutlinedIcon}
              />
              <CreditTooltipChip
                count={availablePdevCredits}
                tooltip="PD credits show how many professional development courses you can get for free."
                accentClass="bg-red-100 text-[#FF0000] dark:bg-red-950 dark:text-red-300"
                Icon={WorkspacePremiumOutlinedIcon}
              />
            </div>
          ) : null}

          <BookFreeSampleModal>
            <button type="button" className="hidden rounded-full bg-[#FF0000] px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 motion-reduce:transition-none lg:inline-flex">
              Get Free Sample
            </button>
          </BookFreeSampleModal>

          {customer.isAuthenticated ? (
            <UserProfileBar />
          ) : (
            <Link href="/user/login" className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-slate-950 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E74BC] dark:text-white dark:hover:bg-white/15 dark:focus-visible:outline-white" aria-label="Login">
              <PersonOutlineOutlinedIcon className="!text-[30px]" aria-hidden="true" />
            </Link>
          )}

          <Link href="/accounts/cart" className="relative inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-slate-950 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E74BC] dark:text-white dark:hover:bg-white/15 dark:focus-visible:outline-white" aria-label={`Cart with ${visibleCartLength} items`}>
            <LocalMallOutlinedIcon className="!text-[28px]" aria-hidden="true" />
            {visibleCartLength > 0 && (
              <span className="absolute right-1.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF0000] px-1 text-[10px] font-bold leading-none text-white">
                {visibleCartLength}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
