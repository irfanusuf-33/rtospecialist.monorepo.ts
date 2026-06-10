import Link from "next/link";
import Image from "next/image";
import { MotionItem, MotionStagger } from "../common/animations/MotionReveal";
import heroImage from "../../assets/heroimage.svg";

export default function Header () {
  return (
    <section className="relative isolate overflow-hidden bg-white px-3 py-8 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-4 lg:px-8 lg:py-8">
      <div className="absolute right-6 top-4 z-10 hidden grid-cols-5 gap-2 sm:right-8 sm:top-5 lg:grid">
        {Array.from({ length: 10 }).map((_, index) => (
          <span key={`header-top-dot-${index}`} className="h-2.5 w-2.5 rounded-full bg-blue-100 dark:bg-sky-900/80" />
        ))}
      </div>
      <div className="absolute bottom-4 left-6 z-10 hidden grid-cols-5 gap-2 sm:bottom-5 sm:left-8 lg:grid">
        {Array.from({ length: 10 }).map((_, index) => (
          <span key={`header-bottom-dot-${index}`} className="h-2.5 w-2.5 rounded-full bg-blue-100 dark:bg-sky-900/80" />
        ))}
      </div>
      <div className="mx-auto grid max-w-[84rem] items-center gap-10 lg:grid-cols-[minmax(0,760px)_minmax(380px,1fr)] lg:justify-between">
        <MotionItem className="max-w-4xl">
          <div className="max-w-[760px]">
            <MotionStagger>
              <MotionItem>
                <h1 className="text-3xl font-semibold uppercase leading-tight tracking-tight text-slate-950 dark:text-white sm:text-[2.75rem] lg:text-5xl">
                  <span className="block md:whitespace-nowrap">Bring clarity to your RTO&apos;s</span>
                  <span className="block text-blue-500 dark:text-sky-300">compliance system</span>
                </h1>
              </MotionItem>

              <MotionItem className="mt-6">
                <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
                  Reduce rework, improve evidence clarity, and implement training and assessment systems faster, with <span className="text-blue-600 dark:text-sky-300">structured resources</span> and <span className="text-blue-600 dark:text-sky-300">practical support</span> designed for real RTO operations.
                </p>
              </MotionItem>

              <MotionItem className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/book-appointment" className="inline-flex min-h-12 w-full flex-1 items-center justify-center rounded-full bg-red-500 px-12 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600">
                  Book a consultation
                </Link>
                <Link href="/ecommerce-categories" className="inline-flex min-h-12 w-full flex-1 items-center justify-center rounded-full border border-red-500 px-12 text-sm font-semibold text-red-500 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 dark:hover:bg-red-950/30">
                  Explore resources
                </Link>
              </MotionItem>
            </MotionStagger>
          </div>
        </MotionItem>

        <MotionItem
          className="relative hidden min-h-[340px] w-full max-w-[500px] justify-self-end lg:block"
          aria-label="Hero illustration"
        >
          <Image
            src={heroImage}
            alt="Team collaboration illustration"
            className="h-auto w-full object-contain"
            priority
          />
        </MotionItem>
      </div>
    </section>
  );
}
