import Image from "next/image";
import Link from "next/link";
import pdHeroImage from "../../assets/pdImg.svg";

export default function PdevHeader() {
  return (
    <header className="relative overflow-hidden bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.08),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,116,188,0.08),_transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(248,113,113,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.1),_transparent_28%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-6 md:py-16 lg:grid-cols-[minmax(0,1.16fr)_minmax(380px,1.04fr)] lg:gap-6 lg:pl-8 lg:pr-2 lg:py-20">
        <div className="relative z-20 min-w-0 max-w-none pr-0 lg:pr-4">
          <h1 className="text-[2.375rem] font-semibold leading-tight tracking-tight sm:text-[2.875rem] lg:text-[3.325rem] lg:leading-[1.08]">
            <span className="md:whitespace-nowrap">
              <span className="text-red-600 dark:text-red-400">Professional</span> Development for
            </span>
            <span className="mt-2 block">RTO Teams</span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-900 dark:text-slate-100">
            Built for Australian <span className="text-emerald-600 dark:text-emerald-400">RTOs</span> that need
            practical capability support, not just more information.
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            Access practical professional development designed to help RTO teams stay current, strengthen
            capability, and support more consistent training, assessment, and evidence practices.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/training"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-red-600 px-7 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 dark:bg-red-500 dark:hover:bg-red-400 sm:w-auto sm:min-w-[210px]"
            >
              View PD Library
            </Link>
            <Link
              href="#pricing"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-red-300 bg-white px-7 text-sm font-semibold text-red-600 transition hover:border-red-500 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 dark:border-red-400/40 dark:bg-slate-900 dark:text-red-300 dark:hover:border-red-300 dark:hover:bg-slate-800 sm:w-auto sm:min-w-[220px]"
            >
              Explore PD Subscriptions
            </Link>
          </div>
        </div>

        <div className="relative z-10 mx-auto hidden w-full max-w-[780px] md:max-w-[680px] lg:ml-auto lg:block">
          <div className="absolute inset-y-0 left-0 z-10 hidden w-24 bg-gradient-to-r from-white via-white/85 to-transparent dark:from-slate-950 dark:via-slate-950/75 lg:block" />
          <div className="overflow-hidden rounded-[26px] lg:rounded-[28px]">
            <Image
              src={pdHeroImage}
              alt="Professional development workshop session for RTO teams"
              priority
              className="h-[320px] w-full object-cover object-right lg:h-[430px]"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
