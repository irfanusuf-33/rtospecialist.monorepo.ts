import Link from "next/link";

export default function PdevMembershipCtaSection() {
  return (
    <section className="bg-[#EEF6FC] px-4 py-12 text-slate-950 dark:bg-slate-900 dark:text-white sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="mx-auto max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          <span className="text-red-600 dark:text-red-400">Looking</span> for Broader Value{" "}
          <span className="text-sky-700 dark:text-sky-400">Across</span> the Year?
        </h2>

        <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-slate-700 dark:text-slate-300 sm:text-lg">
          If your organisation also needs learning resources, ongoing savings, and a more connected support
          model, membership may be the better fit.
        </p>

        <p className="mx-auto mt-2 max-w-4xl text-base leading-8 text-slate-700 dark:text-slate-300 sm:text-lg">
          Our membership options are designed for providers that want continuity across resources,
          professional development, and long term operational value.
        </p>

        <div className="mt-8">
          <Link
            href="#pricing"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-red-600 px-8 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 dark:bg-red-500 dark:hover:bg-red-400 sm:px-10 sm:text-base"
          >
            View Membership Options
          </Link>
        </div>
      </div>
    </section>
  );
}
