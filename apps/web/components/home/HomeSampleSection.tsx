import Image from "next/image";
import { MotionItem, MotionStagger } from "../common/animations/MotionReveal";
import sampleSectionImage from "../../assets/samplesectionimage.svg";
import BookFreeSampleModal from "../common/BookFreeSampleModal";

export default function HomeSampleSection () {
  return (
    <section className="bg-white px-2 py-8 dark:bg-slate-950 sm:px-3 lg:px-6 lg:py-10">
      <div className="mx-auto max-w-[84rem]">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0E74BC] px-6 py-12 dark:bg-sky-900 sm:px-8 lg:px-10 lg:py-14">
          <Image
            src={sampleSectionImage}
            alt=""
            width={122}
            height={122}
            className="pointer-events-none absolute left-6 top-6 h-20 w-20 object-contain opacity-90 sm:h-[110px] sm:w-[110px]"
          />
          <Image
            src={sampleSectionImage}
            alt=""
            width={122}
            height={122}
            className="pointer-events-none absolute bottom-6 right-6 h-20 w-20 object-contain opacity-90 sm:h-[110px] sm:w-[110px]"
          />

          <MotionStagger className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
            <MotionItem>
              <h2 className="text-3xl font-semibold leading-[1.28] tracking-tight text-white sm:text-4xl lg:text-[4rem] lg:leading-[1.24]">
                <span className="block">Start building{" "}
                  <span className="rounded-md bg-white px-2 py-0.5 text-[#0E74BC] dark:text-sky-900">
                    clearer
                  </span>
                  , more
                </span>
                <span className="mt-5 block lg:mt-8">
                  <span className="rounded-md bg-white px-2 py-0.5 text-[#0E74BC] dark:text-sky-900">
                    defensible evidence
                  </span>{" "}
                  today
                </span>
              </h2>
            </MotionItem>

            <MotionItem className="mt-8">
              <BookFreeSampleModal>
                <button
                  type="button"
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-red-500 px-10 text-base font-semibold text-white transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white dark:bg-red-500 dark:hover:bg-red-400 sm:min-h-16 sm:px-12 sm:text-lg"
                >
                  Get the Free Sample
                </button>
              </BookFreeSampleModal>
            </MotionItem>
          </MotionStagger>
        </div>
      </div>
    </section>
  );
}
