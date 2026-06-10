import Image from "next/image";
import Link from "next/link";
import { MotionItem, MotionStagger } from "../common/animations/MotionReveal";
import exploreMembershipBg from "../../assets/exploremembershipbg.svg";
import exploreMembershipImage from "../../assets/exploremembershipimage.svg";

export default function HomeExploreMembershipSection () {
  return (
    <section className="relative overflow-hidden px-3 py-10 sm:px-4 lg:px-8 lg:py-12">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${exploreMembershipBg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-[rgba(14,116,188,0.01)] dark:bg-[rgba(2,6,23,0.82)]" />

      <div className="relative mx-auto grid max-w-[84rem] items-center gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(340px,1fr)] lg:gap-10">
        <MotionStagger className="max-w-2xl">
          <MotionItem>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
              Ongoing <span className="text-red-500 dark:text-red-400">support, guidance,</span> and{" "}
              <span className="text-red-500 dark:text-red-400">capability development</span>
            </h2>
          </MotionItem>

          <MotionItem className="mt-5">
            <p className="max-w-xl text-base leading-8 text-slate-700 dark:text-slate-300 sm:text-lg">
              Stay up to date, improve internal capability, and maintain consistency with ongoing access to resources, updates, and professional development.
            </p>
          </MotionItem>

          <MotionItem className="mt-7">
            <Link
              href="/membership-plans"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-red-500 px-8 text-sm font-semibold text-white transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 dark:bg-red-500 dark:hover:bg-red-400"
            >
              View membership plans
            </Link>
          </MotionItem>
        </MotionStagger>

        <MotionItem className="relative z-10 mx-auto w-full max-w-[720px]">
          <div className="rounded-2xl border border-[#0E74BC]/40 bg-white p-3 shadow-[0_20px_48px_rgba(14,116,188,0.12)] dark:border-sky-400/30 dark:bg-slate-900 dark:shadow-[0_20px_48px_rgba(2,6,23,0.45)] sm:p-4">
            <Image
              src={exploreMembershipImage}
              alt="Membership plans preview"
              width={543}
              height={311}
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
              className="block h-auto w-full rounded-xl object-contain"
              priority={false}
            />
          </div>
        </MotionItem>
      </div>
    </section>
  );
}
