import Link from "next/link";

export default function PdevBottomCtaSection() {
  return (
    <section className="bg-white px-4 pb-14 pt-2 sm:px-6 lg:px-8 lg:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white px-6 py-12 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:px-10 lg:px-14 lg:py-16">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 50% 18%, rgba(255, 0, 0, 0.08) 0%, rgba(255, 0, 0, 0.04) 22%, rgba(255, 255, 255, 0) 52%),
                radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0.02) 26%, rgba(255, 255, 255, 0) 58%),
                linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,250,252,1) 100%)
              `,
            }}
          />

          <div className="relative mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-[54px] lg:leading-[1.1]">
              <span className="text-[#FF1208]">Ready</span> to build capability across your{" "}
              <span className="text-[#FF1208]">RTO</span> team?
            </h2>

            <p className="mx-auto mt-5 max-w-4xl text-base leading-8 text-slate-700 sm:text-lg">
              Explore the professional development library, choose the subscription that fits your
              team, and support stronger capability across the year.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/training"
                className="inline-flex min-h-[58px] min-w-[280px] items-center justify-center rounded-full bg-[#FF1208] px-8 text-base font-semibold text-white transition hover:bg-[#df1209] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF1208]"
              >
                View PD Library
              </Link>

              <Link
                href="#pricing"
                className="inline-flex min-h-[58px] min-w-[280px] items-center justify-center rounded-full border border-[#FF1208] bg-white px-8 text-base font-semibold text-[#FF1208] transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF1208]"
              >
                Explore PD Subscriptions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
